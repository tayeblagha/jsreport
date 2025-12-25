

Handlebars.registerHelper('gt', function (a, b) {
  return a > b;
});

Handlebars.registerHelper('eq', function (a, b) {
  return a == b;
});

Handlebars.registerHelper('lt', function (a, b) {
  return a < b;
});

Handlebars.registerHelper('and', function (a, b) {
  return a && b;
});

Handlebars.registerHelper('or', function (a, b) {
  return a || b;
});

Handlebars.registerHelper('set', function(name, value, options) {
  if (arguments.length === 2) {
    options = value;
    value = undefined;
  }

  if (options && typeof options.fn === 'function' && value === undefined) {
    value = options.fn(this);
  }

  const root = (options && options.data && options.data.root) ? options.data.root : this;
  
  // Only set the variable if it doesn't already exist in the data
  if (root[name] === undefined) {
    root[name] = value;
  }
  
  return '';
});

Handlebars.registerHelper('get', function(name, options) {
  const root = (options && options.data && options.data.root) ? options.data.root : this;
  // Prefer dynamic namespace, fall back to top-level property
  if (root.__dynamicVars && root.__dynamicVars[name] !== undefined) {
    return root.__dynamicVars[name];
  }
  return root[name];
});


handlebars.registerHelper('ternary', function(condition, trueValue, falseValue) {
    return condition ? trueValue : falseValue;
});


