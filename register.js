document.addEventListener("DOMContentLoaded", () => {
  const registerBtn = document.getElementById("registerBtn");

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

    // Hash the password
    const passwordHash = await sha256(password);

    // Generate wallet hash
    const walletHash = await sha256(firstName + lastName + email);

    // Insert into Supabase
    const { error } = await supabase
      .from("profiles")
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          password_hash: passwordHash,
          wallet_hash: walletHash
        }
      ]);

    if (error) {
      alert("Supabase error: " + error.message);
      console.error(error);
      return;
    }

    alert("Account created! Wallet hash: " + walletHash);
    window.location.href = "login.html";
  });
});

// SHA-256 for browser
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}





