<template>
  <div id="app">
    <pre id="code-section"></pre>
    <input type="text" id="input-section" placeholder="Enter command">
  </div>
</template>

<script setup>
import extension from 'socket:extension';
import * as os from "socket:os";
onMounted( async() => {
  const ext = await extension.load( 'socket-extension-terminal' );

  const input = document.querySelector( '#input-section' );
  const code = document.querySelector( '#code-section' );

  const history = [];
  let historyIndex = 0;

  input.focus();
  input.addEventListener( 'keydown', async ( e ) => {
    if ( e.key === 'ArrowUp' && history.length > 0 )
    {
      input.value = history[ historyIndex ];
      historyIndex = Math.min( historyIndex + 1, history.length - 1 );
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    if ( e.key === 'ArrowDown' && history.length > 0 )
    {
      input.value = history[ historyIndex ];
      historyIndex = Math.max( historyIndex - 1, 0 );
      e.stopPropagation();
      e.preventDefault();
      return;
    }

    if ( e.key !== 'Enter' )
    {
      e.stopPropagation();
      return;
    }
    code.textContent += '$ ' + input.value + os.EOL
    history.unshift( input.value );
    historyIndex = 0;
    await ext.binding.process.spawn( { command: input.value } );
    input.value = '';
    input.scrollIntoView()
  } );

  window.addEventListener( 'data', e => {
    code.textContent += e.detail.data.toString() + os.EOL;
  } );
} )



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
