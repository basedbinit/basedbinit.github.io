document.getElementById("name").textContent = CONFIG.name;
document.getElementById("bio").textContent = CONFIG.bio;

document.getElementById("instagram").href = CONFIG.instagram;
document.getElementById("discord").href = CONFIG.discord;
document.getElementById("spotify").href = CONFIG.spotify;
document.getElementById("chess").href = CONFIG.chess;
document.getElementById("reddit").href = CONFIG.reddit;

tsParticles.load("tsparticles", {
  particles: {
    number: { value: 60 },
    color: { value: "#ffffff" },
    move: { enable: true, speed: 1 },
    size: { value: 2 },
    opacity: { value: 0.4 }
  }
});

const DISCORD_ID = "1497555732495859852";

async function updateStatus() {
  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
    const data = await res.json();
    const status = data.data.discord_status;

    const dot = document.getElementById("status-dot");
    const text = document.getElementById("status-text");
    const subtext = document.getElementById("status-subtext");
    const activityText = document.getElementById("activity-text");

    dot.className = "dot " + status;

    const labels = {
      online: "Online",
      idle: "Idle",
      dnd: "Do Not Disturb",
      offline: "Offline"
    };

    const subtitles = {
      online: "Current status: User is active.",
      idle: "Current status: User is inactive.",
      dnd: "Current status: Do not disturb.",
      offline: "Current status: User is offline."
    };

    text.textContent = labels[status] || "Unknown";
    subtext.textContent = subtitles[status] || "";

    if (data.data.listening_to_spotify && data.data.spotify) {
      const song = data.data.spotify.song;
      const artist = data.data.spotify.artist;
      const albumArt = data.data.spotify.album_art_url;

      activityText.innerHTML = `
        <div class="spotify-now-playing">
          <img src="${albumArt}" class="spotify-art" alt="album art">
          <div class="spotify-info">
            <p class="spotify-song">${song}</p>
            <p class="spotify-artist">${artist}</p>
          </div>
          <i class="fa-brands fa-spotify spotify-icon"></i>
        </div>
      `;
    } else {
      activityText.textContent = "prolly idling or offline";
    }
  } catch (err) {
    document.getElementById("status-text").textContent = "Status unavailable";
  }
}

updateStatus();
setInterval(updateStatus, 30000);
const CHESS_USERNAME = "MOIBINIT";

async function loadChessMatches() {
  const container = document.getElementById("chess-matches");
  try {
    const archivesRes = await fetch(`https://api.chess.com/pub/player/${CHESS_USERNAME.toLowerCase()}/games/archives`);
    const archivesData = await archivesRes.json();
    const archives = archivesData.archives;

    if (!archives || archives.length === 0) {
      container.innerHTML = `<p class="chess-loading">No games found.</p>`;
      return;
    }

    const latestArchiveUrl = archives[archives.length - 1];
    const gamesRes = await fetch(latestArchiveUrl);
    const gamesData = await gamesRes.json();
    const games = gamesData.games.slice(-5).reverse();

    if (games.length === 0) {
      container.innerHTML = `<p class="chess-loading">No recent games found.</p>`;
      return;
    }

    container.innerHTML = games.map(game => {
      const isWhite = game.white.username.toLowerCase() === CHESS_USERNAME.toLowerCase();
      const me = isWhite ? game.white : game.black;
      const opponent = isWhite ? game.black : game.white;

      let resultClass = "draw";
      let resultText = "Draw";

      if (me.result === "win") {
        resultClass = "win";
        resultText = "Win";
      } else if (["checkmated", "resigned", "timeout", "abandoned"].includes(me.result)) {
        resultClass = "loss";
        resultText = "Loss";
      }

      const timeControl = game.time_class.charAt(0).toUpperCase() + game.time_class.slice(1);

      return `
        <div class="chess-match">
          <div class="chess-match-info">
            <span class="chess-opponent">vs ${opponent.username}</span>
            <span class="chess-timecontrol">${timeControl}</span>
          </div>
          <span class="chess-result ${resultClass}">${resultText}</span>
        </div>
      `;
    }).join("");

  } catch (err) {
    container.innerHTML = `<p class="chess-loading">Couldn't load matches.</p>`;
  }
}

loadChessMatches();