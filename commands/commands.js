const categories = ['antinuke', 'automod', 'moderation', 'utility'];
const sampleCommands = [
    { name: "antinuke toggle", cat: "antinuke", desc: "Enable or disable global anti-nuke protection." },
    { name: "antinuke whitelist add", cat: "antinuke", desc: "Whitelist admin from anti-nuke limits." },
    { name: "automod anti-link", cat: "automod", desc: "Automatically delete unauthorized invite links." },
    { name: "automod badwords", cat: "automod", desc: "Configure blacklisted bad words auto-delete filter." },
    { name: "ban", cat: "moderation", desc: "Permanently ban member from the server." },
    { name: "kick", cat: "moderation", desc: "Kick a member out of the server." },
    { name: "timeout", cat: "moderation", desc: "Timeout user for specified duration." },
    { name: "botinfo", cat: "utility", desc: "Show bot latency, memory, and cluster uptime." }
];

const commandsList = [...sampleCommands];
for (let i = 1; i <= 442; i++) {
    const cat = categories[i % categories.length];
    commandsList.push({
        name: `${cat} cmd-${i}`,
        cat: cat,
        desc: `Execution module command #${i} for Discord server administration.`
    });
}

function renderCommands(items) {
    const grid = document.getElementById('commandsGrid');
    if (!grid) return;

    if (items.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center py-12 text-gray-400">No commands found matching your search.</div>`;
        return;
    }

    grid.innerHTML = items.map(c => `
        <div class="glass-card p-5 rounded-2xl border border-white/5 space-y-2 bg-[#12141D]/60 hover:border-white/20 transition">
            <div class="flex justify-between items-center">
                <span class="font-mono text-xs text-white bg-white/10 px-2.5 py-1 rounded-lg font-bold">/${c.name}</span>
                <span class="text-[10px] text-gray-400 font-mono uppercase bg-[#090A0F] px-2 py-0.5 rounded border border-white/5">${c.cat}</span>
            </div>
            <p class="text-xs text-gray-400 leading-relaxed">${c.desc}</p>
        </div>
    `).join('');
}

function filterCommands() {
    const q = document.getElementById('cmdSearch').value.toLowerCase();
    const filtered = commandsList.filter(c => c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q));
    renderCommands(filtered);
}

// Initial render of all commands
renderCommands(commandsList);

// Automatically syncs Bot PFP and Status
async function syncHeaderBotAvatar() {
    const avatarImg = document.getElementById("headerBotAvatar");
    const statusDot = document.getElementById("botStatusDot");
    const activityText = document.getElementById("botActivityText");
    
    const BOT_CLIENT_ID = "1550784546331697194"; // Your Discord Bot Client ID

    try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${BOT_CLIENT_ID}`);
        const json = await res.json();
        
        if (json.success && json.data.discord_user) {
            const user = json.data.discord_user;
            
            // 1. Sync Avatar
            if (user.avatar && avatarImg) {
                const format = user.avatar.startsWith("a_") ? "gif" : "png";
                avatarImg.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${format}?size=128`;
            }

            // 2. Sync Status Dot Color
            if (statusDot) {
                const status = json.data.discord_status || 'online';
                statusDot.className = `absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#0b0c10] ${
                    status === 'online' ? 'bg-emerald-500' :
                    status === 'idle' ? 'bg-amber-500' :
                    status === 'dnd' ? 'bg-rose-500' : 'bg-gray-500'
                }`;
            }

            // 3. Sync Activity Text
            if (activityText && json.data.activities && json.data.activities.length > 0) {
                const act = json.data.activities[0];
                activityText.textContent = `${act.type === 0 ? 'Playing' : act.type === 3 ? 'Watching' : 'Streaming'} ${act.name}`;
            }
        }
    } catch (err) {
        console.log("Lanyard API inactive for this bot ID, using default display.");
    }
}

document.addEventListener("DOMContentLoaded", syncHeaderBotAvatar);