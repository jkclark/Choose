import type { Choice } from "./choices";
import { getMostRecentTallyTime } from "./choices";

const CHOICES_KEY = "choices";

export function saveChoiceLocally(choice: Choice): void {
  const choices = getChoicesFromLocalStorage();

  if (choices[choice.gameId] !== undefined) {
    // Choice already exists, do not overwrite, log an error
    console.error("Choice already exists for game ID", choice.gameId);
    return;
  }

  choices[choice.gameId] = choice;

  localStorage.setItem(CHOICES_KEY, JSON.stringify(choices));
}

export function getChoiceLocally(gameId: number): Choice | null {
  const choices = getChoicesFromLocalStorage();
  return choices[gameId] || null;
}

export function getAllUserChoices(): Record<number, number> {
  const choices = getChoicesFromLocalStorage();
  const mostRecentTallyTime = getMostRecentTallyTime();

  // Convert from Choice objects to gameId -> choice mapping
  // Only include choices made after the most recent backend tally (3am Eastern)
  // This prevents double-counting choices that have already been aggregated
  const choiceMap: Record<number, number> = {};
  Object.entries(choices).forEach(([gameId, choice]) => {
    // Only count choices made after the most recent tally to avoid double counting
    if (choice.chosenTime > mostRecentTallyTime) {
      choiceMap[Number(gameId)] = choice.choice;
    }
  });
  return choiceMap;
}

function getChoicesFromLocalStorage(): Record<number, Choice> {
  const choicesString = localStorage.getItem(CHOICES_KEY);
  if (!choicesString) {
    return {};
  }

  try {
    const choices = JSON.parse(choicesString);
    return choices;
  } catch (e) {
    console.error("Error parsing choices from localStorage", e);
    return {};
  }
}
