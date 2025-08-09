// main.js - This script is the bridge between our webpage and our powerful AI on Hugging Face.

// First, let's grab the HTML elements we'll need to work with.
const predictButton = document.getElementById('predict-button');
const resultDiv = document.getElementById('result');

// --- This is the confirmed, correct public address of your AI brain running in the cloud. ---
const API_URL = "https://szili2011-ai-house-price-predictor-api.hf.space/run/predict";


// Now, we tell the "Predict" button to listen for clicks.
// When a click happens, this whole function will run.
predictButton.addEventListener('click', async () => {
    
    // Let the user know that the AI is thinking. This makes the app feel responsive.
    resultDiv.style.display = 'block';
    resultDiv.innerText = '🤖 Asking the AI on Hugging Face...';

    // Step 1: Gather all the information from the form fields.
    const inputs = [
        parseInt(document.getElementById('sqft').value),      // sqft
        parseInt(document.getElementById('bedrooms').value),  // bedrooms
        parseInt(document.getElementById('age').value),       // house_age
        parseInt(document.getElementById('condition').value), // condition
        parseInt(document.getElementById('year').value),      // year_sold
        parseFloat(document.getElementById('interest').value),// interest_rate
        document.getElementById('region').value,              // region
        document.getElementById('subtype').value,             // sub_type
        document.getElementById('style').value,               // style
        document.querySelector('input[name="garage"]:checked').value === "1", // has_garage (as true/false)
        document.querySelector('input[name="pool"]:checked').value === "1"    // has_pool (as true/false)
    ];

    try {
        // Step 2: Send this data package over the internet to our API.
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                data: inputs
            })
        });

        // Step 3: Wait for the AI's response and get the result.
        const result = await response.json();
        const predicted_price = result.data[0];

        // Step 4: Display the final prediction to the user!
        resultDiv.innerText = `Predicted Price: ${predicted_price}`;

    } catch (error) {
        // If anything goes wrong, we'll show an error message.
        console.error("Error connecting to the AI server:", error);
        resultDiv.innerText = '❌ Error: Could not connect to the AI. Please try again later.';
    }
});
