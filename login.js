// Initialize Supabase client
const SUPABASE_URL = "https://hpribgbrwyljorezjwsp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwcmliZ2Jyd3lsam9yZXpqd3NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4ODYzNzUsImV4cCI6MjA4MDQ2MjM3NX0.SmjSKDXGD4WeLvNQooBuV9ZkihATaz4cUXt39_IQMss";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

    try {
      // First, try to find user in profiles table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .eq("password_hash", passwordHash)
        .maybeSingle();

      if (profileData && !profileError) {
        // User found in profiles table
        console.log("User found in profiles table");
        userData = { id: profileData.id, email: profileData.email };
        walletHash = profileData.wallet_hash;
      } else {
        // If not found in profiles, check users table
        console.log("Checking users table...");
        const { data: userData_from_users, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .eq("password", passwordHash)
          .maybeSingle();

        if (userData_from_users && !userError) {
          // User found in users table
          console.log("User found in users table");
          userData = { id: userData_from_users.id, email: userData_from_users.email };
          walletHash = userData_from_users.wallet_hash;
        } else {
          console.log("User not found in either table");
          alert("Invalid email or password!");
          return;
        }
      }

      // Store session locally
      localStorage.setItem("supabaseSession", JSON.stringify({
        user: userData,
        walletHash: walletHash
      }));

      console.log("Login successful, redirecting...");
      // Redirect to profile page
      window.location.href = "profile.html";
      
    } catch (err) {
      console.error("Login error:", err);
      alert("An error occurred during login. Please try again.");
    }
  });
});

// SHA-256 hashing function
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}
