




const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import the Discord Bot client directly
const client = require('./bot.js');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'lame_secret_key',
    resave: false,
    saveUninitialized: false
}));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lamebot')
    .then(() => console.log(' Connected to MongoDB!'))
    .catch(() => console.log(' Running database in standalone mode.'));

// Default Cache fallback
let botStatsCache = {
    servers: 1,
    users: 100,
    commands: 529,
    ping: 15,
    uptime: "0h 0m",
    shards: 1,
    clusters: 1,
    avatar: "https://cdn.discordapp.com/embed/avatars/0.png",
    botName: "LAME",
    status: "online",
    activity: "Protecting Servers"
};

// Helper function: Helper to format milliseconds into "1d 2h" or "2h 15m"
function formatUptime(ms) {
    if (!ms) return "0h 0m";
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days}d ${hours}h` : `${hours}h ${minutes}m`;
}

// Real-time Data Sync Function (Extracts data straight from Discord Client)
function getLiveBotStats() {
    if (!client || !client.isReady()) {
        return botStatsCache;
    }

    const totalGuilds = client.guilds.cache.size;
    const totalUsers = client.guilds.cache.reduce((acc, g) => acc + (g.memberCount || 0), 0);
    const apiPing = Math.round(client.ws.ping);
    const uptime = formatUptime(client.uptime);
    const shards = client.ws.shards ? client.ws.shards.size : 1;
    const avatarUrl = client.user.displayAvatarURL({ extension: 'png', forceStatic: false, size: 512 });
    const status = client.user.presence?.status || 'online';
    
    const activityText = client.user.presence?.activities[0]?.name 
        ? `${client.user.presence.activities[0].type === 0 ? 'Playing' : 'Watching'} ${client.user.presence.activities[0].name}`
        : "Protecting Servers";

    botStatsCache = {
        servers: totalGuilds,
        users: totalUsers,
        commands: client.commands ? client.commands.size : 529,
        ping: apiPing > 0 ? apiPing : 15,
        uptime: uptime,
        shards: shards,
        clusters: 1,
        avatar: avatarUrl,
        botName: client.user.username,
        status: status,
        activity: activityText
    };

    return botStatsCache;
}

function broadcastLiveStats() {
    const freshStats = getLiveBotStats();
    io.emit('botStatsUpdate', freshStats);
}

// ==========================================
// ⚡ INSTANT DISCORD AUTOMATIC EVENT TRIGGERS
// ==========================================
client.on('clientReady', () => {
    broadcastLiveStats();
    setInterval(broadcastLiveStats, 15000); // Pulse stats every 15s
});

client.on('guildCreate', broadcastLiveStats);
client.on('guildDelete', broadcastLiveStats);

client.on('userUpdate', (oldUser, newUser) => {
    if (newUser.id === client.user?.id) broadcastLiveStats();
});

client.on('presenceUpdate', (oldPresence, newPresence) => {
    if (newPresence && newPresence.userId === client.user?.id) broadcastLiveStats();
});

// ==========================================
// 🚨 PUBLIC API ENDPOINTS
// ==========================================
app.get('/api/bot-stats', (req, res) => {
    res.json(getLiveBotStats());
});

// Static Folders & Routing
app.use(express.static(path.join(__dirname, 'home')));
app.use('/home', express.static(path.join(__dirname, 'home')));
app.use('/commands', express.static(path.join(__dirname, 'commands')));
app.use('/dashboard', express.static(path.join(__dirname, 'dashboard')));
app.use('/team', express.static(path.join(__dirname, 'team')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home', 'index.html'));
});

// Socket.IO Browser Connections
io.on('connection', (socket) => {
    console.log('🌐 Browser connected to Live WebSockets');
    socket.emit('botStatsUpdate', getLiveBotStats());
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Website Server active on http://127.0.0.1:${PORT}`);
});