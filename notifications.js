document.addEventListener("DOMContentLoaded", () => { 
  const overlay = document.getElementById("nft-modal-overlay");
  const modalText = document.getElementById("nft-modal-text");
  const closeBtn = document.getElementById("nft-modal-close");

  function showModal(message) {
    modalText.textContent = message;
    overlay.classList.add("show");

    // Auto-hide after 5 seconds
    setTimeout(() => overlay.classList.remove("show"), 5000);
  }

  closeBtn.addEventListener("click", () => overlay.classList.remove("show"));

  // Buy NFT function
  window.buyNFT = function(id) {
    showModal(`You bought NFT #${id}! 🚀`);

    // Find the button that was clicked
    const buttons = document.querySelectorAll("button");
    buttons.forEach(btn => {
      if (btn.textContent.includes(`Buy NFT #${id}`)) {
        
        setTimeout(() => {
          btn.textContent = "Owned";
          btn.style.backgroundColor = "black";
          btn.style.color = "#00bfff";
          btn.style.cursor = "not-allowed";
          btn.disabled = true;
        }, 1000);
      }
    });
  };
});











