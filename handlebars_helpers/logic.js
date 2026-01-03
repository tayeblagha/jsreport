
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