const express = require('express');
const jsreport = require('jsreport')();
const path = require('path');
const fs = require('fs').promises;

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

  let code = '';
  for (const f of files) {
    code += `\n/* ${f} */\n` + await fs.readFile(path.join(helpersDir, f), 'utf8');
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

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT} \n`,
        `GET http://localhost:${PORT}/generate-ppt - Generate PowerPoint`)
    
    );
  });
}

module.exports = jsreport;
