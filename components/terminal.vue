<template>
  <div id="app">
    <pre id="code-section">{{ terminalOutput }}</pre>
    <input type="text" id="input-section" v-model="command" @keydown.enter="executeCommand" placeholder="Enter command">
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import extension from 'socket:extension';
import * as os from "socket:os";

const terminalOutput = ref('');
const command = ref('');
const history = ref([]);
let historyIndex = ref(0);
const ext = await extension.load('socket-extension-terminal');

onMounted(async () => {

  window.addEventListener('data', (e) => {
    terminalOutput.value += e.detail.data.toString() + os.EOL;
  });
});

const executeCommand = async () => {
  if (!command.value.trim()) return;

  terminalOutput.value += `$ ${command.value}${os.EOL}`;
  history.value.unshift(command.value);
  historyIndex.value = 0;
  
  // const ext = await extension.load('socket-extension-terminal');
  await ext.binding.process.spawn({ command: command.value });

  command.value = '';
};
</script>

<style>
body,
html {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Courier New', monospace;
  background-color: #000;
  color: #0f0;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100%;
}

#code-section {
  flex: 1;
  overflow: auto;
  background-color: #000;
  color: #0f0;
  padding: 20px;
  white-space: pre-wrap;
  border: none;
  resize: none;
}

#input-section {
  width: 100%;
  background-color: #000;
  color: #0f0;
  padding: 10px;
  border: none;
  border-top: 1px solid #0f0;
}
</style>
