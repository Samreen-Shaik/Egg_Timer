let timer = null;
let timeLeft = 0;
let totalTime = 0;
let isRunning = false;

// Single set of animated egg videos for all presets
const eggVideos = {
  raw: "images/raw-egg.mp4",
  half: "images/half-boiled-egg.mp4",
  almost: "images/almost-boiled-egg.mp4",
  final: "images/boiled-egg.mp4"
};

const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const countdownEl = document.getElementById("countdown");
const eggVideo = document.getElementById("egg");
const alarmSound = document.getElementById("alarm");
const darkModeToggle = document.getElementById("darkModeToggle");
const steamContainer = document.querySelector(".steam-container");

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
darkModeToggle.addEventListener("change", toggleDarkMode);

function startTimer() {
  if (isRunning) return; // Prevent multiple intervals

  // Determine duration based on preset selection or custom input
  const boilOption = document.querySelector('input[name="boilTime"]:checked');
  if (boilOption) {
    timeLeft = parseInt(boilOption.value);
  } else {
    let minutes = parseInt(document.getElementById("minutes").value);
    if (!minutes || minutes <= 0) {
      alert("Please enter a valid time or select a boil option!");
      return;
    }
    timeLeft = minutes * 60;
  }

  totalTime = timeLeft;
  isRunning = true;
  steamContainer.style.visibility = "visible";
  updateEggVideo("raw");
  updateCountdown();

  timer = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timer);
      timer = null;
      // Play alarm sound only when time completes
      alarmSound.play().catch(() => {
        console.log("Sound playback failed.");
      });
      countdownEl.innerText = "00:00";
      updateEggVideo("final");
      isRunning = false;
      steamContainer.style.visibility = "hidden";
    } else {
      timeLeft--;
      updateCountdown();
      updateEggVideoBasedOnProgress();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  timer = null;
  isRunning = false;
  steamContainer.style.visibility = "hidden";
}

function resetTimer() {
  clearInterval(timer);
  timer = null;
  isRunning = false;
  timeLeft = 0;
  totalTime = 0;
  countdownEl.innerText = "00:00";
  document.getElementById("minutes").value = "";
  // Uncheck preset options
  const boilOptions = document.querySelectorAll('input[name="boilTime"]');
  boilOptions.forEach(option => (option.checked = false));
  updateEggVideo("raw");
  steamContainer.style.visibility = "hidden";
  
  // Stop the alarm sound if it's playing
  if (!alarmSound.paused) {
    alarmSound.pause();
    alarmSound.currentTime = 0;
  }
}

function updateCountdown() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  countdownEl.innerText = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateEggVideo(stage) {
  const videoSource = eggVideos[stage];
  if (videoSource) {
    eggVideo.src = videoSource;
    eggVideo.load();
    eggVideo.play();
  }
}

function updateEggVideoBasedOnProgress() {
  if (totalTime === 0) return; // Prevent division by zero
  let progress = (totalTime - timeLeft) / totalTime;
  if (progress < 0.3) {
    updateEggVideo("raw");
  } else if (progress < 0.7) {
    updateEggVideo("half");
  } else if (progress < 1) {
    updateEggVideo("almost");
  } else {
    updateEggVideo("final");
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark", darkModeToggle.checked);
}
