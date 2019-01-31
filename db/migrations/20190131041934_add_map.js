exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTableIfNotExists("maps", function (table) {
            table.increments('id').unsigned().primary();
            table.string('name');
            table.float('latitudes', 2, 6);
            table.float('longtitudes', 2, 6);
        }).then(function () {
                return knex("maps").insert([
                    {name: "Best Bars", latitudes: "43.658412", longtitudes: "-79.400037"},
                    {name: "Best Pizza", latitudes: "43.658412", longtitudes: "-79.400037"}
                ]);
            }
        ),
    ]);
};


exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('maps');
};

