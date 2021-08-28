import { Component, OnDestroy, OnInit } from '@angular/core';
import { RoslibService } from '../../roslib.service';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { pluck } from 'rxjs/operators';

@Component({
    selector: 'app-motor-table',
    templateUrl: './motor-table.component.html',
    styleUrls: ['./motor-table.component.scss'],
})
export class MotorTableComponent implements OnInit, OnDestroy {
    motorThrottlesData$: Observable<number[]>;
    motorThrottlesFeedbackData$: Observable<number[]>;
    motorThrottlesCombinedData$: Observable<[number[], number[]]>;
    sub: Subscription;
    motorData: MotorThrottleInfo[] = [
        {
            throttle: 0,
            feedback: 0,
            error: 0,
        },
        {
            throttle: 0,
            feedback: 0,
            error: 0,
        },
        {
            throttle: 0,
            feedback: 0,
            error: 0,
        },
        {
            throttle: 0,
            feedback: 0,
            error: 0,
        },
        {
            throttle: 0,
            feedback: 0,
            error: 0,
        },
        {
            throttle: 0,
            feedback: 0,
            error: 0,
        },
        {
            throttle: 0,
            feedback: 0,
            error: 0,
        },
        {
            throttle: 0,
            feedback: 0,
            error: 0,
        },
    ];

    constructor(private rs: RoslibService) {}

    ngOnInit(): void {
        this.motorThrottlesData$ = this.rs.motorThrottlesData.pipe(pluck('throttles'));
        this.motorThrottlesFeedbackData$ = this.rs.motorThrottlesFeedbackData.pipe(pluck('data'));
        this.sub = combineLatest([
            this.motorThrottlesData$,
            this.motorThrottlesFeedbackData$,
        ]).subscribe(([throttles, feedback]) => {
            feedback.map((x) => (x - 1100) / 400 - 1);
            throttles.forEach((value, index) => {
                this.motorData[index].throttle = value;
                this.motorData[index].feedback = feedback[index];
                this.motorData[index].error = Math.abs(value - feedback[index]);
            });
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}

interface MotorThrottleInfo {
    throttle: number;
    feedback: number;
    error: number;
}
