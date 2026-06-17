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
    JoyMessage,
    ImuMessage,
    Vector3Message,
    PointStampedMessage,
} from 'ngx-roslib';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import {
    ControlInfoMessage,
    DepthMessage,
    Float64MultiArrayMessage,
    LeakSensorMessage,
    LqrActiveFeedbackMessage,
    MotorThrottlesFeedbackMessage,
    MotorThrottlesMessage,
    PcbTempMessage,
    PoseStampedMessage,
    RosState,
    TwistWithCovarianceStampedMessage,
} from './ros-model.enum';
import { environment } from '../environments/environment';
import { NbToastrService } from '@nebular/theme';
import { getReasonPhrase } from 'http-status-codes';

type FactorNumber = { factor: number };

type StatusNumber = { status: number };

type Valid = { valid: boolean };

type AllTagsServiceResponse = { name_tags: string[]; positions: Vector3Message[] };

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
        data: false,
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
    private getPositionSource = new Subject<Vector3Message>();
    getPositionData = this.getPositionSource.asObservable();
    private currentPositionSource = new Subject<Vector3Message>();
    currentPositionData = this.currentPositionSource.asObservable();
    private tagRequestsSource = new Subject<string>();
    tagRequestsData = this.tagRequestsSource.asObservable();
    private lqrVelocitySource = new BehaviorSubject<Float64MultiArrayMessage>({ data: [] });
    lqrVelocityData = this.lqrVelocitySource.asObservable();
    private lqrAccelCmdSource = new BehaviorSubject<Float64MultiArrayMessage>({ data: [] });
    lqrAccelCmdData = this.lqrAccelCmdSource.asObservable();
    private lqrDynamicsSource = new BehaviorSubject<Float64MultiArrayMessage>({ data: [] });
    lqrDynamicsData = this.lqrDynamicsSource.asObservable();
    private dvlVelocitiesSource = new BehaviorSubject<TwistWithCovarianceStampedMessage>({});
    dvlVelocitiesData = this.dvlVelocitiesSource.asObservable();
    private dvlAltitudeSource = new BehaviorSubject<PoseStampedMessage>({});
    dvlAltitudeData = this.dvlAltitudeSource.asObservable();
    private killSwitchSource = new BehaviorSubject<LeakSensorMessage>({ data: false });
    killSwitchData = this.killSwitchSource.asObservable();
    private magneticSwitch2Source = new BehaviorSubject<LeakSensorMessage>({ data: false });
    magneticSwitch2Data = this.magneticSwitch2Source.asObservable();
    private magneticSwitch3Source = new BehaviorSubject<LeakSensorMessage>({ data: false });
    magneticSwitch3Data = this.magneticSwitch3Source.asObservable();

    constructor(public roslibService: NgxRoslibService, private toasterService: NbToastrService) {
        this.rbServer = this.roslibService.connect(environment.rosUrl);
        this.roslibService.onOpen.subscribe(() => this.onConnect());
        this.roslibService.onClose.subscribe(() => this.connectionClosed());
        this.roslibService.onError.subscribe(() => this.errorOnConnection());
    }

    subscribeAllTopics(): void {
        const rosout = new RosTopic<RosoutMessage>({
            ros: this.rbServer,
            name: '/rosout',
            messageType: 'rosgraph_msgs/Log',
        });
        rosout.subscribe((msg) => {
            this.emitRosoutMessage(msg);
        });

        // Motor throttles — topic and type renamed in ROS2 rewrite
        // was: /actuator/motors (asuqtr_actuator_node/ActuatorThrottle)
        const motorThrottles = new RosTopic({
            ros: this.rbServer,
            name: 'thruster_cmd',
            messageType: 'sub_interfaces/ThrusterCommand',
        });
        motorThrottles.subscribe((msg) => this.emitMotorThrottlesMessage(msg));
        // /motors/pulses (motor encoder feedback) removed — no equivalent in ROS2
        // /control/lqr_active_feedback removed — no equivalent in ROS2 control_node

        // Depth sensor — topic renamed, now published as nav_msgs/Odometry
        // was: /sensors/depth (std_msgs/Float32)
        const depth = new RosTopic({
            ros: this.rbServer,
            name: 'depth',
            messageType: 'nav_msgs/Odometry',
        });
        depth.subscribe((msg) => this.emitDepthMessage(msg));

        // Temperature alert — now a boolean GPIO signal, not a temperature value
        // was: /pcb_temp (std_msgs/Int32)
        const tempAlert = new RosTopic({
            ros: this.rbServer,
            name: 'temperature_alert',
            messageType: 'std_msgs/Bool',
        });
        tempAlert.subscribe((msg) => this.emitPcbTempMessage(msg));

        // Water leak — consolidated to single sensor
        // was: /pod_node/battery_leak_driver + /pod_node/battery_leak_helper (ROS1, removed)
        const waterLeak = new RosTopic({
            ros: this.rbServer,
            name: 'water_leak',
            messageType: 'std_msgs/Bool',
        });
        waterLeak.subscribe((msg) => this.emitLeakDriverMessage(msg));
        // leakSensorHelperSource stays at default false — only one water leak sensor in ROS2

        // Odometry — provides current state (position + orientation + velocity) and nav position
        // replaces: /control/state (Float32MultiArray) + /nav_node/position (PointStamped)
        const odometry = new RosTopic({
            ros: this.rbServer,
            name: 'odometry/filtered',
            messageType: 'nav_msgs/Odometry',
        });
        odometry.subscribe((msg) => this.emitOdometryMessage(msg));
        // /control/target_state removed — control_node no longer publishes a target state topic

        // LQR angle debug — closest equivalent to old /control/lqr_error
        // was: /control/lqr_error (std_msgs/Float32MultiArray)
        const lqrAngles = new RosTopic({
            ros: this.rbServer,
            name: 'debug/lqr_angles',
            messageType: 'std_msgs/Float64MultiArray',
        });
        lqrAngles.subscribe((msg) => this.emitLqrErrorMessage(msg));

        const imuData = new RosTopic<ImuMessage>({
            ros: this.rbServer,
            name: '/vectornav/IMU',
            messageType: 'sensor_msgs/Imu',
        });
        imuData.subscribe((msg) => this.emitImuMessage(msg));

        const lqrVelocity = new RosTopic<Float64MultiArrayMessage>({
            ros: this.rbServer,
            name: 'debug/lqr_velocity',
            messageType: 'std_msgs/Float64MultiArray',
        });
        lqrVelocity.subscribe((msg) => this.lqrVelocitySource.next(msg));

        const lqrAccelCmd = new RosTopic<Float64MultiArrayMessage>({
            ros: this.rbServer,
            name: 'debug/lqr_accel_cmd',
            messageType: 'std_msgs/Float64MultiArray',
        });
        lqrAccelCmd.subscribe((msg) => this.lqrAccelCmdSource.next(msg));

        const lqrDynamics = new RosTopic<Float64MultiArrayMessage>({
            ros: this.rbServer,
            name: 'debug/lqr_dynamics',
            messageType: 'std_msgs/Float64MultiArray',
        });
        lqrDynamics.subscribe((msg) => this.lqrDynamicsSource.next(msg));

        const dvlVelocities = new RosTopic<TwistWithCovarianceStampedMessage>({
            ros: this.rbServer,
            name: 'dvl/velocities',
            messageType: 'geometry_msgs/TwistWithCovarianceStamped',
        });
        dvlVelocities.subscribe((msg) => this.dvlVelocitiesSource.next(msg));

        const dvlAltitude = new RosTopic<PoseStampedMessage>({
            ros: this.rbServer,
            name: 'dvl/altitude',
            messageType: 'geometry_msgs/PoseStamped',
        });
        dvlAltitude.subscribe((msg) => this.dvlAltitudeSource.next(msg));

        const killSwitch = new RosTopic<LeakSensorMessage>({
            ros: this.rbServer,
            name: 'kill_switch',
            messageType: 'std_msgs/Bool',
        });
        killSwitch.subscribe((msg) => this.killSwitchSource.next(msg));

        const magneticSwitch2 = new RosTopic<LeakSensorMessage>({
            ros: this.rbServer,
            name: 'magnetic_switch_2',
            messageType: 'std_msgs/Bool',
        });
        magneticSwitch2.subscribe((msg) => this.magneticSwitch2Source.next(msg));

        const magneticSwitch3 = new RosTopic<LeakSensorMessage>({
            ros: this.rbServer,
            name: 'magnetic_switch_3',
            messageType: 'std_msgs/Bool',
        });
        magneticSwitch3.subscribe((msg) => this.magneticSwitch3Source.next(msg));
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

    requestReposition(reqPosX: number, reqPosY: number, reqPosZ: number): void {
        const navRepositionService = new RosService<{ request_position: number[] }, Valid>({
            ros: this.rbServer,
            name: '/nav_node/reposition',
            serviceType: 'Reposition',
        });

        navRepositionService.call(
            { request_position: [reqPosX, reqPosY, reqPosZ] },
            (res) => {
                this.navRepositionServicePosResponse(res.valid);
            },
            (err) => this.navRepositionServiceError(err)
        );
    }

    requestAllTags(callback: (res: AllTagsServiceResponse) => void): void {
        const navAllTagsRequestService = new RosService<{}, AllTagsServiceResponse>({
            ros: this.rbServer,
            name: '/nav_node/read_all_tags',
            serviceType: 'ReadAllTags',
        });

        navAllTagsRequestService.call(
            {},
            (res) => {
                callback(res);
            },
            (err) => this.navRepositionServiceError(err)
        );
    }

    requestTagPosition(name: string): void {
        const tagPositionService = new RosService<{ name: string }, Valid>({
            ros: this.rbServer,
            name: '/nav_node/tag_position',
            serviceType: 'TagPosition',
        });

        this.tagRequestsSource.next(name);

        tagPositionService.call(
            { name },
            (res) => {
                this.tagPositionServicePosResponse(res.valid);
            },
            (err) => this.tagPositionServiceError(err)
        );
    }

    requestGetPosition(name: string): void {
        const getPositionService = new RosService<
            { name: string },
            Valid & { new_position: number[] }
        >({
            ros: this.rbServer,
            name: '/nav_node/get_position',
            serviceType: 'GetPosition',
        });

        getPositionService.call(
            { name },
            (res) => {
                this.getPositionServicePosResponse(res.valid, res.new_position, name);
            },
            (err) => this.getPositionServiceError(err)
        );
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
            name: '/actuator/update_motor_pwm_offset',
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
        const toggleLqrService = new RosService<{ lqr_enabled: boolean }, StatusNumber>({
            ros: this.rbServer,
            name: '/control/toggle_lqr_control',
            serviceType: 'asuqtr_control_node/ToggleLqr',
        });

        toggleLqrService.call(
            {
                lqr_enabled: lqrActive,
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
        // ThrusterCommand has {header, efforts: float64[8]}
        // Adapt to legacy MotorThrottlesMessage shape so motor-table keeps working
        this.motorThrottlesSource.next({
            header: msg.header ?? {},
            ids: [1, 2, 3, 4, 5, 6, 7, 8],
            throttles: msg.efforts ?? [],
        });
    }

    private emitDepthMessage(msg: any) {
        // depth topic is now nav_msgs/Odometry; depth in metres is pose.pose.position.z
        this.depthSource.next({ data: msg.pose?.pose?.position?.z ?? 0 });
    }

    private emitPcbTempMessage(msg: any) {
        // temperature_alert is now a boolean GPIO signal (true = overtemp alert)
        this.pcbTempSource.next({ data: msg.data ?? false });
    }

    private emitOdometryMessage(msg: any) {
        const pos = msg.pose?.pose?.position ?? { x: 0, y: 0, z: 0 };
        const ori = msg.pose?.pose?.orientation ?? { x: 0, y: 0, z: 0, w: 1 };
        const linVel = msg.twist?.twist?.linear ?? { x: 0, y: 0, z: 0 };
        const angVel = msg.twist?.twist?.angular ?? { x: 0, y: 0, z: 0 };
        const { roll, pitch, yaw } = this.quaternionToEuler(ori);

        // 12-element state vector [x, y, z, roll, pitch, yaw, u, v, w, p, q, r]
        this.controlLqrStateSource.next({
            header: msg.header ?? {},
            data: [
                pos.x, pos.y, pos.z,
                roll, pitch, yaw,
                linVel.x, linVel.y, linVel.z,
                angVel.x, angVel.y, angVel.z,
            ],
        });

        // Also feed the nav position display
        this.currentPositionSource.next({ x: pos.x, y: pos.y, z: pos.z });
    }

    private quaternionToEuler(q: { x: number; y: number; z: number; w: number }): { roll: number; pitch: number; yaw: number } {
        const sinr_cosp = 2 * (q.w * q.x + q.y * q.z);
        const cosr_cosp = 1 - 2 * (q.x * q.x + q.y * q.y);
        const roll = Math.atan2(sinr_cosp, cosr_cosp);

        const sinp = 2 * (q.w * q.y - q.z * q.x);
        const pitch = Math.abs(sinp) >= 1 ? (Math.PI / 2) * Math.sign(sinp) : Math.asin(sinp);

        const siny_cosp = 2 * (q.w * q.z + q.x * q.y);
        const cosy_cosp = 1 - 2 * (q.y * q.y + q.z * q.z);
        const yaw = Math.atan2(siny_cosp, cosy_cosp);

        return { roll, pitch, yaw };
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

    private navRepositionServicePosResponse(valid: boolean) {
        if (valid) {
            this.toasterService.success('Nice', 'Successfully repositioned navigation algorithm');
        } else {
            this.toasterService.danger(
                'Error while requesting reposition',
                `Navigation node services failure`
            );
        }
    }

    private navRepositionServiceError(err: string) {
        this.toasterService.danger('Error: ' + err, `Failed to reposition navigation algorithm`);
    }

    private tagPositionServicePosResponse(valid: boolean) {
        if (valid) {
            this.toasterService.success(
                'Nice',
                'Successfully tagged a position in the navigation algorithm'
            );
        } else {
            this.toasterService.danger(
                'Error while tagging position',
                `Navigation node services failure`
            );
        }
    }

    private tagPositionServiceError(err: string) {
        this.toasterService.danger(
            'Error: ' + err,
            `Failed to tag a position in the navigation algorithm`
        );
    }

    private getPositionServicePosResponse(valid: boolean, position: number[], name: string) {
        if (valid) {
            if (position.length <= 3) {
                this.toasterService.success(
                    `${name} -> x: ${position[0]}, y: ${position[1]}, z: ${position[2]}`,
                    'Successfully requested a position from the navigation algorithm'
                );
                this.getPositionSource.next({ x: position[0], y: position[1], z: position[2] });
            } else {
                this.toasterService.danger(
                    `Error while getting position, invalid response length of ${position.length}`,
                    `Navigation node services failure`
                );
            }
        } else {
            this.toasterService.danger(
                'Error while getting position',
                `Navigation node services failure`
            );
        }
    }

    private getPositionServiceError(err: string) {
        this.toasterService.danger(
            'Error: ' + err,
            `Failed to get a position from the navigation algorithm`
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
