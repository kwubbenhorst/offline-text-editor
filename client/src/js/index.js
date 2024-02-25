// This index.js file is the entry point for the client-side code. It initializes the CodeMirror editor, registers the service worker, and manages the loading spinner.
// The CodeMirror editor is initialized, and if it fails, a loading spinner is displayed.
// Then the script checks if service workers are supported and registers the Workbox service worker for caching.
// This file was basically complete in the source-code but it had a bug. I changed what was passed in to the new instance of Workbox from '/src-sw.js' (name of the pre-bundled file) to '/service-worker.js' (name of the file after bundling) to eliminate errors in the console. 

import { Workbox } from 'workbox-window';
import Editor from './editor';
import './database';
import '../css/style.css';

const main = document.querySelector('#main');
main.innerHTML = '';

const loadSpinner = () => {
  const spinner = document.createElement('div');
  spinner.classList.add('spinner');
  spinner.innerHTML = `
  <div class="loading-container">
  <div class="loading-spinner" />
  </div>
  `;
  main.appendChild(spinner);
};

const editor = new Editor();

if (typeof editor === 'undefined') {
  loadSpinner();
}

// Check if service workers are supported
if ('serviceWorker' in navigator) {
  // register workbox service worker
  const workboxSW = new Workbox('/service-worker.js');
  workboxSW.register();
} else {
  console.error('Service workers are not supported in this browser.');
}
