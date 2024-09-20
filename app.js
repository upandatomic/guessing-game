// script.js

// Sample product list (You can expand this list)
const products = [
    { name: "Wireless Headphones", price: 199.99 },
    { name: "Bluetooth Speaker", price: 149.99 },
    { name: "Smartphone", price: 799.99 },
    { name: "Laptop", price: 1299.99 },
    { name: "Gaming Console", price: 499.99 },
    { name: "Smart Watch", price: 249.99 },
    { name: "Digital Camera", price: 549.99 },
    { name: "Tablet", price: 399.99 },
    { name: "External Hard Drive", price: 89.99 },
    { name: "Action Camera", price: 299.99 }
];

let basketItems = [];
let totalValue = 0;
let attempts = 0;
const maxAttempts = 5;

function startGame() {
    // Reset variables
    basketItems = [];
    totalValue = 0;
    attempts = 0;
    document.getElementById('feedback').textContent = '';
    document.getElementById('new-game').style.display = 'none';
    document.getElementById('guess-container').innerHTML = '';

    // Generate basket
    generateBasket();

    // Display basket items
    displayBasketItems();

    // Create input rows
    createInputRows();
}

function generateBasket() {
    const itemCount = Math.floor(Math.random() * 3) + 3; // 3 to 5 items
    const usedIndices = new Set();

    while (basketItems.length < itemCount) {
        const index = Math.floor(Math.random() * products.length);
        if (!usedIndices.has(index)) {
            usedIndices.add(index);
            basketItems.push(products[index]);
            totalValue += products[index].price;
        }
    }

    // Ensure total value is less than 9999.99
    if (totalValue > 9999.99) {
        totalValue = 9999.99;
    }
    totalValue = parseFloat(totalValue.toFixed(2)); // Round to 2 decimal places
}

function displayBasketItems() {
    const itemsContainer = document.getElementById('items');
    itemsContainer.innerHTML = '';

    basketItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item');

        const nameSpan = document.createElement('span');
        nameSpan.textContent = item.name;

        const priceSpan = document.createElement('span');
        priceSpan.textContent = `$${item.price.toFixed(2)}`;

        itemDiv.appendChild(nameSpan);
        itemDiv.appendChild(priceSpan);
        itemsContainer.appendChild(itemDiv);
    });
}

function createInputRows() {
    const guessContainer = document.getElementById('guess-container');

    for (let i = 0; i < maxAttempts; i++) {
        const inputRow = document.createElement('div');
        inputRow.classList.add('input-row');

        for (let j = 0; j < 6; j++) {
            const inputBox = document.createElement('input');
            inputBox.type = 'text';
            inputBox.maxLength = 1;
            inputBox.disabled = i !== 0; // Enable only the first row
            inputBox.addEventListener('input', moveFocus);
            inputBox.addEventListener('keyup', handleEnter);
            inputRow.appendChild(inputBox);
        }

        guessContainer.appendChild(inputRow);
    }
}

function moveFocus(e) {
    const input = e.target;
    if (input.value.length === 1) {
        let nextInput = input.nextElementSibling;
        while (nextInput && nextInput.tagName !== 'INPUT') {
            nextInput = nextInput.nextElementSibling;
        }
        if (nextInput) {
            nextInput.focus();
        }
    }
}

function handleEnter(e) {
    if (e.key === 'Enter') {
        submitGuess();
    }
}

function submitGuess() {
    const guessContainer = document.getElementById('guess-container');
    const currentRow = guessContainer.children[attempts];
    const inputs = currentRow.querySelectorAll('input');

    let guessValue = '';
    inputs.forEach(input => {
        guessValue += input.value;
    });

    if (guessValue.length < 6) {
        alert('Please fill all the boxes before submitting.');
        return;
    }

    const guessNumber = parseFloat(guessValue);
    if (isNaN(guessNumber)) {
        alert('Please enter valid numbers.');
        return;
    }

    attempts++;

    // Provide feedback
    const feedback = document.getElementById('feedback');
    if (guessNumber === totalValue) {
        feedback.textContent = 'Correct! You guessed the exact price!';
        endGame();
    } else if (guessNumber > totalValue) {
        feedback.textContent = 'Your guess is over the total value. Game over!';
        endGame();
    } else if (attempts === maxAttempts) {
        feedback.textContent = `You've used all your guesses. The correct price was $${totalValue.toFixed(2)}.`;
        endGame();
    } else {
        feedback.textContent = 'Your guess is lower than the total value. Try again!';
        // Enable next row
        if (attempts < maxAttempts) {
            const nextRow = guessContainer.children[attempts];
            const nextInputs = nextRow.querySelectorAll('input');
            nextInputs.forEach(input => {
                input.disabled = false;
            });
            nextInputs[0].focus();
        }
    }

    // Disable current row inputs
    inputs.forEach(input => {
        input.disabled = true;
    });
}

function endGame() {
    // Disable all inputs
    const inputs = document.querySelectorAll('.input-row input');
    inputs.forEach(input => {
        input.disabled = true;
    });

    // Show new game button
    document.getElementById('new-game').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    startGame();
    document.getElementById('new-game').addEventListener('click', startGame);
});
