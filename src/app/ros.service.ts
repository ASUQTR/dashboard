import { Time } from '@angular/common';
import { Injectable } from '@angular/core';
import ROSLIB from 'roslib';
import { BehaviorSubject } from 'rxjs';
import { RosState } from './ros-state.enum';

const ROS_URL = 'ws://172.29.189.102:9090';

@Injectable({
    providedIn: 'root',
})
export class RosService {
    rbServer: ROSLIB.Ros;
    statusText = 'Connecting to ROS server...';
    connected = RosState.Disconnected;
    private _rosStateItemSource = new BehaviorSubject<RosState>(
        RosState.Disconnected
    );
    rosStateItem$ = this._rosStateItemSource.asObservable();
    private _rosoutSource = new BehaviorSubject<any>(null);
    rosoutData = this._rosoutSource.asObservable();
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

    onConnect() {
        if (this.connectionTimer) clearInterval(this.connectionTimer);
        this.connected = RosState.Connected;
        this.statusText = 'Connection to ROS server established';
        this.statusIcon = 'checkmark-circle-2';
        this.statusIconColor = 'success';
        this.emitNewRosState(this.connected);
        this.subscribeAllTopics();
    }

    errorOnConnection() {
        this.connected = RosState.Error;
        this.statusText = 'Error during connection to ROS server';
        this.statusIcon = 'close-circle';
        this.statusIconColor = 'danger';
        this.emitNewRosState(this.connected);
        this.retryConnection();
    }

    connectionClosed() {
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

    emitRosoutMessage(msg: any) {
        this._rosoutSource.next(msg);
    }

    retryConnection() {
        this.connectionTimer = setInterval(
            () => this.rbServer.connect(ROS_URL),
            1000
        );
    }

    emitNewRosState(newState: RosState) {
        this._rosStateItemSource.next(newState);
    }
}

export class RosoutMessage {
    header: RosMsgHeader;
    level: RosoutLevel;
    name: string;
    msg: string;
    file: string;
    func: string;
    line: number;
    topics: string[];
    constructor(
        header: RosMsgHeader,
        level: RosoutLevel,
        name: string,
        msg: string,
        file: string,
        func: string,
        line: number,
        topics: Array<string>
    ) {
        this.header = header;
        this.level = level;
        this.name = name;
        this.msg = msg;
        this.file = file;
        this.func = func;
        this.line = line;
        this.topics = topics;
    }
}

export class RosMsgHeader {
    seq: number;
    stamp: Time;
    frame_id: string;
    constructor(seq: number, stamp: Time, frame_id: string) {
        this.seq = seq;
        this.stamp = stamp;
        this.frame_id = frame_id;
    }
}

export enum RosoutLevel {
    DEBUG = 1,
    INFO = 2,
    WARN = 4,
    ERROR = 8,
    FATAL = 16,
}
