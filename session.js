document.addEventListener("DOMContentLoaded", async () => { 
  const sessionData = JSON.parse(localStorage.getItem("supabaseSession"));

  // For testing: clear session to force redirect
  localStorage.removeItem("supabaseSession");

  if (!sessionData) {
    window.location.href = "login.html";
    return;
  }

   //Optionally, enforce 1-hour session expiry 
  
  const sessionStart = new Date(sessionData.createdAt).getTime();
  const now = Date.now();
  const oneHour = 60 * 60 * 1000; // 1 hour in ms
  if (now - sessionStart > oneHour) {
    localStorage.removeItem("supabaseSession");
    window.location.href = "login.html";
    return;
  }
  

  document.getElementById("wallet").textContent = sessionData.walletHash;

  // Fetch NFTs owned by user
  const { data: owned, error } = await supabase
    .from("nft_owned")
    .select("nft_id")
    .eq("user_id", sessionData.user.id);

  if (!error && owned.length > 0) {
    // Disable the buttons on page load
    owned.forEach(row => {
      const id = row.nft_id;
      const btn = document.querySelector(`button[data-nft="${id}"]`);
      if (btn) {
        btn.textContent = "Owned";
        btn.style.backgroundColor = "#222";
        btn.style.color = "#00bfff";
        btn.style.cursor = "not-allowed";
        btn.disabled = true;
      }
    });
  }

  // Session countdown timer
  
  const timerEl = document.getElementById("timer");
  if (timerEl) {
    // Default 1 hour for timer display
    const sessionDuration = 60 * 60 * 1000; // 1 hour in ms
    const start = Date.now(); // you could replace with sessionData.createdAt if available
    const sessionEnd = start + sessionDuration;

    function updateTimer() {
      const now = Date.now();
      const diff = sessionEnd - now;

      if (diff <= 0) {
        timerEl.textContent = "00:00";
        localStorage.removeItem("supabaseSession");
        window.location.href = "login.html";
        return;
      }

      const minutes = Math.floor(diff / 1000 / 60).toString().padStart(2, "0");
      const seconds = Math.floor((diff / 1000) % 60).toString().padStart(2, "0");
      timerEl.textContent = `${minutes}:${seconds}`;
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }
});

