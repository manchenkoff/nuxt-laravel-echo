import type Echo from 'laravel-echo'
import type { Broadcaster } from 'laravel-echo'
import { useNuxtApp } from '#app'

export const useEcho = (): Echo<keyof Broadcaster> => {
  const { $echo } = useNuxtApp()

  return $echo as Echo<keyof Broadcaster>
}
