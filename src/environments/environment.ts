/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    rosUrl: 'ws://' + location.hostname + ':9090',
    firebase: {
        apiKey: 'AIzaSyB7Ds00xlfd03DXwCUp2p3mVoP36zfTZho',
        authDomain: 'asuqtr-web-page-refactor.firebaseapp.com',
        databaseURL: 'https://asuqtr-web-page-refactor.firebaseio.com',
        projectId: 'asuqtr-web-page-refactor',
        storageBucket: 'asuqtr-web-page-refactor.appspot.com',
        messagingSenderId: '413426909710',
        appId: '1:413426909710:web:e8b12c0ba63aee5e70b25f',
        measurementId: 'G-FYMS7GQF1D',
    },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
