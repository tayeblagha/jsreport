
Handlebars.registerHelper('toRadarChart', function(section) {
  if (!section || !section.insights) return {
    labels: [],
    datasets: [{ label: "Series 1", data: [] }]
  };

  const labels = section.insights.map(i => i.name);
  const data = section.insights.map(i => Number(i.score) || 0);  // keep normalized (0–1)

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



Handlebars.registerHelper('testchart', function(section) {
  // Return empty but valid chart data structure
  if (!section || !section.insights) {
    return {
      labels: ['No Data'],
      datasets: [{
        label: "No Data",
        data: [0]
      }]
    };
  }
  
  // Your actual data transformation here
  return {
    labels: section.insights.map(i => i.label),
    datasets: [{
      label: "Series 1",
      data: section.insights.map(i => i.value)
    }]
  };
});



// small helpers



Handlebars.registerHelper('prepareLeadershipChart', function (leadership, options) {
  // create a safe empty chart structure
  const emptyChart = {
    labels: [],
    datasets: [{ label: 'Leadership', data: [] }]
  };

  // guard checks
  if (
    !leadership ||
    leadership.show === false ||
    !Array.isArray(leadership.competencies) ||
    leadership.competencies.length === 0
  ) {
    options.data.root.leadershipChartData = emptyChart;
    return '';
  }

  const labels = [];
  const data = [];

  leadership.competencies.forEach(c => {
    if (c && typeof c.name === 'string') {
      labels.push(c.name);
      data.push(typeof c.score === 'number' ? c.score : 0);
    }
  });

  options.data.root.leadershipChartData =
    labels.length === 0
      ? emptyChart
      : {
          labels,
          datasets: [{ label: 'Series 1', data }]
        };

  // return nothing into the document (we only stored the data)
  return '';
});





Handlebars.registerHelper('toChart', function(section) {
  if (!section ) return {
    labels: [],
    datasets: [{ label: "Series 1", data: [] }]
  };

  const labels = section.map(i => i.name);
  const data = section.map(i => Number(i.score) || 0);  // keep normalized (0–1)

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





Handlebars.registerHelper('tocompetenciesviewChart', function(section) {

  if (!section || !section.competencies) return {
    labels: [],
    datasets: [{ label: "Series 1", data: [] }]
  };

  const labels = section.competencies.map(i => i.name);
  const data = section.competencies.map(i => Number(i.score) || 0);  // keep normalized (0–1)

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