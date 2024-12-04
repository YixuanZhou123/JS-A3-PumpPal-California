function updateUrl(events) {
    events.addEventListener('plotChange', function(event) {
      const countryToPlot = event.detail.countryToPlot.join(','); // Assuming countryToPlot is an array
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('country', countryToPlot);
      window.history.pushState({}, '', newUrl);
    });
  
    events.addEventListener('plotStop', function(event) {
      const countryToPlot = event.detail.countryToPlot.join(','); // Assuming countryToPlot is an array
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('country', countryToPlot);
      window.history.pushState({}, '', newUrl);
    });
}

export {
    updateUrl,
  };
  


