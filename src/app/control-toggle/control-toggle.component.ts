import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { RosService } from '../ros.service';
import { ControlEnableMessage } from '../ros-model.enum';

@Component({
    selector: 'app-control-toggle',
    templateUrl: './control-toggle.component.html',
    styleUrls: ['./control-toggle.component.scss'],
})
export class ControlToggleComponent implements OnInit {
    readonly enableLQRCookieName = 'enableLQRCookie';
    checked: boolean;
    constructor(private cookies: CookieService, private rs: RosService) {
        this.rs.lqrControlData.subscribe((newData) => {
            this.checked = newData;
        });
    }

    ngOnInit(): void {
        if (this.cookies.check(this.enableLQRCookieName)) {
            const cookieStartingValue =
                this.cookies.get(this.enableLQRCookieName) === 'true';
            this.checked = cookieStartingValue;
            this.rs.lqrControlSource.next(cookieStartingValue);
        }
    }

    toggleLQR(newValue: boolean): void {
        this.cookies.set(this.enableLQRCookieName, newValue.toString(), 30); // Keep cookie for 30 days
        if (newValue !== this.checked) {
            this.rs.lqrControlSource.next(newValue);
        }
    }

    convertToRos(value: boolean): ControlEnableMessage {
        let enableLQRMessage: ControlEnableMessage;
        enableLQRMessage = {
            data: value,
        };
        return enableLQRMessage;
    }
}
