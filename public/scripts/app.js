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


function deletePin(){
  event.preventDefault();

  for(let i = 0; i < markers.length; i++){
      if(lastPin[0] === markers[i].id){
        console.log("deleted Pin", lastPin[0]);
        markers[i].setMap(null);
      }
  }
   //converting to string to pass through post request, int wont work

  $.post("/delete", {"id":lastPin[0]} , function(data, status) {
    // console.log(data);
    // console.log(status);
  });
}


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


