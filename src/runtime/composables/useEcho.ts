import type Echo from 'laravel-echo'
import type { SupportedBroadcaster } from '../types/options'
import { useNuxtApp } from '#app'

export const useEcho = (): Echo<SupportedBroadcaster> => {
  const { $echo } = useNuxtApp()

  return $echo as Echo<SupportedBroadcaster>
}
