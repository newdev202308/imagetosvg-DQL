// Global variables
let uploadedImage = null;
let svgString = '';
let originalFileName = '';
let useServerAPI = true; // Toggle between client-side and server-side - DEFAULT: Potrace (Server)
let outputMode = 'stroke'; // 'fill' or 'stroke' - DEFAULT: Coloring Book Mode
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
            blur: 0,               // No blur for sharp coloring book lines
            ltres: 128,            // Standard threshold
            qtres: 0.5,            // LOWER = smoother curves (more curve points)
            pathomit: 0            // Keep ALL paths including small details (clouds, etc.)
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

    // Initialize Selection
    selectAlgorithm('server-rgb'); // Default to Potrace RGB (Server) - Best for Coloring Book
    selectOutputMode('stroke'); // Default to Coloring Book Mode

    // Color Slider Listener
    const colorSlider = document.getElementById('serverColors');
    if (colorSlider) {
        colorSlider.addEventListener('input', (e) => {
            document.getElementById('serverColorsValue').textContent = e.target.value;
        });
    }

    // Stroke Width Slider Listener
    const strokeWidthSlider = document.getElementById('strokeWidth');
    if (strokeWidthSlider) {
        strokeWidthSlider.addEventListener('input', (e) => {
            document.getElementById('strokeWidthValue').textContent = e.target.value;
        });
    }

    // Quality (optTolerance) Slider Listener
    const optToleranceSlider = document.getElementById('optTolerance');
    if (optToleranceSlider) {
        optToleranceSlider.addEventListener('input', (e) => {
            document.getElementById('optToleranceValue').textContent = e.target.value;
        });
    }
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

// Output Mode Selection (Fill vs Stroke for Coloring Book)
window.selectOutputMode = function (mode) {
    outputMode = mode;

    // Update Buttons
    document.querySelectorAll('.mode-option').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === mode) btn.classList.add('active');
    });

    // Show/hide stroke settings
    const strokeSettings = document.querySelector('.stroke-settings');
    if (strokeSettings) {
        strokeSettings.style.display = mode === 'stroke' ? 'block' : 'none';
    }

    // IMPORTANT: Auto-recommend Potrace RGB for Coloring Book Mode
    if (mode === 'stroke') {
        // If not using server-rgb, show warning
        if (currentAlgorithm !== 'server-rgb') {
            showToast('⚠️ Coloring Book Mode works best with Potrace RGB (Server) to create separate colorable regions. Switch algorithm for best results!', 'warning', 8000);

            // Show algorithm warning in stroke settings
            const strokeSettings = document.querySelector('.stroke-settings');
            if (strokeSettings) {
                let algorithmWarning = strokeSettings.querySelector('.algorithm-warning');
                if (!algorithmWarning) {
                    algorithmWarning = document.createElement('div');
                    algorithmWarning.className = 'algorithm-warning';
                    algorithmWarning.style.cssText = 'background: #fff3cd; border: 2px solid #ffc107; padding: 12px; border-radius: 6px; margin-top: 15px; color: #856404;';
                    strokeSettings.appendChild(algorithmWarning);
                }
                algorithmWarning.innerHTML = `
                    <strong>⚠️ Important:</strong> Current algorithm may create only 1 path (can't color separate regions).<br>
                    <strong>Recommended:</strong> Switch to <strong>Potrace RGB (Server)</strong> for multiple colorable regions.<br>
                    <button onclick="selectAlgorithm('server-rgb')" style="margin-top: 8px; background: #ffc107; color: #000; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold;">
                        🎨 Switch to Potrace RGB
                    </button>
                `;
            }
        } else {
            // Remove warning if using correct algorithm
            const strokeSettings = document.querySelector('.stroke-settings');
            if (strokeSettings) {
                const algorithmWarning = strokeSettings.querySelector('.algorithm-warning');
                if (algorithmWarning) algorithmWarning.remove();
            }
        }
    } else {
        // Remove warning when switching to Fill Mode
        const strokeSettings = document.querySelector('.stroke-settings');
        if (strokeSettings) {
            const algorithmWarning = strokeSettings.querySelector('.algorithm-warning');
            if (algorithmWarning) algorithmWarning.remove();
        }
    }

    // Show feedback
    const modeText = mode === 'stroke' ? '🎨 Coloring Book Mode enabled - SVG will have stroke outlines' : '🖼️ Fill Mode enabled - Normal filled SVG';
    showToast(modeText, 'success');
}

// Algorithm Selection
let currentAlgorithm = 'server-rgb'; // Default: Potrace RGB (Server) - Best for Coloring Book

// Initialize Algorithm Selection
function initializeAlgorithmSelection() {
    // Check hidden input or default
    const saved = document.getElementById('algorithmSelection').value;
    if (saved) selectAlgorithm(saved);
}

