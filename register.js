document.getElementById("registerBtn").addEventListener("click", async () => {
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("inputEmail").value;
  const password = document.getElementById("inputPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  const res = await fetch("/.netlify/functions/register", {
    method: "POST",
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      password
    })
  });

  const data = await res.json();
  alert(data.message);

  if (data.success) {
    window.location.href = "login.html";
  }
});
