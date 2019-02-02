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



function savePin() {
  var title = escape(document.getElementById("title").value);
  var description = escape(document.getElementById("description").value);
  var latlng = marker.getPosition();
  var imageUrl = escape(document.getElementById("imageUrl").value);
  var url = "createPin?&title=" + title + "&description=" + description + "&latitudes=" + latlng.lat() + "&longtitudes=" + latlng.lng() + "&imageUrl=" + imageUrl + "&maps_id=" + mapId;



  downloadUrl(url, function(data, responseCode) {
    console.log(data);
    if (responseCode == 200 && data.length <= 1) {
      infowindow.close();
      messagewindow.open(map, marker);
    }
  });
}





function downloadUrl(url, callback) {
  var request = window.ActiveXObject ?
      new ActiveXObject('Microsoft.XMLHTTP') :
      new XMLHttpRequest;

  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      request.onreadystatechange = null;
      callback(request.responseText, request.status);
    }
  };

  request.open('GET', url, true);
  request.send(null);
}
