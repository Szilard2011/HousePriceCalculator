<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI House Price Predictor</title>
    <!-- We are linking to our stylesheet. -->
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <div class="container">
        <header>
            <h1>AI House Price Predictor</h1>
            <p>Describe a property below, and our trained AI will estimate its market value based on millions of simulated data points.</p>
        </header>

        <!-- This message shows while the AI model downloads from Hugging Face. -->
        <div id="loader">
            <p>🚀 Initializing AI Brain from Hugging Face... this may take a moment on your first visit.</p>
        </div>

        <!-- The main calculator form, hidden until the AI is ready. -->
        <main id="calculator" style="display:none;">
            
            <label for="sqft">Square Footage:</label>
            <input type="number" id="sqft" value="2500">

            <label for="bedrooms">Bedrooms:</label>
            <input type="number" id="bedrooms" value="4">
            
            <label for="age">House Age (years):</label>
            <input type="number" id="age" value="15">
            
            <label for="condition">Property Condition (1-10):</label>
            <input type="number" id="condition" value="8" min="1" max="10">
            
            <label for="year">Year Sold:</label>
            <input type="number" id="year" value="2024">
            
            <label for="interest">Interest Rate (%):</label>
            <input type="number" id="interest" step="0.1" value="5.5">
            
            <label for="region">Region:</label>
            <select id="region">
                <option>Sunbelt</option><option>Pacific Northwest</option><option>Rust Belt</option>
                <option>New England</option><option>Mountain West</option>
            </select>
            
            <label for="subtype">Sub-Type:</label>
            <select id="subtype">
                <option>Urban</option><option selected>Suburban</option><option>Rural</option>
                <option>Historic District</option>
            </select>
            
            <label for="style">Architectural Style:</label>
            <select id="style">
                <option>Modern</option><option>Ranch</option><option selected>Colonial</option>
                <option>Craftsman</option><option>Victorian</option>
            </select>

            <div class="radio-group">
                <p>Does it have a garage?</p>
                <input type="radio" id="garage_yes" name="garage" value="1" checked><label for="garage_yes">Yes</label>
                <input type="radio" id="garage_no" name="garage" value="0"><label for="garage_no">No</label>
            </div>

            <div class="radio-group">
                <p>Does it have a pool?</p>
                <input type="radio" id="pool_yes" name="pool" value="1"><label for="pool_yes">Yes</label>
                <input type="radio" id="pool_no" name="pool" value="0" checked><label for="pool_no">No</label>
            </div>
            
            <button id="predict-button">Predict Price</button>

            <!-- The prediction result will be displayed here. -->
            <div id="result"></div>
        </main>
    </div>

    <!-- This section loads the Pyodide engine (Python for the web). -->
    <script src="https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js"></script>
    <!-- And this loads our main JavaScript file, which contains the AI logic. -->
    <script src="main.js"></script>
</body>
</html>
