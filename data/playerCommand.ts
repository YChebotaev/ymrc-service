import { knex } from 'knex'
import knexfile from '../knexfile'
import type { PlayerCommand } from 'knex/types/tables'

export const createCommand = (
  pincode: string,
  method: 'play' | 'pause' | 'forward' | 'backward' | 'volume',
  params: undefined | [number]) => {
  return knex(knexfile).from('player_command').insert({
    pincode,
    method,
    params,
    created_at: new Date()
  })
}

export const getCommandsSince = async (pincode: string, since?: Date | null): Promise<PlayerCommand[]> => {
  let req = knex(knexfile)
    .from('player_command')
    .where({ pincode })

  if (since != null) {
    req = req.where('created_at', '>=', since.getTime())
  }

  return req.select()
}
