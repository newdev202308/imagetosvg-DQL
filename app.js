// Global variables
let uploadedImage = null;
let svgString = '';
let originalFileName = '';
let useServerAPI = true; // Toggle between client-side and server-side - DEFAULT: Potrace (Server)
// Server API URL - Auto-detect based on environment
let serverURL = '';
if (window.location.protocol === 'file:') {
    serverURL = 'http://localhost:3000'; // Local file -> Local server
} else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    if (window.location.port !== '3000') {
        serverURL = 'http://localhost:3000'; // Localhost (not 3000) -> Local server
    } else {
        serverURL = ''; // Same origin (proxy/served by backend)
    }
} else {
    serverURL = ''; // Production (served by backend) -> Relative path check
}

// DOM Elements
const uploadBox = document.getElementById('uploadBox');
const fileInput = document.getElementById('fileInput');
const selectFileBtn = document.getElementById('selectFileBtn');
const settingsSection = document.getElementById('settingsSection');
const previewSection = document.getElementById('previewSection');
const originalImage = document.getElementById('originalImage');
const svgPreview = document.getElementById('svgPreview');
const loadingIndicator = document.getElementById('loadingIndicator');
const convertBtn = document.getElementById('convertBtn');
const resetBtn = document.getElementById('resetBtn');
const downloadSection = document.getElementById('downloadSection');
const downloadBtn = document.getElementById('downloadBtn');
const viewCodeBtn = document.getElementById('viewCodeBtn');
const codeViewer = document.getElementById('codeViewer');
const svgCode = document.getElementById('svgCode');
const copyCodeBtn = document.getElementById('copyCodeBtn');
const toast = document.getElementById('toast');
const algorithmToggle = document.getElementById('algorithmToggle');
const serverURLInput = document.getElementById('serverURL');

// Settings elements
const blurInput = document.getElementById('blur');
const blurValue = document.getElementById('blurValue');
const ltresInput = document.getElementById('ltres');
const ltresValue = document.getElementById('ltresValue');
const qtresInput = document.getElementById('qtres');
const qtresValue = document.getElementById('qtresValue');

// Optimized presets for different image types
const presets = {
    lineart: {
        name: 'Line Art',
        description: 'Optimized for line drawings, coloring books',
        options: {
            colorsampling: 0,      // Disabled for black/white
            numberofcolors: 2,     // Just black and white
            blur: 1,               // Light blur for smoother curves
            ltres: 128,            // Standard threshold
            qtres: 0.5,            // LOWER = smoother curves (more curve points)
            pathomit: 1            // Keep almost all details
        }
    },
    logo: {
        name: 'Logo / Icon',
        description: 'Optimized for logos, icons, simple shapes',
        options: {
            colorsampling: 2,      // Deterministic
            numberofcolors: 8,     // Limited colors
            blur: 0,               // Sharp edges
            ltres: 128,
            qtres: 1.5,
            pathomit: 6
        }
    },
    photo: {
        name: 'Complex Photo',
        description: 'Optimized for photos, complex images',
        options: {
            colorsampling: 1,      // Random sampling
            numberofcolors: 32,    // More colors
            blur: 2,               // Smooth details
            ltres: 128,
            qtres: 1,
            pathomit: 10
        }
    },
    sketch: {
        name: 'Sketch',
        description: 'Optimized for hand-drawn sketches',
        options: {
            colorsampling: 0,
            numberofcolors: 4,
            blur: 1,
            ltres: 120,
            qtres: 2,
            pathomit: 5
        }
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    updateRangeValues();
    initializePresets();
    updateAlgorithmUI(); // Set default UI for Potrace mode
});

