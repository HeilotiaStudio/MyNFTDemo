self.addEventListener("push", event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Notification";
  const options = {
    body: data.body || "Someone bought NFT",
    icon: data.icon || "/apple-touch-icon.png"
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
