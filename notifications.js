<script>
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
  window.buyNFT = function(id, button) {
    showModal(`You bought NFT #${id}! 🚀`);

    // UI change after 1-second delay
    if (button) {
      button.disabled = true; // disable immediately
      setTimeout(() => {
        button.textContent = "Owned";
        button.style.backgroundColor = "black";
        button.style.color = "#00bfff";
        button.style.cursor = "not-allowed";
      }, 1000);
    }

    // Optional: push notification or server call here
  };
});
</script>






