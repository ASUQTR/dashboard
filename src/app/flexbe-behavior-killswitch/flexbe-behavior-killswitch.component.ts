import { Component, OnInit } from '@angular/core';
import { RosService } from '../ros.service';

@Component({
    selector: 'app-flexbe-behavior-killswitch',
    templateUrl: './flexbe-behavior-killswitch.component.html',
    styleUrls: ['./flexbe-behavior-killswitch.component.scss'],
})
export class FlexbeBehaviorKillswitchComponent implements OnInit {
    constructor(private rs: RosService) {}

    ngOnInit(): void {}

    killBehavior() {
        this.rs.behaviorKillSwitchSource.next();
    }
}
