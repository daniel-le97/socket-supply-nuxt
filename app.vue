<template>
  <div>
    <!-- <NuxtWelcome /> -->
    <div>
      this is a terminal extension
      platform: {{ toProperCase(platform()) }}
    </div>
    <Terminal/>
    <!-- <button @click="clicker">
      {{ hello }}
    </button> -->
  </div>
</template>
<script setup lang="ts">
import {platform} from 'socket:os';
const hello = ref('hello what system is this')
const clicker = () => {
  hello.value = toProperCase(platform())
}
const toProperCase = (s:string) => s[0].toUpperCase() + s.slice(1)
</script>
<style>
body, html {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
