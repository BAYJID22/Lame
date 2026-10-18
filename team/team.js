document.addEventListener("DOMContentLoaded", () => {
    // 1. SYNC HEADER BOT PFP LOGO
    const headerBotAvatar = document.getElementById("headerBotAvatar");
    const BOT_CLIENT_ID = "1550784546331697194"; // Your Discord Bot Client ID

    if (headerBotAvatar) {
        fetch(`https://api.lanyard.rest/v1/users/${BOT_CLIENT_ID}`)
            .then(res => res.json())
            .then(res => {
                if (res.success && res.data.discord_user.avatar) {
                    const user = res.data.discord_user;
                    const format = user.avatar.startsWith("a_") ? "gif" : "png";
                    headerBotAvatar.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${format}?size=128`;
                }
            })
            .catch(err => console.error("Header bot avatar sync failed:", err));
    }

    // 2. SYNC TEAM MEMBER CARDS (FLAME & SHADOW)
    const cards = document.querySelectorAll(".team-card[data-discord-id]");
    cards.forEach(card => {
        const discordId = card.getAttribute("data-discord-id");
        if (!discordId) return;

        fetch(`https://api.lanyard.rest/v1/users/${discordId}`)
            .then(res => res.json())
            .then(res => {
                if (!res.success || !res.data) return;

                const data = res.data;
                const user = data.discord_user;

                // Update Avatar Image
                const avatarImg = card.querySelector(".avatar-img");
                if (avatarImg && user.avatar) {
                    const format = user.avatar.startsWith("a_") ? "gif" : "png";
                    avatarImg.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${format}?size=256`;
                }

                // Update Status Dot (online, idle, dnd, offline)
                const statusDot = card.querySelector(".status-dot");
                if (statusDot && data.discord_status) {
                    statusDot.className = `status-dot ${data.discord_status}`;
                    statusDot.title = data.discord_status.toUpperCase();
                }

                // Update Avatar Decoration (if any)
                const decorationImg = card.querySelector(".avatar-decoration");
                if (decorationImg && user.avatar_decoration_data) {
                    decorationImg.src = `https://cdn.discordapp.com/avatar-decoration-presets/${user.avatar_decoration_data.asset}.png`;
                    decorationImg.style.display = "block";
                }
            })
            .catch(err => console.error(`Error fetching Discord profile for ${discordId}:`, err));
    });
});
<<<<<<< HEAD
=======

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
>>>>>>> 1a190c7 (Sync Bot PFP header across Commands, Dashboard, and Team pages)
