// runs the filter (filterByPriceAndRating) and then sorts the resulting array (sortByRating)
var processResults = function(req, res, price, rating) {
  return sortByRating(filterByPriceAndRating(req, res, price, rating));
};

// filters our foursquare results to only include those in our price/rating range
var filterByPriceAndRating = function(req, data, price, rating) {

  var businesses = data.response.groups[0].items;

  var filtered = businesses.filter(function(business) {
    if (business.venue.price && business.venue.rating) {
      return business.venue.price.tier <= req.body.price && business.venue.rating >= req.body.rating;
    }
  });

  return filtered;

};

// sorts our filtered results array by rating (highest to lowest) 
var sortByRating = function(businesses) {

  return businesses.sort(function(a,b) {
    return b.venue.rating - a.venue.rating;
  })

};

module.exports = {
  processResults: processResults
}