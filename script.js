const leftAmount = document.getElementById("leftAmount");
const rightAmount = document.getElementById("rightAmount");
const leftRate = document.getElementById("leftRate");
const rightRate = document.getElementById("rightRate");
const errorMessage = document.getElementById("errorMessage");

const leftButtons = document.querySelectorAll(".exchange-block:first-child .currency-option");
const rightButtons = document.querySelectorAll(".exchange-block:last-child .currency-option");

let leftCurrency = "RUB";
let rightCurrency = "USD";

let rates = {};

async function fetchRates(base = "RUB") {
    try {
        const response = await fetch(`https://api.exchangerate.host/latest?base=${base}&symbols=RUB,USD,EUR,GBP`);
        const data = await response.json();
        rates = data.rates;
        updateAmounts();
        errorMessage.classList.remove("show");
    } catch (error) {
        console.error("APİ xətası:", error);
        errorMessage.textContent = "Məzənnə alınmadı. Yenidən yoxlayın.";
        errorMessage.classList.add("show");
    }
}

function updateAmounts() {
    const leftValue = rates[leftCurrency] ? 1 : 0;
    const rightValue = (rates[rightCurrency] / rates[leftCurrency]).toFixed(4);
    leftAmount.value = leftValue;
    rightAmount.value = rightValue;

    leftRate.textContent = `1 ${leftCurrency} = ${(rates[rightCurrency] / rates[leftCurrency]).toFixed(4)} ${rightCurrency}`;
    rightRate.textContent = `1 ${rightCurrency} = ${(rates[leftCurrency] / rates[rightCurrency]).toFixed(4)} ${leftCurrency}`;
}

function setupButtons(buttons, side) {
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");

            if(side === "left") leftCurrency = btn.dataset.currency;
            else rightCurrency = btn.dataset.currency;

            fetchRates(leftCurrency);
        });
    });
}

setupButtons(leftButtons, "left");
setupButtons(rightButtons, "right");

fetchRates(leftCurrency);