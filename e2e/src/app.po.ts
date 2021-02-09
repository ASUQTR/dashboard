/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

import { browser, by, element } from 'protractor';

export class AppPage {
    navigateTo(): Promise<unknown> {
        return browser.get(browser.baseUrl) as Promise<unknown>;
    }

    getTitleText(): Promise<string> {
        return element(
            by.css(
                'app-root nb-layout .scrollable-container .layout nb-layout-header nav app-toolbar span'
            )
        ).getText() as Promise<string>;
    }
}
