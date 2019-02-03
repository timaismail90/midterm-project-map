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


//use above code to maybe load pins better. also use ajax load function to load a specific element in html.
//see documentation.



function deletePin(){
  event.preventDefault();

  for(let i = 0; i < markers.length; i++){
    // console.log("where")
    // console.log(lastTitle[0], lastDescription[0], lastUrl[0]);
    // console.log(markers[i].pin.title, markers[i].pin.description, markers[i].pin.imageUrl);

    //uses "last" array, to see last pin clicked, then cycles through all pins aka markers and compares values, if values match delete.

      if(lastTitle[0] === markers[i].pin.title && lastDescription[0] === markers[i].pin.description && lastUrl[0] === markers[i].pin.imageUrl){ //set to equal dscrip, title , and url
        console.log("deleted Pin", lastTitle[0], lastDescription[0], lastUrl[0]);
        markers[i].setMap(null); //hides pin from map.
      }
  }

//using ajax to make post request, will be handled by server.js. passing in object of info of the deleted pin.
  $.post("/delete", {"title": lastTitle[0], "description": lastDescription[0], "imageUrl": lastUrl[0]} , function(data, status) {
    console.log(status);
  });
}


function savePin() {
  let title = escape(document.getElementById("title").value);
  let description = escape(document.getElementById("description").value);
  let latlng = marker.getPosition();
  let imageUrl = escape(document.getElementById("imageUrl").value);
  let url = "createPin?&title=" + title + "&description=" + description + "&latitudes=" + latlng.lat() + "&longtitudes=" + latlng.lng() + "&imageUrl=" + imageUrl + "&maps_id=" + mapId;



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
  let title = $('#titleEdit').val();
  let description = $('#descriptionEdit').val();
  let imageUrl = $('#imageUrlEdit').val();

  console.log(title, description, imageUrl);

  const editData = {
      "title": lastTitle[0],
      "description": lastDescription[0],
      "imageUrl": lastUrl[0],
      "titleNew": title,
      "descriptionNew": description,
      "imageUrlNew": imageUrl,
      "maps_id": mapId
  }

  $.post("/edit", editData, function(data, status) {
    console.log(status);
  });

}



function editPin(){
  console.log('909');
  $('#titleEdit').val(lastTitle[0]);
  $('#descriptionEdit').val(lastDescription[0]);
  $('#imageUrlEdit').val(lastUrl[0]);
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


