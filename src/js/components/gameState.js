// This module manages the selected game ID in a simple way.
let selectedGameId = null;

export function setSelectedGameId(id) {
    selectedGameId = id;
}

export function getSelectedGameId() {
    return selectedGameId;
}
