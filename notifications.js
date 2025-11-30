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

     // Map NFT IDs to Google Drive file IDs
  const nftFiles = {
    1: "1qR5u2v9eML1Gc7B4Egk1htWjccsjayd6",
    2: "1aiX1qS9BYWxOdvYYyNp59PXTjcEDiiYD",
    3: "1T_yH6AeLPUyHm9VamiWm2nhHtqmo83Mb"
  };

  // Trigger download
  if (nftFiles[id]) {
    const a = document.createElement("a");
    a.href = `https://drive.google.com/uc?export=download&id=${nftFiles[id]}`;
    a.download = `NFT_${id}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

    // Find the button that was clicked
    const buttons = document.querySelectorAll("button");
    buttons.forEach(btn => {
      if (btn.textContent.includes(`Buy NFT #${id}`)) {
        
        setTimeout(() => {
          btn.textContent = "Owned";
          btn.style.backgroundColor = "#222";
          btn.style.color = "#00bfff";
          btn.style.cursor = "not-allowed";
          btn.disabled = true;
        }, 1000);
      }
    });
  };
});














