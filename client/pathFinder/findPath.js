var findPath = function(places) {
  console.log('inside findPath', places);

  places.forEach(function (place) {
    console.log(place.geometry.location.lat());
    console.log(place.geometry.location.lng());
  });
};

module.exports = {findPath: findPath};