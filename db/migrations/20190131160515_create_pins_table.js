exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTableIfNotExists("pins", function (table) {
          table.increments('id').unsigned().primary();
          table.string('title');
          table.string('description');
          table.string('imageUrl');
          table.float('latitudes', 2, 6);
          table.float('longtitudes', 2, 6);
          table.bigInteger('maps_id').references('maps.id');
        }).then(function () {
            return knex("pins").insert([
                {title: "Horseshoe Tavern", description: "Bar with pool table. Local music acts tour this bar.", imageUrl: "https://s3-media3.fl.yelpcdn.com/bphoto/kOnanN4rJpPYvUnuC4IKWA/o.jpg", latitudes: "43.649005", longtitudes: "-79.395988", maps_id: 1},
                {title: "Crocodile Rock bar", description: "Great bar for after work. Plays retro music. Rooftop patio is great in summer.", imageUrl: "https://s3-media3.fl.yelpcdn.com/bphoto/NzqIHjUdShtirL0mlKAY9Q/o.jpg", latitudes: "43.648323", longtitudes: "-79.388510",maps_id:1 },
                {title: "The Black Bull", description: "Good pub with big patio. Has billiards available.", imageUrl: "https://s3-media3.fl.yelpcdn.com/bphoto/0IRjYLoApDQhXNqZFn0G9w/o.jpg", latitudes: "43.649647", longtitudes: "-79.393275", maps_id: 1},
                {title: "BarChef", description: "Create cocktails, made with homemade bitters.", imageUrl: "https://s3-media1.fl.yelpcdn.com/bphoto/-bmywPhQqltm0kdadnOZNQ/o.jpg", latitudes: "43.648109", longtitudes: "-79.400138", maps_id:1 },
                {title: "Kit Kat Italian Bar", description: "Southern Italian cooking with huge wine selection.", imageUrl: "https://s3-media2.fl.yelpcdn.com/bphoto/H-yg1x4l6YLe9kxf7C9g3Q/o.jpg", latitudes: "43.646400", longtitudes: "-79.390182",maps_id: 1},

                {title: "Hey Lucy", description: "Thin crust pizza with Martinis. Also has rooftop seating.", imageUrl: "https://s3-media2.fl.yelpcdn.com/bphoto/lkG7qjInbWDRnjmG5xsNMQ/o.jpg", latitudes: "43.646416", longtitudes: "-79.390105", maps_id: 2},
                {title: "Jz's Pizza", description: "Good pizza, pasta and subs.", imageUrl: "https://s3-media4.fl.yelpcdn.com/bphoto/-_s7-PtZ6pRNxjbjgNojBw/o.jpg", latitudes: "43.645301", longtitudes: "-79.389743",maps_id: 2 },
                {title: "Blaze Pizza", description: "California chain of pizza serving up great thin crust.", imageUrl: "https://s3-media3.fl.yelpcdn.com/bphoto/YChEq5cQCIz-kG7gMxt1Lg/o.jpg", latitudes: "43.649647", longtitudes: "-79.391271", maps_id: 2},
                {title: "Pizzeria Libretto", description: "Neopolitan pizza cooked with wood-fired oven.", imageUrl: "https://s3-media4.fl.yelpcdn.com/bphoto/1LFV9KNnjjGL2vA4Lzt06w/o.jpg", latitudes: "43.648458", longtitudes: "-79.384951", maps_id: 2 },
                {title: "Via Mercanti", description: "Thin crust pizza cooked with brick oven. Has local draft beer.", imageUrl: "https://s3-media2.fl.yelpcdn.com/bphoto/gGDZZzlUDF45yCAxB3PbEQ/o.jpg", latitudes: "43.654065", longtitudes: "-79.402032", maps_id: 2}

              ]);
            }
        ),
    ]);
};


exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('pins');
};

