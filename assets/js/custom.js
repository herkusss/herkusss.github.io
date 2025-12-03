document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contact-form");
    const submitBtn = form.querySelector('button[type="submit"]');

    const results = document.createElement("div");
    form.insertAdjacentElement("afterend", results);

    const successMessage = document.createElement("div");
    successMessage.textContent = "Duomenys pateikti sėkmingai!";
    successMessage.style.display = "none";
    successMessage.style.marginTop = "10px";
    successMessage.style.padding = "8px";
    successMessage.style.borderRadius = "4px";
    successMessage.style.backgroundColor = "#d4edda";
    successMessage.style.color = "#155724";
    successMessage.style.fontFamily = "Franklin Gothic Medium, Arial, sans-serif";
    results.insertAdjacentElement("afterend", successMessage);

    const fields = {
        firstName: document.getElementById("firstName"),
        lastName: document.getElementById("lastName"),
        email: document.getElementById("email"),
        phone: document.getElementById("phone"),
        address: document.getElementById("address"),
        rating1: document.getElementById("rating1"),
        rating2: document.getElementById("rating2"),
        rating3: document.getElementById("rating3")
    };

    const errors = {};
    const requiredIds = ["firstName", "lastName", "email", "phone", "address", "rating1", "rating2", "rating3"];
    submitBtn.disabled = true;

    function getErrorSpan(input) {
        let span = input.nextElementSibling;
        if (!span || !span.classList.contains("error-message")) {
            span = document.createElement("span");
            span.className = "error-message";
            input.insertAdjacentElement("afterend", span);
        }
        return span;
    }

    function setError(id, message) {
        const input = fields[id];
        if (!input) return;
        errors[id] = message;
        input.classList.add("error");
        const span = getErrorSpan(input);
        span.textContent = message;
    }

    function clearError(id) {
        const input = fields[id];
        if (!input) return;
        errors[id] = "";
        input.classList.remove("error");
        const span = input.nextElementSibling;
        if (span && span.classList.contains("error-message")) {
            span.textContent = "";
        }
    }

    function validateField(id) {
        const input = fields[id];
        const value = input.value.trim();

        if (id === "firstName" || id === "lastName") {
            if (value === "") {
                setError(id, "Šis laukas privalomas");
                return;
            }
            const nameRegex = /^[A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž\s'-]+$/;
            if (!nameRegex.test(value)) {
                setError(id, "Naudokite tik raides");
                return;
            }
            clearError(id);
            return;
        }

        if (id === "email") {
            if (value === "") {
                setError(id, "Šis laukas privalomas");
                return;
            }
            const emailRegex = /.+@.+\..+/;
            if (!emailRegex.test(value)) {
                setError(id, "Neteisingas el. pašto formatas");
                return;
            }
            clearError(id);
            return;
        }

        if (id === "address") {
            if (value === "") {
                setError(id, "Šis laukas privalomas");
                return;
            }
            clearError(id);
            return;
        }

        if (id === "rating1" || id === "rating2" || id === "rating3") {
            if (value === "") {
                setError(id, "Įveskite skaičių 1–10");
                return;
            }
            const n = Number(value);
            if (!Number.isFinite(n) || n < 1 || n > 10) {
                setError(id, "Skaičius turi būti tarp 1 ir 10");
                return;
            }
            clearError(id);
            return;
        }

        if (id === "phone") {
            const pattern = /^\+370 6\d{2} \d{5}$/;
            if (!pattern.test(value)) {
                setError(id, "Numeris turi būti formatu +370 6xx xxxxx");
                return;
            }
            clearError(id);
            return;
        }
    }

    function updateSubmitState() {
        let hasError = false;
        for (const id of requiredIds) {
            const input = fields[id];
            if (!input.value.trim()) {
                hasError = true;
                break;
            }
            if (errors[id]) {
                hasError = true;
                break;
            }
        }
        submitBtn.disabled = hasError;
    }

    for (const id of Object.keys(fields)) {
        if (id === "phone") continue;
        fields[id].addEventListener("input", function () {
            validateField(id);
            updateSubmitState();
        });
    }

    fields.phone.addEventListener("input", function () {
        this.value = this.value.replace(/[^0-9+ ]/g, "");
        validateField("phone");
        updateSubmitState();
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        for (const id of requiredIds) {
            validateField(id);
        }
        updateSubmitState();
        if (submitBtn.disabled) return;

        const vardas = fields.firstName.value.trim();
        const pavarde = fields.lastName.value.trim();
        const email = fields.email.value.trim();
        const telefonas = fields.phone.value.trim();
        const adresas = fields.address.value.trim();

        const klausimas1 = Number(fields.rating1.value);
        const klausimas2 = Number(fields.rating2.value);
        const klausimas3 = Number(fields.rating3.value);

        const data = {
            vardas: vardas,
            pavarde: pavarde,
            email: email,
            telefonas: telefonas,
            adresas: adresas,
            klausimas1: klausimas1,
            klausimas2: klausimas2,
            klausimas3: klausimas3
        };

        console.log(data);

        const vidurkis = ((klausimas1 + klausimas2 + klausimas3) / 3).toFixed(1);

        results.innerHTML = `
            <p>Vardas: ${data.vardas}</p>
            <p>Pavardė: ${data.pavarde}</p>
            <p>El. paštas: ${data.email}</p>
            <p>Tel. numeris: ${data.telefonas}</p>
            <p>Adresas: ${data.adresas}</p>
            <p>Klausimas 1: ${data.klausimas1}</p>
            <p>Klausimas 2: ${data.klausimas2}</p>
            <p>Klausimas 3: ${data.klausimas3}</p>
            <p>${data.vardas} ${data.pavarde}: ${vidurkis}</p>
        `;

        successMessage.style.display = "block";
    });
});






