import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('player_state_update', table => {
      table.increments('id')
      table.string('pincode')
      table.index('pincode', 'player_state_update_pincode_index')
      table.string('curr_name').nullable()
      table.string('next_name').nullable()
      table.string('prev_name').nullable()
      table.integer('curr_volume').nullable()
      table.integer('now_playing').nullable()
      table.dateTime('created_at', { useTz: true })
      table.index('created_at', 'player_state_update_created_at_index')
    })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('player_state_update')
}

