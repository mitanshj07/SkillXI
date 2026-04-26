import requests
import json
import os
from datetime import datetime, timedelta

# Supabase Config
URL = "https://vtvrvlcholgjoujqcoxd.supabase.co/rest/v1"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0dnJ2bGNob2xnam91anFjb3hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMzc0OTgsImV4cCI6MjA1ODkxMzQ5OH0.b4mxDsGgQzSrLtTl73cE4iqhJPiJ5GfEHpkCVe2DRAM"

headers = {
    "apikey": ANON_KEY,
    "Authorization": f"Bearer {ANON_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

def seed():
    print("🚀 Starting Python Seed via REST API...")

    # 1. Matches
    matches = [
        {
            "id": "m1", "home_team": "Manchester City", "home_tag": "MCI", "away_team": "Arsenal", "away_tag": "ARS",
            "league": "Premier League", "match_date": (datetime.now() + timedelta(hours=48)).isoformat(),
            "prize": 10.5, "entry": 0.25, "max_players": 500, "current_players": 142, "featured": True, "status": "NS"
        },
        {
            "id": "m2", "home_team": "Liverpool", "home_tag": "LIV", "away_team": "Chelsea", "away_tag": "CHE",
            "league": "Premier League", "match_date": (datetime.now() + timedelta(hours=24)).isoformat(),
            "prize": 5.0, "entry": 0.1, "max_players": 200, "current_players": 89, "featured": False, "status": "NS"
        }
    ]
    
    print("Seeding Matches...")
    r = requests.post(f"{URL}/matches", headers=headers, data=json.dumps(matches))
    print(f"Status: {r.status_code}")

    # 2. Players
    players = [
        {"id": "p1", "match_id": "m1", "name": "E. Haaland", "team_tag": "MCI", "price": 12.0, "ai_score": 9.8, "position": "FWD"},
        {"id": "p4", "match_id": "m1", "name": "B. Saka", "team_tag": "ARS", "price": 10.5, "ai_score": 9.2, "position": "MID"}
    ]
    
    print("Seeding Players...")
    r = requests.post(f"{URL}/players", headers=headers, data=json.dumps(players))
    print(f"Status: {r.status_code}")

    print("✅ Seed process complete.")

if __name__ == "__main__":
    seed()
