import type Echo from 'laravel-echo'
import type { BroadcastDriver } from 'laravel-echo'
import { useNuxtApp } from '#app'

export const useEcho = (): Echo<BroadcastDriver> => {
  const { $echo } = useNuxtApp()

  return $echo as Echo<BroadcastDriver>
}
