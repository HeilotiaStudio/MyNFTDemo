const publicVapidKey = "BA67-imcfyoBYaQZZgrx6hOTm2FjjOJME3SRIVvuRw9S4CjQDckeQWd0Fit2g1pNniUcCs-48W1C--bUuCqXB1A";

// Helper: convert base64 to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}

document.getElementById("subscribeBtn").addEventListener("click", async () => {
  if (!("serviceWorker" in navigator && "PushManager" in window)) {
    alert("Push notifications are not supported in this browser.");
    return;
  }

  try {
    // Register the service worker
    const register = await navigator.serviceWorker.register("/MyNFTdemo/sw.js", {
      scope: "/MyNFTDemo/"
    });

    // Wait for service worker to be activated
    if (register.installing) {
      await new Promise(resolve => {
        const worker = register.installing;
        worker.addEventListener("statechange", () => {
          if (worker.state === "activated") resolve();
        });
      });
    }

    // Ask permission for notifications
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      alert("You need to allow notifications!");
      return;
    }

    // Subscribe to push notifications
    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });

    console.log("Subscription:", subscription);

    // Send subscription to backend (Netlify Function)
    await fetch("https://my-nft-backend.netlify.app/.netlify/functions/send-push", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: { "Content-Type": "application/json" }
    });

    alert("Subscription sent to server!");

  } catch (err) {
    console.error("Service Worker registration or push subscription failed:", err);
  }
});


