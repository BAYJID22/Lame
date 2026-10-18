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

    grid.innerHTML = items.slice(0, 36).map(c => `
        <div class="glass-card p-5 rounded-2xl border border-white/5 space-y-2">
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

renderCommands(commandsList);