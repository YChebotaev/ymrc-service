import { knex } from 'knex'
import knexfile from '../knexfile'
import type { PlayerState } from 'knex/types/tables'

export const createMockState = (pincode: string) => ({
  id: -1,
  pincode,
  curr_name: null,
  next_name: null,
  prev_name: null,
  curr_volume: null,
  now_playing: 0,
  created_at: new Date(),
  updated_at: new Date()
})

export const isStateMock = (state: { id: number }) => {
  return state.id === -1
}

export const getStateByPincode = async (pincode: string): Promise<PlayerState> => {
  return knex(knexfile).select().from('player_state').where({ pincode }).first()
}

export const updateState = async (id: number, { id: _omit, ...state }: Partial<PlayerState>) => {
  return knex(knexfile).from('player_state').where({ id }).update(state)
}

export const createState = async (state: Partial<PlayerState>) => {
  return knex(knexfile).from('player_state').insert(state)
}