// Select Algorithm Function (Global for HTML access)
window.selectAlgorithm = function (algoType) {
    currentAlgorithm = algoType;
    document.getElementById('algorithmSelection').value = algoType;

    // Update Buttons
    document.querySelectorAll('.algo-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.algo === algoType) btn.classList.add('active');
    });

    // Update UI
    updateAlgorithmUI();

    // If switching to Potrace RGB in Coloring Book Mode, remove warning
    if (algoType === 'server-rgb' && outputMode === 'stroke') {
        const strokeSettings = document.querySelector('.stroke-settings');
        if (strokeSettings) {
            const algorithmWarning = strokeSettings.querySelector('.algorithm-warning');
            if (algorithmWarning) algorithmWarning.remove();
        }
        showToast('✅ Perfect! Potrace RGB will create multiple colorable regions for Coloring Book Mode', 'success', 5000);
    }

    // If switching away from Potrace RGB in Coloring Book Mode, show warning
    if (algoType !== 'server-rgb' && outputMode === 'stroke') {
        showToast('⚠️ Warning: This algorithm may create only 1 path. Use Potrace RGB for multiple colorable regions.', 'warning', 6000);
    }
}

// Update UI based on algorithm selection
function updateAlgorithmUI() {
    const imageTracerSettings = document.querySelector('.imagetracer-settings');
    const serverSettings = document.querySelector('.server-settings');
    const rgbSettings = document.querySelector('.rgb-settings');
    const algorithmNote = document.querySelector('.algorithm-note');

    // Hide all first
    if (imageTracerSettings) imageTracerSettings.style.display = 'none';
    if (serverSettings) serverSettings.style.display = 'none';
    if (rgbSettings) rgbSettings.style.display = 'none';

    // Show based on selection
    if (currentAlgorithm === 'client') {
        // CLIENT MODE (ImageTracer)
        if (imageTracerSettings) imageTracerSettings.style.display = 'block';
        if (algorithmNote) algorithmNote.textContent = '💻 Using ImageTracer (Client) - Offline conversion, no server required';
        useServerAPI = false;
    } else if (currentAlgorithm === 'server') {
        // SERVER MODE (Potrace B&W)
        if (serverSettings) serverSettings.style.display = 'block';
        if (algorithmNote) algorithmNote.textContent = '🚀 Using Potrace (Server) - Standard B&W, high quality line art';
        useServerAPI = true;
    } else if (currentAlgorithm === 'server-rgb') {
        // SERVER RGB MODE (Potrace Multi-layer)
        if (serverSettings) serverSettings.style.display = 'block';
        if (rgbSettings) rgbSettings.style.display = 'block'; // Show Color slider
        if (algorithmNote) algorithmNote.textContent = '🎨 Using Potrace RGB (Server) - Multi-layer color conversion (Slower)';
        useServerAPI = true;
    }
}

// Convert to SVG using Server API (Potrace)
async function convertWithPotrace() {
    if (!uploadedImage) {
        showToast('Please select an image first', 'error');
        return;
    }

    // Get color count for better loading message
    const colorCount = currentAlgorithm === 'server-rgb' ?
        (document.getElementById('serverColors').value || '8') : '2';
    const estimatedTime = Math.ceil(parseInt(colorCount) * 1.5);

    svgPreview.innerHTML = `<div class="loading">
        <div class="spinner"></div>
        <p>Converting with Potrace RGB...</p>
        <small style="color: #666; margin-top: 10px; display: block;">
            Processing ${colorCount} color layers (~${estimatedTime}s)<br>
            Creating multiple colorable regions...
        </small>
    </div>`;
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

        // Get optTolerance from slider (default 0.1 for high accuracy)
        const optToleranceInput = document.getElementById('optTolerance');
        const optToleranceValue = optToleranceInput ? optToleranceInput.value : '0.1';
        formData.append('optTolerance', optToleranceValue);

        formData.append('turnPolicy', 'minority');
        formData.append('optCurve', 'true');

        // Add Color Mode settings
        if (currentAlgorithm === 'server-rgb') {
            formData.append('colorMode', 'true');
            formData.append('colors', colorCount);
            // Add stroke width for Coloring Book mode
            const strokeWidth = document.getElementById('strokeWidth').value;
            formData.append('strokeWidth', strokeWidth);
        } else {
            formData.append('colorMode', 'false');
        }

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
            const colorInfo = result.stats.colors ? ` from ${result.stats.colors} colors` : '';
            showToast(`✅ Success! ${result.stats.pathCount} paths${colorInfo} (${result.stats.sizeKB} KB)`, 'success', 5000);
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

// Helper: Parse path data to get start and end points
function getPathEndpoints(pathData) {
    const commands = pathData.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi);
    if (!commands || commands.length === 0) return null;

    let currentX = 0, currentY = 0;
    let startX = 0, startY = 0;

    // Get start point
    const firstCmd = commands[0].trim();
    const firstMatch = firstCmd.match(/M\s*([+-]?\d*\.?\d+)[,\s]+([+-]?\d*\.?\d+)/i);
    if (firstMatch) {
        startX = parseFloat(firstMatch[1]);
        startY = parseFloat(firstMatch[2]);
        currentX = startX;
        currentY = startY;
    }

    // Get end point (scan through all commands)
    for (let cmd of commands) {
        cmd = cmd.trim();
        const cmdType = cmd[0].toUpperCase();

        if (cmdType === 'M') {
            const match = cmd.match(/M\s*([+-]?\d*\.?\d+)[,\s]+([+-]?\d*\.?\d+)/i);
            if (match) {
                currentX = parseFloat(match[1]);
                currentY = parseFloat(match[2]);
            }
        } else if (cmdType === 'L') {
            const match = cmd.match(/L\s*([+-]?\d*\.?\d+)[,\s]+([+-]?\d*\.?\d+)/i);
            if (match) {
                currentX = parseFloat(match[1]);
                currentY = parseFloat(match[2]);
            }
        } else if (cmdType === 'C') {
            const match = cmd.match(/([+-]?\d*\.?\d+)[,\s]+([+-]?\d*\.?\d+)\s*$/);
            if (match) {
                currentX = parseFloat(match[1]);
                currentY = parseFloat(match[2]);
            }
        }
    }

    return { startX, startY, endX: currentX, endY: currentY };
}