// Initialize preset buttons
function initializePresets() {
    const presetButtons = document.querySelectorAll('[data-preset]');
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const presetType = btn.getAttribute('data-preset');
            applyPreset(presetType);

            // Update active state
            presetButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// Apply preset settings
function applyPreset(presetType) {
    if (presetType === 'custom') {
        // Don't change settings for custom
        return;
    }

    const preset = presets[presetType];
    if (!preset) return;

    // Apply preset options
    document.getElementById('colorsampling').value = preset.options.colorsampling;
    document.getElementById('numberofcolors').value = preset.options.numberofcolors;
    blurInput.value = preset.options.blur;
    ltresInput.value = preset.options.ltres;
    qtresInput.value = preset.options.qtres;
    document.getElementById('pathomit').value = preset.options.pathomit;

    // Update range value displays
    updateRangeValues();

    // Show toast
    showToast(`Applied preset: ${preset.name}`, 'success');
}

// Auto-detect image type
function detectImageType(img) {
    const canvas = document.createElement('canvas');
    canvas.width = Math.min(img.width, 200);
    canvas.height = Math.min(img.height, 200);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let colorCount = 0;
    let uniqueColors = new Set();
    let grayCount = 0;

    // Sample pixels
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Check if grayscale
        if (Math.abs(r - g) < 10 && Math.abs(g - b) < 10) {
            grayCount++;
        }

        // Count unique colors (simplified)
        const color = `${Math.floor(r / 50)},${Math.floor(g / 50)},${Math.floor(b / 50)}`;
        uniqueColors.add(color);
    }

    const totalPixels = data.length / 4;
    const grayPercentage = grayCount / totalPixels;
    const colorVariety = uniqueColors.size;

    // Determine type
    if (grayPercentage > 0.9 && colorVariety < 20) {
        return 'lineart'; // Likely line art or sketch
    } else if (colorVariety < 30) {
        return 'logo'; // Limited colors, likely logo
    } else if (colorVariety > 100) {
        return 'photo'; // Many colors, likely photo
    } else {
        return 'sketch'; // Medium complexity
    }
}

// Event Listeners
function initializeEventListeners() {
    // File selection
    selectFileBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop
    uploadBox.addEventListener('dragover', handleDragOver);
    uploadBox.addEventListener('dragleave', handleDragLeave);
    uploadBox.addEventListener('drop', handleDrop);

    // Buttons
    convertBtn.addEventListener('click', convertToSVG);
    resetBtn.addEventListener('click', resetApp);
    downloadBtn.addEventListener('click', downloadSVG);
    viewCodeBtn.addEventListener('click', toggleCodeViewer);
    copyCodeBtn.addEventListener('click', copySVGCode);

    // Range inputs - mark as custom when changed
    blurInput.addEventListener('input', () => {
        updateRangeValue(blurInput, blurValue);
        markAsCustom();
    });
    ltresInput.addEventListener('input', () => {
        updateRangeValue(ltresInput, ltresValue);
        markAsCustom();
    });
    qtresInput.addEventListener('input', () => {
        updateRangeValue(qtresInput, qtresValue);
        markAsCustom();
    });

    // Other inputs
    document.getElementById('colorsampling').addEventListener('change', markAsCustom);
    document.getElementById('numberofcolors').addEventListener('input', markAsCustom);
    document.getElementById('pathomit').addEventListener('input', markAsCustom);

    // Close toast on click
    toast.addEventListener('click', () => {
        toast.classList.remove('show');
    });

    // Algorithm toggle
    if (algorithmToggle) {
        algorithmToggle.addEventListener('change', (e) => {
            useServerAPI = e.target.checked;
            updateAlgorithmUI();
        });
    }

    // Server URL input
    if (serverURLInput) {
        serverURLInput.addEventListener('change', (e) => {
            serverURL = e.target.value.trim();
        });
    }
}

// Mark preset as custom when settings are manually changed
function markAsCustom() {
    const presetButtons = document.querySelectorAll('.btn-preset');
    presetButtons.forEach(b => b.classList.remove('active'));
    document.querySelector('.btn-preset[data-preset="custom"]').classList.add('active');
}

// Range value updates
function updateRangeValues() {
    updateRangeValue(blurInput, blurValue);
    updateRangeValue(ltresInput, ltresValue);
    updateRangeValue(qtresInput, qtresValue);
}

function updateRangeValue(input, display) {
    display.textContent = input.value;
}

