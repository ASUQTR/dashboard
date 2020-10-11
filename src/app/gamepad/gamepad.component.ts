/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { GamepadService } from '../gamepad.service';
import { Subscription } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
    selector: 'app-gamepad',
    templateUrl: './gamepad.component.html',
    styleUrls: ['./gamepad.component.scss'],
})
export class GamepadComponent implements OnInit, OnDestroy {
    connected = false;
    private gamepadConnectedSubscription: Subscription;
    private gamepadDisconnectedSubscription: Subscription;
    leftStickPosition: Coordinates = { x: 113, y: 160 };
    rightStickPosition: Coordinates = { x: 278, y: 238 };
    leftStickOpacity = 0.2;
    rightStickOpacity = 0.2;
    rightStickOpacityRaw = 0;
    leftStickOpacityRaw = 0;
    leftTriggerOpacity = 0.2;
    leftTriggerOpacityRaw = 0;
    rightTriggerOpacity = 0.2;
    rightTriggerOpacityRaw = 0;
    l1Pressed = 0.2;
    l1PressedRaw = 0;
    r1Pressed = 0.2;
    r1PressedRaw = 0;
    leftOptionButtonRaw = 0;
    leftOptionButton = 0.2;
    rightOptionButtonRaw = 0;
    rightOptionButton = 0.2;
    bottomButtonRaw = 0;
    bottomButton = 0.2;
    rightButtonRaw = 0;
    rightButton = 0.2;
    leftButtonRaw = 0;
    leftButton = 0.2;
    topButtonRaw = 0;
    topButton = 0.2;
    downDPadButtonRaw = 0;
    downDPadButton = 0.2;
    rightDPadButtonRaw = 0;
    rightDPadButton = 0.2;
    leftDPadButtonRaw = 0;
    leftDPadButton = 0.2;
    upDPadButtonRaw = 0;
    upDPadButton = 0.2;
    private gamepadDataSubscription: Subscription;

    constructor(
        public gs: GamepadService,
        private platformDetector: DeviceDetectorService
    ) {}

    ngOnInit(): void {
        this.gamepadConnectedSubscription = this.gs.onGamepadConnected.subscribe(
            (e: GamepadEvent) => {
                if (e) {
                    this.connected = true;
                }
            }
        );
        this.gamepadDisconnectedSubscription = this.gs.onGamepadDisconnected.subscribe(
            (e: GamepadEvent) => {
                if (e) {
                    this.connected = false;
                }
            }
        );
        this.gamepadDataSubscription = this.gs.gamepadData.subscribe((e) => {
            if (e) {
                this.extractGamepadData(e);
            }
        });
    }

    extractGamepadData(gamepads: Gamepad[]) {
        for (const gamepad of gamepads) {
            if (gamepad) {
                const axes = gamepad.axes;
                const buttons = gamepad.buttons;
                this.extractedStickData(axes);
                this.extractTriggerData(buttons, axes);
                this.extractL1Data(buttons);
                this.extractR1Data(buttons);
                this.extractOptionButtonData(buttons);
                this.extractMainButtonsData(buttons);
                this.extractDpadData(buttons, axes);
            }
        }
    }

    private extractDpadData(
        buttons: ReadonlyArray<GamepadButton>,
        axes: ReadonlyArray<number>
    ) {
        const os = this.platformDetector.os;
        if (os === 'Windows') {
            this.upDPadButtonRaw = buttons[12].value;
            this.upDPadButton =
                this.upDPadButtonRaw < 0.2 ? 0.2 : this.upDPadButtonRaw;

            this.downDPadButtonRaw = buttons[13].value;
            this.downDPadButton =
                this.downDPadButtonRaw < 0.2 ? 0.2 : this.downDPadButtonRaw;

            this.leftDPadButtonRaw = buttons[14].value;
            this.leftDPadButton =
                this.leftDPadButtonRaw < 0.2 ? 0.2 : this.leftDPadButtonRaw;

            this.rightDPadButtonRaw = buttons[15].value;
            this.rightDPadButton =
                this.rightDPadButtonRaw < 0.2 ? 0.2 : this.rightDPadButtonRaw;
        } else if (os === 'Linux') {
            const dpadLeftRight = axes[6];
            const dpadUpDown = axes[7];

            this.rightDPadButtonRaw = dpadLeftRight > 0 ? dpadLeftRight : 0;
            this.rightDPadButton =
                this.rightDPadButtonRaw < 0.2 ? 0.2 : this.rightDPadButtonRaw;
            this.leftDPadButtonRaw = dpadLeftRight < 0 ? dpadLeftRight * -1 : 0;
            this.leftDPadButton =
                this.leftDPadButtonRaw < 0.2 ? 0.2 : this.leftDPadButtonRaw;

            this.upDPadButtonRaw = dpadUpDown < 0 ? dpadUpDown * -1 : 0;
            this.upDPadButton =
                this.upDPadButtonRaw < 0.2 ? 0.2 : this.upDPadButtonRaw;
            this.downDPadButtonRaw = dpadUpDown > 0 ? dpadUpDown : 0;
            this.downDPadButton =
                this.downDPadButtonRaw < 0.2 ? 0.2 : this.downDPadButtonRaw;
        }
    }

