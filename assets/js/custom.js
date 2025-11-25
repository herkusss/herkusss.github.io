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
