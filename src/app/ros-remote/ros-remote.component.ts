import { Component, OnInit } from '@angular/core';
import { RestApiService } from "../rest-api.service";

@Component({
    selector: 'app-ros-remote',
    templateUrl: './ros-remote.component.html',
    styleUrls: ['./ros-remote.component.scss'],
})
export class RosRemoteComponent implements OnInit {
    constructor(
        public restService: RestApiService
    ) {
    }

    ngOnInit(): void {
    }

    controlRosRemotely(start: boolean) {
        // +!! transform the boolean value into a number value 0 or 1
        this.restService.controlRosRemotely$.next(+!!start);
        console.log('Pressed on button for ', start);
    }
}
