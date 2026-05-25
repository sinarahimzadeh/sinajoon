const canvas = document.querySelector("#unity-canvas");
const loadingBarFill = document.querySelector("#loading-bar-fill");
const loadingBarContainer = document.querySelector("#loading-bar-container");
const enterBtn = document.querySelector("#enter-btn");
const loadingScreen = document.querySelector("#loading-screen");

// Define Unity initialization configuration
const buildUrl = "Build";
const config = {
  dataUrl: buildUrl + "/verynewbuilds.data",
  frameworkUrl: buildUrl + "/verynewbuilds.framework.js",
  codeUrl: buildUrl + "/verynewbuilds.wasm",
  streamingAssetsUrl: "StreamingAssets",
  companyName: "DefaultCompany",
  productName: "Chair",
  productVersion: "1.0",
};

// Start loading the Unity engine
createUnityInstance(canvas, config, (progress) => {
  // Update our custom loading bar
  loadingBarFill.style.width = (100 * progress) + "%";
}).then((unityInstance) => {
  // Unity has finished loading!
  // Hide the progress bar and show the 'Enter' button
  loadingBarContainer.style.display = "none";
  enterBtn.style.display = "inline-block";
  
  // When the user clicks the button, the audio context is unlocked
  // and we fade out the custom loading screen to reveal the game.
  enterBtn.addEventListener("click", () => {
    loadingScreen.classList.add("fade-out");
    canvas.focus(); // Give keyboard/mouse focus back to the game
    
    // Force Unity's audio context to resume (fixes the sound bug)
    if (unityInstance.Module && unityInstance.Module.WEBAudio) {
        unityInstance.Module.WEBAudio.audioContext.resume();
    } else if (window.WEBAudio) {
        window.WEBAudio.audioContext.resume();
    }
    
    // Optional: completely remove it from the DOM after the 1-second fade out
    setTimeout(() => {
      loadingScreen.remove();
    }, 1000);
  });
}).catch((message) => {
  alert("Error loading the game: " + message);
});
