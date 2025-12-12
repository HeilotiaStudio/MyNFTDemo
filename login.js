document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");

  loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("inputEmail").value.trim();
    const password = document.getElementById("inputPassword").value;

    if (!email || !password) {
      alert("Please fill in all fields!");
      return;
    }

    // Hash password with SHA-256 to match register.js
    const passwordHash = await sha256(password);

    // Query Supabase
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .eq("password_hash", passwordHash)
      .single();

    if (error || !data) {
      alert("Invalid email or password!");
      return;
    }

    // Store session locally
    localStorage.setItem("supabaseSession", JSON.stringify({
      user: { id: data.id, email: data.email },
      walletHash: data.wallet_hash
    }));

    // Redirect to profile page
    window.location.href = "profile.html";
  });
});

// SHA-256 hashing function
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}
