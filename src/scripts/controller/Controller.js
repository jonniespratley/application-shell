import ToasterSingleton from '../libs/ToasterSingleton';

/**
 * Base Controller class should be extended by controller implementations.
 */
export default class Controller {

  /**
   *
   * @constructor
   * @param {boolean} registerServiceWorker Flag to register a serviceWorker.
   */
  constructor (registerServiceWorker = true) {
    if (registerServiceWorker) {
      this.registerServiceWorker();
    }
  }

  /**
   * Register service worker
   */
  registerServiceWorker () {
    if (!('serviceWorker' in navigator)) {
      // Service worker is not supported on this platform
      console.warn('Service worker is not supported on this platform');
      return;
    }

    navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    }).then((registration) => {
      console.log('Service worker is registered.');

      var isUpdate = false;

        // If this fires we should check if there's a new Service Worker
        // waiting to be activated. If so, ask the user to force refresh.
      if (registration.active) {
        isUpdate = true;
      }

      registration.onupdatefound = function(updateEvent) {
        console.log('A new Service Worker version has been found...');

        // If an update is found the spec says that there is a new Service
        // Worker installing, s o we should wait for that to complete then
        // show a notification to the user.
        registration.installing.onstatechange = function(event) {
          if (this.state === 'installed') {
            if (isUpdate) {
              ToasterSingleton.getToaster()
              .toast('App updated. Restart for the new version.');
            } else {
              ToasterSingleton.getToaster().toast('App ready for offline use.');
            }
          }
        };
      };
    })
    .catch((err) => {
      console.log('Unable to register service worker.', err);
    });
  }

  /**
   * Load a script from URL and append it to the documents head.
   * @param {String} url The url of the script to load.
   * @return {Promise} Promise Resolves `onload` or rejects `onerror`.
   */
  loadScript (url) {
    return new Promise((resolve, reject) => {
      var script = document.createElement('script');
      script.async = true;
      script.src = url;

      script.onload = resolve;
      script.onerror = reject;

      document.head.appendChild(script);
    });
  }

  /**
   * Load a stylesheet from URL and append it to the documents head.
   * @param {String} url The url of the stylesheet to load.
   * @return {Promise} Promise Resolves `onload` or rejects `onerror`.
   */
  loadCSS (url) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'text';
      xhr.onload = function(e) {
        if (this.status === 200) {
          var style = document.createElement('style');
          style.textContent = xhr.response;
          document.head.appendChild(style);
          resolve();
        } else {
          reject();
        }
      };
      xhr.send();
    });
  }

}
