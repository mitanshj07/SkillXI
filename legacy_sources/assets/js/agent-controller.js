/**
 * SkillXI Agent Controller
 * Coordinates multi-agent collaboration and UI rendering.
 * Features Gemini direct fallback when Vercel backend is unavailable.
 */

window.sendChatMessage = async function() {
    const inputEl = document.getElementById('chat-input');
    const msg = inputEl.value.trim();
    if (!msg) return;

    // Clear input
    inputEl.value = '';
    inputEl.style.height = '44px';

    // Append user message
    appendMessage('USER', msg);

    // Show loading state for AI
    const loadingId = appendMessage('AI', 'Collaborating with scouts and tacticians...', true);

    try {
        // Get user wallet for context
        const wallet = window.localStorage.getItem('skillxi_wallet') || "";

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message: msg,
                user_wallet: wallet,
                lineup: localStorage.getItem('skillxi_temp_lineup') || '[]'
            })
        });

        if (!response.ok) throw new Error(`Server returned ${response.status}`);

        const data = await response.json();
        
        // Remove loading
        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) loadingEl.remove();

        if (data.error) {
            appendMessage('AI', `🚨 Error: ${data.error}`);
            return;
        }

        // Render Agent Collaboration Logs
        if (data.logs) {
            renderAgentLogs(data.logs, data.lineup_detected);
        }

        // Append final response
        appendMessage('AI', data.response);

    } catch (err) {
        console.warn("⚠️ [AI] Vercel backend unavailable, falling back to Gemini direct:", err.message);
        await callGeminiFallback(msg, loadingId);
    }
};

/**
 * Gemini Direct Fallback
 * Calls the Gemini REST API directly from the browser when the Vercel
 * serverless function is unreachable (e.g. running on python http.server).
 */
async function callGeminiFallback(msg, loadingId) {
    const GEMINI_KEY = 'AIzaSyAV5LHPLVMjhuUjuxbxJvb9hKkSJ1wuxpk';
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

    const wallet = window.localStorage.getItem('skillxi_wallet') || '';
    const lineup = localStorage.getItem('skillxi_temp_lineup') || '[]';

    const systemPrompt = `You are the SkillXI AI Analyst — an elite fantasy sports intelligence engine for Web3 fantasy contests on Solana.
You help users build optimal lineups, identify differentials, analyze captain picks, and find value plays.
User wallet: ${wallet || 'Not connected'}
User lineup context: ${lineup}
Be concise, tactical, and bold. Use bullet points. Speak like an elite sports analyst.`;

    try {
        const res = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: systemPrompt },
                        { text: msg }
                    ]
                }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
            })
        });

        const data = await res.json();
        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) loadingEl.remove();

        if (data.error) {
            appendMessage('AI', `🚨 Gemini Error: ${data.error.message}`);
            return;
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI.';

        // Render simplified agent log for fallback mode
        renderAgentLogs({
            scout: 'Direct Gemini 2.0 Flash — Vercel backend offline.',
            tactician: 'Tactical analysis from model training data.'
        }, lineup !== '[]');

        appendMessage('AI', reply);

        // Award XP for AI interaction
        if (window.triggerAgentXP) window.triggerAgentXP('GEMINI_DIRECT');

    } catch (fallbackErr) {
        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) loadingEl.remove();
        appendMessage('AI', '🚨 Could not reach AI. Check your internet connection.');
        console.error('Gemini fallback error:', fallbackErr);
    }
}

window.handleChatKey = function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        window.sendChatMessage();
    }
};

window.quickAsk = function(text) {
    const input = document.getElementById('chat-input');
    if (input) {
        input.value = text;
        window.sendChatMessage();
    }
};

function appendMessage(sender, text, isLoading = false) {
    const container = document.getElementById('chat-messages');
    if (!container) return 'msg-0';
    const id = 'msg-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
    const isAi = sender === 'AI';
    
    const div = document.createElement('div');
    div.id = id;
    div.className = `flex ${isAi ? 'justify-start' : 'justify-end'} mb-4`;
    
    div.innerHTML = `
        <div class="max-w-[80%] ${isAi ? 'bg-gray-50 border border-gray-100' : 'bg-primary/10 border border-primary/20'} p-5 rounded-2xl shadow-sm">
            <div class="flex items-center gap-2 mb-2">
                <div class="w-6 h-6 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-[10px]">
                    ${isAi ? '🤖' : '👤'}
                </div>
                <span class="${isAi ? 'text-primary' : 'text-gray-900'} text-[10px] font-black uppercase tracking-widest">
                    ${isAi ? 'Kinetic Intelligence' : 'You'}
                </span>
                ${isAi && isLoading ? '<div class="flex gap-1 ml-2"><span class="w-1 h-1 bg-primary rounded-full animate-bounce"></span><span class="w-1 h-1 bg-primary rounded-full animate-bounce" style="animation-delay:0.1s"></span><span class="w-1 h-1 bg-primary rounded-full animate-bounce" style="animation-delay:0.2s"></span></div>' : ''}
            </div>
            <div class="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                ${isLoading ? '<span class="italic text-gray-400">Processing complex match data...</span>' : text.replace(/\n/g, '<br>')}
            </div>
        </div>
    `;
    
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return id;
}

function renderAgentLogs(logs, isLineupDetected = false) {
    const container = document.getElementById('chat-messages');
    if (!container) return;
    
    const logDiv = document.createElement('div');
    logDiv.className = "my-4 p-4 rounded-xl bg-gray-50 border border-dashed border-gray-200";
    
    const scoutText = (logs.scout || 'N/A').slice(0, 150);
    const tacText = (logs.tactician || 'N/A').slice(0, 150);
    
    logDiv.innerHTML = `
        <div class="relative">
            ${isLineupDetected ? `
                <div class="absolute -top-6 right-2 bg-primary/10 text-primary text-[9px] font-black px-2 py-0.5 rounded-full border border-primary/20 animate-pulse">
                    LINEUP CONTEXT ACTIVE
                </div>
            ` : ''}
            <h4 class="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-3 flex items-center gap-2">
                <span class="material-symbols-outlined text-sm">hub</span> Multi-Agent Log
            </h4>
            <div class="space-y-3">
                <div class="flex gap-3">
                    <div class="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span class="material-symbols-outlined text-xs text-blue-400">search</span>
                    </div>
                    <div>
                       <p class="text-[10px] font-black text-gray-500 uppercase mb-0.5">Scout</p>
                       <p class="text-xs text-gray-400 italic">${scoutText}...</p>
                    </div>
                </div>
                <div class="flex gap-3">
                    <div class="w-5 h-5 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span class="material-symbols-outlined text-xs text-purple-400">psychology</span>
                    </div>
                    <div>
                       <p class="text-[10px] font-black text-gray-500 uppercase mb-0.5">Tactician</p>
                       <p class="text-xs text-gray-400 italic">${tacText}...</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(logDiv);
    container.scrollTop = container.scrollHeight;
}
