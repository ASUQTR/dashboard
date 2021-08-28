import { Component, OnInit } from '@angular/core';
import { RoslibService } from '../roslib.service';

@Component({
    selector: 'app-flexbe-behavior-killswitch',
    templateUrl: './flexbe-behavior-killswitch.component.html',
    styleUrls: ['./flexbe-behavior-killswitch.component.scss'],
})
export class FlexbeBehaviorKillswitchComponent implements OnInit {
    constructor(private rs: RoslibService) {}

    ngOnInit(): void {}

    killBehavior() {
        this.rs.behaviorKillSwitchSource.next();
    }
}
