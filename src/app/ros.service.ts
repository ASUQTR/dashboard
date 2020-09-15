import { Injectable } from '@angular/core';
import ROSLIB from 'roslib';
import { BehaviorSubject } from 'rxjs';

const ROS_URL = 'ws://localhost:9090';

@Injectable({
    providedIn: 'root',
})
export class RosService {
    rbServer: ROSLIB.Ros;
    stateTxt = 'Connecting to ROS server...';
    rosState = RosState.Disconnected;
    private _rosStateItemSource = new BehaviorSubject<RosState>(
        RosState.Disconnected
    );
    rosStateItem$ = this._rosStateItemSource.asObservable();

    constructor() {
        this.rbServer = new ROSLIB.Ros({
            url: ROS_URL,
        });
        this.rbServer.on('connection', () => this.connected());
        this.rbServer.on('error', () => this.errorOnConnection());
        this.rbServer.on('close', () => this.connectionClosed());
    }

    connected() {
        this.rosState = RosState.Connected;
        this.stateTxt = 'Connection to ROS server established';
        this.emitNewRosState(this.rosState);
    }

    errorOnConnection() {
        this.rosState = RosState.Error;
        this.stateTxt = 'Error during connection to ROS server';
        this.emitNewRosState(this.rosState);
    }

    connectionClosed() {
        this.rosState = RosState.Disconnected;
        this.stateTxt = 'Connection to ROS server closed';
        this.emitNewRosState(this.rosState);
    }

    emitNewRosState(newState: RosState) {
        this._rosStateItemSource.next(newState);
    }
}

export enum RosState {
    Disconnected,
    Connected,
    Error,
}
