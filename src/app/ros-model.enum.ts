/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

import { RosMsgHeader } from 'ngx-roslib';

export enum RosState {
    Disconnected,
    Connected,
    Error,
}

export interface ControlStateMessage {
    data?: boolean | null;
}

export interface LqrActiveFeedbackMessage {
    data?: boolean | null;
}

export interface ControlSwitchMessage {
    data?: boolean | null;
}

export interface LeakSensorMessage {
    data?: boolean | null;
}

export interface DepthMessage {
    data?: number | null;
}

export interface ControlLoopTimeMessage {
    data?: number | null;
}

export interface ControlInfoMessage {
    header: RosMsgHeader;
    data?: number[] | null;
}

export interface PcbTempMessage {
    data?: boolean | null;
}

export interface MotorThrottlesMessage {
    header: RosMsgHeader;
    ids?: number[] | null;
    throttles?: number[] | null;
}

export interface MotorThrottlesFeedbackMessage {
    header: RosMsgHeader;
    data?: number[] | null;
}
