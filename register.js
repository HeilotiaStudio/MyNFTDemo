document.addEventListener("DOMContentLoaded", () => {
  const registerBtn = document.getElementById("registerBtn");

  const supabaseUrl = "https://hpribgbrwyljorezjwsp.supabase.co";
  const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwcmliZ2Jyd3lsam9yZXpqd3NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4ODYzNzUsImV4cCI6MjA4MDQ2MjM3NX0.SmjSKDXGD4WeLvNQooBuV9ZkihATaz4cUXt39_IQMss";
  const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

  // SHA hashing function
  async function sha256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }

  registerBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("inputEmail").value.trim();
    const password = document.getElementById("inputPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!firstName || !lastName || !email || !password) {
      alert("Please fill in all fields!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Generate wallet hash
    const walletHash = await sha256(email + Date.now());

    // 1) Create Supabase Auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      alert("Error: " + authError.message);
      return;
    }

    const userId = authData.user.id;

    // 2) Insert extra profile data including wallet hash
    const { error: insertError } = await supabase.from("profiles").insert([
      {
        id: userId,
        first_name: firstName,
        last_name: lastName,
        wallet_hash: walletHash
      }
    ]);

    if (insertError) {
      alert("Profile save error: " + insertError.message);
      return;
    }

    alert("Account created! Wallet hash saved.");
    window.location.href = "login.html";
  });
});




