import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('player_command', table => {
      table.increments('id')
      table.string('pincode')
      table.index('pincode', 'player_command_pincode_index')
      table.enum('method', [
        'play',
        'pause',
        'forward',
        'backward',
        'volume'
      ])
      table.json('params').defaultTo([])
      table.dateTime('created_at', { useTz: true })
    })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('player_command')
}

