const NICKNAME_KEY = "quizmaster-nickname";

const nicknameForm = document.querySelector("#nickname-form");
if (nicknameForm) {
  nicknameForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nickname = document.querySelector("#nickname").value.trim();
    if (!nickname) {
      document.querySelector("#nickname").focus();
      return;
    }

    sessionStorage.setItem(NICKNAME_KEY, nickname);
    window.location.href = "game.html";
  });
}

const playerName = document.querySelector("#player-name");
if (playerName) {
  playerName.textContent = sessionStorage.getItem(NICKNAME_KEY) || "Invitado";
}
