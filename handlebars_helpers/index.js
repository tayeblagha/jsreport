
Handlebars.registerHelper('getLabelImageUrl', function(text, state) {
  // encodeURIComponent to safely include text/type in URL
  const encodedText = encodeURIComponent(text);
  const encodedState = encodeURIComponent(state);

  return `http://localhost:3000/label-image?text=${encodedText}&state=${encodedState}`;
});



Handlebars.registerHelper('getLevelImageUrl', function(text, state) {
  // encodeURIComponent to safely include text/type in URL
  const encodedText = encodeURIComponent(text);
  const encodedState = encodeURIComponent(state);

  return `http://localhost:3000/level-image?text=${encodedText}&state=${encodedState}`;
});



Handlebars.registerHelper('getLevelImageUrl', function(text, state) {
  // encodeURIComponent to safely include text/type in URL
  const encodedText = encodeURIComponent(text);
  const encodedState = encodeURIComponent(state);

  return `http://localhost:3000/level-image?text=${encodedText}&state=${encodedState}`;
});



Handlebars.registerHelper('radarImageUrl', function(radarData) {
  if (!radarData) return '';
  // Convert object to JSON string and encode for URL
  const encodedOption = encodeURIComponent(JSON.stringify(radarData));
  console.log(radarData)
  return `http://localhost:3000/radar-image?option=${encodedOption}`;
});




Handlebars.registerHelper('levelIconIf', function (competency, targetLevel) {
    if (!competency) return '';

    const level = competency.level;
    const expected = competency.expected;

    if (level === targetLevel) {
        if (level < expected) return '❌';
        if (level === expected) return '☑️';
        if (level > expected) return '✔';
    }
    
    return '';
});



Handlebars.registerHelper('dataRadarImageUrl', function(radarData) {
  if (!radarData) return '';
  try {
    const encoded = encodeURIComponent(JSON.stringify(radarData));
    // change host/port if needed
    return `http://localhost:3000/data-radar-image?data=${encoded}`;
  } catch (err) {
    console.error('dataRadarImageUrl helper error:', err);
    return '';
  }
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
