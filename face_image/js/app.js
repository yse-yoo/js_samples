// Get HTML elements
const webcam = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('captureButton');
const applyFilterButton = document.getElementById('applyFilterButton');
const downloadButton = document.getElementById('downloadButton');

// canvas context
const ctx = canvas.getContext('2d');

// Set up webcam video stream
async function setupWebcam() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        webcam.srcObject = stream;
    } catch (err) {
        console.error("Error accessing webcam:", err);
    }
}

// Capture image from video stream
function captureImage() {
    canvas.width = webcam.videoWidth;
    canvas.height = webcam.videoHeight;
    ctx.drawImage(webcam, 0, 0, canvas.width, canvas.height);
    downloadButton.disabled = false; // Enable download after capturing
}

// Apply grayscale filter to captured image
function grayscaleFilter() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;        // Red
        data[i + 1] = avg;    // Green
        data[i + 2] = avg;    // Blue
    }
    ctx.putImageData(imageData, 0, 0);
}

function downloadImage() {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `captured-image-${Date.now()}.png`;
    link.click();
}

// Initialize webcam stream
setupWebcam();
