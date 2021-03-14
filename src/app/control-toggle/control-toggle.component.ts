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

    startLQR(): void {
        this.rs.toggleLqrControl(true);
    }

    killLQR(): void {
        this.rs.toggleLqrControl(false);
        this.rs.behaviorKillSwitchSource.next();
    }
}
