"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

//importing cookie session
const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ["romelsecret"]
}))

let mapId = "";
let userId = "";


let whichFavMap = "" ; //only work for one map.
let whichContribute = ""; //only work for one map.
let whichFavMapName = "";
let whichContributeName = "";


//what user is logged in last. User must exist in database for knex to work .
let userLogged = "";

let templateVars;

let mapName="";

let pinData = [];
let favMap = false;

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");


const loadMap = require('./public/scripts/app')
// import initMap from './public/scripts/app';

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));

// Explore page, is user is logged in redirect to new page. else render guest explore page.
app.get("/", (request, respond) => {
  if(request.session.id){
    respond.send('hey'); //render homepage w/ explore maps and favorite maps.
  } else {
    respond.render('index') //render homepage w/ explore maps but no favorites.
  };
});


//view specic map page

app.get('/map/:id', (request, respond) => {
  if(request.session.id){ //this is the test page "test/:id"
    respond.redirect(`/create/${request.params.id}`);
  } else {
    knex('pins')
    .where('maps_id', request.params.id)
    .then(pins => {
    knex('maps')
    .where('id', request.params.id)
    .then(maps => {
    mapName = maps[0].name;
    templateVars = {
      pins: pins,
      length:pins.length,
      name:mapName
    }
    console.log(userLogged);
    respond.render('mapShow', templateVars);
    });
    })
  };
});


//recieves add pin information
app.get('/create/createPin', (request, respond) => {
  mapId = request.query.maps_id;
  knex('pins').insert(request.query)
  .then( function (result) {
    knex('users')
      .where('name', userLogged)
      .then((user) => {
      console.log("OOO", user, user[0].id);
      knex('contributors').insert({'maps_id': mapId, 'users_id': user[0].id})
      .then(function (result) {
      respond.json({success: true, message: 'ok'});
      })
    });
  });
  console.log(request.query);
  // pinData = request.
});





//this will go under map id when cookie is enabled. this is for adding/edit/delete pins
  app.get('/create/:id', (request, respond) => {
    knex('pins')
      .where('maps_id', request.params.id)
      .then(pins => {
        knex('users')
        .where('name', userLogged)
        .then((user) => {
          knex.raw(`SELECT * FROM "favoriteMaps" WHERE users_id = ${user[0].id} AND maps_id = ${request.params.id}`)
            .then(function(results){
              console.log("hello!", results);
              if(results.rowCount){
                favMap = true;
                knex('maps')
                  .where('id', request.params.id)
                  .then(maps => {
                    mapName = maps[0].name;
                    mapId = maps[0].id
                    console.log(mapId);
                    templateVars = {
                      pins: pins,
                      length:pins.length,
                      name:mapName,
                      mapId:mapId,
                      favMap:favMap
                    }
                    respond.render('mapEdit', templateVars);
                  })
    } else {
      favMap = false;
      knex('maps')
        .where('id', request.params.id)
        .then(maps => {
          mapName = maps[0].name;
          mapId = maps[0].id
          console.log(mapId);
          templateVars = {
            pins: pins,
            length:pins.length,
            name:mapName,
            mapId:mapId,
            favMap:favMap
          }
          respond.render('mapEdit', templateVars);
        })
      }


    });
    });
  });
});

//create map page. user adds a title .
app.get('/mapCreate', (request, respond) => {
  respond.render('mapBuild', templateVars);
})



app.post("/login", (request, respond) => {
  console.log("hey", request.body.username);
  userLogged = request.body.username;
  request.session.id = request.body.username
  knex('users')
    .where('name', userLogged)
  .then(function(user) {
    if(user.length) {
        respond.redirect("/");
    } else{
      knex('users').insert({name: userLogged})
        .then((newUser) => {
          console.log('newUser' , newUser);
        })
      respond.redirect("/");
    }
  });

});






//post after user enters title. adds map to maps database, then loads the map.
app.post('/create/', (request, respond) => {
  console.log(request.body.title);
  knex('maps')
  .insert({name:request.body.title, latitudes:43.658412, longtitudes:-79.400037 })
  .then(function () {
    knex('maps')
   .where('name', request.body.title)
   .then(maps => {
      mapId = maps[0].id;
      console.log(maps);
      console.log("tst", mapId)
      knex('users')
        .where('name', userLogged)
        .then((user) => {
        console.log("OOO", user, user[0].id);
        knex('contributors').insert({'maps_id': mapId, 'users_id': user[0].id})
        .then(function (result) {
          respond.redirect(`/map/${mapId}`); //newly created id.
        })
      });

    });
  })
});


