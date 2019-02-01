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

let latitudes = [];
let longitudes = [];
let title = [];
let description = [];

let templateVars;
let coordinates = [];

let mapName="";


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
    respond.render('mapsEdit', templateVars); //on new create map, if null show "enter info etc."
  } else {
    knex('pins')
    .where('maps_id', request.params.id)
    .then(pins => {
    // console.log(pins);
    // console.log(pins.length);
    for(let i = 0; i < pins.length; i++){
       coordinates[i] = {lat: pins[i].latitudes, lng: pins[i].longtitudes}
    }
    knex('maps')
    .where('id', request.params.id)
    .then(maps => {
      mapName = maps[0].name;
    })
    // templateVars = {
    //                 title: pins[0].title,
    //                 descrip: pins[0].description,
    //                 latitudes:pins[0].latitudes,
    //                 longitudes:pins[0].longtitudes
    // }
    // console.log(pins[0]);
    templateVars = {
      coords: coordinates,
      pins: pins,
      length:pins.length,
      name:mapName
    }

    respond.render('mapShow', templateVars);
    });

  };
});


    // knex('pins').where('maps_id', request.params.id).then(pins => {
    //   console.log("hello", pins[0]);
    // });


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

// app.post('create/', (request, respond) => {
//   //generate new id for map.
//   //knex update map table with new map.
//   respond.redirect('map/:id'); //newly created id.
// });

// app.post()



app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});

