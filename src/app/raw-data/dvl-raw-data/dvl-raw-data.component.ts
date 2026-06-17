import { Component, OnDestroy } from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';
import { RoslibService } from '../../roslib.service';
import { PoseStampedMessage, TwistWithCovarianceStampedMessage } from '../../ros-model.enum';

@Component({
    selector: 'app-dvl-raw-data',
    templateUrl: './dvl-raw-data.component.html',
    styleUrls: ['./dvl-raw-data.component.scss'],
})
export class DvlRawDataComponent implements OnDestroy {
    velocities: TwistWithCovarianceStampedMessage = {};
    altitude: PoseStampedMessage = {};

    private sub: Subscription;

    constructor(private rs: RoslibService) {
        this.sub = combineLatest([
            this.rs.dvlVelocitiesData,
            this.rs.dvlAltitudeData,
        ]).subscribe(([vel, alt]) => {
            this.velocities = vel;
            this.altitude = alt;
        });
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
}
