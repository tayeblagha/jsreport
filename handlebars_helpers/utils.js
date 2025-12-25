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