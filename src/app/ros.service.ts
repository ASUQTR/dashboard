/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

import { Injectable } from '@angular/core';
import ROSLIB from 'roslib';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { RosState } from './ros-state.enum';

const ROS_URL = 'ws://172.29.144.108:9090';

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
    statusIcon: string;
    statusIconColor: string;
    connectionTimer: NodeJS.Timeout;

    constructor() {
        this.rbServer = new ROSLIB.Ros({
            url: ROS_URL,
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

    subscribeAllTopics() {
        const rosout = new ROSLIB.Topic({
            ros: this.rbServer,
            name: '/rosout',
            messageType: 'rosgraph_msgs/Log',
        });
        rosout.subscribe((msg) => {
            this.emitRosoutMessage(msg);
        });
    }

    advertiseAllTopics() {
        const joy = new ROSLIB.Topic({
            ros: this.rbServer,
            name: '/joy',
            messageType: 'sensor_msgs/Joy',
        });
        joy.advertise();
        this.joyData.subscribe((joyData) => {
            joy.publish(joyData);
        });
    }

    private emitRosoutMessage(msg: any) {
        this.rosoutSource.next(msg);
    }

    private retryConnection() {
        this.connectionTimer = setInterval(
            () => this.rbServer.connect(ROS_URL),
            1000
        );
    }

    private emitNewRosState(newState: RosState) {
        this.rosStateItemSource.next(newState);
    }
}

export interface JoyMessage {
    header: RosMsgHeader;
    axes?: number[] | null;
    buttons?: number[] | null;
}

export interface RosoutMessage {
    header: RosMsgHeader;
    level?: RosoutLevel | null;
    name?: string | null;
    msg?: string | null;
    file?: string | null;
    func?: string | null;
    line?: number | null;
    topics?: string[] | null;
}

export interface RosMsgHeader {
    seq?: number | null;
    stamp?: RosTime | null;
    // tslint:disable-next-line:variable-name
    frame_id?: string | null;
}

export interface RosTime {
    secs?: number | null;
    nsecs?: number | null;
}

export enum RosoutLevel {
    DEBUG = 1,
    INFO = 2,
    WARN = 4,
    ERROR = 8,
    FATAL = 16,
}
