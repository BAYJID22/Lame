// home/home.js

function updateUI(data) {
    if (!data) return;

    // 1. Avatar Sync
    if (data.avatar) {
        const avatarEl = document.getElementById('headerBotAvatar');
        if (avatarEl) avatarEl.src = data.avatar;
    }

    // 2. Bot Name Sync
    if (data.botName) {
        document.querySelectorAll('.bot-name-display').forEach(el => el.innerText = data.botName);
    }

    // 3. Status Dot
    if (data.status) {
        const dot = document.getElementById('botStatusDot');
        if (dot) {
            dot.className = "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#0b0c10]";
            if (data.status === 'online') dot.classList.add('bg-emerald-500');
            else if (data.status === 'idle') dot.classList.add('bg-amber-500');
            else if (data.status === 'dnd') dot.classList.add('bg-red-500');
            else dot.classList.add('bg-gray-500');
        }
    }

    // 4. Activity Text
    if (data.activity) {
        const act = document.getElementById('botActivityText');
        if (act) act.innerText = data.activity;
    }

    // 5. Metrics Cards
    if (data.users !== undefined) document.getElementById('statUsers').innerText = Number(data.users).toLocaleString();
    if (data.servers !== undefined) document.getElementById('statServers').innerText = Number(data.servers).toLocaleString();
    if (data.commands !== undefined) document.getElementById('statCommands').innerText = `${data.commands}+`;
    if (data.ping !== undefined) document.getElementById('statPing').innerText = `${data.ping}ms`;
    if (data.uptime) document.getElementById('statUptime').innerText = data.uptime;
    if (data.shards !== undefined) document.getElementById('statShards').innerText = data.shards;
    if (data.clusters !== undefined) document.getElementById('statClusters').innerText = data.clusters;
    
    if (data.commands) {
        const heroCmd = document.getElementById('heroCommandCount');
        const navCmd = document.getElementById('statCommandsBadge');
        if (heroCmd) heroCmd.innerText = `${data.commands}+`;
        if (navCmd) navCmd.innerText = `${data.commands}+`;
    }
}

// Fetch bot-data.json from GitHub Pages
document.addEventListener('DOMContentLoaded', async () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.innerText = new Date().getFullYear();

    try {
        const res = await fetch('./bot-data.json?cache_bypass=' + new Date().getTime());
        if (res.ok) {
            const data = await res.json();
            updateUI(data);
        }
    } catch (err) {
        console.error("Failed to load bot data:", err);
    }
});