    private extractMainButtonsData(buttons: ReadonlyArray<GamepadButton>) {
        this.bottomButtonRaw = buttons[0].value;
        this.bottomButton =
            this.bottomButtonRaw < 0.2 ? 0.2 : this.bottomButtonRaw;
        this.rightButtonRaw = buttons[1].value;
        this.rightButton =
            this.rightButtonRaw < 0.2 ? 0.2 : this.rightButtonRaw;

        this.leftButtonRaw = buttons[2].value;
        this.leftButton = this.leftButtonRaw < 0.2 ? 0.2 : this.leftButtonRaw;

        this.topButtonRaw = buttons[3].value;
        this.topButton = this.topButtonRaw < 0.2 ? 0.2 : this.topButtonRaw;
    }

    private extractOptionButtonData(buttons: ReadonlyArray<GamepadButton>) {
        const os = this.platformDetector.os;
        let leftOptionButton: number;
        let rightOptionButton: number;
        if (os === 'Windows') {
            leftOptionButton = buttons[8].value;
            rightOptionButton = buttons[9].value;
        } else if (os === 'Linux') {
            leftOptionButton = buttons[6].value;
            rightOptionButton = buttons[7].value;
        } else {
            leftOptionButton = 0;
            rightOptionButton = 0;
        }
        this.leftOptionButtonRaw = leftOptionButton;
        this.leftOptionButton =
            this.leftOptionButtonRaw < 0.2 ? 0.2 : this.leftOptionButtonRaw;
        this.rightOptionButtonRaw = rightOptionButton;
        this.rightOptionButton =
            this.rightOptionButtonRaw < 0.2 ? 0.2 : this.rightOptionButtonRaw;
    }

    private extractR1Data(buttons: ReadonlyArray<GamepadButton>) {
        this.r1PressedRaw = buttons[5].value;
        this.r1Pressed = this.r1PressedRaw < 0.2 ? 0.2 : this.r1PressedRaw;
    }

    private extractL1Data(buttons: ReadonlyArray<GamepadButton>) {
        this.l1PressedRaw = buttons[4].value;
        this.l1Pressed = this.l1PressedRaw < 0.2 ? 0.2 : this.l1PressedRaw;
    }

    private extractTriggerData(
        buttons: ReadonlyArray<GamepadButton>,
        axes: ReadonlyArray<number>
    ) {
        const os = this.platformDetector.os;
        let leftTrigger: number;
        let rightTrigger: number;
        if (os === 'Windows') {
            leftTrigger = buttons[6].value;
            rightTrigger = buttons[7].value;
        } else if (os === 'Linux') {
            leftTrigger = (axes[2] + 1) / 2.0;
            rightTrigger = (axes[5] + 1) / 2.0;
        } else {
            leftTrigger = 0;
            rightTrigger = 0;
        }
        this.leftTriggerOpacityRaw = leftTrigger;
        this.leftTriggerOpacity =
            this.leftTriggerOpacityRaw < 0.2 ? 0.2 : this.leftTriggerOpacityRaw;
        this.rightTriggerOpacityRaw = rightTrigger;
        this.rightTriggerOpacity =
            this.rightTriggerOpacityRaw < 0.2
                ? 0.2
                : this.rightTriggerOpacityRaw;
    }

    private extractedStickData(axes: ReadonlyArray<number>) {
        const os = this.platformDetector.os;
        let rightStickX: number;
        let rightStickY: number;

        this.leftStickPosition.x = axes[0] * 12 + 113;
        this.leftStickPosition.y = axes[1] * 12 + 160;
        this.leftStickOpacityRaw = Math.sqrt(
            Math.pow(axes[0], 2) + Math.pow(axes[1], 2)
        );
        this.leftStickOpacity =
            this.leftStickOpacityRaw < 0.2 ? 0.2 : this.leftStickOpacityRaw;

        if (os === 'Windows') {
            rightStickX = axes[2];
            rightStickY = axes[3];
        } else if (os === 'Linux') {
            rightStickX = axes[3];
            rightStickY = axes[4];
        } else {
            rightStickX = 0;
            rightStickY = 0;
        }
        this.rightStickPosition.x = rightStickX * 12 + 278;
        this.rightStickPosition.y = rightStickY * 12 + 238;
        this.rightStickOpacityRaw = Math.sqrt(
            Math.pow(rightStickX, 2) + Math.pow(rightStickY, 2)
        );
        this.rightStickOpacity =
            this.rightStickOpacityRaw < 0.2 ? 0.2 : this.rightStickOpacityRaw;
    }

    ngOnDestroy(): void {
        this.gamepadConnectedSubscription.unsubscribe();
        this.gamepadDisconnectedSubscription.unsubscribe();
        this.gamepadDataSubscription.unsubscribe();
    }
}

interface Coordinates {
    x: number;
    y: number;
}
