import { Component, OnDestroy, OnInit } from '@angular/core';
import { RoslibService } from '../../roslib.service';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { bufferCount, map } from 'rxjs/operators';

@Component({
    selector: 'app-control-lqr-debug-info',
    templateUrl: './control-lqr-debug-info.component.html',
    styleUrls: ['./control-lqr-debug-info.component.scss'],
})
export class ControlLqrDebugInfoComponent implements OnInit, OnDestroy {
    lqrAxes: LqrInfo[] = [
        {
            paramName: 'x',
            state: 0,
            targetState: 0,
            error: 0,
        },
        {
            paramName: 'y',
            state: 0,
            targetState: 0,
            error: 0,
        },
        {
            paramName: 'z',
            state: 0,
            targetState: 0,
            error: 0,
        },
        {
            paramName: 'roll',
            state: 0,
            targetState: 0,
            error: 0,
        },
        {
            paramName: 'pitch',
            state: 0,
            targetState: 0,
            error: 0,
        },
        {
            paramName: 'yaw',
            state: 0,
            targetState: 0,
            error: 0,
        },
        {
            paramName: 'u',
            state: 0,
            targetState: 0,
            error: 0,
        },
        {
            paramName: 'v',
            state: 0,
            targetState: 0,
            error: 0,
        },
        {
            paramName: 'w',
            state: 0,
            targetState: 0,
            error: 0,
        },
        {
            paramName: 'p',
            state: 0,
            targetState: 0,
            error: 0,
        },
        {
            paramName: 'q',
            state: 0,
            targetState: 0,
            error: 0,
        },
        {
            paramName: 'r',
            state: 0,
            targetState: 0,
            error: 0,
        },
    ];
    loopTime: Observable<number>;
    private sub: Subscription;

    constructor(private rs: RoslibService) {
        this.loopTime = this.rs.motorThrottlesData.pipe(bufferCount(10, 1)).pipe(
            map((throttleMessages) => {
                const startTime =
                    throttleMessages[0]?.header.stamp?.secs * 1000000000 +
                    throttleMessages[0]?.header.stamp?.nsecs;
                const endTime =
                    throttleMessages[throttleMessages.length - 1]?.header.stamp?.secs * 1000000000 +
                    throttleMessages[throttleMessages.length - 1]?.header.stamp?.nsecs;
                const totalTime = endTime - startTime;
                return 10 / (totalTime / 1000000000);
            })
        );
        this.sub = combineLatest([
            this.rs.controlLqrStateData,
            this.rs.controlLqrTargetStateData,
            this.rs.controlLqrErrorData,
        ]).subscribe(([state, targetState, error]) => {
            state?.data.forEach((value, index) => {
                if (index < 6) {
                    this.lqrAxes[index].state = value;
                    this.lqrAxes[index].targetState = targetState?.data[index];
                    this.lqrAxes[index].error = error?.data[index];
                }
            });
        });
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
}

interface LqrInfo {
    paramName: string;
    state: number;
    targetState: number;
    error: number;
}
