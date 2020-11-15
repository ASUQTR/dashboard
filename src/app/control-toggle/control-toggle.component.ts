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
    constructor(private rs: RosService) {}

    ngOnInit(): void {}

    killLQR(): void {
        this.rs.lqrKillSwitchSource.next(false);
    }
}
