document.addEventListener("DOMContentLoaded", () => {
  const mintBtn = document.getElementById("mintBtn");
  const imageInput = document.getElementById("imageInput");
  const preview = document.getElementById("preview");
  const status = document.getElementById("status");

  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (file) {
      preview.src = URL.createObjectURL(file);
    }
  });

  mintBtn.addEventListener("click", async () => {
    try {
      const name = document.getElementById("nftName").value.trim();
      const file = imageInput.files[0];

      if (!name || !file) {
        throw new Error("Name and image are required");
      }

      const session = JSON.parse(localStorage.getItem("supabaseSession"));
      const walletHash = session?.walletHash;

      if (!walletHash) {
        throw new Error("Wallet not found in session");
      }

      status.textContent = "⏳ Hashing image...";

      const imageHash = await hashFile(file);

      status.textContent = "⏳ Uploading image...";

      const fileExt = file.name.split(".").pop();
      const fileName = `${walletHash}_${imageHash}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("newNFT")
        .upload(fileName, file, { upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from("newNFT")
        .getPublicUrl(fileName);

      status.textContent = "⏳ Saving NFT metadata...";

      const { error: dbError } = await supabase
        .from("nfts")
        .insert({
          name,
          image_url: publicUrl.publicUrl,
          image_hash: imageHash,
          owner_wallet: walletHash
        });

      if (dbError) throw dbError;

      status.textContent = "✅ NFT minted successfully!";
      imageInput.value = "";
      preview.src = "";

    } catch (err) {
      console.error(err);
      status.textContent = "❌ " + err.message;
    }
  });
});

// =======================
// SHA-256 Image Hash
// =======================
async function hashFile(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

