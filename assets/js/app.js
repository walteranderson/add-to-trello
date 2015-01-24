$(function() {
  getCurrentTab(function(tab) {
    // Put the image URL in Google search.
    renderStatus('Performing Google Image search for ' + tab.url);

/*    getImageUrl(tab.url, function(imageUrl, width, height) {

      renderStatus('Search term: ' + tab.url + '\n' +
          'Google image search result: ' + imageUrl);
      var imageResult = document.getElementById('image-result');
      // Explicitly set the width/height to minimize the number of reflows. For
      // a single image, this does not matter, but if you're going to embed
      // multiple external images in your page, then the absence of width/height
      // attributes causes the popup to resize multiple times.
      imageResult.width = width;
      imageResult.height = height;
      imageResult.src = imageUrl;
      imageResult.hidden = false;

    }, function(errorMessage) {
      renderStatus('Cannot display image. ' + errorMessage);
    });
*/  });
});
