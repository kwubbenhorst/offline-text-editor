import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// Added logic to a method that accepts some content and adds it to the database
export const putDb = async (content) => {
  console.log('putDb function called with content:', content);
  try {
    const db = await initdb();
    const tx = db.transaction('jate', 'readwrite');
    const store = tx.objectStore('jate');
    console.log('Putting content into IndexedDB:', content);
    await store.put({ content }); // content is an object with a key 'content'
    console.log('Content added to IndexedDB successfully');
    await tx.done;
  } catch (error) {
    console.error('putDb not implemented', error);
  }
};

// Added logic for a method that gets all the content from the database
export const getDb = async () => {
  console.log('getDb function called');
  try {
    const db = await initdb();
    const tx = db.transaction('jate', 'readonly');
    const store = tx.objectStore('jate');
    const result = await store.getAll();
    console.log('Retrieving content from IndexedDB:', result);
    await tx.done;

    return result.map(item => item.content)[result.length-1]; //grab the last item from the array of strings to be displayed, adds a version history
  } catch (error) {
    console.error('getDb not implemented:', error);
    return []; // Return an empty array
  }
};

initdb();
