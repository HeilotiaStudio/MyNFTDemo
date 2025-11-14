document.addEventListener("DOMContentLoaded", () => {

  const overlay = document.getElementById("nft-modal-overlay");
  const modalText = document.getElementById("nft-modal-text");
  const closeBtn = document.getElementById("nft-modal-close");

  // Show modal with a message
  function showModal(message) {
    modalText.textContent = message;
    overlay.classList.add("show");
  }

  closeBtn.addEventListener("click", () => {
    overlay.classList.remove("show");
  });

  // BUY NFT function (call from button click)
  window.buyNFT = function(id) {
    showModal(`You bought NFT #${id}! `);
    // Optional: Add more logic here (e.g., push notification, server call)
  };
});


