import type Echo from 'laravel-echo'
import { useNuxtApp } from '#app'

export const useEcho = (): Echo => {
  const { $echo } = useNuxtApp()

  return $echo as Echo
}
