function collectVisitorInfo() {
  const data = {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    language: navigator.language,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    platform: navigator.platform
  };

  // Convert object to CSV string
  const csv = Object.keys(data).join(",") + "\n" + Object.values(data).join(",") + "\n";

  // Download CSV file locally
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "visitor_info.csv";
  a.click();
  URL.revokeObjectURL(url);
}
