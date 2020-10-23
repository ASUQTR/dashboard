import { Component, OnInit } from '@angular/core';
import { RosService } from '../ros.service';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';

@Component({
    selector: 'app-ros-remote',
    templateUrl: './ros-remote.component.html',
    styleUrls: ['./ros-remote.component.scss'],
})
export class RosRemoteComponent implements OnInit {
    constructor(
        public rs: RosService,
        private toastrService: NbToastrService
    ) {}

    ngOnInit(): void {}

    controlRosRemotely(start: boolean) {
        let status: NbComponentStatus;

        // +!! transform the boolean value into a number value 0 or 1
        this.rs.restApiControlRosRemotely(+!!start).subscribe(
            (res) => {
                status = 'success';
                this.toastrService.show(
                    '420 blaze it',
                    `Successfully ${
                        start ? 'started' : 'stopped'
                    } ROS remotely`,
                    { status }
                );
            },
            (err) => {
                status = 'danger';
                this.toastrService.show(
                    'Error ' + err.status + ': ' + err.statusText,
                    `Failed to ${start ? 'start' : 'stop'} ROS remotely`,
                    { status }
                );
            }
        );
    }
}
