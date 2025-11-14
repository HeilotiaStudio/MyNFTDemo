document.addEventListener('DOMContentLoaded', () => {
  const toast = document.getElementById('car-toast');
  const toastMessage = document.getElementById('toast-message');
  const closeBtn = toast.querySelector('.close-btn');

  // Show the toast
  function showToast(message) {
    toastMessage.textContent = message;
    toast.style.display = 'flex';

    // Animate
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 10);

    // Auto hide after 5 sec
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(() => { toast.style.display = 'none'; }, 300);
    }, 5000);
  }

  // Main function to trigger notifications
  window.triggerNotification = function(nftNumber) {
    const msg = `Someone bought NFT #${nftNumber}!`;

    // Toast
    showToast(msg);

    // Browser notification permission
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("NFT Marketplace", {
          body: msg,
          icon: "apple-touch-icon.png"
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification("NFT Marketplace", {
              body: msg,
              icon: "apple-touch-icon.png"
            });
          }
        });
      }
    }
  };

  // Close button
  closeBtn.addEventListener('click', () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => { toast.style.display = 'none'; }, 300);
  });
});
