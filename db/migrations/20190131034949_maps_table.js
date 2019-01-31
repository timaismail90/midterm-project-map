exports.up = function(knex, Promise) {
  return knex.schema.createTable('maps', function (table) {
    table.increments('id').unsigned().primary();
    table.string('name');
    table.float('latitudes', 2, 6);
    table.float('longtitudes', 2, 6);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('maps');
};
