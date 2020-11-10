/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada.
 * All rights reserved.
 */

import { Injectable } from '@angular/core';
import ROSLIB from 'roslib';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import {
    ControlEnableMessage,
    ControlInfoMessage,
    ControlLoopTimeMessage,
    ControlStateFeedbackMessage,
    DepthMessage,
    JoyMessage,
    LeakSensorMessage,
    MotorThrottlesFeedbackMessage,
    MotorThrottlesMessage,
    PcbTempMessage,
    RosoutMessage,
    RosState,
} from './ros-model.enum';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { NbToastrService } from '@nebular/theme';

@Injectable({
    providedIn: 'root',
})
export class RosService {
    rbServer: ROSLIB.Ros;
    statusText = 'Connecting to ROS server...';
    connected = RosState.Disconnected;
    joySource = new ReplaySubject<JoyMessage>(1);
    joyData = this.joySource.asObservable();
    lqrControlSource = new ReplaySubject<boolean>(1);
    lqrControlData = this.lqrControlSource.asObservable();
    lqrEnabled: boolean;
    statusIcon: string;
    statusIconColor: string;
    connectionTimer: NodeJS.Timeout;
    private rosStateItemSource = new BehaviorSubject<RosState>(RosState.Disconnected);
    rosStateItem$ = this.rosStateItemSource.asObservable();
    private rosoutSource = new ReplaySubject<RosoutMessage>(); // Will replay all rosout message at subscribe
    rosoutData = this.rosoutSource.asObservable();
    private motorThrottlesSource = new BehaviorSubject<MotorThrottlesMessage>({
        header: {},
        ids: [0, 0, 0, 0, 0, 0, 0, 0],
        throttles: [0, 0, 0, 0, 0, 0, 0, 0],
    });
    motorThrottlesData = this.motorThrottlesSource.asObservable();
    private motorThrottlesFeedbackSource = new BehaviorSubject<MotorThrottlesFeedbackMessage>({
        header: {},
        data: [0, 0, 0, 0, 0, 0, 0, 0],
    });
    motorThrottlesFeedbackData = this.motorThrottlesFeedbackSource.asObservable();
    private controlModeFeedbackSource = new BehaviorSubject<ControlStateFeedbackMessage>(null);
    controlModeFeedbackData = this.controlModeFeedbackSource.asObservable();
    private controlLqrLoopTimeSource = new BehaviorSubject<ControlLoopTimeMessage>({
        data: 0,
    });
    controlLqrLoopTimeData = this.controlLqrLoopTimeSource.asObservable();
    private controlLqrStateSource = new BehaviorSubject<ControlInfoMessage>({
        header: {},
        data: [0, 0, 0, 0, 0, 0],
    });
    controlLqrStateData = this.controlLqrStateSource.asObservable();
    private controlLqrTargetStateSource = new BehaviorSubject<ControlInfoMessage>({
        header: {},
        data: [0, 0, 0, 0, 0, 0],
    });
    controlLqrTargetStateData = this.controlLqrTargetStateSource.asObservable();
    private controlLqrErrorSource = new BehaviorSubject<ControlInfoMessage>({
        header: {},
        data: [0, 0, 0, 0, 0, 0],
    });
    controlLqrErrorData = this.controlLqrErrorSource.asObservable();
    private topicsListSource = new BehaviorSubject<string[]>(null);
    topicsListData = this.topicsListSource.asObservable();
    private depthSource = new BehaviorSubject<DepthMessage>({
        data: 0,
    });
    depthData = this.depthSource.asObservable();
    private pcbTempSource = new BehaviorSubject<PcbTempMessage>({
        data: 0,
    });
    pcbTempData = this.pcbTempSource.asObservable();
    private leakSensorDriverSource = new BehaviorSubject<LeakSensorMessage>({
        data: false,
    });
    leakSensorDriverData = this.leakSensorDriverSource.asObservable();
    private leakSensorHelperSource = new BehaviorSubject<LeakSensorMessage>({
        data: false,
    });
    leakSensorHelperData = this.leakSensorHelperSource.asObservable();
    private oldLeakStateDriver = false;
    private oldLeakStateHelper = false;

