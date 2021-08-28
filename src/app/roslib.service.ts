/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada.
 * All rights reserved.
 */

import { Injectable } from '@angular/core';
import {
    NgxRoslibService,
    RosTopic,
    Rosbridge,
    RosoutMessage,
    RosService,
    RosParam,
} from 'ngx-roslib';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import {
    ControlInfoMessage,
    DepthMessage,
    ImuMessage,
    JoyMessage,
    LeakSensorMessage,
    LqrActiveFeedbackMessage,
    MotorThrottlesFeedbackMessage,
    MotorThrottlesMessage,
    PcbTempMessage,
    // RosoutMessage,
    RosState,
} from './ros-model.enum';
import { environment } from '../environments/environment';
import { NbToastrService } from '@nebular/theme';
import { getReasonPhrase } from 'http-status-codes';

type FactorNumber = { factor: number };

type StatusNumber = { status: number };

@Injectable({
    providedIn: 'root',
})
export class RoslibService {
    rbServer: Rosbridge;
    statusText = 'Connecting to ROS server...';
    connected = RosState.Disconnected;
    statusIcon: string;
    statusIconColor: string;
    connectionTimer: NodeJS.Timeout;
    private rosStateItemSource = new BehaviorSubject<RosState>(RosState.Disconnected);
    rosStateItem$ = this.rosStateItemSource.asObservable();
    joySource = new ReplaySubject<JoyMessage>(1);
    joyData = this.joySource.asObservable();
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
    behaviorKillSwitchSource = new Subject<void>();

    constructor(public roslibService: NgxRoslibService, private toasterService: NbToastrService) {
        this.rbServer = this.roslibService.connect(environment.rosUrl);
        this.roslibService.onOpen.subscribe(() => this.onConnect());
        this.roslibService.onClose.subscribe(() => this.connectionClosed());
        this.roslibService.onError.subscribe(() => this.errorOnConnection());
    }

    subscribeAllTopics(): void {
        this.getSimpleParam();

        const rosout = new RosTopic<RosoutMessage>({
            ros: this.rbServer,
            name: '/rosout',
            messageType: 'rosgraph_msgs/Log',
        });
        rosout.subscribe((msg) => {
            this.emitRosoutMessage(msg);
        });

        const motorThrottles = new RosTopic<MotorThrottlesMessage>({
            ros: this.rbServer,
            name: '/motors',
            messageType: 'asuqtr_actuator_node/ActuatorThrottle',
        });
        motorThrottles.subscribe((msg) => {
            this.emitMotorThrottlesMessage(msg);
        });

        const motorThrottlesFeedback = new RosTopic<MotorThrottlesFeedbackMessage>({
            ros: this.rbServer,
            name: '/motors/pulses',
            messageType: 'std_msgs/Int16MultiArray',
        });
        motorThrottlesFeedback.subscribe((msg) => {
            this.emitMotorThrottlesFeedbackMessage(msg);
        });

        const lqrActiveFeedback = new RosTopic<LqrActiveFeedbackMessage>({
            ros: this.rbServer,
            name: '/control/lqr_active_feedback',
            messageType: 'std_msgs/Bool',
        });
        lqrActiveFeedback.subscribe((msg) => {
            this.emitLqrActiveFeedbackMessage(msg);
        });

        const depth = new RosTopic<DepthMessage>({
            ros: this.rbServer,
            name: '/sensors/depth',
            messageType: 'std_msgs/Float32',
        });
        depth.subscribe((msg) => this.emitDepthMessage(msg));

        const pcbTemp = new RosTopic<PcbTempMessage>({
            ros: this.rbServer,
            name: '/pcb_temp',
            messageType: 'std_msgs/Int32',
        });
        pcbTemp.subscribe((msg) => this.emitPcbTempMessage(msg));

        const leakDriver = new RosTopic<LeakSensorMessage>({
            ros: this.rbServer,
            name: '/pod_node/battery_leak_driver',
            messageType: 'std_msgs/Bool',
        });
        leakDriver.subscribe((msg) => this.emitLeakDriverMessage(msg));

        const leakHelper = new RosTopic<LeakSensorMessage>({
            ros: this.rbServer,
            name: '/pod_node/battery_leak_helper',
            messageType: 'std_msgs/Bool',
        });
        leakHelper.subscribe((msg) => this.emitLeakHelperMessage(msg));

        const lqrState = new RosTopic<ControlInfoMessage>({
            ros: this.rbServer,
            name: '/control/state',
            messageType: 'std_msgs/Float32MultiArray',
        });
        lqrState.subscribe((msg) => this.emitLqrStateMessage(msg));

        const lqrTargetState = new RosTopic<ControlInfoMessage>({
            ros: this.rbServer,
            name: '/control/target_state',
            messageType: 'std_msgs/Float32MultiArray',
        });
        lqrTargetState.subscribe((msg) => this.emitLqrTargetStateMessage(msg));

        const lqrError = new RosTopic<ControlInfoMessage>({
            ros: this.rbServer,
            name: '/control/lqr_error',
            messageType: 'std_msgs/Float32MultiArray',
        });
        lqrError.subscribe((msg) => this.emitLqrErrorMessage(msg));

        const imuData = new RosTopic<ImuMessage>({
            ros: this.rbServer,
            name: '/vectornav/IMU',
            messageType: 'sensor_msgs/Imu',
        });
        imuData.subscribe((msg) => this.emitImuMessage(msg));
    }

