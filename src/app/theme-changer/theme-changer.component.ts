/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

import { Component, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-theme-changer',
    templateUrl: './theme-changer.component.html',
    styleUrls: ['./theme-changer.component.scss'],
})
export class ThemeChangerComponent implements OnInit {
    readonly themeCookieName = 'nbDarkThemeValue';
    checked = false;
    constructor(
        private themeService: NbThemeService,
        private cookie: CookieService
    ) {}

    ngOnInit(): void {
        if (this.cookie.check(this.themeCookieName)) {
            const cookieStartingValue =
                this.cookie.get(this.themeCookieName) === 'true';
            this.checked = cookieStartingValue;
            this.themeService.changeTheme(
                cookieStartingValue ? 'dark' : 'default'
            );
        }
    }

    onToggle(value: boolean) {
        this.cookie.set(this.themeCookieName, value.toString(), 30); // Keep cookie for 30 days
        this.themeService.changeTheme(value ? 'dark' : 'default');
    }
}
