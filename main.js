// main.js

// First, we get references to the important HTML elements we'll need to interact with.
const loader = document.getElementById('loader');
const calculator = document.getElementById('calculator');
const predictButton = document.getElementById('predict-button');
const resultDiv = document.getElementById('result');

// This is the main function that orchestrates everything.
async function initializeAndRun() {
    console.log("Starting the initialization process...");

    // --- STEP 1: Load the Pyodide Engine and Python Packages ---
    try {
        let pyodide = await loadPyodide();
        console.log("Pyodide engine loaded.");
        await pyodide.loadPackage(["numpy", "pandas", "scikit-learn", "joblib"]);
        console.log("Required Python packages loaded.");

        // --- STEP 2: Load Our Trained AI Model from Hugging Face ---
        const modelPromise = pyodide.runPythonAsync(`
            from pyodide.http import pyfetch
            import joblib
            import io

            # These are the direct download URLs for YOUR model files hosted on Hugging Face.
            model_url = "https://huggingface.co/szili2011/ai-house-price-predictor/resolve/main/housing_model.joblib"
            columns_url = "https://huggingface.co/szili2011/ai-house-price-predictor/resolve/main/model_columns.joblib"

            # Fetch the model file from the Hugging Face URL.
            print("Downloading AI model from Hugging Face...")
            response = await pyfetch(model_url)
            model_bytes = await response.bytes()
            print("Model download complete. Loading...")
            model = joblib.load(io.BytesIO(model_bytes))

            # Fetch the columns file from its Hugging Face URL.
            response_cols = await pyfetch(columns_url)
            cols_bytes = await response_cols.bytes()
            model_columns = joblib.load(io.BytesIO(cols_bytes))
            
            # This makes the loaded 'model' and 'model_columns' available globally within Pyodide.
            (model, model_columns)
        `);

        // We wait until the model and columns are fully loaded before continuing.
        const [model, model_columns] = await modelPromise;
        console.log("AI Model and columns have been successfully loaded and are ready.");
        
        // --- STEP 3: Update the UI ---
        // Now that the AI is ready, we hide the "loading" message and show the calculator form.
        loader.style.display = 'none';
        calculator.style.display = 'block';

        // --- STEP 4: Set up the Predict Button ---
        predictButton.addEventListener('click', async () => {
            // First, we collect all the current values from the form inputs on the webpage.
            const inputs = {
                SquareFootage: parseInt(document.getElementById('sqft').value),
                Bedrooms: parseInt(document.getElementById('bedrooms').value),
                HouseAge: parseInt(document.getElementById('age').value),
                PropertyCondition: parseInt(document.getElementById('condition').value),
                YearSold: parseInt(document.getElementById('year').value),
                InterestRate: parseFloat(document.getElementById('interest').value),
                Region: document.getElementById('region').value,
                SubType: document.getElementById('subtype').value,
                ArchitecturalStyle: document.getElementById('style').value,
                HasGarage: !!parseInt(document.querySelector('input[name="garage"]:checked').value),
                HasPool: !!parseInt(document.querySelector('input[name="pool"]:checked').value)
            };

            // We make the user's input data available to our Python code.
            pyodide.globals.set("input_data_js", inputs);

            // Now, we run a second Python script to process this new data and get a prediction.
            const predicted_price = await pyodide.runPythonAsync(`
                import pandas as pd
                
                # Get the house data that we just passed from JavaScript.
                input_dict = input_data_js.to_py()
                input_df = pd.DataFrame([input_dict])
                
                # Preprocess this new data in the *exact same way* we preprocessed the training data.
                input_processed = pd.get_dummies(input_df)
                
                # Reindex to make sure it has the exact same columns in the same order as the training data.
                final_input = input_processed.reindex(columns=model_columns, fill_value=0)
                
                # Use our loaded model to predict the price on the prepared data.
                prediction = model.predict(final_input)[0]
                prediction
            `);

            // --- STEP 5: Display the Result ---
            // We take the price prediction from Python and display it beautifully on the page.
            resultDiv.innerText = `Predicted Price: $${predicted_price.toLocaleString('en-US', {maximumFractionDigits: 0})}`;
            resultDiv.style.display = 'block';
        });

    } catch (error) {
        // If anything goes wrong during initialization, we show an error message.
        console.error("Failed to initialize the AI application:", error);
        loader.innerText = "❌ Error: Could not load the AI model. Please check the browser's console (F12) for details.";
    }
}

// This line officially starts the whole process when the webpage loads.
initializeAndRun();