// Korteles

document.addEventListener("DOMContentLoaded", function () {
    const board = document.getElementById("game-board");
    const difficultySelect = document.getElementById("difficulty");
    const startBtn = document.getElementById("startGame");
    const resetBtn = document.getElementById("resetGame");
    const movesSpan = document.getElementById("moves");
    const matchesSpan = document.getElementById("matches");
    const timeSpan = document.getElementById("time");
    const winMessage = document.getElementById("win-message");
    const bestEasySpan = document.getElementById("best-easy");
    const bestHardSpan = document.getElementById("best-hard");

    if (!board) {
        return;
    }

    const baseIcons = [
        "assets/img/korteles/A.png",
        "assets/img/korteles/B.png",
        "assets/img/korteles/C.png",
        "assets/img/korteles/D.png",
        "assets/img/korteles/E.png",
        "assets/img/korteles/F.png"];


    let deck = [];
    let flippedCards = [];
    let isBusy = false;
    let moves = 0;
    let matches = 0;
    let totalPairs = 0;

    let timerId = null;
    let currentTime = 0;
    let gameStarted = false;

    const LS_KEY_EASY = "memory-best-easy";
    const LS_KEY_HARD = "memory-best-hard";

    function loadBestScores() {
        const bestEasy = localStorage.getItem(LS_KEY_EASY);
        const bestHard = localStorage.getItem(LS_KEY_HARD);
        bestEasySpan.textContent = bestEasy ? bestEasy : "-";
        bestHardSpan.textContent = bestHard ? bestHard : "-";
    }

    loadBestScores();

    function startTimer() {
        if (timerId) return;
        timerId = setInterval(() => {
            currentTime++;
            timeSpan.textContent = currentTime;
        }, 1000);
    }

    function stopTimer() {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
    }

    function resetStats() {
        moves = 0;
        matches = 0;
        currentTime = 0;
        gameStarted = false;
        movesSpan.textContent = "0";
        matchesSpan.textContent = "0";
        timeSpan.textContent = "0";
        winMessage.textContent = "";
        stopTimer();
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function buildDeck() {
        const difficulty = difficultySelect.value; 
        let neededPairs = 0;

        if (difficulty === "easy") {
            // 4 x 3 = 12 kortelių 6 poros
            neededPairs = 6;
            board.classList.remove("hard");
            board.classList.add("easy");
        } else {
            // 6 x 4 = 24 kortelės 12 porų
            neededPairs = 12;
            board.classList.remove("easy");
            board.classList.add("hard");
        }
        const icons = [];
        while (icons.length < neededPairs) {
            for (const icon of baseIcons) {
                if (icons.length < neededPairs) {
                    icons.push(icon);
                }
            }
        }

        const tempDeck = [];
        icons.forEach(icon => {
            tempDeck.push({ icon, id: Math.random() });
            tempDeck.push({ icon, id: Math.random() });
        });

        totalPairs = neededPairs;
        return shuffle(tempDeck);
    }

    function renderBoard() {
        board.innerHTML = "";
        deck.forEach(cardData => {
            const card = document.createElement("div");
            card.className = "game-card";
            card.dataset.icon = cardData.icon;
            card.dataset.id = cardData.id;

            const img = document.createElement("img");
            img.src = cardData.icon;
            img.className = "card-image";
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "cover";
            img.style.visibility = "hidden";

            card.appendChild(img);

            card.addEventListener("click", function () {
                handleCardClick(card);
            });

            board.appendChild(card);
        });
    }


    function handleCardClick(card) {
        if (isBusy) return;
        if (card.classList.contains("flipped") || card.classList.contains("matched")) return;
        if (!gameStarted) {
            gameStarted = true;
            startTimer();
        }

        card.classList.add("flipped");
        card.querySelector("img").style.visibility = "visible";
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            checkMatch();
        }
    }

    function checkMatch() {
        if (flippedCards.length !== 2) return;

        isBusy = true;
        moves++;
        movesSpan.textContent = moves.toString();

        const [card1, card2] = flippedCards;
        const sameIcon = card1.dataset.icon === card2.dataset.icon;

        if (sameIcon) {
            card1.querySelector("img").style.visibility = "visible";
            card2.querySelector("img").style.visibility = "visible";
            matches++;
            matchesSpan.textContent = matches.toString();
            flippedCards = [];
            isBusy = false;
            checkWin();
        } else {
            setTimeout(() => {
                card1.classList.remove("flipped");
                card2.classList.remove("flipped");
                card1.querySelector("img").style.visibility = "hidden";
                card2.querySelector("img").style.visibility = "hidden";
                flippedCards = [];
                isBusy = false;
            }, 1000);
        }
    }

    function checkWin() {
        if (matches === totalPairs) {
            stopTimer();
            winMessage.textContent = "Laimeta. Visos poros surastos.";
            saveBestScore();
        }
    }

    function saveBestScore() {
        const difficulty = difficultySelect.value;
        if (difficulty === "easy") {
            const currentBest = localStorage.getItem(LS_KEY_EASY);
            if (!currentBest || moves < Number(currentBest)) {
                localStorage.setItem(LS_KEY_EASY, moves.toString());
            }
        } else {
            const currentBest = localStorage.getItem(LS_KEY_HARD);
            if (!currentBest || moves < Number(currentBest)) {
                localStorage.setItem(LS_KEY_HARD, moves.toString());
            }
        }
        loadBestScores();
    }

    function startGame() {
        resetStats();
        deck = buildDeck();
        renderBoard();
    }

    function resetGame() {
        startGame();
    }

    startBtn.addEventListener("click", startGame);
    resetBtn.addEventListener("click", resetGame);
    difficultySelect.addEventListener("change", startGame);
});
