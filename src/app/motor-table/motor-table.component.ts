import { Component, OnDestroy, OnInit } from '@angular/core';
import { RosService } from '../ros.service';
import { Observable, Subscription } from 'rxjs';
import { pluck } from 'rxjs/operators';

@Component({
    selector: 'app-motor-table',
    templateUrl: './motor-table.component.html',
    styleUrls: ['./motor-table.component.scss'],
})
export class MotorTableComponent implements OnInit, OnDestroy {
    motorThrottlesData$: Observable<number[]>;

    constructor(private rs: RosService) {}

    ngOnInit(): void {
        this.motorThrottlesData$ = this.rs.motorThrottlesData.pipe(pluck('throttles'));
    }

    ngOnDestroy(): void {}
}
