document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".team-card");
  cards.forEach((card) => {
    const discordId = card.getAttribute("data-discord-id");
    if (discordId) fetchDiscordUserData(discordId, card);
  });
});

async function fetchDiscordUserData(userId, cardElement) {
  try {
    const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
    const result = await response.json();

    if (!result.success || !result.data) return;

    const data = result.data;
    const user = data.discord_user;

    // 1. UPDATE DISPLAY NAME
    const nameElem = cardElement.querySelector(".user-name");
    if (nameElem) nameElem.textContent = user.global_name || user.username;

    // 2. UPDATE AVATAR IMAGE (GIF or PNG)
    const avatarImg = cardElement.querySelector(".avatar-img");
    if (avatarImg && user.avatar) {
      const ext = user.avatar.startsWith("a_") ? "gif" : "png";
      avatarImg.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=256`;
    }

    // 3. UPDATE AVATAR DECORATION (CENTERED)
    const decorationImg = cardElement.querySelector(".avatar-decoration");
    if (decorationImg) {
      if (user.avatar_decoration_data) {
        const assetHash = user.avatar_decoration_data.asset;
        decorationImg.src = `https://cdn.discordapp.com/avatar-decoration-presets/${assetHash}.png`;
        decorationImg.style.display = "block";
      } else {
        decorationImg.style.display = "none";
      }
    }

    // 4. AUTOMATIC DYNAMIC BANNER (GIF, IMAGE, DISCORD COLOR, OR THEME GRADIENT)
    const bannerElem = cardElement.querySelector(".card-banner");
    if (bannerElem) {
      if (user.banner) {
        // CHOICE A: User set an Image or Animated GIF Banner on Discord
        const ext = user.banner.startsWith("a_") ? "gif" : "png";
        const bannerUrl = `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.${ext}?size=600`;
        
        bannerElem.style.backgroundImage = `url('${bannerUrl}')`;
        bannerElem.style.backgroundColor = "transparent";
      } 
      else if (user.banner_color) {
        // CHOICE B: User set a solid Hex color on Discord (e.g., "#ff0000")
        bannerElem.style.backgroundImage = "none";
        bannerElem.style.backgroundColor = user.banner_color;
      } 
      else if (user.accent_color !== null && user.accent_color !== undefined) {
        // CHOICE C: Convert Discord Accent Color (integer) to Hex Code
        const hexColor = `#${user.accent_color.toString(16).padStart(6, "0")}`;
        bannerElem.style.backgroundImage = "none";
        bannerElem.style.backgroundColor = hexColor;
      }
      // CHOICE D: If Discord returns null (no custom banner set),
      // it keeps the vibrant CSS Red/Cyan gradient automatically!
    }

    // 5. UPDATE STATUS INDICATOR DOT
    const statusDot = cardElement.querySelector(".status-dot");
    if (statusDot) {
      const status = data.discord_status || "offline";
      statusDot.className = `status-dot ${status}`;
      statusDot.title = status.charAt(0).toUpperCase() + status.slice(1);
    }

    // 6. UPDATE DISCORD USER LINK
    const discordLink = cardElement.querySelector(".discord-user-link");
    if (discordLink) discordLink.href = `https://discord.com/users/${user.id}`;

  } catch (error) {
    console.error(`Error loading Discord data for ${userId}:`, error);
  }
}