// This editor.js file handles the initialization of the CodeMirror editor and manages the interactions with IndexedDB. 
// On editor instantiation, data is loaded from IndexedDB using the getDb method. The retrieved data is then injected into the CodeMirror editor.
// There were errors showing in the console when I ran the source-code version. When I converted the data array to a string CodeMirror did not complain anymore 
// The saving of updated data to IndexedDB from the editor using the putDb method is triggered by the blur event (the user clicks out of the editor/editor loses focus)


// Import the methods we defined in database.js to save and get data from the indexedDB
import { getDb, putDb } from './database';
import { header } from './header';

export default class {
  constructor() {
    const localData = localStorage.getItem('content');

    // check if CodeMirror is loaded
    if (typeof CodeMirror === 'undefined') {
      throw new Error('CodeMirror is not loaded');
    }

    this.editor = CodeMirror(document.querySelector('#main'), {
      value: '',
      mode: 'javascript',
      theme: 'monokai',
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      indentUnit: 2,
      tabSize: 2,
    });

    // When the editor is ready, set the value to whatever is stored in indexedDB.
    // Fall back to localStorage if nothing is stored in indexedDB, and if neither is available, set the value to header.
    getDb().then((data) => {
      console.info('Loaded data from IndexedDB:', data);
      // Convert the array to a string
      const stringData = data;
      console.info('Injecting into editor');
      console.log('Value of data:', data);
      console.log('Value of localData:', localData);
      console.log('Value of header:', header);
      console.log('Before setting value in CodeMirror:', stringData || localData || header);
      this.editor.setValue(stringData || localData || header);
      console.log('After setting value in CodeMirror:', this.editor.getValue());
    });

    this.editor.on('change', () => {
      localStorage.setItem('content', this.editor.getValue());
    });

    // Save the content of the editor when the editor itself loses focus
    this.editor.on('blur', () => {
      console.log('The editor has lost focus');
      putDb(localStorage.getItem('content'));
    });
  }
}
