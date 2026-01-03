

Handlebars.registerHelper('getLabelImageUrl', function(text, state) {
  // encodeURIComponent to safely include text/type in URL
  const encodedText = encodeURIComponent(text);
  const encodedState = encodeURIComponent(state);

  return `${PUBLIC_BASE_URL}/label-image?text=${encodedText}&state=${encodedState}`;
});



Handlebars.registerHelper('getLevelImageUrl', function(text, state) {
  // encodeURIComponent to safely include text/type in URL
  const encodedText = encodeURIComponent(text);
  const encodedState = encodeURIComponent(state);

  return `${PUBLIC_BASE_URL}/level-image?text=${encodedText}&state=${encodedState}`;
});


Handlebars.registerHelper('radarImageUrl', function(radarData) {
  if (!radarData) return '';
  // Convert object to JSON string and encode for URL
  const encodedOption = encodeURIComponent(JSON.stringify(radarData));
  console.log(radarData)
  return `${PUBLIC_BASE_URL}/radar-image?option=${encodedOption}`;
});


Handlebars.registerHelper('dataRadarImageUrl', function(radarData) {
  if (!radarData) return '';
  try {
    const encoded = encodeURIComponent(JSON.stringify(radarData));
    // change host/port if needed
    return `${PUBLIC_BASE_URL}/data-radar-image?data=${encoded}`;
  } catch (err) {
    console.error('dataRadarImageUrl helper error:', err);
    return '';
  }
});








Handlebars.registerHelper('dataCardUrl', function(text,subtext, state) {
  // encodeURIComponent to safely include text/type in URL
  const encodedText = encodeURIComponent(text);
  const encodedSubText = encodeURIComponent(subtext);
  const encodedState = encodeURIComponent(state);

  return `${PUBLIC_BASE_URL}/generate-card?text=${encodedText}&subtext=${encodedSubText}&state=${encodedState}`;
});