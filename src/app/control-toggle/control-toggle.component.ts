import { Component, OnInit } from '@angular/core';
import { RosService } from '../ros.service';

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
        this.rs.behaviorKillSwitchSource.next();
    }
}
