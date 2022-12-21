import fastify from 'fastify'
import cors from '@fastify/cors'
import { produce } from 'immer'
import { PlayerStateUpdate, PlayerCommand } from 'knex/types/tables'
import {
  createMockState,
  createCommand,
  getCommandsSince,
  createStateUpdate,
  getAllStateUpdates,
} from './data'

class Commands {
  getSince(since: Date) { }
}

const service = fastify()

service.register(cors, { origin: true })

service.get<{
  Params: {
    pincode: string
  }
}>('/players/:pincode/current_state', async ({ params: { pincode } }) => {
  const updates = await getAllStateUpdates(pincode)

  return updates.reduce(
    (finalState, currentUpdate) => produce(finalState, draft => {
      Reflect.deleteProperty(draft, 'id')

      if (currentUpdate.created_at != null) {
        Reflect.set(draft, 'created_at', currentUpdate.created_at)
      }

      if (currentUpdate.next_name != null) {
        Reflect.set(draft, 'next_name', currentUpdate.next_name)
      }

      if (currentUpdate.curr_name != null) {
        Reflect.set(draft, 'curr_name', currentUpdate.curr_name)
      }

      if (currentUpdate.prev_name != null) {
        Reflect.set(draft, 'prev_name', currentUpdate.prev_name)
      }

      if (currentUpdate.curr_volume != null) {
        Reflect.set(draft, 'curr_volume', currentUpdate.curr_volume)
      }

      if (currentUpdate.now_playing != null) {
        Reflect.set(draft, 'now_playing', currentUpdate.now_playing)
      }
    }),
    createMockState(pincode)
  )
})

service.post<{
  Params: {
    pincode: string
  },
  Body: string
}>('/players/:pincode/state_update', async ({ params: { pincode }, body: stateUpdateStr }) => {
  const stateUpdate: PlayerStateUpdate = typeof stateUpdateStr === 'string'
    ? JSON.parse(stateUpdateStr)
    : stateUpdateStr

  await createStateUpdate(pincode, stateUpdate)
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
