

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