app.post('/delete/', (request, respond) => {
  console.log("eh", request.body);
  knex('pins')
    .where({
    title: request.body.title,
    })
    .del()
    .then(function () {
      knex('users')
        .where('name', userLogged)
        .then((user) => {
        console.log("OOO", user, user[0].id);
        knex('contributors').insert({'maps_id': mapId, 'users_id': user[0].id})
        .then(function (result) {
        respond.json({success: true, message: 'ok'});
        })
      });
    });
});

app.post('/favorite/', (request, respond) => {
  if(request.body.favorite === 'true'){
    console.log("time to add");
    knex('users')
      .where('name', userLogged)
    .then((user) => {
      console.log("OOO", user, user[0].id);
      knex("favoriteMaps").insert({'maps_id': request.body.maps_id, 'users_id': user[0].id})
      .then(function (result) {
        console.log(result);
        respond.json({success: true, message: 'ok'});
      })
    });
  } else{
    console.log("time to delete");
    knex('users')
      .where('name', userLogged)
      .then((user) => {
        knex.raw(`DELETE FROM "favoriteMaps" WHERE users_id = ${user[0].id} AND maps_id = ${request.body.maps_id}`)
        .then(function(results){
          console.log(results);
          favMap = false;
          respond.send('okay!!!');
        })
      })


    // knex.raw('DELETE FROM favoriteMaps WHERE id = '
    // console.log("time to delete");
    //have to check how to delete w/ multiple arguments.
  }



});



app.post('/edit/', (request, respond) => {
  console.log("HEYHEYHEY");
  console.log(request.body.maps_id);
  console.log(userLogged);


//adding new edited pin to database. checks  old pin then updates info w/ new.
  knex('pins')
    .where('title', request.body.title)
    .then((pin) => {
      console.log(pin);
      if(pin.length){
        knex('pins')
        .update({
          title: request.body.titleNew,
          description: request.body.descriptionNew,
          imageUrl: request.body.imageUrlNew
        })
        .where('title', request.body.title)
        .returning('*')
        .then((newPin) => {
          console.log('newPin:', newPin);
            //giving user a contribution
            knex('users')
              .where('name', userLogged)
            .then((user) => {
              console.log("OOO", user, user[0].id);
              knex('contributors').insert({'maps_id': request.body.maps_id, 'users_id': user[0].id})
              .then(function (result) {
                console.log("WHERE ARE YOU");
                respond.json({success: true, message: 'ok'});
                // respond.redirect(`/create/${request.body.maps_id}`)
                // respond.redirect('back');
              })
            });
        })
      }
    })



});




app.get('/profile', (req, res) => {
  knex('users')
  .where('name', userLogged)
  .then((user) => {
    knex('favoriteMaps')
    .where('users_id', user[0].id)
    .then((map) => {
      whichFavMap = map[0].maps_id;
      console.log(whichFavMap);
        knex('users')
        .where('name', userLogged)
        .then((user) => {
          knex('contributors')
          .where('users_id', user[0].id)
          .then((map2) => {
            whichContribute = map2[0].maps_id;
            console.log(whichContribute);
            knex('maps')
            .where('id', whichFavMap)
            .then((mapName) =>{
              whichFavMapName = mapName[0].name
              console.log("hello",mapName[0].name);
              knex('maps')
              .where('id', whichContribute)
              .then((mapName2) => {
                whichContributeName = mapName2[0].name
                console.log('bye', mapName2[0].name)
                let templateVars = {
                  whichFavMap:whichFavMap,
                  whichContribute:whichContribute,
                  userLogged:userLogged,
                  whichContributeName:whichContributeName,
                  whichFavMapName,whichFavMapName
                  }
               res.render('profile', templateVars)
                })
            })

          });
        });
    });
  });
});




app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});



//SUPPOSE I HAD PROFILE ROUTE.

// app.get ....
// app.get('/profile', (req, res) => {
//   let templateVars = {userLogged: userLogged};


// knex('users')
//   .where('name', userLogged)
//   .then((user) => {
//     knex('favoriteMaps')
//     .where('users_id', user[0].id)
//     .then((map) => {
//       //get map info set to variable .
//       knex('users')
//     }



//   res.render('profile', templateVars)


// // });
// let templateVars = {userLogged: userLogged};