// Helper: Calculate distance between two points
function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Convert Fill-based SVG to Stroke-based SVG for Coloring Book
function convertToStrokeSVG(svgStr) {
    const strokeWidth = document.getElementById('strokeWidth').value;
    const fillGapsEnabled = document.getElementById('fillGaps')?.checked ?? true;

    // Parse SVG string
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgStr, 'image/svg+xml');
    const svgElement = svgDoc.documentElement;

    // Remove all non-path elements (keep only paths)
    const nonPathElements = svgElement.querySelectorAll('g, rect, circle, ellipse, polygon, polyline, line, mask, clipPath, defs, use');
    nonPathElements.forEach(el => el.remove());

    // Process all path elements
    const paths = svgElement.querySelectorAll('path');

    paths.forEach(path => {
        const currentFill = path.getAttribute('fill');
        const isFillNone = currentFill === 'none' || currentFill === 'transparent';

        // For coloring book with fill+stroke (Adobe Illustrator style):
        // KEEP original fill colors from the SVG (don't replace them)
        // ADD black stroke outline for professional look

        let fillColor = currentFill; // KEEP original fill color

        // If no fill or transparent, default to white
        if (!currentFill || isFillNone) {
            fillColor = '#FFFFFF';
        }

        // IMPORTANT: Ensure path is closed for coloring
        let pathData = path.getAttribute('d');
        if (pathData && fillGapsEnabled) {
            pathData = pathData.trim();

            // Check if path ends with Z or z (closed)
            const isClosed = pathData.endsWith('Z') || pathData.endsWith('z');

            if (!isClosed) {
                // Get start and end points
                const endpoints = getPathEndpoints(pathData);

                if (endpoints) {
                    const { startX, startY, endX, endY } = endpoints;
                    const gap = distance(startX, startY, endX, endY);

                    // If gap is small (< 10px), auto-close with Z
                    // If gap is larger, add explicit line back to start
                    if (gap < 10) {
                        pathData += ' Z';
                    } else if (gap < 50) {
                        // Medium gap: add line back to start, then close
                        pathData += ` L ${startX},${startY} Z`;
                    }
                    // If gap > 50px, it's likely intentionally open, don't force close

                    path.setAttribute('d', pathData);
                }
            }
        }

        // Set coloring book attributes
        path.setAttribute('fill', fillColor);
        path.setAttribute('fill-rule', 'evenodd');
        path.setAttribute('stroke', '#000000');
        path.setAttribute('stroke-width', strokeWidth);
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        path.setAttribute('stroke-miterlimit', '10');

        // Remove any opacity/transform that might interfere
        path.removeAttribute('opacity');
        path.removeAttribute('fill-opacity');
        path.removeAttribute('stroke-opacity');
    });

    // Serialize back to string
    const serializer = new XMLSerializer();
    return serializer.serializeToString(svgElement);
}

// Display SVG
function displaySVG(svgStr) {
    // Apply coloring book mode if enabled
    // SKIP client-side processing for server-rgb because server already applies Adobe style
    if (outputMode === 'stroke' && currentAlgorithm !== 'server-rgb') {
        svgStr = convertToStrokeSVG(svgStr);
    }

    // Store the final SVG string for download
    svgString = svgStr;

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

        // Show mode in info
        const modeLabel = outputMode === 'stroke' ? ' | Mode: Coloring Book' : ' | Mode: Fill';
        document.getElementById('svgInfo').textContent =
            `Size: ${width} × ${height}px | Paths: ${paths} | Size: ${sizeInKB} KB${modeLabel}`;
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
        // Format SVG code for better readability
        const formattedSVG = svgString.replace(/></g, '>\n<');
        svgCode.value = formattedSVG;
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
function showToast(message, type = 'success', duration = 3000) {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    setTimeout(() => toast.classList.add('show'), 100);

    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Prevent default drag behavior on document
document.addEventListener('dragover', (e) => e.preventDefault());
document.addEventListener('drop', (e) => e.preventDefault());
