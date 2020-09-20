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
    toggleNgModel = true;
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
        this.cookie.set(this.themeCookieName, value.toString());
        this.themeService.changeTheme(value ? 'dark' : 'default');
    }
}
