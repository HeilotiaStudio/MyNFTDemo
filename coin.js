// ===============================
// Fake Syntax Highlighting Editor
// ===============================

const input = document.getElementById("talesInput");
const highlight = document.getElementById("highlight");

// Basic keyword highlighter
function highlightSyntax(text) {
  // Escape HTML so user input doesn't break the page
  text = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Highlight keywords
  text = text.replace(/create new/g, '<span class="kw">create new</span>');

  // Highlight keys inside the DSL
  text = text.replace(
    /\b(type|name|ammount|mintable|owner)\b/g,
    '<span class="key">$1</span>'
  );

  return text;
}

// Mirror textarea → pre
input.addEventListener("input", () => {
  const raw = input.value;
  highlight.innerHTML = highlightSyntax(raw);
});

// Keep scroll positions synced
input.addEventListener("scroll", () => {
  highlight.scrollTop = input.scrollTop;
  highlight.scrollLeft = input.scrollLeft;
});


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

      // Get session and user ID (Supabase Auth UUID)
      const sessionData = JSON.parse(localStorage.getItem("supabaseSession"));
      const userId = sessionData?.user?.id;

      if (!userId) {
        throw new Error("User session missing — cannot create coin");
      }

      await executeCommand(command, userId);

      alert("✅ Coin created successfully");
      input.value = "";
      highlight.innerHTML = "";
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


// ===============================
// EXECUTION + CSV HISTORY
// ===============================

async function executeCommand(cmd, userId) {
  if (cmd.owner !== "auto") {
    throw new Error("Manual owner assignment is not allowed");
  }

  // Insert coin
  const { error } = await supabase
    .from("coins")
    .insert({
      user_id: "00000000-0000-0000-0000-000000000000", // dummy UUID
      name: cmd.name,
      amount: cmd.amount,
      mintable: cmd.mintable
    });

  if (error) {
    throw new Error(error.message);
  }

  // CSV history
  const timestamp = new Date().toISOString();
  const action = "create_coin";
  const safeName = `"${String(cmd.name).replace(/"/g, '""')}"`;

  const csvLine = [
    timestamp,
    userId,
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




