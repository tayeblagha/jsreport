
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
