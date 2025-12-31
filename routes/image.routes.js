const express = require('express');
const sharp = require('sharp');
const { createCanvas } = require('canvas');
const echarts = require('echarts');

const router = express.Router();
router.get('/level-image', async (req, res) => {
  try {
    const text = req.query.text || 'Label';
    const state = req.query.state === 'true';

    // Dimensions updated for better proportions based on image
    const width = 140; 
    const height = 45;

    let bgColor, textColor, fontWeight;

    if (state) {
      // Dark Blue State (Active)
      bgColor = '#2D5A75'; // Slate blue from image
      textColor = '#FFFFFF';
      fontWeight = 'bold';
    } else {
      // Light Gray State (Inactive)
      bgColor = '#F4F4F4'; // Subtle off-white/gray
      textColor = '#2D5A75';
      fontWeight = 'normal';
    }

    const svg = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="${width}" height="${height}" rx="6" ry="6" fill="${bgColor}" />
        
        <text 
          x="50%" 
          y="50%" 
          dominant-baseline="central" 
          text-anchor="middle" 
          font-family="sans-serif" 
          font-size="18" 
          font-weight="${fontWeight}" 
          fill="${textColor}">
          ${text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
        </text>
      </svg>
    `;

    const png = await sharp(Buffer.from(svg))
      .png()
      .toBuffer();

    res.set('Content-Type', 'image/png');
    // Optional: Add cache headers so the image isn't re-generated every time
    res.set('Cache-Control', 'public, max-age=86400'); 
    res.send(png);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating label');
  }
});


router.get('/label-image', async (req, res) => {
  try {
    const text = req.query.text || 'Label';
    const state = req.query.state === 'true';

    const width = 90;
    const height = 55;

    let bgColor, textColor, strokeColor;

    if (state) {
      bgColor = '#4CAF33';
      textColor = '#FFFFFF';
      strokeColor = '#4CAF33';
    } else {
      bgColor = '#FFFFFF';
      textColor = '#2A5C7A';
      strokeColor = 'transparent';
    }

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <rect x="2" y="2" width="${width - 4}" height="${height - 4}" rx="10" ry="10"
              fill="${bgColor}"
              stroke="${strokeColor}"
              stroke-width="1"/>
       
        <text x="50%" y="55%"
              dominant-baseline="middle"
              text-anchor="middle"
              font-family="Arial, sans-serif"
              font-size="20"
              font-weight="bold"
              fill="${textColor}">
          ${text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
        </text>
      </svg>
    `;

    const png = await sharp(Buffer.from(svg))
      .png()
      .toBuffer();

    res.set('Content-Type', 'image/png');
    res.send(png);
  } catch (err) {
    console.error(err);
    res.status(500).send('Image generation failed');
  }
});


router.post('/radar-image', (req, res) => {
  try {
    const { type, width = 848, height = 409, option } = req.body;

    if (!option) {
      return res.status(400).send('Missing "option" in request body');
    }

    // Create canvas with requested dimensions
    const canvas = createCanvas(Number(width), Number(height));
    const chart = echarts.init(canvas, null, {
      width: Number(width),
      height: Number(height),
    });

    // Set the full ECharts option
    chart.setOption(option);

    // Convert canvas to PNG buffer
    const buffer = canvas.toBuffer('image/png');
    chart.dispose();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-store');
    res.send(buffer);

  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to render radar chart');
  }
});
router.get('/radar-image', async (req, res) => {
  try {
    if (!req.query.option) return res.status(400).send('Missing "option" query parameter');

    const payload = JSON.parse(decodeURIComponent(req.query.option));
    const echartsOption = payload.option || payload;
    
    const width =  1600;
    const height =  800;

    echartsOption.backgroundColor = echartsOption.backgroundColor || 'transparent';
    if (!echartsOption.radar) echartsOption.radar = {};
    echartsOption.radar.center = echartsOption.radar.center || ['50%', '50%'];
    echartsOption.radar.radius = echartsOption.radar.radius || '75%';

    if (echartsOption.series && Array.isArray(echartsOption.series)) {
      echartsOption.series.forEach(seriesItem => {
        if (seriesItem.type === 'radar' && seriesItem.data) {
          const dataArray = Array.isArray(seriesItem.data) ? seriesItem.data : [seriesItem.data];
          
          dataArray.forEach(dataItem => {
            dataItem.label = dataItem.label || {};
            dataItem.label.show = true;
            dataItem.label.formatter = dataItem.label.formatter || '{c}%';
            dataItem.label.color = dataItem.label.color || '#1B384D';
            dataItem.label.fontSize = dataItem.label.fontSize || 10;
            dataItem.label.fontWeight = dataItem.label.fontWeight || 'bold';
            
            // ADJUSTMENT: Set distance to 2 or 0 to bring it closer to the point
            // Setting position to 'top' with a small distance is usually most readable
            dataItem.label.position = dataItem.label.position || 'top';
            dataItem.label.distance = 2; 

            dataItem.label.backgroundColor = dataItem.label.backgroundColor || 'rgba(255, 255, 255, 0.8)';
            dataItem.label.borderColor = dataItem.label.borderColor || 'rgba(76, 175, 80, 0.5)';
            dataItem.label.borderWidth = dataItem.label.borderWidth || 1;
            dataItem.label.borderRadius = dataItem.label.borderRadius || 4;
            dataItem.label.padding = dataItem.label.padding || [4, 6];
          });
        }
      });
    }

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    const chart = echarts.init(canvas);
    chart.setOption(echartsOption);
    await new Promise(resolve => {
      chart.on('rendered', resolve);
      chart.resize({ width, height });
    });

    const cropBuffer = cropCanvasToContent(canvas, 12); 
    chart.dispose();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'inline; filename="radar-chart.png"');
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.send(cropBuffer);

  } catch (err) {
    console.error('Error generating radar chart:', err);
    res.status(500).send('Error generating chart');
  }
});

