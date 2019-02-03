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




function initMap(latitudes, longtitudes) {
  var map;
  console.log("tst", latitudes, longtitudes);
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 60, lng: 60 },
    zoom: 14
  });
}


$(document).ready(function() {
  console.log("heart")
  $("#heart").click(function() {
    event.preventDefault(event);
    console.log("heart")
    $(this).toggleClass('oldColor', 'newColor');
    $.ajax({
      type: "POST",
      url: '/favourites',
      data: {
        user_id: 1,
        map_id: 1
        // $('#heart').val()
      },
      success: function(data) {}
    })
  })
})



//how should I connect
// knex('favorite_maps').select().asCallback(function(err, rows) {
//       .insert({ maps_id: "", user_id: "", hearts: "" }
//         .returning('*')
//         .then(rows => console.log(rows))
//         .catch(err => console.log(err.message))
//       })
