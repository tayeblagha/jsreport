

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
    return `${pronoun} excelled in ${top[0]}, ${top[1]} and ${top[2]}.`;
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
    return `Areas for improvement include ${bottom[0]}, ${bottom[1]} and ${bottom[2]}.`;
});
