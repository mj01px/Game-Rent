// app.js

import {initContainer} from "./config/constants.js";

// Expose initContainer function globally on the window object,
// so it can be called from anywhere in the app or inline scripts.
window.initContainer = initContainer;
