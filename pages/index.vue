<template>
  <div>
    <!-- <NuxtWelcome /> -->
    <h1>{{ toProperCase(platform()) }}</h1>
  </div>
</template>
<script setup lang="ts">
import { watch, watchEffect } from 'vue';
import {platform} from 'socket:os';
import { useMagicKeys} from '@vueuse/core'
// import { platform } from 'socket:os';
console.log(platform())
const { shift, space, a } = useMagicKeys()

watch(space, (v) => {
  if (v)
    console.log('space has been pressed')
})

watchEffect(() => {
  if (shift.value && a.value)
    console.log('Shift + A have been pressed')
})
const toProperCase = (s:string) => s[0].toUpperCase() + s.slice(1)
</script>
<style>
body, html {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
