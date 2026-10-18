// home.js — Pure GitHub Pages Sync

function updateUI(data) {
    if (!data) return;
    console.log("🎨 Updating UI with Bot Data:", data);

    // 1. Avatar Sync
    if (data.avatar) {
        const avatarEl = document.getElementById('headerBotAvatar');
        if (avatarEl) avatarEl.src = data.avatar;
    }

    // 2. Bot Name Sync (Updates all name labels)
    if (data.botName) {
        document.querySelectorAll('.bot-name-display').forEach(el => {
            el.innerText = data.botName;
        });
    }

    // 3. Status Indicator Dot
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

    // 5. Statistics Cards
    if (data.users !== undefined) {
        const el = document.getElementById('statUsers');
        if (el) el.innerText = Number(data.users).toLocaleString();
    }
    if (data.servers !== undefined) {
        const el = document.getElementById('statServers');
        if (el) el.innerText = Number(data.servers).toLocaleString();
    }
    if (data.commands !== undefined) {
        const el = document.getElementById('statCommands');
        if (el) el.innerText = `${data.commands}+`;
    }
    if (data.ping !== undefined) {
        const el = document.getElementById('statPing');
        if (el) el.innerText = `${data.ping}ms`;
    }
    if (data.uptime) {
        const el = document.getElementById('statUptime');
        if (el) el.innerText = data.uptime;
    }
    if (data.shards !== undefined) {
        const el = document.getElementById('statShards');
        if (el) el.innerText = data.shards;
    }
    if (data.clusters !== undefined) {
        const el = document.getElementById('statClusters');
        if (el) el.innerText = data.clusters;
    }

    // Hero & Nav Command badges
    if (data.commands) {
        const heroCmd = document.getElementById('heroCommandCount');
        const navCmd = document.getElementById('statCommandsBadge');
        if (heroCmd) heroCmd.innerText = `${data.commands}+`;
        if (navCmd) navCmd.innerText = `${data.commands}+`;
    }
}

// Fetch bot-data.json from GitHub Pages
async function loadBotData() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.innerText = new Date().getFullYear();

    try {
        const res = await fetch('./bot-data.json?v=' + new Date().getTime());
        if (res.ok) {
            const data = await res.json();
            updateUI(data);
        } else {
            console.error("bot-data.json response not OK:", res.status);
        }
    } catch (err) {
        console.error("Failed to load bot stats:", err);
    }
}

document.addEventListener('DOMContentLoaded', loadBotData);

// Automatically syncs Bot PFP into header across all pages
async function syncHeaderBotAvatar() {
    const avatarImg = document.getElementById("headerBotAvatar");
    if (!avatarImg) return;

    const BOT_CLIENT_ID = "1550784546331697194"; // Your Discord Bot Client ID

    try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${BOT_CLIENT_ID}`);
        const json = await res.json();
        
        if (json.success && json.data.discord_user.avatar) {
            const user = json.data.discord_user;
            const format = user.avatar.startsWith("a_") ? "gif" : "png";
            avatarImg.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${format}?size=128`;
        }
    } catch (err) {
        console.error("Header bot avatar sync failed:", err);
    }
}

document.addEventListener("DOMContentLoaded", syncHeaderBotAvatar);