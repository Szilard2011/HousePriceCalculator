// main.js - DIAGNOSTIC SCRIPT
// The only purpose of this script is to capture and display the raw API response.

const predictButton = document.getElementById('predict-button');
const resultDiv = document.getElementById('result');

const API_URL = "https://szili2011-ai-house-price-predictor-api.hf.space/run/predict";

predictButton.addEventListener('click', async () => {
    
    // Let the user know we're starting the test.
    resultDiv.style.display = 'block';
    resultDiv.innerText = '🔬 Running diagnostic test... Sending data to API...';

    // Gather the inputs as usual.
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
        // Make the API call as before.
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                data: inputs
            })
        });

        const result = await response.json();
        
        // --- THIS IS THE BLACK BOX RECORDER ---
        // We are not assuming anything. We are just printing what we received.
        console.log("--- RAW API RESPONSE RECEIVED ---");
        console.log("The object below is the exact data sent back by the Hugging Face server:");
        console.log(result);
        console.log("---------------------------------");
        
        // Now we tell the user on the webpage to check the console.
        resultDiv.innerText = "✅ Test Complete. Please open the Developer Console (F12) and copy the 'RAW API RESPONSE' object.";


    } catch (error) {
        // If the connection itself fails, we'll still see it.
        console.error("Error during the fetch operation:", error);
        resultDiv.innerText = '❌ Test Failed. Could not connect to the server. Check console for details.';
    }
});
