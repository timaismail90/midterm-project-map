exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('contributors', function (table) {
    table.bigInteger('maps_id').references('maps.id');
    table.bigInteger('users_id').references('users.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('contributors');
};
