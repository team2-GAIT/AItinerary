const axios = require('axios');
const readline = require('readline');

require('dotenv').config({ 
    path: 'C:\\Users\\13sha\\Documents\\GitHub\\AItinerary\\AItinerary\\client\\.env.keys' 
  });

const openAIApiKey = process.env.OPENAI_API_KEY;

const generateImage = async (prompt) => {
    try {
        console.log("Generating image...");
        const response = await axios.post(
            "https://api.openai.com/v1/images/generations",
            {
                prompt: prompt,
                n: 1,
                size: "1024x1024",
            },
            {
                headers: {
                    Authorization: `Bearer ${openAIApiKey}`,
                    "Content-Type": "application/json",
                },
            }
        );
        const imageUrl = response.data.data[0].url;
        console.log("Generated Image URL:", imageUrl);
        return imageUrl;
    } catch (error) {
        console.error("Error generating image:", error.response?.data || error.message);
        return null;
    }
};

const main = async () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question("Enter a prompt to generate an image: ", async (prompt) => {
        const imageUrl = await generateImage(prompt);
        if (imageUrl) {
            console.log(`\nImage successfully generated! Image URL:\n${imageUrl}`);
        } else {
            console.log("Failed to generate an image. Please try again.");
        }

        rl.close();
    });
};

main();
