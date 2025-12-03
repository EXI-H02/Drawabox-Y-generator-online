// --- Constants ---
const WIDTH = 800;
const HEIGHT = 800;

// Center point (Origin)
const OX = WIDTH / 2;
const OY = HEIGHT / 2;

// Colors (RGB/CSS)
const AXIS_COLOR = 'rgb(200, 150, 0)';
const VECTOR_COLOR = 'rgb(0, 0, 0)';
const POINT_COLOR = 'rgb(0, 0, 0)';
const POINT_RADIUS = 3;

// Global coordinates object
let vectorCoords = {};

// --- Canvas and Context Setup ---
const canvas = document.getElementById('vectorCanvas');
const ctx = canvas.getContext('2d');
const generateButton = document.getElementById('generateButton');

// --- Helper Functions ---

function randLen() {
    // Generates a random integer length between 100 and 400
    return Math.floor(Math.random() * 191) + 100;
}

function angularDistance(angle1, angle2) {
    // Calculates the minimum angular distance between two angles (0-360)
    let diff = Math.abs(angle1 - angle2);
    // Handles wrap-around (e.g., distance between 10 and 350 is 20)
    return Math.min(diff, 360 - diff);
}

function polarToCartesian(length, angle_degrees) {
    // Converts degrees to radians
    const angle_radians = angle_degrees * (Math.PI / 180);
    
    const delta_x = length * Math.cos(angle_radians);
    // Canvas Y-axis is inverted (Y increases downwards), so we negate the sine component
    const delta_y = -length * Math.sin(angle_radians); 
    
    // Return absolute screen coordinates
    return {
        x: OX + delta_x,
        y: OY + delta_y
    };
}

function generateVectors() {
    let lenA = randLen();
    let lenB = randLen();
    let lenC = randLen();
    
    let angleA, angleB, angleC;

    // --- Rejection Sampling for 90 degree minimum separation ---
    while (true) {
        // Generate three random angles (0-359 degrees)
        angleA = Math.floor(Math.random() * 360);
        angleB = Math.floor(Math.random() * 360);
        angleC = Math.floor(Math.random() * 360);

        // Calculate angular distances
        const dAB = angularDistance(angleA, angleB);
        const dAC = angularDistance(angleA, angleC);
        const dBC = angularDistance(angleB, angleC);

        // Check condition: all separations must be >= 90 degrees
        if (dAB >= 90 && dAC >= 90 && dBC >= 90) {
            break; 
        }
    }

    // Calculate final Coordinates
    const A = polarToCartesian(lenA, angleA);
    const B = polarToCartesian(lenB, angleB);
    const C = polarToCartesian(lenC, angleC);
    
    vectorCoords = { A, B, C };
    
    console.log(`Generated Vectors: A=${Math.round(lenA)}@${angleA}°, B=${Math.round(lenB)}@${angleB}°, C=${Math.round(lenC)}@${angleC}°`);
    console.log(`Separations: dAB=${angularDistance(angleA, angleB)}°, dAC=${angularDistance(angleA, angleC)}°, dBC=${angularDistance(angleB, angleC)}°`);
    
    drawElements();
}

function drawElements() {
    // 1. Clear screen (already white from CSS, but good practice to clear)
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    
    // 2. Draw axes
    ctx.strokeStyle = AXIS_COLOR;
    ctx.lineWidth = 1;
    
    // Horizontal Line (X-axis)
    ctx.beginPath();
    ctx.moveTo(0, OY);
    ctx.lineTo(WIDTH, OY);
    ctx.stroke();
    
    // Vertical Line (Y-axis)
    ctx.beginPath();
    ctx.moveTo(OX, 0);
    ctx.lineTo(OX, HEIGHT);
    ctx.stroke();

    // 3. Draw vectors (Lines)
    ctx.strokeStyle = VECTOR_COLOR;
    ctx.lineWidth = 2;
    
    const { A, B, C } = vectorCoords;

    // Draw OA
    ctx.beginPath();
    ctx.moveTo(OX, OY);
    ctx.lineTo(A.x, A.y);
    ctx.stroke();
    
    // Draw OB
    ctx.beginPath();
    ctx.moveTo(OX, OY);
    ctx.lineTo(B.x, B.y);
    ctx.stroke();

    // Draw OC
    ctx.beginPath();
    ctx.moveTo(OX, OY);
    ctx.lineTo(C.x, C.y);
    ctx.stroke();

    // 4. Draw points (Filled circles, matching the 6x6 size of the C code's rects)
    ctx.fillStyle = POINT_COLOR;
    
    // Origin O
    ctx.beginPath();
    ctx.arc(OX, OY, POINT_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    // Point A
    ctx.beginPath();
    ctx.arc(A.x, A.y, POINT_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    // Point B
    ctx.beginPath();
    ctx.arc(B.x, B.y, POINT_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    // Point C
    ctx.beginPath();
    ctx.arc(C.x, C.y, POINT_RADIUS, 0, Math.PI * 2);
    ctx.fill();
}

// --- Event Listener ---
generateButton.addEventListener('click', generateVectors);

// --- Initial Run ---
// Start the application by generating the first set of vectors
generateVectors();