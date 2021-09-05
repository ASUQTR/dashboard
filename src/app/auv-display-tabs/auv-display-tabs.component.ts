import { Component, OnInit } from '@angular/core';
import { NbTabComponent } from '@nebular/theme';
import { CookieService } from 'ngx-cookie-service';
import { RoslibService } from '../roslib.service';

@Component({
    selector: 'app-auv-display-tabs',
    templateUrl: './auv-display-tabs.component.html',
    styleUrls: ['./auv-display-tabs.component.scss'],
})
export class AuvDisplayTabsComponent implements OnInit {
    tab1Active = false;
    readonly tabSelectedCookieName = 'tab1Active';

    constructor(private cookie: CookieService, public rs: RoslibService) {}

    ngOnInit(): void {
        if (this.cookie.check(this.tabSelectedCookieName)) {
            const cookieValue = this.cookie.get(this.tabSelectedCookieName);
            if (cookieValue === 'true') {
                this.tab1Active = true;
            } else if (cookieValue === 'false') {
                this.tab1Active = false;
            }
        }
    }

    tabUpdated(event: NbTabComponent) {
        if (event?.tabTitle === 'Motor Throttles') {
            this.cookie.set(this.tabSelectedCookieName, String(true), 30); // Keep cookie for 30 days
        } else if (event?.tabTitle === 'Nav Display') {
            this.cookie.set(this.tabSelectedCookieName, String(false), 30); // Keep cookie for 30 days
        }
    }
}
