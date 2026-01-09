const input = document.getElementById("talesInput");

// ===============================
// Taleslang Parser + Execution
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("parseCoinBtn");

  if (!btn || !input) return;

  btn.addEventListener("click", async () => {
    const raw = input.value.trim();
    if (!raw) {
      alert("Taleslang input is empty");
      return;
    }

    try {
      const command = parseTaleslang(raw);

      // ✅ Wallet hash comes from session (same as UI line)
      const sessionData = JSON.parse(localStorage.getItem("supabaseSession"));
      const walletHash = sessionData?.walletHash;

      if (!walletHash) {
        throw new Error("Wallet hash missing — cannot create coin");
      }

      await executeCommand(command, walletHash);

      alert("✅ Coin created successfully");
      input.value = "";
    } catch (err) {
      alert("❌ " + err.message);
    }
  });
});

// ===============================
// PARSER
// ===============================

function parseTaleslang(text) {
  if (!text.startsWith("create new")) {
    throw new Error("Only 'create new' are supported as keywords");
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

// ===============================
// EXECUTION + CSV HISTORY
// ===============================

async function executeCommand(cmd, walletHash) {
  if (cmd.owner !== "auto") {
    throw new Error("Manual owner assignment is not allowed");
  }

  // ✅ Store wallet hash in existing user_id column
  const { error } = await supabase
    .from("coins")
    .insert({
      user_id: walletHash,
      name: cmd.name,
      amount: cmd.amount,
      mintable: cmd.mintable
    });

  if (error?.code === "23505") {
    throw new Error("A coin with this name already exists");
  }

  if (error) {
    throw new Error(error.message);
  }

  // CSV history
  const timestamp = new Date().toISOString();
  const action = "create_coin";
  const safeName = `"${String(cmd.name).replace(/"/g, '""')}"`;

  const csvLine = [
    timestamp,
    walletHash,
    action,
    safeName,
    cmd.amount,
    cmd.mintable
  ].join(",");

  const { error: historyError } = await supabase
    .from("coin_history")
    .insert({
      entry: csvLine
    });

  if (historyError) {
    console.error("Failed to write coin history:", historyError.message);
  }
}










