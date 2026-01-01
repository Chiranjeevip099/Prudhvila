// ================= GLOBAL =================
let currentSlideIndex = 0;
document.addEventListener("DOMContentLoaded", () => {
    initGalleryControls();
     initializePuzzleGame();
});
document.getElementById("celebrateBtn").addEventListener("click", () => {
    document.getElementById("gallery").scrollIntoView({
        behavior: "smooth"
    });
});

// ================= MUSIC PLAYER =================
const audio = document.getElementById("audioPlayer");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevTrackBtn");
const nextBtn = document.getElementById("nextTrackBtn");
const progress = document.getElementById("progress");
const progressBar = document.querySelector(".progress-bar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volumeSlider");
const trackTitle = document.getElementById("trackTitle");
const trackArtist = document.getElementById("trackArtist");

let currentTrackIndex = 0;

const audioTracks = [
    { title: "Happy Birthday Song", artist: "Birthday Collection", src: "audio/25.mp3" },
    { title: "Celebration Time", artist: "Party Hits", src: "audio/26.mp3" },
    { title: "Party Anthem", artist: "Birthday Beats", src: "audio/24.mp3" }
];

function loadTrack(index) {
    const track = audioTracks[index];
    audio.src = track.src;
    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;
}
loadTrack(currentTrackIndex);

// ▶️ ⏸️ Play / Pause
playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
        playPauseBtn.textContent = "⏸️";
    } else {
        audio.pause();
        playPauseBtn.textContent = "▶️";
    }
});

// ⏭️ Next
nextBtn.addEventListener("click", () => {
    currentTrackIndex = (currentTrackIndex + 1) % audioTracks.length;
    loadTrack(currentTrackIndex);
    audio.play();
    playPauseBtn.textContent = "⏸️";
});

// ⏮️ Previous
prevBtn.addEventListener("click", () => {
    currentTrackIndex =
        (currentTrackIndex - 1 + audioTracks.length) % audioTracks.length;
    loadTrack(currentTrackIndex);
    audio.play();
    playPauseBtn.textContent = "⏸️";
});

// ⏱️ Progress Update
audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;

    const percent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = percent + "%";

    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
});

// ⏩ Seek
progressBar.addEventListener("click", e => {
    const seekTime = (e.offsetX / progressBar.clientWidth) * audio.duration;
    audio.currentTime = seekTime;
});

// 🔊 Volume
volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value / 100;
});

// 🎶 Playlist Click
document.querySelectorAll(".playlist-item").forEach(item => {
    item.addEventListener("click", () => {
        currentTrackIndex = Number(item.dataset.track);
        loadTrack(currentTrackIndex);
        audio.play();
        playPauseBtn.textContent = "⏸️";

        document.querySelectorAll(".playlist-item").forEach(i =>
            i.classList.remove("active")
        );
        item.classList.add("active");
    });
});

// ⏭️ Auto Next
audio.addEventListener("ended", () => {
    nextBtn.click();
});

function formatTime(time) {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
}



// ================= NAVBAR =================
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

if (navToggle) {
    navToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        navToggle.classList.toggle("active");
    });
}

// ================= GALLERY =================
function changeSlide(dir) {
    const slides = document.querySelectorAll(".slide");
    const indicators = document.querySelectorAll(".indicator");

    slides[currentSlideIndex].classList.remove("active");
    indicators[currentSlideIndex].classList.remove("active");

    currentSlideIndex += dir;
    if (currentSlideIndex >= slides.length) currentSlideIndex = 0;
    if (currentSlideIndex < 0) currentSlideIndex = slides.length - 1;

    slides[currentSlideIndex].classList.add("active");
    indicators[currentSlideIndex].classList.add("active");
}
let slideshowInterval = null;

function changeView(viewType) {
    const grid = document.getElementById("galleryGrid");
    const slideshow = document.getElementById("gallerySlideshow");

    if (!grid || !slideshow) return;

    if (viewType === "grid") {
        grid.style.display = "grid";
        slideshow.style.display = "none";
        clearInterval(slideshowInterval);
        slideshowInterval = null;
    }

    if (viewType === "slideshow") {
        grid.style.display = "none";
        slideshow.style.display = "block";
        startSlideshow();
    }
}

function startSlideshow() {
    if (slideshowInterval) return;

    slideshowInterval = setInterval(() => {
        changeSlide(1);
    }, 4000);
}
function initGalleryControls() {
    const gridBtn = document.getElementById("gridViewBtn");
    const slideBtn = document.getElementById("slideshowViewBtn");
    const prevBtn = document.getElementById("prevSlideBtn");
    const nextBtn = document.getElementById("nextSlideBtn");
    const indicators = document.querySelectorAll(".indicator");

    // Grid view
    if (gridBtn) {
        gridBtn.addEventListener("click", () => {
            changeView("grid");
        });
    }

    // Slideshow view
    if (slideBtn) {
        slideBtn.addEventListener("click", () => {
            changeView("slideshow");
        });
    }

    // Prev / Next buttons
    if (prevBtn) {
        prevBtn.addEventListener("click", () => changeSlide(-1));
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => changeSlide(1));
    }

    // Indicators click
    indicators.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            goToSlide(index);
        });
    });
}
function goToSlide(index) {
    const slides = document.querySelectorAll(".slide");
    const indicators = document.querySelectorAll(".indicator");

    slides[currentSlideIndex].classList.remove("active");
    indicators[currentSlideIndex].classList.remove("active");

    currentSlideIndex = index;

    slides[currentSlideIndex].classList.add("active");
    indicators[currentSlideIndex].classList.add("active");
}
// ================= PUZZLE GAME =================
let gameTimer;
let gameStartTime;
let moveCount = 0;
let currentDifficulty = "easy";
let puzzlePieces = [];

