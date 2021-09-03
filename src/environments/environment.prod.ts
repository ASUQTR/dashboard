/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

import packageJson from '../../package.json';

export const environment = {
    production: true,
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
    version: packageJson.version,
};
