// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "/api/users"
//   }).done((users) => {
//     for(user of users) {
//       $("<div>").text(user.name).appendTo($("body"));
//     }
//   });;
// });

// module.exports = {

//   initMap: function(latitude, longitude){
//       let map = "";
//       map = new google.maps.Map(document.getElementById('map'), {
//         center: {lat: `${latitude}`, lng: `${longitude}`},
//         zoom: 14
//       });
//   }
// };


function initMap(latitudes,longtitudes) {
  var map;
  console.log("tst", latitudes,longtitudes);
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 60, lng: 60},
    zoom: 14
  });
}
