const axios = require('axios');
const fs = require('fs');

const replicateApiKey = "r8_6UPfSJE6D0OwglJNEwMmU5iBrWjluG91jYb3O";

const generateMusic = async (prompt, duration = 10) => {
    try {
        console.log("Generating music...");

        // Step 1: Start a prediction
        const response = await axios.post(
            "https://api.replicate.com/v1/predictions",
            {
                version: "7a76a8258b23fae65c5a22debb8841d1d7e816b75c2f24218cd2bd8573787906",
                input: { prompt: prompt, duration: duration },
            },
            {
                headers: {
                    Authorization: `Token ${replicateApiKey}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const prediction = response.data;
        console.log("Prediction started:", prediction.id);

        // Step 2: Poll for completion
        let status = prediction.status;
        while (status !== "succeeded" && status !== "failed") {
            console.log("Waiting for completion...");
            await new Promise((resolve) => setTimeout(resolve, 3000));

            const pollResponse = await axios.get(
                `https://api.replicate.com/v1/predictions/${prediction.id}`,
                {
                    headers: { Authorization: `Token ${replicateApiKey}` },
                }
            );

            status = pollResponse.data.status;
            console.log("Current Prediction Status:", status);

            if (status === "succeeded") {
                const output = pollResponse.data.output;
                console.log("Output data:", output);

                if (!output || output.length === 0) {
                    console.error("No output received from the model.");
                    return null;
                }

                const audioUrl = output[0];
                if (!audioUrl || !audioUrl.startsWith("http")) {
                    console.error("Invalid URL received:", audioUrl);
                    return null;
                }

                console.log("Generated music URL:", audioUrl);

                // Step 3: Download the audio file
                const audioResponse = await axios.get(audioUrl, { responseType: "arraybuffer" });
                const filePath = "generated_music.wav";
                fs.writeFileSync(filePath, Buffer.from(audioResponse.data));
                console.log(`Music saved as '${filePath}'.`);
                return filePath;
            }
        }

        if (status === "failed") {
            console.error("Music generation failed. Check the API response for details.");
        }
        return null;
    } catch (error) {
        console.error("Error generating music:", error.response?.data || error.message);
        return null;
    }
};

// Example usage: Run this script with a prompt as a command-line argument
// e.g. node script.js "A calming piano melody for a rainy day"
(async () => {
    const userPrompt = process.argv[2];
    if (!userPrompt) {
        console.error("Please provide a prompt as a command line argument.");
        process.exit(1);
    }

    const filePath = await generateMusic(userPrompt);

    if (filePath) {
        console.log("Music generation complete. File saved locally.");
    }
})();
