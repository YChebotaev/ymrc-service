declare module 'knex/types/tables' {
  type PlayerState = {
    id: number
    pincode: string,
    curr_name: string | null,
    next_name: string | null,
    prev_name: string | null,
    curr_volume: number | null,
    now_playing: number | null,
    created_at: Date
    updated_at: Date | null
  }

  type PlayerStateUpdate = {
    id: number
    pincode: string,
    curr_name: string | null,
    next_name: string | null,
    prev_name: string | null,
    curr_volume: number | null,
    now_playing: boolean | null,
    created_at: Date
  }

  type PlayerCommand<Params extends any[] = any[]> = {
    id: number
    pincode: string,
    method: 'play' | 'pause' | 'volume',
    params: Params
  }

  interface Tables {
    player_state: PlayerState
    player_state_update: PlayerStateUpdate
    player_command: PlayerCommand
  }
}
