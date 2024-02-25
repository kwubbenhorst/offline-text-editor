# offline-text-editor
A single-page PWA application for a text editor that can work in the browser even offline, built by implementing methods for getting and storing data to an IndexedDB database on an existing code-base, and deployed with Heroku 

![MIT License](https://img.shields.io/badge/MIT-License-blue)
  

## Table of Contents
- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)
- [Contributions](#contributions)
- [Tests](#tests)
- [Questions](#questions)

## Description
This project optimized an existing code-base for a single-page text editor application, designed to run in the browser, so that it would meet the criteria for a Progressive Web Application (PWA), and, thanks to various data-persistence techniques, be able to function offline. The text editor is ideal for capturing short jottings which can be retrieved and edited if a user is at work in a remote location, with unreliable network connection. To be considered a PWA an application must 1. use a web manifest (a file of metadata governing how the app will behave when installed on different devices -- especially mobile -- so that the UX is consistent across various platforms), 2. use a service worker (a piece of functionality that works in the background to cache assets and persist data) so that offline functionality is enabled, and 3. be installable so that the UX is more like using a native app which can appear on a device as if it were independent of the browser and be accessible from the device's home screen or app launcher. (PWAs still rely on the browser's engine to run, so independence of the browser is more a perception in the UX than a technical reality). 

This application uses an indexedDB database, another client-side storage solution alongside local storage and session storage, but more robust. It supports more complex data structures than local storage and is good for handling larger amounts of data. Workers such as a linesman in the Cariboo region of BC, or an electrical engineer on a rig in the Hibernian oil field might need to store detailed technical specs in a structured way, and indexedDB would allow them to do that. Webpack and Workbox are dependencies that inject a custom service worker for the caching of assets. This is what provides for fast loading (good for areas where network connections are slow) and for offline functionality (good for areas where network connections are non-existent). There are various caching strategies that can be employed. CacheFirst, the Workbox strategy employed here, always serves the client from the cache rather than the network, subject to certain governing principles established in the service-worker file. For instance, assets are considered stale after 7 days and will then be refreshed by fetching from the network. This application uses an express server. The server side and client side are kept separate in the code's file structure, so the project actually has three package.jsons. It has a single entry point, however, in server.js and for testing purposes starts simply enough with the command "npm start" which builds the webpack (ie. the set of compiled, bundled application files, ready for distribution) and starts the server. All the work of adapting the existing codebase to meet PWA criteria happened in the client side files, with the exception of adding scripts for the application's overall package.json and installing the npm dependencies in all three package.jsons. The installability feature comes through handling logic for certain click events defined in the install.js file on the client-side. The babel-loader dependency allows for the use of next-gen JavaScript. It is also the webpack dependency that injects the web-manifest, providing for consistent UX across various devices. 

Developing this project was challenging, as it used new dependencies designed to do a lot for you in the background, each with their own documentation as to what properties to define and syntax to use. The choice of which caching strategy to use depends on developer experience with various use-cases. The fact the plugins do so much of the work implicitly makes it difficult to grasp all that is going on "behind the veil" that you can't see cause for in the code. Debugging and the tools to test that things are working properly are also quite complex. Not only the Chrome Dev Tools console was in play, but also the Application and Network Tabs of the inspector. If the console logs any errors in the bundled files (those in the dist folder created for production by the build script, leveraging webpack) it is hopeless to try to interpret them because the compiled code looks nothing like the uncompiled code. Any errors at the deployment stage will reference the compiled code and be difficult to debug. 

One feature that perhaps makes this project stand out is the way data is stored and retrieved (see database.js and editor.js). IndexedDB, as the name suggests, assigns an index to each entry and one way to grab the stored content would be to focus on the entry at the first index only, replacing the data at this index every time it is updated. However my approach of saving the whole stringified array and displaying only the last one to the view creates a version history which might guard against data loss. In the future it might be nice to make the text editor a little prettier. The CSS file and header were given in the source-code and were not adapted as part of the refactor. The stylings are fairly basic. More buttons to save when done entering or editing text rather than triggering the store by losing focus on the editor might also make for a more intuitive UI. In testing the installation icon in the address bar works for displaying the prompt, but the install button does not always work. This is the case when the app has already been installed. For it to work again the app has to be uninstalled and the cached data cleared. I am hopeful that this will not be an issue in the deployed version. According to the Lighthouse audit, the application is now a bona fide PWA and scores highly on all metrics (audit was run in an incognito window in the development environment).

![Screen Shot 2024-02-25 at 3 50 47 AM](https://github.com/kwubbenhorst/offline-text-editor/assets/140316693/b4af443d-6c60-45fc-9d18-b6bae116b44c)

This app has been deployed with Heroku. Here is the URL:
https://off-line-text-editor-2797b90d319f.herokuapp.com/ 

## Installation
In the test environment, the user needs only to enter npm start in the terminal for the server to be started and the webpack to be created. The only reason a user would need to revert to the pre-deployment version might be to manually adjust the time set for cached assets to be considered fresh. It is currently set to 7 days, but if our electrical engineer is on the oil rig for 3 weeks, she might want to reset that to 21 days. In terms of the deployed app, the user need only navigate to the URL within any internet browser. If they choose, they may then hit the install button or the install icon within the address bar, and be able to access and use the app directly from their device's home screen or app launcher.

## Usage
In terms of the UX the application is very simple. When opened the IndexedDB storage has been immediately created (it can be seen by using the inspect tool under application IndexedDB/jate/jate in browsers where Chrome Dev Tools are installed). Numbered lines are ready to receive text entered by the user. After text has been entered and the user clicks off the DOM window, the content can be seen to have been stored in the IndexedDB. When the text editor is reopened after closing the content previously entered is retrieved from IndexedDB storage and rendered in the display. The user can also click on the install button or the install icon in the address bar and see that the web application has become an icon on their desktop or on the home screen of their mobile device. So long as the user continues using the same device, indexedDB will record their text entered, and render back the most updated version upon reload or refresh. The app should be highly performant (fast!) even in slow network/no network contexts because the static assets are being served from the cache, and are not subject to the time delay involved in an API call.

## Credits
This project was a single-author creation.
Source-code for this project (prior to the implementation of technologies that render it a PWA) is found in Module 19 Challenge of the EdX full stack curriculum.  Within the code what portions are from source-code and what portions constitute the work of the developer are indicated in the comments in the client-side files (which are a blend). All the server side files were given as source-code.

## License
This project is licensed under the [MIT License](./LICENSE-MIT).

## Contributions
Contributions are welcome. Please contact the developer, Karla Wubbenhorst, through github: github.com/kwubbenhorst, or via email: kwubbenhorst@gmail.com

## Tests
N/A

## Questions
User feedback and questions are always welcome. Please use the same means of contact given above: github.com/kwubbenhorst or kwubbenhorst@gmail.com
