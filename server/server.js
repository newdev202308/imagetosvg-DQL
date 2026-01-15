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
            color = '#000000',
            background = 'transparent'
        } = req.body;

        // Convert image to grayscale PNG using Sharp
        // Potrace works best with PNG format
        const processedImage = await sharp(req.file.buffer)
            .grayscale()
            .png()
            .toBuffer();

        // Potrace options
        const potraceOptions = {
            threshold: parseInt(threshold),
            turdSize: parseInt(turdSize),
            turnPolicy: turnPolicy,
            alphaMax: parseFloat(alphaMax),
            optCurve: optCurve === 'true' || optCurve === true,
            optTolerance: parseFloat(optTolerance),
            color: color,
            background: background
        };

        console.log('Potrace options:', potraceOptions);

        // Trace with Potrace
        potrace.trace(processedImage, potraceOptions, (err, svg) => {
            if (err) {
                console.error('Potrace error:', err);
                return res.status(500).json({
                    error: 'Lỗi khi chuyển đổi',
                    details: err.message
                });
            }

            console.log('Conversion successful, SVG length:', svg.length);

            // Calculate stats
            const pathCount = (svg.match(/<path/g) || []).length;
            const sizeInBytes = Buffer.byteLength(svg, 'utf8');
            const sizeInKB = (sizeInBytes / 1024).toFixed(2);

            res.json({
                success: true,
                svg: svg,
                stats: {
                    pathCount: pathCount,
                    sizeKB: sizeInKB,
                    originalFileName: req.file.originalname
                }
            });
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
