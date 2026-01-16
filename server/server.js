const express = require('express');
const multer = require('multer');
const potrace = require('potrace');
const sharp = require('sharp');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file JPG, PNG, JPEG'));
        }
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Helper: Simple color distance
function colorDistance(c1, c2) {
    return Math.sqrt(
        Math.pow(c1.r - c2.r, 2) +
        Math.pow(c1.g - c2.g, 2) +
        Math.pow(c1.b - c2.b, 2)
    );
}

// Convert image to SVG using Potrace
app.post('/api/convert', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Vui lòng upload file ảnh' });
        }

        console.log('Processing image:', req.file.originalname);

        // Get settings from request
        const {
            threshold = 128,
            turdSize = 2,
            turnPolicy = 'minority',
            alphaMax = 1,
            optCurve = true,
            optTolerance = 0.2,
            colorMode = 'false', // NEW: Check if color mode is enabled
            colors = 8,          // NEW: Number of colors
            quantize = 'true'
        } = req.body;

        const isColorMode = colorMode === 'true' || colorMode === true;
        const colorCount = parseInt(colors) || 8;

        // B&W MODE (Legacy Potrace)
        if (!isColorMode) {
            const processedImage = await sharp(req.file.buffer)
                .grayscale()
                .png()
                .toBuffer();

            const potraceOptions = {
                threshold: parseInt(threshold),
                turdSize: parseInt(turdSize),
                turnPolicy: turnPolicy,
                alphaMax: parseFloat(alphaMax),
                optCurve: optCurve === 'true',
                optTolerance: parseFloat(optTolerance),
                color: '#000000',
                background: 'transparent'
            };

            potrace.trace(processedImage, potraceOptions, (err, svg) => {
                if (err) throw err;

                const stats = {
                    pathCount: (svg.match(/<path/g) || []).length,
                    sizeKB: (Buffer.byteLength(svg, 'utf8') / 1024).toFixed(2)
                };

                res.json({ success: true, svg, stats });
            });
            return;
        }

        // --- COLOR MODE (Multi-layer Potrace) ---
        console.log(`\n🎨 Starting Color Processing:`);
        console.log(`   Colors: ${colorCount}`);
        console.log(`   Estimated time: ${Math.ceil(colorCount * 1.5)}s`);

        // 1. Quantize Image using Sharp
        // We output to raw buffer to read pixels manually if needed, 
        // but easier trick: Posterize -> loop unique colors

        // Step 1: Reduce colors (Posterize)
        const quantizer = sharp(req.file.buffer)
            .resize(800) // Resize first to speed up processing
            .toFormat('png');

        // Note: keeping it simple - Sharp doesn't have "palettize" that returns palette list easily.
        // Strategy: 
        // 1. Create limited palette buffer using internal logic or external lib.
        // 2. Since we don't have 'get-pixels' yet, let's use a creative loop with Sharp.
        // ALTERNATIVE: Use a simplified "Threshold Banding" if we want to avoid complex clustering code without libs.

        // BETTER STRATEGY WITHOUT NEW LIBS:
        // Use Sharp to generate 'N' separate binary images based on posterization? No, hard to separate colors.
        // Let's implement a very basic K-means or frequency sort on downscaled image to pick palette.

        const rawBuffer = await sharp(req.file.buffer)
            .resize(100, 100, { fit: 'inside' }) // Tiny thumbnail for palette extraction
            .raw()
            .toBuffer();

        // Extract Palette (Naive approach)
        const pixelData = [];
        for (let i = 0; i < rawBuffer.length; i += 3) { // Assume RGB (no alpha in raw usually if not specified, check metadata)
            pixelData.push({ r: rawBuffer[i], g: rawBuffer[i + 1], b: rawBuffer[i + 2] });
        }

        // Just take distinct colors from "posterized" small version?
        // Let's rely on Sharp's built-in image optimization slightly? 
        // Actually, let's try a simpler approach server-side: 
        // We will process the full image with sharp.ensureAlpha()

        const fullBuffer = await sharp(req.file.buffer).ensureAlpha().raw().toBuffer();
        const info = await sharp(req.file.buffer).metadata();

        // NOTE: Writing full k-means in one file is risky for "replace_file".
        // Let's default to a "Layered Threshold" approach for "Potrace RGB" MVP if libs are missing.
        // BUT user expects REAL color.

        // Let's pretend we have a robust palette. 
        // Since we cannot easily install 'quantize' or 'get-pixels' via tool here without user permission to run npm install again...
        // Wait, I can run npm install.
        // Let's pause editing server.js and install 'get-pixels' and 'quantize' first? 
        // No, user wants simple flow.

        // Workaround: We will rely on image-q or just do a simple quantization here?
        // Let's TRY writing a simple 8-color quantization manually:
        // Or simply scan the image for dominant colors? 

        // Let's proceed with a Mock/Simple separating logic for now to keep it runnable without heavy deps.
        // We will treat "RGB" as "CMYK-ish" seperation? No, bad result.

        // BEST PATH: Install 'node-vibrant' or similar? 
        // Let's use 'quantize' (node-quantize). It is small.
        // I will finish this 'server.js' edit assuming I will install a helper, OR write a mini helper.
        // Let's write a mini-helper here.

        // ... Implementation of "Simple Color Extraction" ...
        // For MVP: We will scan the 100x100 thumbnail.
        // Group pixels into 'colorCount' buckets.

        // Then for each bucket (Palette Color):
        // 1. Create a binary mask where pixel is "close" to Palette Color.
        // 2. Run Potrace on mask.
        // 3. Set SVG path fill to Palette Color.

        // Let's do this!

        // --- 1. Extract Palette from Thumb ---
        // INCREASED resolution for better line detection
        const thumb = await sharp(req.file.buffer)
            .resize(200, 200, { fit: 'inside' })  // DOUBLED from 100x100
            .raw()
            .toBuffer();

        const colorMap = {};
        const step = 16; // REDUCED from 24 - More precise color detection

        for (let i = 0; i < thumb.length; i += 3) { // RGB
            const r = Math.floor(thumb[i] / step) * step;
            const g = Math.floor(thumb[i + 1] / step) * step;
            const b = Math.floor(thumb[i + 2] / step) * step;

            const key = `${r},${g},${b}`;
            colorMap[key] = (colorMap[key] || 0) + 1;
        }

        // Sort by frequency
        let uniqueColors = Object.entries(colorMap)
            .sort((a, b) => b[1] - a[1]); // Descending

        // Logic: Always preserve the DARKEST color found (usually outlines/eyes) 
        // even if it's low frequency.
        // Find darkest in the *entire* limited map
        let darkest = null;
        let minLum = 255 * 3;

        uniqueColors.forEach(e => {
            const parts = e[0].split(',').map(Number);
            const lum = parts[0] + parts[1] + parts[2];
            if (lum < minLum) {
                minLum = lum;
                darkest = e; // Keep full entry [key, freq]
            }
        });

        // Slice top frequent
        let finalColors = uniqueColors.slice(0, colorCount);

        // Check if darkest is included. If not, swap the last one (least frequent of the top) with darkest.
        // Unless colorCount is very small (2), then maybe we shouldn't force? 
        // Actually, for Line Art, Black is CRITICAL.
        if (darkest) {
            const isIncluded = finalColors.some(c => c[0] === darkest[0]);
            if (!isIncluded && finalColors.length > 0) {
                // Replace the last one (lowest freq) with Darkest
                finalColors[finalColors.length - 1] = darkest;
            }
        }

        // Re-Sort final list so Darkest (Low Freq) is at the END?
        // Wait, 'layers' logic: 
        // We draw layers sequentially. 
        // If we want outlines ON TOP, they must be LAST in the SVG.
        // So Low Frequency should be LAST.
        // My previous sort was Descending (High -> Low). 
        // So High (Bg) is First (Bottom). Low (Details) is Last (Top).
        // This is correct.
        // Just need to ensure 'finalColors' is still sorted by Frequency (or specifically put Darkest last).

        // Let's re-sort 'finalColors' by Luminance? No, by Freq is usually safe for layering.
        // But if we force-added Darkest, it might have very low freq. 
        // It should naturally be at the end if we just appended it? 
        // No, I replaced the last element. So it IS at the end.

        const sortedColors = finalColors.map(e => {
            const parts = e[0].split(',').map(Number);
            return { r: parts[0], g: parts[1], b: parts[2] };
        });

        // --- 2. Process Layers ---
        let finalSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${info.width} ${info.height}">`;

        // Get raw pixel data of full image
        const rawFull = await sharp(req.file.buffer).ensureAlpha().raw().toBuffer();
        const width = info.width;
        const height = info.height;

        const promises = sortedColors.map(async (color, colorIndex) => {
            // Create 1-bit buffer for this color using CLOSEST COLOR approach
            // This preserves anti-aliased edges better than threshold
            const maskBuffer = Buffer.alloc(width * height); // 1 byte per pixel (Grayscale)

            for (let i = 0; i < width * height; i++) {
                const r = rawFull[i * 4];
                const g = rawFull[i * 4 + 1];
                const b = rawFull[i * 4 + 2];

                // Find closest color in palette
                let minDist = Infinity;
                let closestIndex = 0;

                for (let j = 0; j < sortedColors.length; j++) {
                    const c = sortedColors[j];
                    const dist = Math.sqrt(Math.pow(r - c.r, 2) + Math.pow(g - c.g, 2) + Math.pow(b - c.b, 2));
                    if (dist < minDist) {
                        minDist = dist;
                        closestIndex = j;
                    }
                }

                // Pixel belongs to current color if it's the closest
                // This creates sharp, precise boundaries
                maskBuffer[i] = (closestIndex === colorIndex) ? 0 : 255;
            }

            // Trace this mask
            const pngMask = await sharp(maskBuffer, { raw: { width, height, channels: 1 } }).png().toBuffer();

            return new Promise((resolve) => {
                const opts = {
                    threshold: 180,  // INCREASED from 128 - Only trace very dark pixels = Thinner lines
                    turdSize: 0,  // FORCE 0 - Keep ALL details
                    turnPolicy: 'black',  // Better for line art
                    alphaMax: 0.2,  // REDUCED from 0.3 - Ultra sharp corners
                    optCurve: true,  // Always optimize curves
                    optTolerance: 0.1,  // Balanced for smooth curves with detail preservation
                    color: `rgb(${color.r},${color.g},${color.b})`,
                    background: 'transparent'
                };
                potrace.trace(pngMask, opts, (err, svgPartial) => {
                    if (err) resolve('');
                    // Extract <path> elements only
                    const paths = svgPartial.match(/<path[^>]*>/g) || [];
                    resolve(paths.join('\n'));
                });
            });
        });

        console.log(`   Processing ${sortedColors.length} color layers...`);
        const layers = await Promise.all(promises);
        finalSVG += layers.join('\n');
        finalSVG += '</svg>';

        const pathCount = (finalSVG.match(/<path/g) || []).length;
        const sizeKB = (Buffer.byteLength(finalSVG, 'utf8') / 1024).toFixed(2);

        console.log(`   ✅ Done! ${pathCount} paths, ${sizeKB} KB\n`);

        res.json({
            success: true,
            svg: finalSVG,
            stats: {
                pathCount,
                sizeKB,
                colors: sortedColors.length
            }
        });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            error: 'Lỗi server',
            details: error.message
        });
    }
});

// Posterize endpoint for color images (convert to limited colors first)
app.post('/api/posterize', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Vui lòng upload file ảnh' });
        }

        const { colors = 2, threshold = 128 } = req.body;

        // Use sharp to posterize (reduce colors)
        const posterized = await sharp(req.file.buffer)
            .grayscale()
            .normalize()
            .threshold(parseInt(threshold))
            .png()
            .toBuffer();

        res.set('Content-Type', 'image/png');
        res.send(posterized);

    } catch (error) {
        console.error('Posterize error:', error);
        res.status(500).json({
            error: 'Lỗi khi xử lý ảnh',
            details: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File quá lớn. Tối đa 10MB' });
        }
        return res.status(400).json({ error: err.message });
    }

    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Lỗi server không xác định' });
});

// Start server
app.listen(PORT, () => {
    console.log(`
🚀 Server đang chạy!
📡 URL: http://localhost:${PORT}
🔧 API endpoint: http://localhost:${PORT}/api/convert
✅ Status: http://localhost:${PORT}/health
    `);
});
