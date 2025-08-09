// Get references to our HTML elements
const loader = document.getElementById('loader');
const calculator = document.getElementById('calculator');
const predictButton = document.getElementById('predict-button');
const resultDiv = document.getElementById('result');

async function main() {
    // 1. Load the Pyodide engine and Python packages
    let pyodide = await loadPyodide();
    await pyodide.loadPackage(["numpy", "pandas", "scikit-learn", "joblib"]);
    
    // 2. Fetch the saved model files from our GitHub Pages repository
    let modelPromise = pyodide.runPythonAsync(`
        from pyodide.http import pyfetch
        import joblib
        import io

        # Fetch model file
        response = await pyfetch("trained_housing_model_final.joblib")
        model_bytes = await response.bytes()
        model = joblib.load(io.BytesIO(model_bytes))

        # Fetch columns file
        response_cols = await pyfetch("model_columns_final.joblib")
        cols_bytes = await response_cols.bytes()
        model_columns = joblib.load(io.BytesIO(cols_bytes))
        
        # Return both the model and the columns
        (model, model_columns)
    `);
    
    // Wait for the model and columns to be fully loaded
    const [model, model_columns] = await modelPromise;
    console.log("AI Model and columns loaded successfully!");

    // Hide the loader and show the calculator form
    loader.style.display = 'none';
    calculator.style.display = 'block';

    // 3. Add an event listener to the predict button
    predictButton.addEventListener('click', async () => {
        // Get all the values from the form inputs
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

        // Pass the user inputs to a Python function to make the prediction
        pyodide.globals.set("input_data_js", inputs);
        let predicted_price = await pyodide.runPythonAsync(`
            import pandas as pd
            
            # Get the input data from JavaScript
            input_dict = input_data_js.to_py()
            input_df = pd.DataFrame([input_dict])
            
            # Preprocess the data exactly like we did in training
            input_processed = pd.get_dummies(input_df)
            final_input = input_processed.reindex(columns=model_columns, fill_value=0)
            
            # Make the prediction!
            prediction = model.predict(final_input)[0]
            prediction
        `);

        // Display the result on the webpage
        resultDiv.innerText = `AI Predicted Price: $${predicted_price.toLocaleString('en-US', {maximumFractionDigits: 0})}`;
    });
}

// Run the main function when the page loads
main();hand.jsmain.js
