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
    statusIcon: string;
    statusIconColor: string;

    constructor() {
        this.rbServer = new ROSLIB.Ros({
            url: ROS_URL,
        });
        this.rbServer.on('connection', () => this.onConnect());
        this.rbServer.on('error', () => this.errorOnConnection());
        this.rbServer.on('close', () => this.connectionClosed());
    }

    onConnect() {
        this.connected = RosState.Connected;
        this.statusText = 'Connection to ROS server established';
        this.statusIcon = 'checkmark-circle-2';
        this.statusIconColor = 'success';
        this.emitNewRosState(this.connected);
    }

    errorOnConnection() {
        this.connected = RosState.Error;
        this.statusText = 'Error during connection to ROS server';
        this.statusIcon = 'close-circle';
        this.statusIconColor = 'danger';
        this.emitNewRosState(this.connected);
    }

    connectionClosed() {
        this.connected = RosState.Disconnected;
        this.statusText = 'Connection to ROS server closed';
        this.statusIcon = 'close-circle';
        this.statusIconColor = 'danger';
        this.emitNewRosState(this.connected);
    }

    emitNewRosState(newState: RosState) {
        this._rosStateItemSource.next(newState);
    }
}
