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

    //uses "last" arrays, to see last pin clicked, then cycles through all pins aka markers and compares values, if values match delete.

      if(lastTitle[0] === markers[i].pin.title && lastDescription[0] === markers[i].pin.description && lastUrl[0] === markers[i].pin.imageUrl){ //set to equal dscrip, title , and url
        console.log("deleted Pin", lastTitle[0], lastDescription[0], lastUrl[0]);
        markers[i].setMap(null); //hides pin from map.
      }
  }

//using ajax to make post request, will be handled by server.js. passing in object of info of the deleted pin.
  $.post("/delete", {"title": lastTitle[0], "description": lastDescription[0], "imageUrl": lastUrl[0]} , function(data, status) {
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

function editPinRender(){
  event.preventDefault();

  //get all information in edit form
  let title = $('#titleEdit').val();
  let description = $('#descriptionEdit').val();
  let imageUrl = $('#imageUrlEdit').val();


  console.log('888');
  console.log(title, description, imageUrl);


  //make post request with new information
  $.post("/delete", {"title": lastTitle[0], "description": lastDescription[0], "imageUrl": lastUrl[0]} , function(data, status) {

  });




  //handle post request in server.js
  //render the new pin or all pins again.

}



function editPin(){
  for(let i = 0; i < markers.length; i++){

  //uses "last" array, to see last pin clicked, then cycles through all pins aka markers and compares values, if values match fill in edit form.
    if(lastTitle[0] === markers[i].pin.title && lastDescription[0] === markers[i].pin.description && lastUrl[0] === markers[i].pin.imageUrl){ //set to equal dscrip, title , and url
      $('#titleEdit').val(markers[i].pin.title);
      $('#descriptionEdit').val(markers[i].pin.description);
      $('#imageUrlEdit').val(markers[i].pin.imageUrl);
    }
  }
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


