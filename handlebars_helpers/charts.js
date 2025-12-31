
Handlebars.registerHelper('generateInterviewChart', function(section) {
  if (!section || !section.insights) {
    return {
      labels: ['No Data'],
      datasets: [{
        label: "No Data",
        data: [0]
      }]
    };
  }

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



Handlebars.registerHelper('generateLeadershipCompetenciesChart', function(section) {

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



Handlebars.registerHelper('generateTechnicalCompetenciesChart', function(section) {


  if (!section || !section.competencies || section.competencies.length === 0) {
    console.log("empty data");
    return {
      labels: ['No Data'], // Needs at least one item to satisfy pptxChart
      datasets: [{ 
        label: "Series 1", 
        data: [0] 
      }]
    };
  }

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
