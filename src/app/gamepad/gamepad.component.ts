import { Component, OnDestroy, OnInit } from '@angular/core';
import { GamepadService } from '../gamepad.service';
import { Subscription } from 'rxjs';

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

    constructor(public gs: GamepadService) {}

    // noinspection DuplicatedCode
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
                this.leftStickPosition.x = axes[0] * 12 + 113;
                this.leftStickPosition.y = axes[1] * 12 + 160;
                this.leftStickOpacityRaw = Math.sqrt(
                    Math.pow(axes[0], 2) + Math.pow(axes[1], 2)
                );
                this.leftStickOpacity =
                    this.leftStickOpacityRaw < 0.2
                        ? 0.2
                        : this.leftStickOpacityRaw;
                this.rightStickPosition.x = axes[2] * 12 + 278;
                this.rightStickPosition.y = axes[3] * 12 + 238;
                this.rightStickOpacityRaw = Math.sqrt(
                    Math.pow(axes[2], 2) + Math.pow(axes[3], 2)
                );
                this.rightStickOpacity =
                    this.rightStickOpacityRaw < 0.2
                        ? 0.2
                        : this.rightStickOpacityRaw;

                const buttons = gamepad.buttons;
                this.leftTriggerOpacityRaw = buttons[6].value;
                this.leftTriggerOpacity =
                    this.leftTriggerOpacityRaw < 0.2
                        ? 0.2
                        : this.leftTriggerOpacityRaw;
                this.rightTriggerOpacityRaw = buttons[7].value;
                this.rightTriggerOpacity =
                    this.rightTriggerOpacityRaw < 0.2
                        ? 0.2
                        : this.rightTriggerOpacityRaw;

                this.l1PressedRaw = buttons[4].value;
                this.l1Pressed =
                    this.l1PressedRaw < 0.2 ? 0.2 : this.l1PressedRaw;
                this.r1PressedRaw = buttons[5].value;
                this.r1Pressed =
                    this.r1PressedRaw < 0.2 ? 0.2 : this.r1PressedRaw;

                this.leftOptionButtonRaw = buttons[8].value;
                this.leftOptionButton =
                    this.leftOptionButtonRaw < 0.2
                        ? 0.2
                        : this.leftOptionButtonRaw;
                this.rightOptionButtonRaw = buttons[9].value;
                this.rightOptionButton =
                    this.rightOptionButtonRaw < 0.2
                        ? 0.2
                        : this.rightOptionButtonRaw;

                this.bottomButtonRaw = buttons[0].value;
                this.bottomButton =
                    this.bottomButtonRaw < 0.2 ? 0.2 : this.bottomButtonRaw;
                this.rightButtonRaw = buttons[1].value;
                this.rightButton =
                    this.rightButtonRaw < 0.2 ? 0.2 : this.rightButtonRaw;

                this.leftButtonRaw = buttons[2].value;
                this.leftButton =
                    this.leftButtonRaw < 0.2 ? 0.2 : this.leftButtonRaw;

                this.topButtonRaw = buttons[3].value;
                this.topButton =
                    this.topButtonRaw < 0.2 ? 0.2 : this.topButtonRaw;

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
                    this.rightDPadButtonRaw < 0.2
                        ? 0.2
                        : this.rightDPadButtonRaw;
            }
        }
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
