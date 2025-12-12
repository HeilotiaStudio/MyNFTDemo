document.addEventListener("DOMContentLoaded", async () => { 
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

  // 1. APPLY OWNED STATES ON PAGE LOAD
 
  const sessionData = JSON.parse(localStorage.getItem("supabaseSession"));
  const userId = sessionData?.user?.id;

  if (userId) {
    const { data: owned, error } = await supabase
      .from("nft_owned")
      .select("nft_id")
      .eq("user_id", userId);

    if (!error && owned) {
      owned.forEach(row => {
        const btn = document.querySelector(`button[data-nft="${row.nft_id}"]`);
        if (btn) {
          btn.textContent = "Owned";
          btn.style.backgroundColor = "#222";
          btn.style.color = "#00bfff";
          btn.style.cursor = "not-allowed";
          btn.disabled = true;
        }
      });
    }
  }


  // 2. BUY NFT (logic + saving to DB)
  
  window.buyNFT = async function(id) {
    showModal(`You bought NFT #${id}! 🚀`);

    // Save in Supabase
    if (userId) {
      const { error } = await supabase
        .from("nft_owned")
        .insert({ user_id: userId, nft_id: id });

      if (error) console.error("Supabase save failed:", error);
    }

    // ========== DOWNLOAD (unchanged) ==========
    const nftFiles = {
      1: "1qR5u2v9eML1Gc7B4Egk1htWjccsjayd6",
      2: "1aiX1qS9BYWxOdvYYyNp59PXTjcEDiiYD",
      3: "1T_yH6AeLPUyHm9VamiWm2nhHtqmo83Mb"
    };

    if (nftFiles[id]) {
      const a = document.createElement("a");
      a.href = `https://drive.google.com/uc?export=download&id=${nftFiles[id]}`;
      a.download = `NFT_${id}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    // ========== SIMPLE NOTIFICATION (unchanged) ==========
    if (window.showSimpleNotification) {
      showSimpleNotification(`You now own NFT #${id}!`);
    }

    // ========== UPDATE UI ==========
    const btn = document.querySelector(`button[data-nft="${id}"]`);

    if (btn) {
      setTimeout(() => {
        btn.textContent = "Owned";
        btn.style.backgroundColor = "#222";
        btn.style.color = "#00bfff";
        btn.style.cursor = "not-allowed";
        btn.disabled = true;
      }, 1000);
    }
  };
});
















