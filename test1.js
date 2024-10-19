// console.log("JavaScript file loaded successfully");
//
// import Replicate from "replicate";
//
// console.log("Starting the script");

// import Replicate from "replicate"
//
// const replicate = new Replicate({
//    auth: process.env.REPLICATE_API_TOKEN,
// });
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors({
    origin: '*' // Allow all origins (or specify your frontend domain)
}));

// Parse JSON bodies
app.use(express.json());

app.post('/api/predict', async (req, res) => {
    try {
        const response = await axios.post('https://api.replicate.com/v1/predictions', req.body, {
            headers: {
                'Authorization': `Token YOUR_REPLICATE_API_TOKEN`, // Replace with your Replicate API token
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error calling the Replicate API');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});







async function streamAIModelOutput() {
    const outputElement = document.getElementById('output');

    try {
        const response = await fetch('http://localhost:3000/api/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                version: "meta/meta-llama-3.1-405b-instruct", // Replace with your model version ID
                input: {} // Your model inputs go here
            })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();

        let predictionUrl = result.urls.get;
        while (result.status !== "succeeded" && result.status !== "failed") {
            const predictionResponse = await fetch(predictionUrl);
            result = await predictionResponse.json();

            if (result.status === "processing") {
                outputElement.textContent += "Processing...\n";
            }

            await new Promise(resolve => setTimeout(resolve, 1000)); // Poll every second
        }

        if (result.status === "succeeded") {
            outputElement.textContent += result.output;
        } else {
            outputElement.textContent += "Prediction failed.";
        }

    } catch (error) {
        console.error("Error:", error);
        outputElement.textContent += "\nError: " + error.message;
    }
}

window.onload = streamAIModelOutput;








/*

async function streamAIModelOutput() {
    const outputElement = document.getElementById('output');

    try {
        const response = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
                'Authorization': "r8_8yLpWqtYAhUBPb46ijGAQKYLleepq4d2SgQ80", // Replace with your Replicate API token
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              version: "meta/meta-llama-3.1-405b-instruct",
              input: {} // Your model inputs go here
            })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();

        // Polling for the prediction result
        let predictionUrl = result.urls.get;
        while (result.status !== "succeeded" && result.status !== "failed") {
            const predictionResponse = await fetch(predictionUrl, {
                headers: {
                    'Authorization': process.env.REPLICATE_API_TOKEN, // Replace with your Replicate API token
                }
            });
            result = await predictionResponse.json();

            if (result.status === "processing") {
                outputElement.textContent += "Processing...\n";
            }

            await new Promise(resolve => setTimeout(resolve, 1000)); // Poll every second
        }

        if (result.status === "succeeded") {
            outputElement.textContent += result.output;
        } else {
            outputElement.textContent += "Prediction failed.";
        }

    } catch (error) {
        console.error("Error:", error);
        outputElement.textContent += "\nError: " + error.message;
    }
}

window.onload = streamAIModelOutput;
*/
