import { knex } from 'knex'
import knexfile from '../knexfile'
import type { PlayerStateUpdate } from 'knex/types/tables'

export const getAllStateUpdates = async (pincode: string): Promise<PlayerStateUpdate[]> => {
  return knex(knexfile)
    .select()
    .where({ pincode })
    .orderBy('created_at')
    .from('player_state_update')
}

export const createStateUpdate = async (
  pincode: string,
  { id: _omit1, pincode: _omit2, created_at: _omit3, ...update }: Partial<PlayerStateUpdate>
) => {
  return knex(knexfile)
    .insert({ pincode, ...update, created_at: new Date() })
    .into('player_state_update')
}
