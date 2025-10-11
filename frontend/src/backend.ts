/**
 * This module handles communication with AWS (Lambda and S3) for storing and
 * retrieving choices.
 */
import type { Choice } from "./choices";

const API_BASE_URL = "https://4w1im8e5i2.execute-api.us-east-1.amazonaws.com";
const AGGREGATE_FILE_URL =
  "https://choose-choices.s3.us-east-1.amazonaws.com/aggregated_choices.json";

// Queue for pending submissions to handle rapid clicks
const submissionQueue: Choice[] = [];
let isProcessingQueue = false;

export async function submitChoice(choice: Choice) {
  // Add to queue and process
  submissionQueue.push(choice);
  processSubmissionQueue();
}

async function processSubmissionQueue() {
  if (isProcessingQueue || submissionQueue.length === 0) {
    return;
  }

  isProcessingQueue = true;

  try {
    // Process all pending choices in batch
    const choicesToSubmit = submissionQueue.splice(0); // Remove all items from queue

    if (choicesToSubmit.length > 0) {
      await submitChoices(choicesToSubmit);
    }
  } catch (error) {
    console.error("Error processing submission queue:", error);
  } finally {
    isProcessingQueue = false;

    // Check if more items were added while processing
    if (submissionQueue.length > 0) {
      setTimeout(processSubmissionQueue, 100); // Small delay before next batch
    }
  }
}

async function submitChoices(choices: Choice[], retryCount = 0): Promise<void> {
  const maxRetries = 3;
  const retryDelay = 1000; // 1 second

  try {
    // Rename gameId to game_id to comply with what the backend expects
    const transformedChoices = choices.map((choice) => ({
      game_id: choice.gameId,
      choice: choice.choice,
    }));

    const response = await fetch(`${API_BASE_URL}/choose`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ choices: transformedChoices }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    console.log(
      `Successfully submitted choices for games: ${choices.map((c) => c.gameId).join(", ")}`,
    );
  } catch (error) {
    console.error(
      `Failed to submit choices (attempt ${retryCount + 1}):`,
      error,
    );

    if (retryCount < maxRetries) {
      console.log(`Retrying in ${retryDelay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      return submitChoices(choices, retryCount + 1);
    } else {
      console.error(
        `Failed to submit choices after ${maxRetries + 1} attempts:`,
        choices,
      );
      // Still throw the error so calling code can handle it
      throw error;
    }
  }
}

export async function getAllChoices() {
  const response = await fetch(AGGREGATE_FILE_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch choices");
  }
  return response.json();
}