const puzzleImages = [
    "images/img1.jpeg",
    "images/img3.jpeg",
    "images/img8.jpeg"
];

document.addEventListener("DOMContentLoaded", () => {
    initializePuzzleGame();
});

function initializePuzzleGame() {
    changeDifficulty();
    startNewGame();

    const difficultySelect = document.getElementById("difficultySelect");
    const newGameBtn = document.getElementById("newGameBtn");
    const showSolutionBtn = document.getElementById("showSolutionBtn");

    if (difficultySelect)
        difficultySelect.addEventListener("change", changeDifficulty);

    if (newGameBtn)
        newGameBtn.addEventListener("click", startNewGame);

    if (showSolutionBtn)
        showSolutionBtn.addEventListener("click", showSolution);
}

function changeDifficulty() {
    const select = document.getElementById("difficultySelect");
    if (!select) return;

    currentDifficulty = select.value;
     startNewGame();
}

function startNewGame() {
    clearInterval(gameTimer);
    gameStartTime = Date.now();
    moveCount = 0;
    updateGameStats();

    generatePuzzle();
    startGameTimer();

    const gameCompletion = document.getElementById("gameCompletion");
    if (gameCompletion) gameCompletion.style.display = "none";
}

function generatePuzzle() {
    const puzzleBoard = document.getElementById("puzzleBoard");
    if (!puzzleBoard) return;

    puzzleBoard.innerHTML = "";
    puzzlePieces = [];

    const gridSize =
        currentDifficulty === "easy" ? 3 :
        currentDifficulty === "medium" ? 4 : 5;

    puzzleBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    const imageUrl =
        puzzleImages[Math.floor(Math.random() * puzzleImages.length)];

    const solutionImage = document.getElementById("solutionImage");
    if (solutionImage) solutionImage.src = imageUrl;

    for (let i = 0; i < gridSize * gridSize; i++) {
        const piece = document.createElement("div");
        piece.className = "puzzle-piece";
        piece.dataset.correct = i;
        piece.dataset.current = i;

        const row = Math.floor(i / gridSize);
        const col = i % gridSize;

        piece.style.backgroundImage = `url(${imageUrl})`;
        piece.style.backgroundSize = `${gridSize * 100}% ${gridSize * 100}%`;
        piece.style.backgroundPosition =
            `${(col / (gridSize - 1)) * 100}% ${(row / (gridSize - 1)) * 100}%`;

        piece.draggable = true;
        piece.addEventListener("dragstart", dragStart);
        piece.addEventListener("dragover", dragOver);
        piece.addEventListener("drop", dropPiece);

        puzzleBoard.appendChild(piece);
        puzzlePieces.push(piece);
    }

    shufflePuzzle();
}

function shufflePuzzle() {
    puzzlePieces.sort(() => Math.random() - 0.5);
    puzzlePieces.forEach((piece, index) => {
        piece.dataset.current = index;
        piece.parentNode.appendChild(piece);
    });
}

let draggedPiece = null;

function dragStart(e) {
    draggedPiece = e.target;
}

function dragOver(e) {
    e.preventDefault();
}

function dropPiece(e) {
    if (!draggedPiece || draggedPiece === e.target) return;

    const board = draggedPiece.parentNode;
    const draggedNext = draggedPiece.nextSibling === e.target
        ? draggedPiece
        : draggedPiece.nextSibling;

    board.insertBefore(draggedPiece, e.target);
    board.insertBefore(e.target, draggedNext);

    moveCount++;
    updateGameStats();
    checkPuzzleSolved();
}

function checkPuzzleSolved() {
    const solved = puzzlePieces.every((piece, index) =>
        piece.dataset.correct == index
    );

    if (solved) {
        clearInterval(gameTimer);
        document.getElementById("gameCompletion").style.display = "flex";
        document.getElementById("finalMoves").textContent = moveCount;
        document.getElementById("finalTime").textContent =
            document.getElementById("gameTimer").textContent;
    }
}

function showSolution() {
    puzzlePieces.sort(
        (a, b) => a.dataset.correct - b.dataset.correct
    );
    puzzlePieces.forEach(piece => piece.parentNode.appendChild(piece));
}

function startGameTimer() {
    gameTimer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
        const min = Math.floor(elapsed / 60);
        const sec = elapsed % 60;
        document.getElementById("gameTimer").textContent =
            `${min}:${sec.toString().padStart(2, "0")}`;
    }, 1000);
}

function updateGameStats() {
    document.getElementById("moveCounter").textContent = moveCount;
}


// ================= BACKGROUND EFFECT =================
function createConfetti() {
    const container = document.getElementById("confettiContainer");
    if (!container) return;

    container.innerHTML = "";
    const colors = ["#ff6b9d", "#4ecdc4", "#ffeaa7"];

    for (let i = 0; i < 40; i++) {
        const c = document.createElement("div");
        c.className = "confetti";
        c.style.left = Math.random() * 100 + "%";
        c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        c.style.animationDelay = Math.random() * 2 + "s";
        container.appendChild(c);
    }
}
setInterval(createConfetti, 8000);
createConfetti();

// ================= IMAGE ERROR FALLBACK =================
document.querySelectorAll("img").forEach(img => {
    img.addEventListener("error", function () {
        this.src =
            "https://via.placeholder.com/400x300/ff6b9d/ffffff?text=Birthday+Image";
    });
});
