<script setup lang="ts">
interface ErrorProps {
  error?: {
    url: string
    statusCode: number
    statusMessage: string
    message: string
    description: string
    data?: object
  }
}

const props = defineProps<ErrorProps>()
</script>

<template>
  <NuxtLoadingIndicator />

  <h1>Nuxt - Laravel Echo application sample</h1>

  <strong>Error</strong>

  <p>{{ props.error }}</p>
</template>

<style scoped></style>
