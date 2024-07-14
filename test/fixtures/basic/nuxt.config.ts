import MyModule from '../../../src/module'

export default defineNuxtConfig({
  // @ts-expect-error incompatible types
  modules: [MyModule],
})