    private emitRosoutMessage(msg: RosoutMessage) {
        this.rosoutSource.next(msg);
    }

    advertiseAllTopics(): void {
        const joy = new RosTopic<JoyMessage>({
            ros: this.rbServer,
            name: '/dashboard/gamepad',
            messageType: 'sensor_msgs/Joy',
        });
        joy.advertise();
        this.joyData.subscribe((joyData) => {
            joy.publish(joyData);
        });

        const killSwitchBehavior = new RosTopic<unknown>({
            ros: this.rbServer,
            name: '/flexbe/commands/preempt',
            messageType: 'std_msgs/Empty',
        });
        killSwitchBehavior.advertise();

        this.behaviorKillSwitchSource.subscribe(() => {
            const msg = {};
            killSwitchBehavior.publish(msg);
        });

        const imu = new RosTopic<ImuMessage>({
            ros: this.rbServer,
            name: '/vectornav/IMU',
            messageType: 'sensor_msgs/Imu',
        });

        imu.advertise();

        this.imuMockSource.subscribe((msg: ImuMessage) => {
            imu.publish(msg);
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
        setTimeout(() => this.toggleLqrControl(false), 1000);
    }

    private getTopics() {
        if (this.connected) {
            this.rbServer.getTopics((allTopics) => {
                this.topicsListSource.next(allTopics);
            });
            setTimeout(() => this.getTopics(), 2000);
        }
    }

    private getNodes() {
        if (this.connected) {
            this.rbServer.getNodes((allNodes) => {
                this.nodesListSource.next(allNodes);
            });
            setTimeout(() => this.getNodes(), 2000);
        }
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

    private retryConnection() {
        this.connectionTimer = setInterval(() => this.rbServer.connect(environment.rosUrl), 1000);
    }

    getSimpleParam() {
        const param = new RosParam<number>({
            ros: this.rbServer,
            name: '/rosbridge_websocket/port',
        });

        param.get((res) => {
            console.log(res);
        });
    }

    getLqrParamsMatrixQ(): RosParam<number[]> {
        return new RosParam<number[]>({
            ros: this.rbServer,
            name: 'control_node/state_cost_matrix',
        });
    }

    getLqrParamsMatrixR(): RosParam<number[]> {
        return new RosParam<number[]>({
            ros: this.rbServer,
            name: 'control_node/motor_cost_matrix',
        });
    }

    getMotorsPwmOffset(): RosParam<number> {
        return new RosParam<number>({
            ros: this.rbServer,
            name: 'motors/pwm_offset',
        });
    }

    changeLqrAngleThreshold(newThreshold: number): void {
        const changeLqrAngleThresholdService = new RosService<FactorNumber, StatusNumber>({
            ros: this.rbServer,
            name: '/control/update_angle_threshold',
            serviceType: 'asuqtr_control_node/UpdateAngleThreshold',
        });

        changeLqrAngleThresholdService.call(
            {
                factor: newThreshold,
            },
            (res) => this.changeLqrAngleThresholdServicePosResponse(res.status),
            (err) => this.changeLqrAngleThresholdServiceError(err)
        );
    }

    changeLqrPositionThreshold(newThreshold: number): void {
        const changeLqrPositionThresholdService = new RosService<FactorNumber, StatusNumber>({
            ros: this.rbServer,
            name: '/control/update_position_threshold',
            serviceType: 'asuqtr_control_node/UpdatePosThreshold',
        });

        changeLqrPositionThresholdService.call(
            {
                factor: newThreshold,
            },
            (res) => this.changeLqrPositionThresholdServicePosResponse(res.status),
            (err) => this.changeLqrPositionThresholdServiceError(err)
        );
    }

    changeMotorsPwmOffsetFactor(newOffset: number): void {
        const changeMotorsPwmOffsetService = new RosService<FactorNumber, StatusNumber>({
            ros: this.rbServer,
            name: '/motors/update_pwm_offset',
            serviceType: 'asuqtr_actuator_node/UpdatePwmOffset',
        });

        changeMotorsPwmOffsetService.call(
            {
                factor: newOffset,
            },
            (res) => this.changeMotorsPwmOffsetServicePosResponse(res.status),
            (err) => this.changeMotorsPwmOffsetServiceError(err)
        );
    }

    changeLqrRate(newRate: number): void {
        const changeLqrRateService = new RosService<FactorNumber, StatusNumber>({
            ros: this.rbServer,
            name: '/control/update_max_lqr_rate',
            serviceType: 'asuqtr_control_node/UpdateMaxLqrRate',
        });

        changeLqrRateService.call(
            {
                factor: newRate,
            },
            (res) => this.changeLqrRateServicePosResponse(res.status),
            (err) => this.changeLqrRateServiceError(err)
        );
    }

    changeLqrActionServerRate(newRate: number): void {
        const changeLqrActionServerRateService = new RosService<FactorNumber, StatusNumber>({
            ros: this.rbServer,
            name: '/control/update_action_server_rate',
            serviceType: 'asuqtr_control_node/UpdateAsRate',
        });

        changeLqrActionServerRateService.call(
            {
                factor: newRate,
            },
            (res) => this.changeLqrActionServerRateServicePosResponse(res.status),
            (err) => this.changeLqrActionServerRateServiceError(err)
        );
    }

    changeLqrAttenuationFactor(newAttenuationFactor: number): void {
        const changeLqrAttenuationFactorService = new RosService<FactorNumber, StatusNumber>({
            ros: this.rbServer,
            name: '/control/update_throttle_attenuation',
            serviceType: 'asuqtr_control_node/UpdateAttenuation',
        });

        changeLqrAttenuationFactorService.call(
            {
                factor: newAttenuationFactor,
            },
            (res) => this.changeLqrAttenuationFactorServicePosResponse(res.status),
            (err) => this.changeLqrAttenuationFactorServiceError(err)
        );
    }

    toggleLqrControl(lqrActive: boolean): void {
        const toggleLqrService = new RosService<{ lqr_active: boolean }, StatusNumber>({
            ros: this.rbServer,
            name: '/control/toggle_lqr_control',
            serviceType: 'asuqtr_control_node/ToggleLqr',
        });

        toggleLqrService.call(
            {
                lqr_active: lqrActive,
            },
            (res) => this.toggleLqrControlServicePosResponse(res.status),
            (err) => this.toggleLqrControlServiceError(err)
        );
    }

    sendLqrParams(matrixQ: number[], matrixR: number[]): void {
        const lqrService = new RosService<{ Q: number[]; R: number[] }, {}>({
            ros: this.rbServer,
            name: '/tune_lqr_matrix',
            serviceType: 'asuqtr_control_node/TuneMatrix',
        });

        lqrService.call(
            {
                Q: matrixQ,
                R: matrixR,
            },
            () => this.lqrParamServicePosResponse(),
            (err) => this.lqrParamServiceError(err)
        );
    }

    private emitNewRosState(newState: RosState) {
        this.rosStateItemSource.next(newState);
    }

    private emitMotorThrottlesMessage(msg: any) {
        this.motorThrottlesSource.next(msg);
    }

    private emitLqrActiveFeedbackMessage(msg: any) {
        this.lqrActiveFeedbackSource.next(msg);
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

    private toggleLqrControlServiceError(err: string) {
        this.toasterService.danger('Error: ' + err, `Failed to toggle LQR`);
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

    private changeLqrAttenuationFactorServiceError(err: string) {
        this.toasterService.danger('Error: ' + err, `Failed to update LQR attenuation factor`);
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

    private changeLqrPositionThresholdServiceError(err: string) {
        this.toasterService.danger('Error: ' + err, `Failed to update LQR position threshold`);
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

    private changeMotorsPwmOffsetServiceError(err: string) {
        this.toasterService.danger('Error: ' + err, `Failed to update motors PWM offset`);
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

    private changeLqrAngleThresholdServiceError(err: string) {
        this.toasterService.danger('Error: ' + err, `Failed to update LQR angle threshold`);
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

    private changeLqrRateServiceError(err: string) {
        this.toasterService.danger('Error: ' + err, `Failed to update LQR loop rate`);
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

    private changeLqrActionServerRateServiceError(err: string) {
        this.toasterService.danger('Error: ' + err, `Failed to update LQR action server rate`);
    }

    private lqrParamServicePosResponse() {
        this.toasterService.success('Nice', 'Successfully updated new LQR params');
    }

    private lqrParamServiceError(err: string) {
        this.toasterService.danger('Error: ' + err, `Failed to save LQR params config`);
    }
}
