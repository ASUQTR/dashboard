/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

import { Injectable } from '@angular/core';
import ROSLIB from 'roslib';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import {
    ControlEnableMessage,
    ControlStateFeedbackMessage,
    JoyMessage,
    MotorThrottlesMessage,
    RosoutMessage,
    RosState,
} from './ros-model.enum';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class RosService {
    rbServer: ROSLIB.Ros;
    statusText = 'Connecting to ROS server...';
    connected = RosState.Disconnected;
    private rosStateItemSource = new BehaviorSubject<RosState>(
        RosState.Disconnected
    );
    rosStateItem$ = this.rosStateItemSource.asObservable();
    private rosoutSource = new BehaviorSubject<RosoutMessage>(null);
    rosoutData = this.rosoutSource.asObservable();
    joySource = new ReplaySubject<JoyMessage>(1);
    joyData = this.joySource.asObservable();
    private motorThrottlesSource = new BehaviorSubject<MotorThrottlesMessage>(
        null
    );
    motorThrottlesData = this.motorThrottlesSource.asObservable();
    private controlModeFeedbackSource = new BehaviorSubject<
        ControlStateFeedbackMessage
    >(null);
    controlModeFeedbackData = this.controlModeFeedbackSource.asObservable();
    lqrControlSource = new ReplaySubject<boolean>(1);
    lqrControlData = this.lqrControlSource.asObservable();
    lqrEnabled: boolean;
    statusIcon: string;
    statusIconColor: string;
    connectionTimer: NodeJS.Timeout;

    constructor() {
        this.rbServer = new ROSLIB.Ros({
            url: environment.rosUrl,
        });
        this.rbServer.on('connection', () => this.onConnect());
        this.rbServer.on('error', () => this.errorOnConnection());
        this.rbServer.on('close', () => this.connectionClosed());
    }

    private onConnect() {
        if (this.connectionTimer) {
            clearInterval(this.connectionTimer);
        }
        this.connected = RosState.Connected;
        this.statusText = 'Connection to ROS server established';
        this.statusIcon = 'checkmark-circle-2';
        this.statusIconColor = 'success';
        this.emitNewRosState(this.connected);
        this.subscribeAllTopics();
        this.advertiseAllTopics();
    }

    private errorOnConnection() {
        this.connected = RosState.Error;
        this.statusText = 'Error during connection to ROS server';
        this.statusIcon = 'close-circle';
        this.statusIconColor = 'danger';
        this.emitNewRosState(this.connected);
        this.retryConnection();
    }

    private connectionClosed() {
        this.connected = RosState.Disconnected;
        this.statusText = 'Connection to ROS server closed';
        this.statusIcon = 'close-circle';
        this.statusIconColor = 'danger';
        this.emitNewRosState(this.connected);
        this.retryConnection();
    }

    subscribeAllTopics(): void {
        const rosout = new ROSLIB.Topic({
            ros: this.rbServer,
            name: '/rosout',
            messageType: 'rosgraph_msgs/Log',
        });
        rosout.subscribe((msg) => {
            this.emitRosoutMessage(msg);
        });

        const motorThrottles = new ROSLIB.Topic({
            ros: this.rbServer,
            name: '/motors',
            messageType: 'asuqtr_actuator_node/ActuatorThrottle',
        });

        motorThrottles.subscribe((msg) => {
            this.emitMotorThrottlesMessage(msg);
        });

        const controlModeFeedback = new ROSLIB.Topic({
            ros: this.rbServer,
            name: 'control/mode_feedback',
            messageType: 'std_msgs/Bool',
        });

        controlModeFeedback.subscribe((msg) => {
            this.emitControlModeFeedbackMessage(msg);
        });
    }

    advertiseAllTopics(): void {
        const joy = new ROSLIB.Topic({
            ros: this.rbServer,
            name: '/joy',
            messageType: 'sensor_msgs/Joy',
        });
        joy.advertise();
        this.joyData.subscribe((joyData) => {
            joy.publish(joyData);
        });

        const enableLQR = new ROSLIB.Topic({
            ros: this.rbServer,
            name: 'control/switch',
            messageType: 'std_msgs/Bool',
        });
        enableLQR.advertise();
        this.lqrControlData.subscribe((enableLQRData) => {
            if (this.lqrEnabled !== enableLQRData) {
                const newDataLQREnable: ControlEnableMessage = {
                    data: enableLQRData,
                };
                enableLQR.publish(newDataLQREnable);
                this.lqrEnabled = enableLQRData;
            }
        });
    }

    private emitRosoutMessage(msg: any) {
        this.rosoutSource.next(msg);
    }

    private retryConnection() {
        this.connectionTimer = setInterval(
            () => this.rbServer.connect(environment.rosUrl),
            1000
        );
    }

    private emitNewRosState(newState: RosState) {
        this.rosStateItemSource.next(newState);
    }

    private emitMotorThrottlesMessage(msg: any) {
        this.motorThrottlesSource.next(msg);
    }

    private emitControlModeFeedbackMessage(msg: any) {
        this.controlModeFeedbackSource.next(msg);
    }
}
