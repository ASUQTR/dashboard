/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada.
 * All rights reserved.
 */

import { Injectable } from '@angular/core';
import ROSLIB from 'roslib';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import {
    ControlInfoMessage,
    ControlLoopTimeMessage,
    LqrActiveFeedbackMessage,
    ControlSwitchMessage,
    DepthMessage,
    ImuMessage,
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
import { getReasonPhrase } from 'http-status-codes';

@Injectable({
    providedIn: 'root',
})
export class RosService {
    rbServer: ROSLIB.Ros;
    statusText = 'Connecting to ROS server...';
    connected = RosState.Disconnected;
    joySource = new ReplaySubject<JoyMessage>(1);
    joyData = this.joySource.asObservable();
    behaviorKillSwitchSource = new Subject<void>();
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
    private lqrActiveFeedbackSource = new BehaviorSubject<LqrActiveFeedbackMessage>(null);
    lqrActiveFeedbackData = this.lqrActiveFeedbackSource.asObservable();
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
    private nodesListSource = new Subject<string[]>();
    nodesListData = this.nodesListSource.asObservable();
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
    private imuSource = new Subject<ImuMessage>();
    imuData = this.imuSource.asObservable();
    imuMockSource = new Subject<ImuMessage>();

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

        const lqrActiveFeedback = new ROSLIB.Topic({
            ros: this.rbServer,
            name: '/control/lqr_active_feedback',
            messageType: 'std_msgs/Bool',
        });

        lqrActiveFeedback.subscribe((msg) => {
            this.emitLqrActiveFeedbackMessage(msg);
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
            name: '/pod_node/battery_leak_driver',
            messageType: 'std_msgs/Bool',
        });

        leakDriver.subscribe((msg) => this.emitLeakDriverMessage(msg));

        const leakHelper = new ROSLIB.Topic({
            ros: this.rbServer,
            name: '/pod_node/battery_leak_helper',
            messageType: 'std_msgs/Bool',
        });

        leakHelper.subscribe((msg) => this.emitLeakHelperMessage(msg));

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

        const imuData = new ROSLIB.Topic({
            ros: this.rbServer,
            name: '/vectornav/IMU',
            messageType: 'sensor_msgs/Imu',
        });

        imuData.subscribe((msg) => this.emitImuMessage(msg));
    }

    advertiseAllTopics(): void {
        const joy = new ROSLIB.Topic({
            ros: this.rbServer,
            name: '/dashboard/gamepad',
            messageType: 'sensor_msgs/Joy',
        });
        joy.advertise();
        this.joyData.subscribe((joyData) => {
            joy.publish(joyData);
        });

        const killSwitchBehavior = new ROSLIB.Topic({
            ros: this.rbServer,
            name: '/flexbe/commands/preempt',
            messageType: 'std_msgs/Empty',
        });
        killSwitchBehavior.advertise();

        this.behaviorKillSwitchSource.subscribe(() => {
            const msg = {};
            killSwitchBehavior.publish(msg);
        });

        const imu = new ROSLIB.Topic({
            ros: this.rbServer,
            name: '/vectornav/IMU',
            messageType: 'sensor_msgs/Imu',
        });

        imu.advertise();

        this.imuMockSource.subscribe((msg: ImuMessage) => {
            imu.publish(msg);
        });
    }

    changeLqrAngleThreshold(newThreshold: number): void {
        const changeLqrAngleThresholdService = new ROSLIB.Service({
            ros: this.rbServer,
            name: '/control/update_angle_threshold',
            serviceType: 'asuqtr_control_node/UpdateAngleThreshold',
        });

        const request = new ROSLIB.ServiceRequest({
            factor: newThreshold,
        });

        changeLqrAngleThresholdService.callService(
            request,
            (res) => this.changeLqrAngleThresholdServicePosResponse(res.status),
            (err) => this.changeLqrAngleThresholdServiceError(err)
        );
    }

    changeLqrPositionThreshold(newThreshold: number): void {
        const changeLqrPositionThresholdService = new ROSLIB.Service({
            ros: this.rbServer,
            name: '/control/update_position_threshold',
            serviceType: 'asuqtr_control_node/UpdatePosThreshold',
        });

        const request = new ROSLIB.ServiceRequest({
            factor: newThreshold,
        });

        changeLqrPositionThresholdService.callService(
            request,
            (res) => this.changeLqrPositionThresholdServicePosResponse(res.status),
            (err) => this.changeLqrPositionThresholdServiceError(err)
        );
    }

    changeMotorsPwmOffsetFactor(newOffset: number): void {
        const changeMotorsPwmOffsetService = new ROSLIB.Service({
            ros: this.rbServer,
            name: '/motors/update_pwm_offset',
            serviceType: 'asuqtr_actuator_node/UpdatePwmOffset',
        });

        const request = new ROSLIB.ServiceRequest({
            factor: newOffset,
        });

        changeMotorsPwmOffsetService.callService(
            request,
            (res) => this.changeMotorsPwmOffsetServicePosResponse(res.status),
            (err) => this.changeMotorsPwmOffsetServiceError(err)
        );
    }

    changeLqrRate(newRate: number): void {
        const changeLqrRateService = new ROSLIB.Service({
            ros: this.rbServer,
            name: '/control/update_max_lqr_rate',
            serviceType: 'asuqtr_control_node/UpdateMaxLqrRate',
        });

        const request = new ROSLIB.ServiceRequest({
            factor: newRate,
        });

        changeLqrRateService.callService(
            request,
            (res) => this.changeLqrRateServicePosResponse(res.status),
            (err) => this.changeLqrRateServiceError(err)
        );
    }

    changeLqrActionServerRate(newRate: number): void {
        const changeLqrActionServerRateService = new ROSLIB.Service({
            ros: this.rbServer,
            name: '/control/update_action_server_rate',
            serviceType: 'asuqtr_control_node/UpdateAsRate',
        });

        const request = new ROSLIB.ServiceRequest({
            factor: newRate,
        });

        changeLqrActionServerRateService.callService(
            request,
            (res) => this.changeLqrActionServerRateServicePosResponse(res.status),
            (err) => this.changeLqrActionServerRateServiceError(err)
        );
    }

    changeLqrAttenuationFactor(newAttenuationFactor: number): void {
        const changeLqrAttenuationFactorService = new ROSLIB.Service({
            ros: this.rbServer,
            name: '/control/update_throttle_attenuation',
            serviceType: 'asuqtr_control_node/UpdateAttenuation',
        });

        const request = new ROSLIB.ServiceRequest({
            factor: newAttenuationFactor,
        });

        changeLqrAttenuationFactorService.callService(
            request,
            (res) => this.changeLqrAttenuationFactorServicePosResponse(res.status),
            (err) => this.changeLqrAttenuationFactorServiceError(err)
        );
    }

    toggleLqrControl(lqrActive: boolean): void {
        const toggleLqrService = new ROSLIB.Service({
            ros: this.rbServer,
            name: '/control/toggle_lqr_control',
            serviceType: 'asuqtr_control_node/ToggleLqr',
        });

        const request = new ROSLIB.ServiceRequest({
            lqr_active: lqrActive,
        });

        toggleLqrService.callService(
            request,
            (res) => this.toggleLqrControlServicePosResponse(res.status),
            (err) => this.toggleLqrControlServiceError(err)
        );
    }

    sendLqrParams(matrixQ: number[], matrixR: number[]): void {
        const lqrService = new ROSLIB.Service({
            ros: this.rbServer,
            name: '/tune_lqr_matrix',
            serviceType: 'asuqtr_control_node/TuneMatrix',
        });

        const request = new ROSLIB.ServiceRequest({
            Q: matrixQ,
            R: matrixR,
        });

        lqrService.callService(
            request,
            () => this.lqrParamServicePosResponse(),
            (err) => this.lqrParamServiceError(err)
        );
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

    getMotorsPwmOffset(): any {
        return new ROSLIB.Param({
            ros: this.rbServer,
            name: 'motors/pwm_offset',
        });
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
        this.getNodes();
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
        const timeNow = new Date();
        const newMsg: MotorThrottlesMessage = {
            header: {
                seq: 0,
                frame_id: '',
                stamp: {
                    secs: Math.floor(timeNow.getTime() / 1000),
                    nsecs: timeNow.getMilliseconds() * 1000000,
                },
            },
            ids: msg.ids,
            throttles: msg.throttles,
        };
        this.motorThrottlesSource.next(newMsg);
    }

    private emitLqrActiveFeedbackMessage(msg: any) {
        this.lqrActiveFeedbackSource.next(msg);
    }

    private getTopics() {
        if (this.connected) {
            this.rbServer.getTopics((allTopics) => {
                this.topicsListSource.next(allTopics.topics);
            });
            setTimeout(() => this.getTopics(), 2000);
        }
    }

    private getNodes() {
        if (this.connected) {
            this.rbServer.getNodes((allNodes) => this.nodesListSource.next(allNodes));
            setTimeout(() => this.getNodes(), 2000);
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

    private emitLqrStateMessage(msg: any) {
        this.controlLqrStateSource.next(msg);
    }

    private emitLqrTargetStateMessage(msg: any) {
        this.controlLqrTargetStateSource.next(msg);
    }

    private emitLqrErrorMessage(msg: any) {
        this.controlLqrErrorSource.next(msg);
    }

    private emitImuMessage(msg: any) {
        this.imuSource.next(msg);
    }

    private toggleLqrControlServicePosResponse(status: number) {
        if (status >= 200 && status < 300) {
            this.toasterService.success('Nice', 'Successfully updated new LQR params');
        } else {
            this.toasterService.danger(
                'Error ' + status + ': ' + getReasonPhrase(status),
                `Failed to toggle LQR`
            );
        }
    }

    private toggleLqrControlServiceError(err: any) {
        console.error(err);
        this.toasterService.danger(
            'Error ' + err?.status + ': ' + getReasonPhrase(err?.status),
            `Failed to toggle LQR`
        );
    }

    private changeLqrAttenuationFactorServicePosResponse(status: number) {
        if (status >= 200 && status < 300) {
            this.toasterService.success('Nice', 'Successfully updated LQR attenuation factor');
        } else {
            this.toasterService.danger(
                'Error ' + status + ': ' + getReasonPhrase(status),
                `Failed to update LQR attenuation factor`
            );
        }
    }

    private changeLqrAttenuationFactorServiceError(err: any) {
        console.error(err);
        this.toasterService.danger(
            'Error ' + err?.status + ': ' + getReasonPhrase(err?.status),
            `Failed to update LQR attenuation factor`
        );
    }

    private changeLqrPositionThresholdServicePosResponse(status: number) {
        if (status >= 200 && status < 300) {
            this.toasterService.success('Nice', 'Successfully updated LQR position threshold');
        } else {
            this.toasterService.danger(
                'Error ' + status + ': ' + getReasonPhrase(status),
                `Failed to update LQR position threshold`
            );
        }
    }

    private changeLqrPositionThresholdServiceError(err: any) {
        console.error(err);
        this.toasterService.danger(
            'Error ' + err?.status + ': ' + getReasonPhrase(err?.status),
            `Failed to update LQR position threshold`
        );
    }

    private changeMotorsPwmOffsetServicePosResponse(status: number) {
        if (status >= 200 && status < 300) {
            this.toasterService.success('Nice', 'Successfully updated motors PWM offset');
        } else {
            this.toasterService.danger(
                'Error ' + status + ': ' + getReasonPhrase(status),
                `Failed to update motors PWM offset`
            );
        }
    }

    private changeMotorsPwmOffsetServiceError(err: any) {
        console.error(err);
        this.toasterService.danger(
            'Error ' + err?.status + ': ' + getReasonPhrase(err?.status),
            `Failed to update motors PWM offset`
        );
    }

    private changeLqrAngleThresholdServicePosResponse(status: number) {
        if (status >= 200 && status < 300) {
            this.toasterService.success('Nice', 'Successfully updated LQR angle threshold');
        } else {
            this.toasterService.danger(
                'Error ' + status + ': ' + getReasonPhrase(status),
                `Failed to update LQR angle threshold`
            );
        }
    }

    private changeLqrAngleThresholdServiceError(err: any) {
        console.error(err);
        this.toasterService.danger(
            'Error ' + err?.status + ': ' + getReasonPhrase(err?.status),
            `Failed to update LQR angle threshold`
        );
    }

    private changeLqrRateServicePosResponse(status: number) {
        if (status >= 200 && status < 300) {
            this.toasterService.success('Nice', 'Successfully updated LQR loop rate');
        } else {
            this.toasterService.danger(
                'Error ' + status + ': ' + getReasonPhrase(status),
                `Failed to update LQR loop rate`
            );
        }
    }

    private changeLqrRateServiceError(err: any) {
        console.error(err);
        this.toasterService.danger(
            'Error ' + err?.status + ': ' + getReasonPhrase(err?.status),
            `Failed to update LQR loop rate`
        );
    }

    private changeLqrActionServerRateServicePosResponse(status: number) {
        if (status >= 200 && status < 300) {
            this.toasterService.success('Nice', 'Successfully updated LQR action server rate');
        } else {
            this.toasterService.danger(
                'Error ' + status + ': ' + getReasonPhrase(status),
                `Failed to update LQR action server rate`
            );
        }
    }

    private changeLqrActionServerRateServiceError(err: any) {
        console.error(err);
        this.toasterService.danger(
            'Error ' + err?.status + ': ' + getReasonPhrase(err?.status),
            `Failed to update LQR action server rate`
        );
    }

    private lqrParamServicePosResponse() {
        this.toasterService.success('Nice', 'Successfully updated new LQR params');
    }

    private lqrParamServiceError(err: any) {
        console.error(err);
        this.toasterService.danger(
            'Error ' + err.status + ': ' + getReasonPhrase(err.status),
            `Failed to save LQR params config`
        );
    }
}
