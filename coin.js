document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("parseCoinBtn");
  const input = document.getElementById("talesInput");

  if (!btn || !input) return;

  btn.addEventListener("click", async () => {
    const raw = input.value.trim();
    if (!raw) {
      alert("Taleslang input is empty");
      return;
    }

    try {
      const command = parseTaleslang(raw);

      // ⬅️ NEW: get session and user ID
      const sessionData = JSON.parse(localStorage.getItem("supabaseSession"));
      const userId = sessionData?.user?.id;

      if (!userId) {
        throw new Error("User session missing — cannot create coin");
      }

      await executeCommand(command, userId);

      alert("✅ Coin created successfully");
      input.value = "";
    } catch (err) {
      alert("❌ " + err.message);
    }
  });
});

/* ===========================
   PARSER
=========================== */

function parseTaleslang(text) {
  if (!text.startsWith("create new")) {
    throw new Error("Only 'create new' is supported");
  }

  const bodyMatch = text.match(/\{([\s\S]*)\}/);
  if (!bodyMatch) {
    throw new Error("Missing object body {}");
  }

  const body = bodyMatch[1];

  const regex = /(\w+)\s*:\s*"([^"]*)"/g;
  const data = {};
  let match;

  while ((match = regex.exec(body)) !== null) {
    data[match[1]] = match[2];
  }

  const required = ["type", "name", "ammount"];
  for (const key of required) {
    if (!data[key]) {
      throw new Error(`Missing required field: ${key}`);
    }
  }

  if (data.type !== "coin") {
    throw new Error('Only type:"coin" is supported');
  }

  const amount = parseInt(data.ammount, 10);
  if (isNaN(amount) || amount <= 0) {
    throw new Error("ammount must be a positive number");
  }

  return {
    name: data.name,
    amount,
    mintable: data.mintable === "true",
    owner: data.owner || "auto"
  };
}

/* 
   EXECUTION
*/
async function executeCommand(cmd) {
  if (cmd.owner !== "auto") {
    throw new Error("Manual owner assignment is not allowed");
  }

  const { error } = await supabase
    .from("coins")
    .insert({
      user_id: "me",   // ⬅️ FIX: hard‑coded user
      name: cmd.name,
      amount: cmd.amount,
      mintable: cmd.mintable
    });

  if (error) {
    throw new Error(error.message);
  }
}





