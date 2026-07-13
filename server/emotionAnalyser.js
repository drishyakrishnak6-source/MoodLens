import { HfInference } from "@huggingface/inference";

// Initialize with your Hugging Face Access Token 
// (Get a free token from hf.co/settings/tokens)
const hf = new HfInference("YOUR_HUGGING_FACE_ACCESS_TOKEN");

/**
 * Analyzes text using the GoEmotions model (28 total categories)
 * @param {string} text - The user's journal or text entry
 */
async function analyzeGranularEmotions(text) {
  try {
    const response = await hf.textClassification({
      model: "monologg/bert-base-cased-goemotions-original",
      inputs: text,
    });

    // Sort the results so the highest confidence emotions are first
    const sortedEmotions = response.sort((a, b) => b.score - a.score);

    console.log("--- Granular Emotion Analysis Results ---");
    console.log(`Input Text: "${text}"\n`);
    
    // Display top 3 detected emotions with percentages
    console.log("Detected Emotions:");
    sortedEmotions.slice(0, 3).forEach((emotion) => {
      const percentage = (emotion.score * 100).toFixed(1);
      console.log(`- ${emotion.label}: ${percentage}%`);
    });

    return sortedEmotions;
  } catch (error) {
    console.error("Error analyzing emotions:", error);
  }
}

// Example usage:
const sampleJournalEntry = "I'm so proud of fixing this bug today, but honestly, I'm a bit nervous about the deployment tomorrow.";
analyzeGranularEmotions(sampleJournalEntry);