    constructor(private http: HttpClient, private toasterService: NbToastrService) {
        this.rbServer = new ROSLIB.Ros({
            url: environment.rosUrl,
        });
        this.rbServer.on('connection', () => this.onConnect());
        this.rbServer.on('error', () => this.errorOnConnection());
        this.rbServer.on('close', () => this.connectionClosed());
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

        const motorThrottlesFeedback = new ROSLIB.Topic({
            ros: this.rbServer,
            name: '/motors/pulses',
            messageType: 'std_msgs/Int16MultiArray',
        });

        motorThrottlesFeedback.subscribe((msg) => {
            this.emitMotorThrottlesFeedbackMessage(msg);
        });

        const controlModeFeedback = new ROSLIB.Topic({
            ros: this.rbServer,
            name: '/control/mode_feedback',
            messageType: 'std_msgs/Bool',
        });

        controlModeFeedback.subscribe((msg) => {
            this.emitControlModeFeedbackMessage(msg);
        });

        const depth = new ROSLIB.Topic({
            ros: this.rbServer,
            name: '/sensors/depth',
            messageType: 'std_msgs/Float32',
        });

        depth.subscribe((msg) => this.emitDepthMessage(msg));

        const pcbTemp = new ROSLIB.Topic({
            ros: this.rbServer,
            name: '/pcb_temp',
            messageType: 'std_msgs/Int32',
        });

        pcbTemp.subscribe((msg) => this.emitPcbTempMessage(msg));

        const leakDriver = new ROSLIB.Topic({
            ros: this.rbServer,
            name: '/power_node/battery_leak_driver',
            messageType: 'std_msgs/Bool',
        });

        leakDriver.subscribe((msg) => this.emitLeakDriverMessage(msg));

        const leakHelper = new ROSLIB.Topic({
            ros: this.rbServer,
            name: '/power_node/battery_leak_helper',
            messageType: 'std_msgs/Bool',
        });

        leakHelper.subscribe((msg) => this.emitLeakHelperMessage(msg));

        const lqrLoopTime = new ROSLIB.Topic({
            ros: this.rbServer,
            name: '/control/loop_time',
            messageType: 'std_msgs/Float32',
        });

        lqrLoopTime.subscribe((msg) => this.emitLqrLoopTimeMessage(msg));

        const lqrState = new ROSLIB.Topic({
            ros: this.rbServer,
            name: '/control/state',
            messageType: 'std_msgs/Float32MultiArray',
        });

        lqrState.subscribe((msg) => this.emitLqrStateMessage(msg));

        const lqrTargetState = new ROSLIB.Topic({
            ros: this.rbServer,
            name: '/control/target_state',
            messageType: 'std_msgs/Float32MultiArray',
        });

        lqrTargetState.subscribe((msg) => this.emitLqrTargetStateMessage(msg));

        const lqrError = new ROSLIB.Topic({
            ros: this.rbServer,
            name: '/control/lqr_error',
            messageType: 'std_msgs/Float32MultiArray',
        });

        lqrError.subscribe((msg) => this.emitLqrErrorMessage(msg));
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
            name: '/control/switch',
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

    sendLqrParams(matrixQ: number[], matrixR: number[]): void {
        const lqrParamMatrixQ = new ROSLIB.Param({
            ros: this.rbServer,
            name: 'control_node/state_cost_matrix',
        });
        const lqrParamMatrixR = new ROSLIB.Param({
            ros: this.rbServer,
            name: 'control_node/motor_cost_matrix',
        });

        lqrParamMatrixQ.set(matrixQ, (res) => {
            console.log('LQR parameters write for matrix Q response is: ', res);
        });
        lqrParamMatrixR.set(matrixR, (res) => {
            console.log('LQR parameters write for matrix R response is: ', res);
        });
    }

    getLqrParamsMatrixQ(): any {
        return new ROSLIB.Param({
            ros: this.rbServer,
            name: 'control_node/state_cost_matrix',
        });
    }

    getLqrParamsMatrixR(): any {
        return new ROSLIB.Param({
            ros: this.rbServer,
            name: 'control_node/motor_cost_matrix',
        });
    }

    restApiControlRosRemotely(start: number): Observable<any> {
        const apiUrl =
            'http://' + location.hostname + ':42069/api/remote?start=' + start.toString();
        return this.http.post(apiUrl, '', {});
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
        this.getTopics();
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

    private emitRosoutMessage(msg: any) {
        this.rosoutSource.next(msg);
    }

    private retryConnection() {
        this.connectionTimer = setInterval(() => this.rbServer.connect(environment.rosUrl), 1000);
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

    private getTopics() {
        if (this.connected) {
            this.rbServer.getTopics((allTopics) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                this.topicsListSource.next(allTopics.topics);
            });
            setTimeout(() => this.getTopics(), 2000);
        }
    }

    private emitDepthMessage(msg: any) {
        this.depthSource.next(msg);
    }

    private emitPcbTempMessage(msg: any) {
        this.pcbTempSource.next(msg);
    }

    private emitLeakDriverMessage(msg: any) {
        const newLeakState = msg?.data ?? false;
        if (newLeakState && newLeakState !== this.oldLeakStateDriver) {
            this.toasterService.danger('Leak detected in DRIVER pod', 'DANGER', {
                duration: 0,
            });
        }
        this.oldLeakStateDriver = newLeakState;
        this.leakSensorDriverSource.next(msg);
    }

    private emitLeakHelperMessage(msg: any) {
        const newLeakState = msg?.data ?? false;
        if (newLeakState && newLeakState !== this.oldLeakStateHelper) {
            this.toasterService.danger('Leak detected in HELPER pod', 'DANGER', {
                duration: 0,
            });
        }
        this.oldLeakStateHelper = newLeakState;
        this.leakSensorHelperSource.next(msg);
    }

    private emitMotorThrottlesFeedbackMessage(msg: any) {
        if (msg && msg.data.length === 8) {
            this.motorThrottlesFeedbackSource.next(msg);
        }
    }

    private emitLqrLoopTimeMessage(msg: any) {
        this.controlLqrLoopTimeSource.next(msg);
    }

    private emitLqrStateMessage(msg: any) {
        this.controlLqrStateSource.next(msg);
    }

    private emitLqrTargetStateMessage(msg: any) {
        this.controlLqrTargetStateSource.next(msg);
    }

    private emitLqrErrorMessage(msg: any) {
        this.controlLqrErrorSource.next(msg);
    }
}
