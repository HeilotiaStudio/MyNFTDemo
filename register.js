document.addEventListener("DOMContentLoaded", () => {
  const registerBtn = document.getElementById("registerBtn");

  registerBtn.addEventListener("click", async (e) => {
    e.preventDefault(); // prevent default form submission

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

    try {
      // Your real Google Apps Script endpoint
      const endpoint = "https://script.google.com/macros/s/AKfycbyO79tn2pT_zIbCXKUMQL9-xGpX_4Bbp0PL_MI3bGBY3wrf2eQmixkZOitIsTEdigZL/exec";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password })
      });

      const data = await response.json();

      if (data.success) {
        alert("Account created! Wallet hash: " + data.walletHash);
        window.location.href = "login.html"; // redirect to login page
      } else {
        alert("Error: " + data.message);
      }

    } catch (err) {
      console.error(err);
      alert("An error occurred while registering.");
    }
  });
});


