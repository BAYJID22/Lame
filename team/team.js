// Automatically syncs Flame & Shadow's Discord avatars & online status live!
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".team-card[data-discord-id]");

    cards.forEach(card => {
        const discordId = card.getAttribute("data-discord-id");
        if (!discordId) return;

        // Fetch Live Discord status from Lanyard API
        fetch(`https://api.lanyard.rest/v1/users/${discordId}`)
            .then(res => res.json())
            .then(res => {
                if (!res.success || !res.data) return;

                const data = res.data;
                const user = data.discord_user;

                // 1. Update Avatar
                const avatarImg = card.querySelector(".avatar-img");
                if (avatarImg && user.avatar) {
                    const format = user.avatar.startsWith("a_") ? "gif" : "png";
                    avatarImg.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${format}?size=256`;
                }

                // 2. Update Status Dot (online, idle, dnd, offline)
                const statusDot = card.querySelector(".status-dot");
                if (statusDot && data.discord_status) {
                    statusDot.className = `status-dot ${data.discord_status}`;
                    statusDot.title = data.discord_status.toUpperCase();
                }

                // 3. Update Avatar Decoration (if present)
                const decorationImg = card.querySelector(".avatar-decoration");
                if (decorationImg && user.avatar_decoration_data) {
                    decorationImg.src = `https://cdn.discordapp.com/avatar-decoration-presets/${user.avatar_decoration_data.asset}.png`;
                    decorationImg.style.display = "block";
                }
            })
            .catch(err => console.error(`Error fetching Discord status for ${discordId}:`, err));
    });
});