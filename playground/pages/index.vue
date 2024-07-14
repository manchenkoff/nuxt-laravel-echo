<script setup lang="ts">
const echo = useEcho()

const messages = ref<string[]>([])
const writeNewMessage = (e: object) => messages.value.push(JSON.stringify(e))

function stopAllListeners() {
  echo.leaveAllChannels()
}

function subscribeToPublicChannel() {
  const name = 'public'
  const event = '.PublicEvent'

  echo
    .channel(name)
    .listen(event, (e: object) => writeNewMessage(e))
    .error((e: object) => {
      console.error('Public channel error', e)
    })
}

function subscribeToPrivateChannel() {
  const name = 'users'
  const event = '.PrivateEvent'

  echo
    .private(name)
    .listen(event, (e: object) => writeNewMessage(e))
    .error((e: object) => {
      console.error('Private channel error', e)
    })
}
</script>

<template>
  <div>
    <button @click="subscribeToPublicChannel">
      Subscribe to public channel
    </button>
    <button @click="subscribeToPrivateChannel">
      Subscribe to private channel
    </button>
    <button @click="stopAllListeners">
      Stop all listeners
    </button>
  </div>
  <div>
    <h2>Message history</h2>
    <ol>
      <li
        v-for="message in messages"
        :key="message"
      >
        {{ message }}
      </li>
    </ol>
  </div>
</template>

<style scoped></style>
