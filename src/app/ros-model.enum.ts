/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

export enum RosState {
    Disconnected,
    Connected,
    Error,
}

export interface ControlStateMessage {
    data?: boolean | null;
}

export interface ControlStateFeedbackMessage {
    data?: boolean | null;
}

export interface ControlEnableMessage {
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
    data?: number | null;
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
    // eslint-disable-next-line @typescript-eslint/naming-convention
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
