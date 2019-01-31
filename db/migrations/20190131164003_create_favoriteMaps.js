exports.up = function(knex, Promise) {
  return knex.schema.createTable('favoriteMaps', function (table) {
    table.bigInteger('maps_id').references('maps.id');
    table.bigInteger('users_id').references('users.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('favoriteMaps');
};
