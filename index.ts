import fastify from 'fastify'
import cors from '@fastify/cors'
import { PlayerCommand, PlayerState } from 'knex/types/tables'
import {
  createCommand,
  getCommandsSince,
  getStateByPincode,
  updateState,
  createState,
} from './data'

const service = fastify()

service.register(cors, { origin: true })

service.get<{
  Params: {
    pincode: string
  }
}>('/players/:pincode/current_state', async ({ params: { pincode } }) => {
  const currentState = await getStateByPincode(pincode)

  return currentState
})

service.post<{
  Params: {
    pincode: string
  },
  Body: string
}>('/players/:pincode/state_update', async ({ params: { pincode }, body: stateUpdateStr }) => {
  const newStateUpdate: PlayerState = typeof stateUpdateStr === 'string'
    ? JSON.parse(stateUpdateStr) satisfies PlayerState
    : stateUpdateStr satisfies PlayerState
  const prevStateUpdate = await getStateByPincode(pincode)

  if (prevStateUpdate) {
    await updateState(prevStateUpdate.id, {
      ...newStateUpdate,
      now_playing: newStateUpdate.now_playing ? 1 : 0,
      updated_at: new Date()
    })
  } else {
    await createState({
      ...newStateUpdate,
      pincode,
      now_playing: newStateUpdate.now_playing ? 1 : 0,
      created_at: new Date()
    })
  }
})

service.get<{
  Params: {
    pincode: string
  },
  Querystring: {
    since?: string
  }
}>('/players/:pincode/get_commands', async ({ params: { pincode }, query: { since: sinceString } }) => {
  const since = Number.isNaN(Number(sinceString)) ? null : new Date(Number(sinceString))

  const commands = await getCommandsSince(pincode, since)

  return commands
})

service.post<{
  Params: {
    pincode: string
  },
  Body: Omit<PlayerCommand, 'id' | 'pincode'>
}>('/players/:pincode/send_command', async ({ params: { pincode }, body: playerCommand }) => {
  await createCommand(pincode, playerCommand.method, playerCommand.params as any)
})

service.listen({
  port: process.env['PORT'] ? Number(process.env['PORT']) : 3000,
  host: '::'
}, (err, address) => {
  if (err) {
    console.error(err)
  } else {
    console.log(`Service listeninig on ${address}`)
  }
})
