

Handlebars.registerHelper('generateBarChart', function(section) {

  if (!section || section.length === 0) {
    return {
      labels: ['No Data'], // Needs at least one item to satisfy pptxChart
      datasets: [{ 
        label: "Series 1", 
        data: [0] 
      }]
    };
  }

  const labels = section.map(c => c.name || "");
  const data = section.map(c => Number(c.score) || 0); // normalize to 0–1 if needed

  return {
    labels: labels,
    datasets: [
      {
        label: "Series 1",
        data: data
      }
    ]
  };
});


Handlebars.registerHelper('generatePercentageChart', function (overallScore) {
  // convert and clamp value between 0 and 100
  var score = Number(overallScore);
  if (!isFinite(score)) {
    score = 0;
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    labels: ['Score', 'Remaining'],
    datasets: [
      {
        label: 'Overall Score',
        data: [score, 100 - score]
      }
    ]
  };
});

