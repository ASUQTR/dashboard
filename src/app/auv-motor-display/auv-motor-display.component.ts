/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RosService } from '../ros.service';
import { MotorThrottlesMessage } from '../ros-model.enum';

@Component({
    selector: 'app-auv-motor-display',
    templateUrl: './auv-motor-display.component.html',
    styleUrls: ['./auv-motor-display.component.scss'],
})
export class AuvMotorDisplayComponent implements OnInit, OnDestroy {
    motors = new Array<MotorDisplay>();
    private motorThrottlesDataSubscription: Subscription;

    constructor(public rs: RosService) {}

    /**
     * Init function to initialize the motors object array and to subscribe to the motorThrottle Subject coming from the RosService
     * (/motors topic)
     */
    ngOnInit(): void {
        this.motors.push(
            { fillOpacity: 0, forwardIntensity: 0, backwardIntensity: 0 },
            { fillOpacity: 0, forwardIntensity: 0, backwardIntensity: 0 },
            { fillOpacity: 0, forwardIntensity: 0, backwardIntensity: 0 },
            { fillOpacity: 0, forwardIntensity: 0, backwardIntensity: 0 },
            { fillOpacity: 0, forwardIntensity: 0, backwardIntensity: 0 },
            { fillOpacity: 0, forwardIntensity: 0, backwardIntensity: 0 },
            { fillOpacity: 0, forwardIntensity: 0, backwardIntensity: 0 },
            { fillOpacity: 0, forwardIntensity: 0, backwardIntensity: 0 }
        );
        this.motorThrottlesDataSubscription = this.rs.motorThrottlesData.subscribe(
            (motorThrottles) => {
                if (motorThrottles) {
                    this.extractMotorThrottlesData(motorThrottles);
                }
            }
        );
    }

    /**
     * Converts the motor throttle data into usable forward/backward values to correctly display the data from the Motors topic
     * @param motorThrottles Motors topic data coming from the RosService
     */
    extractMotorThrottlesData(motorThrottles: MotorThrottlesMessage): void {
        for (let index = 0; index < motorThrottles.throttles.length; index++) {
            const intensity = motorThrottles.throttles[index];
            this.motors[index].forwardIntensity = intensity > 0 ? intensity : 0;
            this.motors[index].backwardIntensity =
                intensity < 0 ? intensity * -1 : 0;
            this.motors[index].fillOpacity = (Math.abs(intensity) * 4) / 3;
        }
    }

    ngOnDestroy(): void {
        this.motorThrottlesDataSubscription.unsubscribe();
    }
}

/**
 * Private interface to help displaying the motor throttles
 */
interface MotorDisplay {
    fillOpacity: number;
    forwardIntensity: number;
    backwardIntensity: number;
}
