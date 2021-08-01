/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

import { ApplicationRef, Component, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { CookieService } from 'ngx-cookie-service';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-theme-changer',
    templateUrl: './theme-changer.component.html',
    styleUrls: ['./theme-changer.component.scss'],
})
export class ThemeChangerComponent implements OnInit {
    readonly themeCookieName = 'nbThemeValue';
    themes = ['syspref', 'dark', 'default', 'cosmic'];
    selectedThemeFormControl = new FormControl();
    selectedTheme = 'syspref';

    constructor(
        private themeService: NbThemeService,
        private cookie: CookieService,
        private ref: ApplicationRef
    ) {}

    ngOnInit(): void {
        if (this.cookie.check(this.themeCookieName)) {
            this.selectedTheme = this.cookie.get(this.themeCookieName);
            if (this.themes.includes(this.selectedTheme)) {
                this.selectedThemeFormControl.setValue(
                    this.themes.indexOf(this.selectedTheme).toString()
                );
            } else {
                this.selectedTheme = 'syspref';
            }
        } else {
            this.selectedTheme = 'syspref';
            this.selectedThemeFormControl.setValue(
                this.themes.indexOf(this.selectedTheme).toString()
            );
        }

        if (this.selectedTheme !== 'syspref') {
            this.themeService.changeTheme(this.selectedTheme);
        } else {
            this.checkSystemPreferencesAndApply();
            this.addDarkModeChangeListener();
        }

        this.selectedThemeFormControl.valueChanges.subscribe((value) => {
            switch (value) {
                case '0':
                    this.selectedTheme = 'syspref';
                    break;

                case '1':
                    this.selectedTheme = 'dark';
                    break;

                case '2':
                    this.selectedTheme = 'default';
                    break;

                case '3':
                    this.selectedTheme = 'cosmic';
                    break;

                default:
                    this.selectedTheme = 'default';
                    break;
            }

            this.cookie.set(this.themeCookieName, this.selectedTheme, 30); // Keep cookie for 30 days
            if (this.selectedTheme !== 'syspref') {
                this.themeService.changeTheme(this.selectedTheme);
            } else {
                this.checkSystemPreferencesAndApply();
            }
        });
    }

    private checkSystemPreferencesAndApply() {
        // Initially check if dark mode is enabled on system
        const darkModeOn =
            window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

        this.themeService.changeTheme(darkModeOn ? 'dark' : 'default');
    }

    private addDarkModeChangeListener() {
        // Watch for changes of the preference
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (this.selectedTheme === 'syspref') {
                const turnOn = e.matches;
                this.themeService.changeTheme(turnOn ? 'dark' : 'default');
                this.ref.tick();
            }
        });
    }
}
