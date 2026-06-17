import { Component, OnDestroy } from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';
import { RoslibService } from '../../roslib.service';

@Component({
    selector: 'app-lqr-raw-debug',
    templateUrl: './lqr-raw-debug.component.html',
    styleUrls: ['./lqr-raw-debug.component.scss'],
})
export class LqrRawDebugComponent implements OnDestroy {
    lqrVelocity: number[] = [];
    lqrAccelCmd: number[] = [];
    lqrDynamics: number[] = [];

    private sub: Subscription;

    constructor(private rs: RoslibService) {
        this.sub = combineLatest([
            this.rs.lqrVelocityData,
            this.rs.lqrAccelCmdData,
            this.rs.lqrDynamicsData,
        ]).subscribe(([vel, accel, dyn]) => {
            this.lqrVelocity = vel.data ?? [];
            this.lqrAccelCmd = accel.data ?? [];
            this.lqrDynamics = dyn.data ?? [];
        });
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
}
