/**
 * Simple state management module for tracking the currently selected game ID.
 * Provides getter and setter functions to manage the selected game ID in a centralized way.
 *
 * This acts as a basic state container to avoid global variables and provide
 * controlled access to the selected game ID across components.
 */

// Private module variable to store the currently selected game ID
let selectedGameId = null;

/**
 * Sets the currently selected game ID
 * @param {string|number} id - The game ID to set as currently selected
 */
export function setSelectedGameId(id) {
    selectedGameId = id;
}

/**
 * Gets the currently selected game ID
 * @returns {string|number|null} The currently selected game ID or null if none is selected
 */
export function getSelectedGameId() {
    return selectedGameId;
}