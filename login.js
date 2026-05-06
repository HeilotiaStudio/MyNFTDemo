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

    // Hash password with SHA-256
    const passwordHash = await sha256(password);
    let userData = null;
    let walletHash = null;

    // First, try to find user in profiles table
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .eq("password_hash", passwordHash)
      .single();

    if (!profileError && profileData) {
      // User found in profiles table
      userData = { id: profileData.id, email: profileData.email };
      walletHash = profileData.wallet_hash;
    } else {
      // If not found in profiles, check users table (using 'password' field)
      const { data: userData_from_users, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("password", passwordHash)  // Changed from password_hash to password
        .single();

      if (!userError && userData_from_users) {
        // User found in users table
        userData = { id: userData_from_users.id, email: userData_from_users.email };
        walletHash = userData_from_users.wallet_hash;
      } else {
        // User not found in either table
        alert("Invalid email or password!");
        return;
      }
    }

    // Store session locally
    localStorage.setItem("supabaseSession", JSON.stringify({
      user: userData,
      walletHash: walletHash
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
