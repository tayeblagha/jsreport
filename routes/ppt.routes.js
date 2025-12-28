const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

router.get('/generate-ppt', async (req, res) => {
  try {
    const jsreport = req.app.locals.jsreport;
    const helpersCode = req.app.locals.helpersCode;

    const templateBuffer = await fs.readFile(path.join(__dirname, '../list.pptx'));
    const data = JSON.parse(
      await fs.readFile(path.join(__dirname, '../data.json'), 'utf8')
    );

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

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="presentation.pptx"'
    );
    res.send(report.content);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
