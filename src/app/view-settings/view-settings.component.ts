import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-view-settings',
    templateUrl: './view-settings.component.html',
    styleUrls: ['./view-settings.component.scss'],
})
export class ViewSettingsComponent implements OnInit {
    readonly themeCookieName = 'viewMotorThrottlesCanvas';
    motorThrottlesCanvaschecked = false;
    constructor(private cookie: CookieService) {}

    ngOnInit(): void {
        if (this.cookie.check(this.themeCookieName)) {
            const cookieStartingValue =
                this.cookie.get(this.themeCookieName) === 'true';
            this.motorThrottlesCanvaschecked = cookieStartingValue;
        }
    }

    onToggleMotorThrottlesCanvas(value: boolean) {
        this.cookie.set(this.themeCookieName, value.toString());
    }
}
