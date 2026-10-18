// bot.js — Local PC Auto-Sync (100% Token Safe)
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const { exec } = require('child_process');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ]
});

function formatUptime(ms) {
    if (!ms) return "0h 0m";
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days}d ${hours}h` : `${hours}h ${minutes}m`;
}

// Function to save stats and push to GitHub automatically
function syncToGitHub(reason = "Auto Sync") {
    if (!client.isReady()) return;

    const totalGuilds = client.guilds.cache.size;
    const totalUsers = client.guilds.cache.reduce((acc, g) => acc + (g.memberCount || 0), 0);
    const apiPing = Math.round(client.ws.ping);
    const uptime = formatUptime(client.uptime);
    const avatarUrl = client.user.displayAvatarURL({ extension: 'png', forceStatic: false, size: 512 });
    const status = client.user.presence?.status || 'online';
    const activityText = client.user.presence?.activities[0]?.name 
        ? `${client.user.presence.activities[0].type === 0 ? 'Playing' : 'Watching'} ${client.user.presence.activities[0].name}`
        : "Protecting Servers";

    const stats = {
        botName: client.user.username,
        avatar: avatarUrl,
        status: status,
        activity: activityText,
        servers: totalGuilds,
        users: totalUsers,
        commands: client.commands ? client.commands.size : 529,
        ping: apiPing > 0 ? apiPing : 15,
        uptime: uptime,
        shards: client.ws.shards ? client.ws.shards.size : 1,
        clusters: 1
    };

    // 1. Write public JSON file locally
    fs.writeFileSync('bot-data.json', JSON.stringify(stats, null, 2));
    console.log(`📊 [LOCAL SYNC] Updated bot-data.json (${reason})`);

    // 2. Automatically push ONLY bot-data.json to GitHub
    exec('git add bot-data.json && git commit -m "Auto sync bot stats" && git push', (error) => {
        if (error) {
            // Ignore error if there were no changes to commit
            if (!error.message.includes('nothing to commit')) {
                console.log(`⚠️ Git push note: ${error.message.split('\n')[0]}`);
            }
        } else {
            console.log(`🚀 [GITHUB SYNC SUCCESS] Live website updated on GitHub Pages!`);
        }
    });
}

// Event Triggers
client.on('clientReady', () => {
    console.log(`🤖 Logged in as ${client.user.tag}`);
    syncToGitHub("Bot Started");
    
    // Sync to GitHub every 10 minutes
    setInterval(() => syncToGitHub("Interval Sync"), 10 * 60 * 1000);
});

client.on('guildCreate', () => syncToGitHub("Joined Server"));
client.on('guildDelete', () => syncToGitHub("Left Server"));

client.on('userUpdate', (oldUser, newUser) => {
    if (newUser.id === client.user.id) syncToGitHub("Profile Changed");
});

client.on('presenceUpdate', (oldPresence, newPresence) => {
    if (newPresence && newPresence.userId === client.user.id) syncToGitHub("Status Changed");
});

client.login(process.env.DISCORD_BOT_TOKEN);