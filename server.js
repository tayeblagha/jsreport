const jsreport = require('jsreport')()
const express = require('express')
const fs = require('fs').promises
const path = require('path')
const multer = require('multer')
// syncronized fs 
const fssync =  require('fs')

// Initialize Express app
const app = express()
const upload = multer({ storage: multer.memoryStorage() })

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Add pptx configuration to jsreport
jsreport.beforeRenderListeners.add('pptx-config', (req, res) => {
  if (req.template.recipe === 'pptx') {
    req.template.engine = 'handlebars'
  }
})
// API Endpoint: Generate PPTX via GET
app.get('/generate-ppt', async (req, res) => {
  try {
    console.log('📊 Received request to generate PowerPoint via GET');

    // --- Load default template ---
    let templateBuffer;
    try {
      templateBuffer = await fs.readFile(path.join(__dirname, 'list.pptx'));
      console.log('Using default template: list.pptx');
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Default template list.pptx not found'
      });
    }

    // --- Load default data ---
    let data;
    try {
      const dataContent = await fs.readFile(path.join(__dirname, 'data.json'), 'utf8');
      data = JSON.parse(dataContent);
      console.log('Using default data: data.json');
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Default data.json not found or invalid JSON'
      });
    }
const helpersCode = fssync.readFileSync("helpers.js", "utf8");

    // --- Render PPTX using jsreport ---
   const report = await jsreport.render({
  template: {
    recipe: 'pptx',
    engine: 'handlebars',
    helpers: helpersCode,
    pptx: {
      templateAsset: {
        content: templateBuffer.toString('base64'),
        encoding: 'base64'
      }
    }
  },
  data
});

    // --- Send the generated PPTX ---
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = req.query.filename || `presentation-${timestamp}.pptx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(report.content);

    console.log(`✅ PowerPoint generated: ${filename} (${Math.round(report.content.length / 1024)} KB)`);

  } catch (error) {
    console.error('❌ Error generating PowerPoint:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Optional: Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'PPTX Generator API',
    timestamp: new Date().toISOString()
  })
})

// Optional: Get default template info
app.get('/templates/default', async (req, res) => {
  try {
    const files = []
    
    try {
      const templateStats = await fs.stat('list.pptx')
      files.push({
        name: 'list.pptx',
        exists: true,
        size: templateStats.size,
        modified: templateStats.mtime
      })
    } catch {
      files.push({
        name: 'list.pptx',
        exists: false
      })
    }

    try {
      const dataStats = await fs.stat('data.json')
      files.push({
        name: 'data.json',
        exists: true,
        size: dataStats.size,
        modified: dataStats.mtime
      })
    } catch {
      files.push({
        name: 'data.json',
        exists: false
      })
    }

    res.json({
      success: true,
      defaultFiles: files
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Initialize jsreport and start server
if (process.env.JSREPORT_CLI) {
  // Export jsreport instance for jsreport-cli
  module.exports = jsreport
} else {
  jsreport.init().then(() => {
    console.log('🚀 jsreport initialized successfully')
    
    // Start Express server
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
      console.log(`🌐 API Server running on port ${PORT}`)
      console.log('\n📋 Available Endpoints:')
      console.log(`   POST http://localhost:${PORT}/generate-ppt - Generate PowerPoint`)
      console.log(`   GET  http://localhost:${PORT}/health - Health check`)
      console.log(`   GET  http://localhost:${PORT}/templates/default - Check default files`)
      console.log('\n📤 You can now make API calls to generate PowerPoint presentations!')
    })
  }).catch((e) => {
    console.error('Failed to initialize jsreport:', e)
    process.exit(1)
  })
}

async function shutdown() {
  try {
    await jsreport.close()
    console.log('\n👋 jsreport closed successfully')
    process.exit(0)
  } catch (e) {
    console.error('Error during shutdown:', e)
    process.exit(1)
  }
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)