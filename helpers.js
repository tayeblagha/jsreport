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
