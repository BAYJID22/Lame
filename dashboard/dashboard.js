let currentUser = null;

// ==========================================
// MODAL POPUP ENGINE (Terms & Privacy)
// ==========================================
function openModal(titleText) {
    const modal = document.getElementById('infoModal');
    const modalTitle = document.getElementById('modalTitle');
    
    if (modal && modalTitle) {
        modalTitle.innerText = titleText;
        modal.classList.remove('hidden');
    }
}

function closeModal() {
    const modal = document.getElementById('infoModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// ==========================================
// AUTOMATIC BOT AVATAR FETCH FOR LOGIN CARD
// ==========================================
async function loadBotAvatar() {
    try {
        const res = await fetch('/api/bot-stats');
        const data = await res.json();
        if (data && data.avatar) {
            document.getElementById('botAvatarLogin').src = data.avatar;
        }
    } catch (e) {
        console.log("Using default fallback avatar visual.");
    }
}
loadBotAvatar();

// ==========================================
// DISCORD AUTH & SERVER MANAGEMENT
// ==========================================
async function checkUserAuth() {
    try {
        const res = await fetch('/api/auth/user');
        const data = await res.json();
        
        if (data.loggedIn) {
            currentUser = data.user;
            
            document.getElementById('authPrompt').classList.add('hidden');
            document.getElementById('dashUI').classList.remove('hidden');

            const select = document.getElementById('serverSelect');
            select.innerHTML = currentUser.guilds.map((g, i) => `
                <option value="${i}">${g.name} ${g.owner ? '(Owner)' : '(Admin)'}</option>
            `).join('');
            
            changeServer();
        }
    } catch (e) {
        console.log("User unauthenticated.");
    }
}

async function changeServer() {
    const idx = document.getElementById('serverSelect').value;
    const guild = currentUser.guilds[idx];
    
    if (guild) {
        document.getElementById('activeServerName').innerText = guild.name;
        document.getElementById('activeServerIcon').src = guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : 'https://cdn.discordapp.com/embed/avatars/1.png';
        document.getElementById('activeServerRole').innerText = guild.owner ? 'GUILD OWNER' : 'ADMINISTRATOR';

        try {
            const res = await fetch(`/api/config/${guild.id}`);
            const config = await res.json();
            if (config) {
                document.getElementById('cfgAntiBot').checked = config.antiBot ?? true;
                document.getElementById('cfgAntiChannel').checked = config.antiChannelDelete ?? true;
            }
        } catch (e) {}
    }
}

async function saveConfig() {
    const idx = document.getElementById('serverSelect').value;
    const guild = currentUser.guilds[idx];
    
    await fetch(`/api/config/${guild.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            antiBot: document.getElementById('cfgAntiBot').checked,
            antiChannelDelete: document.getElementById('cfgAntiChannel').checked
        })
    });
    
    alert('Settings saved and synced to database!');
}

checkUserAuth();


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