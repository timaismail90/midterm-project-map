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

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ["romelsecret"]
}))

let mapId = "";


let templateVars;

let mapName="";

let pinData = [];


// import * as L from 'leaflet';

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

// Explor page, is user is logged in redirect to new page. else render guest explore page.
app.get("/", (request, respond) => {
  if(request.session.user_id){
    respond.redirect('/:id');
  } else {
    knex('maps').then(maps => {
    console.log(maps[0]);
    });
    knex('pins').then(pins => {
    console.log(pins);
    });
    respond.render('index')
  };
});


// //user explore page. If not logged in redirect to guest explore page .
// app.get('/:id', (request, respond) => {
//   if(request.session.user_id){
//     //load maps in database.
//     //also load favorite maps
//     let templateVars = {user_id: userDatabase[request.session.user_id]};
//     respond.render('explore', templateVars);
//   } else {
//     respond.redirect('/');
//   };
// });


//view specic map page
app.get('/map/:id', (request, respond) => {
  if(request.session.user_id){
    //load specific map from database
    // let templateVars = {user_id: request.session.user_id,
    //                     mapId: maps[request.params.id]
    //                     };
    respond.render('mapEdit', templateVars); //on new create map, if null show "enter info etc."
  } else {
    knex('pins')
    .where('maps_id', request.params.id)
    .then(pins => {
    knex('maps')
    .where('id', request.params.id)
    .then(maps => {
      mapName = maps[0].name;
    })

    templateVars = {
      pins: pins,
      length:pins.length,
      name:mapName
    }

    respond.render('mapShow', templateVars);
    });

  };
});


//recieves add pin information
  app.get('/test/createPin', (request, respond) => {
    knex('pins').insert(request.query)
    .then( function (result) {
          respond.json({ success: true, message: 'ok' });     // respond back to request
       });
    console.log(request.query);
    // pinData = request.

  });





//this will go under map id when cookie is enabled. this is for adding/edit/delete pins
  app.get('/test/:id', (request, respond) => {
    knex('pins')
    .where('maps_id', request.params.id)
    .then(pins => {
    knex('maps')
    .where('id', request.params.id)
    .then(maps => {
      mapName = maps[0].name;
      mapId = maps[0].id
    })
    console.log(mapId);
    templateVars = {
      pins: pins,
      length:pins.length,
      name:mapName,
      mapId:mapId
    }
    respond.render('mapEdit', templateVars);
    });
  });

// //for creating a map
// app.get('create/', (request, respond) => {
//   if(request.session.user_id){ //if user is logged in user can fill out create map information.
//     let templateVars = {user_id: request.session.user_id,
//                         mapId: maps[request.params.id]
//                         };
//     respond.render('mapsCreate', templateVars);
//   } else {
//     respond.redirect('/') //if user is not log in redirect to homepage
//   };
// });

//create map page. user adds a title .
app.get('/testCreate', (request, respond) => {
  respond.render('mapBuild', templateVars);
})


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
      respond.redirect(`/test/${mapId}`); //newly created id.
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
      respond.json({sucess: true});
    });
});



app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});

