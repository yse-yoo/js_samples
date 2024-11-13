// Get HTML elements
const webcam = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('captureButton');
const downloadButton = document.getElementById('downloadButton');
const thumbnailContainer = document.getElementById('thumbnailContainer');

const ctx = canvas.getContext('2d');
let selectedImageSrc = 'images/frame1.png'; // デフォルトの合成画像パス

// サムネイル画像データの配列
const thumbnails = [
    { src: 'images/frame1.png', alt: 'Frame 1' },
    { src: 'images/frame2.png', alt: 'Frame 2' },
    { src: 'images/frame3.png', alt: 'Frame 3' },
];

// サムネイル画像を動的に生成
function generateThumbnails() {
    thumbnails.forEach((thumbnail) => {
        const img = document.createElement('img');
        img.src = thumbnail.src;
        img.alt = thumbnail.alt;
        img.width = 100;
        img.height = 100;
        img.classList.add('thumbnail', 'cursor-pointer', 'border', 'border-gray-300', 'rounded-md');
        img.setAttribute('data-image', thumbnail.src);
        img.onclick = () => selectFrame(img);
        thumbnailContainer.appendChild(img);
    });
}

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
    mergeImage(); // 初回キャプチャ後にフレームを適用
}

// Merge the selected image onto the captured image
function mergeImage() {
    // キャプチャされた画像を描画し直す
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(webcam, 0, 0, canvas.width, canvas.height);

    const overlayImage = new Image();
    overlayImage.src = selectedImageSrc; // 選択された合成画像のパス

    // 画像が読み込まれたらキャンバスに合成
    overlayImage.onload = () => {
        ctx.drawImage(overlayImage, 0, 0, canvas.width, canvas.height);
    };
}

// Download the captured image with applied filter
function downloadImage() {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `captured-image-${Date.now()}.png`;
    link.click();
}

// Event listener for thumbnail selection
function selectFrame(element) {
    // すべてのサムネイルから 'selected-thumbnail' クラスを削除
    document.querySelectorAll('.thumbnail').forEach(img => {
        img.classList.remove('selected-thumbnail');
    });
    
    // クリックされたサムネイルに 'selected-thumbnail' クラスを追加
    element.classList.add('selected-thumbnail');

    // 選択された画像パスを設定して、合成画像を更新
    selectedImageSrc = element.getAttribute("data-image");
    mergeImage();
}

// Initialize webcam stream and generate thumbnails
setupWebcam();
generateThumbnails();
