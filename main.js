// main.js - This script is the bridge between our webpage and our powerful AI on Hugging Face.
// This version is more robust and handles API errors gracefully.

const predictButton = document.getElementById('predict-button');
const resultDiv = document.getElementById('result');

// This is the confirmed, correct public address of your AI brain running in the cloud.
const API_URL = "https://szili2011-ai-house-price-predictor-api.hf.space/run/predict";


// Now, we tell the "Predict" button to listen for clicks.
predictButton.addEventListener('click', async () => {
    
    // Let the user know that the AI is thinking.
    resultDiv.style.display = 'block';
    resultDiv.innerText = '🤖 Waking up the AI on Hugging Face... This might take a moment.';

    // Step 1: Gather all the information from the form fields.
    const inputs = [
        parseInt(document.getElementById('sqft').value),
        parseInt(document.getElementById('bedrooms').value),
        parseInt(document.getElementById('age').value),
        parseInt(document.getElementById('condition').value),
        parseInt(document.getElementById('year').value),
        parseFloat(document.getElementById('interest').value),
        document.getElementById('region').value,
        document.getElementById('subtype').value,
        document.getElementById('style').value,
        document.querySelector('input[name="garage"]:checked').value === "1",
        document.querySelector('input[name="pool"]:checked').value === "1"
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
        
        // Check if the server responded successfully.
        if (!response.ok) {
            // If the server had an internal error, it won't be 'ok'.
            throw new Error(`Server responded with status: ${response.status}`);
        }

        const result = await response.json();
        
        // --- THIS IS THE FIX ---
        // Before we use the result, we MUST check if it has the 'data' key we expect.
        if (result && result.data && result.data[0]) {
            // If everything looks good, get the prediction.
            const predicted_price = result.data[0];
            // And display it to the user.
            resultDiv.innerText = `Predicted Price: ${predicted_price}`;
        } else {
            // If the server sent back a weird response, we raise an error.
            console.error("Unexpected API response:", result);
            throw new Error("The AI server gave an unexpected response. It might be waking up.");
        }

    } catch (error) {
        // This 'catch' block will now handle all types of errors gracefully.
        console.error("Error connecting to or processing response from the AI server:", error);
        resultDiv.innerText = '❌ An error occurred. The AI server might be waking up or busy. Please try again in 30 seconds.';
    }
});
