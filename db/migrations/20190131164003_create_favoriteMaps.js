exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('favoriteMaps', function (table) {
    table.bigInteger('maps_id').references('maps.id');
    table.bigInteger('users_id').references('users.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('favoriteMaps');
};
