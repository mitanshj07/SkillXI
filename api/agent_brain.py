import os
import json
import requests
from typing import TypedDict, Annotated, List
from dotenv import load_dotenv
from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import BaseMessage, HumanMessage
from supabase import create_client, Client

# --- Config & Environment ---
load_dotenv()
FOOTBALL_API_URL = "https://v3.football.api-sports.io"
FOOTBALL_API_KEY = os.getenv("FOOTBALL_API_KEY", "ebf76d464844eacdbe8a101bf8ee9106")
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL", "https://vtvrvlcholgjoujqcoxd.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") # Required for backend DB access
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")

# --- LLM Setup ---
# Uses GOOGLE_API_KEY from environment. Set it in Vercel project settings or .env.local.
if not GOOGLE_API_KEY:
    raise EnvironmentError("GOOGLE_API_KEY is not set. Add it to Vercel environment variables.")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    google_api_key=GOOGLE_API_KEY,
    temperature=0.7
)

# --- State Definition ---
class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], "The chat messages"]
    user_wallet: str
    user_lineup: str
    scout_data: str
    tactical_analysis: str
    final_response: str
    match_context: str

# --- Real-Time Data Utilities ---

def fetch_live_standings():
    """Fetch current Premier League standings."""
    try:
        url = f"{FOOTBALL_API_URL}/standings?league=39&season=2023"
        headers = {'x-apisports-key': FOOTBALL_API_KEY}
        response = requests.get(url, headers=headers)
        data = response.json()
        standings = data.get("response", [])[0].get("league", {}).get("standings", [])[0]
        
        report = "Current Premier League Standings (Top 5):\n"
        for team in standings[:5]:
            report += f"{team['rank']}. {team['team']['name']} - P:{team['all']['played']} W:{team['all']['win']} Pts:{team['points']}\n"
        return report
    except Exception:
        return "Standings data currently unavailable."

def fetch_user_lineup(wallet_address: str):
    """Fetch the user's latest locked entry from Supabase."""
    if not SUPABASE_KEY:
        return "Supabase context unavailable."
    
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        response = supabase.table("entries").select("lineup_data").eq("user_wallet", wallet_address).order("created_at", desc=True).limit(1).execute()
        
        if response.data:
            lineup = response.data[0].get("lineup_data", [])
            return f"User's Current Lineup Context: {json.dumps(lineup)}"
        return "No active lineup found for this wallet."
    except Exception as e:
        return f"Could not fetch lineup: {str(e)}"

# --- Agent Nodes ---

def scout_node(state: AgentState):
    """The Scout: specialized in fetching real-time injuries and team news."""
    query = state["messages"][-1].content
    
    # Enrich with live data
    live_context = fetch_live_standings()
    
    prompt = f"""
    As the SkillXI Scout, identify player news or strategies relevant to: '{query}'.
    LIVE LEAGUE DATA:
    {live_context}
    
    Provide a scouting report focusing on player form and match significance based on the standings.
    """
    
    response = llm.invoke([HumanMessage(content=prompt)])
    return {"scout_data": response.content, "match_context": live_context}

def tactical_node(state: AgentState):
    """The Tactical Analyst: specialized in analyzing head-to-head history and coaching strategies."""
    query = state["messages"][-1].content
    scout_info = state.get("scout_data", "")
    
    prompt = f"As the SkillXI Tactical Specialist, analyze this query: '{query}'. Report: {scout_info}. Identify tactical edges that could impact player fantasy scores."
    
    response = llm.invoke([HumanMessage(content=prompt)])
    return {"tactical_analysis": response.content}

def optimizer_node(state: AgentState):
    """The Optimizer: synthesizes all intel into a definitive fantasy vertex."""
    query = state["messages"][-1].content
    scout_info = state.get("scout_data", "")
    tactical_info = state.get("tactical_analysis", "")
    wallet = state.get("user_wallet", "")
    
    # Fetch lineup context if wallet available
    user_lineup = ""
    if wallet:
        user_lineup = fetch_user_lineup(wallet)
    
    prompt = f"""
    You are the SkillXI Lead Optimizer. Synthesize the reports:
    - SCOUT REPORT: {scout_info}
    - TACTICAL ANALYSIS: {tactical_info}
    - USER CONTEXT: {user_lineup}
    
    USER QUERY: {query}
    
    Deliver an elite fantasy recommendation. If the users current lineup is provided, specifically mention players in their squad and suggest improvements.
    """
    
    response = llm.invoke([HumanMessage(content=prompt)])
    return {"final_response": response.content, "user_lineup": user_lineup}

# --- Graph Construction ---

workflow = StateGraph(AgentState)
workflow.add_node("scout", scout_node)
workflow.add_node("tactician", tactical_node)
workflow.add_node("optimizer", optimizer_node)

workflow.set_entry_point("scout")
workflow.add_edge("scout", "tactician")
workflow.add_edge("tactician", "optimizer")
workflow.add_edge("optimizer", END)

app = workflow.compile()

# --- Vercel Request Handler ---

def handler(request):
    """Main entry point for Vercel Serverless Function (Python runtime)."""
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            "body": ""
        }
    
    try:
        # Vercel passes body as a string for Python functions
        if hasattr(request, 'body'):
            raw = request.body
            body = json.loads(raw) if isinstance(raw, str) else raw
        else:
            body = {}

        user_message = body.get("message", "")
        user_wallet = body.get("user_wallet", "")
        
        if not user_message:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "No message provided"})
            }
        
        # Initialize state
        initial_state = {
            "messages": [HumanMessage(content=user_message)],
            "user_wallet": user_wallet,
            "user_lineup": "",
            "scout_data": "",
            "tactical_analysis": "",
            "final_response": "",
            "match_context": ""
        }
        
        # Run Graph
        result = app.invoke(initial_state)
        
        response_body = json.dumps({
            "response": result["final_response"],
            "logs": {
                "scout": result["scout_data"][:300] if result.get("scout_data") else "No scout data.",
                "tactician": result["tactical_analysis"][:300] if result.get("tactical_analysis") else "No tactical data."
            },
            "lineup_detected": bool(
                result.get("user_lineup") and
                "No active lineup" not in result["user_lineup"]
            )
        })
        
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": response_body
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": str(e)})
        }