/**
 * Crop a canvas to the bounding box of non-transparent pixels.
 * Returns PNG Buffer of the cropped image (keeps alpha).
 */
function cropCanvasToContent(canvas, padding = 0) {
  const w = canvas.width;
  const h = canvas.height;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const alpha = data[idx + 3];
      if (alpha !== 0) { // non-transparent pixel
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // No non-transparent pixels: return original
  if (maxX === -1) return canvas.toBuffer('image/png');

  // apply padding and clamp
  minX = Math.max(0, minX - padding);
  minY = Math.max(0, minY - padding);
  maxX = Math.min(w - 1, maxX + padding);
  maxY = Math.min(h - 1, maxY + padding);

  const newW = maxX - minX + 1;
  const newH = maxY - minY + 1;
  const { createCanvas, Image } = require('canvas');

  const outCanvas = createCanvas(newW, newH);
  const outCtx = outCanvas.getContext('2d');

  // draw the cropped region from original canvas into outCanvas
  const img = new Image();
  img.src = canvas.toBuffer('image/png');
  outCtx.drawImage(img, minX, minY, newW, newH, 0, 0, newW, newH);

  return outCanvas.toBuffer('image/png');
}



router.get('/data-radar-image', async (req, res) => {
  try {
    // Get data from query parameter
    if (!req.query.data) {
      return res.status(400).json({ error: 'Missing "data" query parameter' });
    }

    // Parse the data array
    const data = JSON.parse(decodeURIComponent(req.query.data));
    
    // Validate data structure
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ error: 'Data must be a non-empty array' });
    }

    // Build ECharts radar chart option from data
    const echartsOption = buildRadarOption(data);
    
    // Chart dimensions
    const width = 1600;
    const height = 800;

    // Ensure proper radar configuration
    echartsOption.backgroundColor = echartsOption.backgroundColor || 'transparent';
    
    if (!echartsOption.radar) {
      echartsOption.radar = {};
    }
    echartsOption.radar.center = echartsOption.radar.center || ['50%', '50%'];
    echartsOption.radar.radius = echartsOption.radar.radius || '75%';

    // Create canvas and render chart
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Initialize ECharts and set option
    const chart = echarts.init(canvas);
    chart.setOption(echartsOption);
    
    // IMPORTANT: In node-canvas environment, we need to use a different approach
    // to wait for rendering. The 'rendered' event works differently.
    chart.setOption(echartsOption, true); // true for not merging with previous option
    
    // Simple timeout approach - give it time to render
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Alternative: Use echarts' built-in rendering completion
    // chart.on('finished', resolve); might work in some versions

    // Crop to content and get buffer
    const cropBuffer = cropCanvasToContent(canvas, 20);
    chart.dispose();

    // Return image
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'inline; filename="radar-chart.png"');
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.send(cropBuffer);

  } catch (err) {
    console.error('Error generating radar chart:', err);
    res.status(500).json({ error: 'Error generating chart', details: err.message });
  }
});

/**
 * Build ECharts radar option from data array
 */
function buildRadarOption(data) {
  // Extract indicators (axes) from data
  const indicators = data.map(item => ({
    name: item.name,
    max: 100, // Since we're using percentages
    min: 0
  }));

  // Convert scores to percentages
  const values = data.map(item => Math.round(item.score * 100));

  return {
    animation: false, // Disable animation for faster rendering in Node.js
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        return `${params.name}<br/>Score: ${params.value}%`;
      }
    },
    radar: {
      indicator: indicators,
      splitNumber: 5,
      axisName: {
        color: '#666',
        fontSize: 18,
        fontWeight: 'normal',
        padding: [0, 10],
        formatter: function(name) {
          // Truncate long names to prevent overlap
          return name.length > 30 ? name.substring(0, 27) + '...' : name;
        }
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(25, 100, 150, 0.05)', 'rgba(25, 100, 150, 0.1)', 
                  'rgba(25, 100, 150, 0.15)', 'rgba(25, 100, 150, 0.2)', 
                  'rgba(25, 100, 150, 0.25)']
        }
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(25, 100, 150, 0.5)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(25, 100, 150, 0.5)'
        }
      }
    },
    series: [{
      type: 'radar',
      data: [{
        value: values,
        name: 'Skills Assessment',
        label: {
          show: true,
          formatter: function(params) {
            return `${params.value}%`;
          },
          color: '#1B384D',
          fontSize: 14,
          fontWeight: 'bold',
          position: 'top',
          distance: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderColor: 'rgba(76, 175, 80, 0.5)',
          borderWidth: 1,
          borderRadius: 4,
          padding: [4, 6]
        },
        areaStyle: {
          color: 'rgba(76, 175, 80, 0.5)'
        },
        lineStyle: {
          color: 'rgba(76, 175, 80, 1)',
          width: 2
        },
        itemStyle: {
          color: 'rgba(76, 175, 80, 1)'
        }
      }]
    }],
    grid: {
      top: 80,
      bottom: 80
    }
  };
}


module.exports = router;
