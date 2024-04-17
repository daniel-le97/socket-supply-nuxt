<template>
  <div>
    <h1>{{ greeting }}</h1>
    <p>Count: {{ count }}</p>
    <button @click=" increment ">Increment</button>
    <p>Reversed message: {{ reversedMessage }}</p>
    <p>{{ platform() }}</p>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { platform } from 'socket:os';

// State
const count = ref( 0 );
const message = ref( 'Hello, Vue!' );
const greeting = computed( () => message.value.toUpperCase() );
const reversedMessage = computed( () => message.value.split( '' ).reverse().join( '' ) );

// Methods
const increment = () =>
{
  count.value++;
};

// Lifecycle hooks
onMounted( () =>
{
  console.log( 'Component mounted' );
} );

onUnmounted( () =>
{
  console.log( 'Component unmounted' );
} );

// Watchers
watch( message, ( newVal, oldVal ) =>
{
  console.log( `Message changed from "${ oldVal }" to "${ newVal }"` );
} );
</script>

<style>
body,
html {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