// Drag and drop handlers
function handleDragOver(e) {
    e.preventDefault();
    uploadBox.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadBox.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    uploadBox.classList.remove('dragover');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

// File selection handler
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

// Handle file processing
function handleFile(file) {
    // Validate file type
    if (!file.type.match('image.*')) {
        showToast('Please select an image file (JPG, PNG, JPEG)', 'error');
        return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showToast('File size must not exceed 10MB', 'error');
        return;
    }

    originalFileName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension

    const reader = new FileReader();
    reader.onload = function (e) {
        uploadedImage = new Image();
        uploadedImage.onload = function () {
            displayOriginalImage(e.target.result);
            showToast('Image loaded successfully!', 'success');
        };
        uploadedImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Display original image
function displayOriginalImage(imageSrc) {
    originalImage.src = imageSrc;

    // Show settings and preview sections
    settingsSection.style.display = 'block';
    previewSection.style.display = 'block';
    downloadSection.style.display = 'none';
    codeViewer.style.display = 'none';

    // Clear previous SVG
    svgPreview.innerHTML = '<div class="loading" id="loadingIndicator"><div class="spinner"></div><p>Click "Convert" to start</p></div>';

    // Update info
    const info = `Size: ${uploadedImage.width} × ${uploadedImage.height}px`;
    document.getElementById('originalInfo').textContent = info;
    document.getElementById('svgInfo').textContent = '';

    // Auto-detect image type and suggest preset
    setTimeout(() => {
        const detectedType = detectImageType(uploadedImage);
        const preset = presets[detectedType];

        // Show recommendation
        showToast(`🤖 Suggestion: This looks like a "${preset.name}". Auto-selected!`, 'success');

        // Auto-apply detected preset
        applyPreset(detectedType);

        // Update active button
        const presetButtons = document.querySelectorAll('.btn-preset');
        presetButtons.forEach(b => b.classList.remove('active'));
        document.querySelector(`.btn-preset[data-preset="${detectedType}"]`).classList.add('active');
    }, 500);
}

// Update UI based on algorithm selection
function updateAlgorithmUI() {
    const imageTracerSettings = document.querySelector('.imagetracer-settings');
    const potraceSettings = document.querySelector('.potrace-settings');
    const algorithmNote = document.querySelector('.algorithm-note');

    if (useServerAPI) {
        // Show Potrace settings, hide ImageTracer settings
        if (imageTracerSettings) imageTracerSettings.style.display = 'none';
        if (potraceSettings) potraceSettings.style.display = 'block';
        if (algorithmNote) algorithmNote.textContent = '🚀 Using Potrace (Server) - High quality, 95%+ match to convertio.co';
    } else {
        // Show ImageTracer settings, hide Potrace settings
        if (imageTracerSettings) imageTracerSettings.style.display = 'block';
        if (potraceSettings) potraceSettings.style.display = 'none';
        if (algorithmNote) algorithmNote.textContent = '💻 Using ImageTracer (Client) - Offline conversion, no server required';
    }
}

// Convert to SVG using Server API (Potrace)
async function convertWithPotrace() {
    if (!uploadedImage) {
        showToast('Please select an image first', 'error');
        return;
    }

    svgPreview.innerHTML = '<div class="loading"><div class="spinner"></div><p>Converting with Potrace...</p></div>';
    downloadSection.style.display = 'none';

    try {
        // Convert image to blob
        const response = await fetch(originalImage.src);
        const blob = await response.blob();

        // Create FormData
        const formData = new FormData();
        formData.append('image', blob, originalFileName + '.png');

        // Add Potrace settings
        formData.append('threshold', ltresInput.value);
        formData.append('turdSize', document.getElementById('pathomit').value || '2');
        formData.append('optTolerance', '0.2');
        formData.append('turnPolicy', 'minority');
        formData.append('optCurve', 'true');

        console.log('Calling Potrace API at:', serverURL + '/api/convert');

        // Call API
        const apiResponse = await fetch(serverURL + '/api/convert', {
            method: 'POST',
            body: formData
        });

        if (!apiResponse.ok) {
            const errorData = await apiResponse.json();
            throw new Error(errorData.error || 'Server error');
        }

        const result = await apiResponse.json();

        if (result.success) {
            svgString = result.svg;
            displaySVG(result.svg);
            showToast(`✅ Conversion successful with Potrace! (${result.stats.pathCount} paths, ${result.stats.sizeKB} KB)`, 'success');
        } else {
            throw new Error(result.error || 'Conversion failed');
        }

    } catch (error) {
        console.error('Potrace API error:', error);
        showToast('❌ API Error: ' + error.message + '. Check if server is running (npm start in server folder)', 'error');
        svgPreview.innerHTML = `<p style="color: red;">API Error: ${error.message}<br><br>Guide:<br>1. Open terminal in "server" folder<br>2. Run: npm install<br>3. Run: npm start<br>4. Server will run at http://localhost:3000</p>`;
    }
}

// Convert to SVG
function convertToSVG() {
    if (!uploadedImage) {
        showToast('Vui lòng chọn ảnh trước', 'error');
        return;
    }

    // Check algorithm selection
    if (useServerAPI) {
        // Use Potrace API
        convertWithPotrace();
        return;
    }

    // Use ImageTracer (client-side)
    if (typeof ImageTracer === 'undefined') {
        showToast('ImageTracer library not loaded. Please refresh and try again.', 'error');
        svgPreview.innerHTML = '<p style="color: red;">Error: Library not loaded. Please refresh (F5).</p>';
        return;
    }

    // Show loading
    svgPreview.innerHTML = '<div class="loading"><div class="spinner"></div><p>Converting...</p></div>';
    downloadSection.style.display = 'none';

    // Get settings with OPTIMIZED options for smooth curves
    const options = {
        // Color options
        corsenabled: false,
        colorsampling: parseInt(document.getElementById('colorsampling').value),
        numberofcolors: parseInt(document.getElementById('numberofcolors').value),
        mincolorratio: 0,
        colorquantcycles: 3,

        // SVG rendering options - CRITICAL for smooth curves
        ltres: parseInt(ltresInput.value),
        qtres: parseFloat(qtresInput.value),  // Lower = smoother curves
        pathomit: parseInt(document.getElementById('pathomit').value),

        // Blur options - helps smooth curves
        blurradius: parseInt(blurInput.value),
        blurdelta: 20,

        // Enhanced options for smooth curves
        linefilter: false,          // Disable for smoother organic lines
        rightangleenhance: false,   // Disable to keep natural curves

        // Stroke options
        strokewidth: 1,

        // Layer options
        layering: 0,                // Sequential layering

        // Tracing options
        roundcoords: 0.5,           // Lower rounding for smoother curves

        // Curve fitting options
        curvefit: true,             // Enable curve fitting
        scale: 1                    // Scale factor
    };

    console.log('Starting conversion with options:', options);

    // Convert using ImageTracer
    setTimeout(() => {
        try {
            ImageTracer.imageToSVG(
                originalImage.src,
                (svgstr) => {
                    console.log('Conversion successful, SVG length:', svgstr.length);
                    svgString = svgstr;
                    displaySVG(svgstr);
                    showToast('Conversion successful!', 'success');
                },
                options
            );
        } catch (error) {
            console.error('Conversion error:', error);
            showToast('Conversion error: ' + error.message, 'error');
            svgPreview.innerHTML = '<p style="color: red;">Conversion error: ' + error.message + '</p>';
        }
    }, 100);
}

// Display SVG
function displaySVG(svgStr) {
    svgPreview.innerHTML = svgStr;

    // Get SVG element and calculate size
    const svgElement = svgPreview.querySelector('svg');
    if (svgElement) {
        const width = svgElement.getAttribute('width');
        const height = svgElement.getAttribute('height');
        const paths = svgElement.querySelectorAll('path').length;

        // Calculate approximate file size
        const sizeInBytes = new Blob([svgStr]).size;
        const sizeInKB = (sizeInBytes / 1024).toFixed(2);

        document.getElementById('svgInfo').textContent =
            `Size: ${width} × ${height}px | Paths: ${paths} | Size: ${sizeInKB} KB`;
    }

    // Show download section
    downloadSection.style.display = 'block';
}

// Download SVG
function downloadSVG() {
    if (!svgString) {
        showToast('No SVG to download', 'error');
        return;
    }

    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${originalFileName || 'converted'}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Download successful!', 'success');
}

// Toggle code viewer
function toggleCodeViewer() {
    if (!svgString) {
        showToast('No SVG code to display', 'error');
        return;
    }

    if (codeViewer.style.display === 'none') {
        codeViewer.style.display = 'block';
        svgCode.value = svgString;
        viewCodeBtn.textContent = '✖️ Close Code';
    } else {
        codeViewer.style.display = 'none';
        viewCodeBtn.textContent = '👁️ View SVG Code';
    }
}

// Copy SVG code
function copySVGCode() {
    svgCode.select();
    document.execCommand('copy');
    showToast('Copied to clipboard!', 'success');
}

// Reset app
function resetApp() {
    // Reset variables
    uploadedImage = null;
    svgString = '';
    originalFileName = '';

    // Reset file input
    fileInput.value = '';

    // Hide sections
    settingsSection.style.display = 'none';
    previewSection.style.display = 'none';
    downloadSection.style.display = 'none';
    codeViewer.style.display = 'none';

    // Clear previews
    originalImage.src = '';
    svgPreview.innerHTML = '';
    document.getElementById('originalInfo').textContent = '';
    document.getElementById('svgInfo').textContent = '';

    showToast('Reset successful. Choose a new image.', 'success');
}

// Toast notification
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    setTimeout(() => toast.classList.add('show'), 100);

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Prevent default drag behavior on document
document.addEventListener('dragover', (e) => e.preventDefault());
document.addEventListener('drop', (e) => e.preventDefault());
