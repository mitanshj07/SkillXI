/**
 * SkillXI Agent Controller
 * Coordinates multi-agent collaboration and UI rendering.
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

        const response = await fetch('/api/agent_brain', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message: msg,
                user_wallet: wallet 
            })
        });

        const data = await response.json();
        
        // Remove loading
        document.getElementById(loadingId).remove();

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
        document.getElementById(loadingId).remove();
        appendMessage('AI', "🚨 Connection to Kinetic AI Brain failed. Please check your environment variables.");
        console.error("Agent Brain Error:", err);
    }
};

window.handleChatKey = function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        window.sendChatMessage();
    }
};

window.quickAsk = function(text) {
    document.getElementById('chat-input').value = text;
    window.sendChatMessage();
};

function appendMessage(sender, text, isLoading = False) {
    const container = document.getElementById('chat-messages');
    const id = 'msg-' + Date.now();
    const isAi = sender === 'AI';
    
    const div = document.createElement('div');
    div.id = id;
    div.className = `flex ${isAi ? 'justify-start' : 'justify-end'} mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300`;
    
    div.innerHTML = `
        <div class="max-w-[80%] ${isAi ? 'bg-surface-container-high kinetic-pulse' : 'bg-primary/20'} p-4 rounded-2xl border ${isAi ? 'border-outline-variant/20' : 'border-primary/30'} reveal-text">
            <div class="flex items-center gap-2 mb-2">
                <span class="${isAi ? 'text-primary' : 'text-secondary'} text-[10px] font-bold uppercase tracking-widest">
                    ${isAi ? 'Kinetic Intelligence' : 'Strategist'}
                </span>
                ${isAi ? '<span class="w-1.5 h-1.5 bg-tertiary rounded-full animate-pulse"></span>' : ''}
            </div>
            <p class="text-sm text-on-surface-variant leading-relaxed">
                ${text.replace(/\n/g, '<br>')}
            </p>
        </div>
    `;
    
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return id;
}

function renderAgentLogs(logs, isLineupDetected = false) {
    const container = document.getElementById('chat-messages');
    
    const logDiv = document.createElement('div');
    logDiv.className = "my-6 p-4 rounded-xl bg-surface-container-low border border-dashed border-outline-variant/30 reveal-text";
    
    logDiv.innerHTML = `
        <div class="scanline-container p-4 rounded-xl bg-surface-container-low border border-dashed border-outline-variant/30 relative">
            ${isLineupDetected ? `
                <div class="absolute -top-3 right-4 bg-tertiary/20 text-tertiary text-[9px] font-black px-2 py-1 rounded-full border border-tertiary/30 animate-pulse">
                    LINEUP CONTEXT ACTIVE
                </div>
            ` : ''}
            <h4 class="text-[10px] font-black text-secondary tracking-widest uppercase mb-4 flex items-center gap-2 relative z-10">
                <span class="material-symbols-outlined text-sm">hub</span> Multi-Agent Collaboration Log
            </h4>
            <div class="space-y-4 relative z-10">
                <div class="flex gap-3">
                    <div class="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <span class="material-symbols-outlined text-sm text-blue-400">search</span>
                    </div>
                    <div>
                       <p class="text-[10px] font-bold text-white uppercase mb-1">Scout Agent</p>
                       <p class="text-[11px] text-on-surface-variant italic">${logs.scout}</p>
                    </div>
                </div>
                <div class="flex gap-3">
                    <div class="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <span class="material-symbols-outlined text-sm text-purple-400">psychology</span>
                    </div>
                    <div>
                       <p class="text-[10px] font-bold text-white uppercase mb-1">Tactical Analyst</p>
                       <p class="text-[11px] text-on-surface-variant italic">${logs.tactician}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(logDiv);
    container.scrollTop = container.scrollHeight;
}
