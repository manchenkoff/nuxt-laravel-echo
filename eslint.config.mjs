// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    tooling: true,
    stylistic: true,
  },
  dirs: {
    src: ['./playground'],
  },
}).append({
  rules: {
    '@stylistic/comma-dangle': 'off',
    '@stylistic/indent': 'off',
    'vue/no-multiple-template-root': 'off',
    'eslintvue/multi-word-component-names': 'off',
  },
})
