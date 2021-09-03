import { Component, OnDestroy, OnInit } from '@angular/core';
import { RoslibService } from '../../roslib.service';
import { pluck } from 'rxjs/operators';
import { combineLatest, Subscription } from 'rxjs';

@Component({
    selector: 'app-leak-sensor',
    templateUrl: './leak-sensor.component.html',
    styleUrls: ['./leak-sensor.component.scss'],
})
export class LeakSensorComponent implements OnInit, OnDestroy {
    leakText = '';
    leak = false;
    private sub: Subscription;

    constructor(private rs: RoslibService) {}

    ngOnInit(): void {
        const leakDriver$ = this.rs.leakSensorDriverData.pipe(pluck('data'));
        const leakHelper$ = this.rs.leakSensorHelperData.pipe(pluck('data'));

        this.sub = combineLatest([leakDriver$, leakHelper$]).subscribe(
            ([leakDriver, leakHelper]) => {
                if (leakDriver && !leakHelper) {
                    this.leakText = 'Driver';
                } else if (!leakDriver && leakHelper) {
                    this.leakText = 'Helper';
                } else if (leakDriver && leakHelper) {
                    this.leakText = 'Driver & Helper';
                } else {
                    this.leakText = 'False';
                }

                this.leak = !!(leakDriver || leakHelper);
            }
        );
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
