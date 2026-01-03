const express = require('express');
const jsreport = require('jsreport')();
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

// Routers
const pptRoutes = require('./routes/ppt.routes');
const imageRoutes = require('./routes/image.routes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// jsreport config
jsreport.beforeRenderListeners.add('pptx-config', (req) => {
  if (req.template.recipe === 'pptx') {
    req.template.engine = 'handlebars';
  }
});

// Load helpers
async function loadAllHelpers() {
  const helpersDir = path.join(__dirname, 'handlebars_helpers');
  const files = (await fs.readdir(helpersDir)).filter(f => f.endsWith('.js'));

  // 1. Inject the PUBLIC_HOST variable into the helper scope
  let code =`const PUBLIC_BASE_URL = "${process.env.PUBLIC_HOST || 'http://localhost'}:${process.env.PUBLIC_PORT || '3000'}";\n`;


  for (const f of files) {
    const fileContent = await fs.readFile(path.join(helpersDir, f), 'utf8');
    
    // 2. Remove any existing 'Handlebars.registerHelper' calls if they exist
    // and just append the raw function code
    code += `\n/* File: ${f} */\n` + fileContent;
  }
  return code;
}

// Attach shared objects to app
app.locals.jsreport = jsreport;
app.locals.loadAllHelpers = loadAllHelpers;

// Routes
app.use('/', imageRoutes);
app.use('/', pptRoutes);

// Start server
if (!process.env.JSREPORT_CLI) {
  jsreport.init().then(async () => {
    app.locals.helpersCode = await loadAllHelpers();

    const PORT = process.env.PUBLIC_PORT || 3000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT} \n`,
        `GET http://localhost:${PORT}/generate-ppt - Generate PowerPoint`)
    
    );
  });
}

module.exports = jsreport;
