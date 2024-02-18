import { knex } from './knex'
import type { PlayerState } from 'knex/types/tables'

export const getStateByPincode = async (pincode: string): Promise<PlayerState> => {
  return knex.select('*').from('player_state').where({ pincode }).first()
}

export const updateState = async (id: number, { id: _omit, ...state }: Partial<PlayerState>) => {
  return knex.from('player_state').where({ id }).update(state)
}

export const createState = async (state: Partial<PlayerState>) => {
  return knex.from('player_state').insert(state)
}