Handlebars.registerHelper('firstCharUpper', function(str) {
  if (typeof str !== 'string' || str.length === 0) {
    return str; // return as-is if not a string or empty
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
});




Handlebars.registerHelper('concat', function() {
  // arguments is like [arg1, arg2, ..., options]
  let args = Array.from(arguments).slice(0, -1);
  return args.join('');
});




Handlebars.registerHelper('assessmentSentence', function(assessment) {
    if (!assessment) return "";

    let items = [];

    // loop over keys except "n"
    Object.keys(assessment).forEach(k => {
        if (k !== "n") {
            let item = assessment[k];
            if (item && item.name && item.score !== undefined) {
                items.push(`${item.score} on ${item.name}`);
            }
        }
    });

    if (items.length === 0) return "";

    // join sentence with commas and "and"
    if (items.length === 1) {
        return items[0] + ".";
    }

    return (
        items.slice(0, -1).join(", ") +
        ", and " +
        items[items.length - 1] +
        "."
    );
});


Handlebars.registerHelper('developmentPlanSentence', function(gender) {
    // Normalize gender
    const isFemale = gender && gender.toLowerCase() === "female";

    const her_his  = isFemale ? "her" : "his";
    const She_He   = isFemale ? "She" : "He";

    return `To further elevate ${her_his} skills and achieve the Expert Level, ${She_He} should accomplish the recommended individual development plan.`;
});


// Helper for top 1–3 competencies sentence (with "and")
Handlebars.registerHelper('competencyHighlights', function(gender, technical, behavioral) {
    if (!technical || !technical.competencies || !behavioral || !behavioral.competencies) return '';

    // Merge all competencies
    let allCompetencies = technical.competencies.concat(behavioral.competencies);

    // Sort descending by score
    allCompetencies.sort((a, b) => b.score - a.score);

    // Pick top 3
    let top = allCompetencies.slice(0, 3).map(c => c.name);

    let pronoun = (gender === 'Female') ? 'She' : 'He';

    if (top.length === 0) return '';
    if (top.length === 1) return `${pronoun} excelled in ${top[0]}.`;
    if (top.length === 2) return `${pronoun} excelled in ${top[0]} and ${top[1]}.`;

    // For 3 items, add commas and "and" before the last
    return `${pronoun} excelled in ${top[0]}, ${top[1]}, and ${top[2]}.`;
});

// Helper for areas needing improvement sentence (bottom 3 with "and")
Handlebars.registerHelper('competencyImprovements', function(technical, behavioral) {
    if (!technical || !technical.competencies || !behavioral || !behavioral.competencies) return '';

    // Merge all competencies
    let allCompetencies = technical.competencies.concat(behavioral.competencies);

    // Sort ascending by score
    allCompetencies.sort((a, b) => a.score - b.score);

    // Pick bottom 3
    let bottom = allCompetencies.slice(0, 3).map(c => c.name);

    if (bottom.length === 0) return '';
    if (bottom.length === 1) return `Area for improvement includes ${bottom[0]}.`;
    if (bottom.length === 2) return `Areas for improvement include ${bottom[0]} and ${bottom[1]}.`;

    // For 3 items, add commas and "and" before the last
    return `Areas for improvement include ${bottom[0]}, ${bottom[1]}, and ${bottom[2]}.`;
});





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
function getPrefix(gender) {
  return gender === 'Female' ? 'Ms.' : gender === 'Male' ? 'Mr.' : '';
}

function getPronouns(gender) {
  if (gender === 'Female') return { subject: 'She', object: 'her', possessive: 'her' };
  if (gender === 'Male') return { subject: 'He', object: 'him', possessive: 'his' };
  return { subject: 'They', object: 'them', possessive: 'their' };
}

function capitalizeName(name = '') {
  return name
    .toString()
    .trim()
    .split(/\s+/)
    .map(w => w[0] ? w[0].toUpperCase() + w.slice(1) : '')
    .join(' ');
}

function normalizePercent(v) {
  if (v == null || isNaN(v)) return 0;
  const num = Number(v);
  return num <= 1 ? Math.round(num * 100) : Math.round(num);
}

function getScoreDescriptor(percent) {
  const p = normalizePercent(percent);
  if (p >= 90) return 'outstanding';
  if (p >= 80) return 'excellent';
  if (p >= 70) return 'good';
  if (p >= 50) return 'medium';
  return 'needs improvement';
}

function buildInsightsFromInterview(interview) {
  if (!interview) return [];
  if (Array.isArray(interview.insights) && interview.insights.length) {
    return interview.insights.map(it => ({
      name: it.name,
      score: normalizePercent(it.score)
    }));
  }

  const fallbackKeys = {
    toneOfCommunication: 'Tone of Communication',
    articulation: 'Articulation',
    pronunciation: 'Pronunciation',
    posture: 'Posture',
    messageRelevance: 'Message Relevance'
  };

  return Object.keys(fallbackKeys)
    .filter(k => interview[k] != null)
    .map(k => ({ name: fallbackKeys[k], score: normalizePercent(interview[k]) }));
}
// ... keep your other helpers (getPrefix, getPronouns, capitalizeName, normalizePercent, getScoreDescriptor, buildInsightsFromInterview) ...

function generateInterviewSummary(interview, gender, fullName) {
  if (!interview) return '';

  const prefix = getPrefix(gender);
  const name = capitalizeName(fullName || interview.name || '');
  const nameWithPrefix = prefix ? `${prefix} ${name}` : name || 'The candidate';
  const pronouns = getPronouns(gender);

  const overallRaw = interview.score != null ? interview.score : interview.overallScore;
  const overallScore = normalizePercent(overallRaw);
  const overallDescriptor = getScoreDescriptor(overallScore);

  const insights = buildInsightsFromInterview(interview);
  const finalOverallSentence = `${nameWithPrefix} achieved an Overall Communication Quality score of ${overallScore}%. This score indicates ${overallDescriptor} communication skills.`;

  if (!insights.length) {
    return `${nameWithPrefix} achieved an overall score of ${overallScore}%, indicating ${overallDescriptor} communication skills. ${finalOverallSentence}`;
  }

  const sorted = [...insights].sort((a, b) => b.score - a.score);
  const top = sorted.slice(0, 2);
  const bottom = sorted.slice(-2).reverse(); // lowest two
  const medium = sorted.slice(2, -2); // between top and bottom

  function joinMetrics(list) {
    if (!list.length) return '';
    if (list.length === 1) return `${list[0].name} (${list[0].score}%)`;
    return list.map(it => `${it.name} (${it.score}%)`).join(' and ');
  }

  function joinMetricsMultiple(list) {
    if (!list.length) return '';
    if (list.length === 1) return `${list[0].name} (${list[0].score}%)`;
    const last = list[list.length - 1];
    const rest = list.slice(0, -1);
    return `${rest.map(it => `${it.name} (${it.score}%)`).join(', ')}, and ${last.name} (${last.score}%)`;
  }

  const strengthsStr = joinMetrics(top);
  const improvementsStr = joinMetrics(bottom);
  const mediumStr = joinMetricsMultiple(medium);

  let parts = [];

  if (strengthsStr) {
    parts.push(`${nameWithPrefix} performed particularly well in ${strengthsStr}.`);
  }

  if (mediumStr) {
    if (medium.length > 1) {
      parts.push(`${pronouns.subject} also got in ${mediumStr}, which show areas of good performance that have potential for further development.`);
    } else {
      parts.push(`${pronouns.subject} also got in ${mediumStr}, which shows an area of good performance that has potential for further development.`);
    }
  }

  if (improvementsStr) {
    parts.push(`Areas for improvement include ${improvementsStr}.`);
  }

  parts.push(finalOverallSentence);

  return parts.join(' ');
}


// Handlebars helper
Handlebars.registerHelper('interviewSummary', function(interview, gender, fullName) {
  return new Handlebars.SafeString(generateInterviewSummary(interview, gender, fullName));
});


Handlebars.registerHelper('leadershipChart', function (leadership) {
   console.log('[leadershipChart] payload:', JSON.stringify(leadership, null, 2));
  // Always return a valid chart structure
  const emptyChart = {
    labels: [],
    datasets: [
      {
        label: 'Leadership',
        data: []
      }
    ]
  };

  // Guard checks
  if (
    !leadership ||
    leadership.show === false ||
    !Array.isArray(leadership.competencies) ||
    leadership.competencies.length === 0
  ) {
    return emptyChart;
  }

  const labels = [];
  const data = [];

  leadership.competencies.forEach(c => {
    if (c && typeof c.name === 'string') {
      labels.push(c.name);
      data.push(
        typeof c.score === 'number' ? c.score : 0
      );
    }
  });

  // Prevent pptxChart crash (labels must exist)
  if (labels.length === 0) {
    return emptyChart;
  }

  return {
    labels,
    datasets: [
      {
        label: 'Series 1',
        data
      }
    ]
  };
});
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