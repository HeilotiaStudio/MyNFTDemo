document.addEventListener('DOMContentLoaded', function () {
    // Initialize the Add to Home Screen prompt
    window.AddToHomeScreenInstance = window.AddToHomeScreen({
      appName: 'MyNFTDemo',
      appNameDisplay: 'standalone',
      appIconUrl: 'apple-touch-icon.png',
      assetUrl: 'https://cdn.jsdelivr.net/gh/philfung/add-to-homescreen@2.91/dist/assets/img/',
      maxModalDisplayCount: 3,
      displayOptions: { showMobile: true, showDesktop: true }
    });

    // Show the prompt
    window.AddToHomeScreenInstance.show('en');

    // Add a global reset function
    window.resetInstallPrompt = function () {
      window.AddToHomeScreenInstance.clearModalDisplayCount();
      alert('Install prompt reset. Reload the page to test again.');
    };
  });
