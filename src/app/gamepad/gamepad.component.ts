import { Component, OnDestroy, OnInit } from '@angular/core';
import { GamepadService } from '../gamepad.service';

@Component({
    selector: 'app-gamepad',
    templateUrl: './gamepad.component.html',
    styleUrls: ['./gamepad.component.scss'],
})
export class GamepadComponent implements OnInit, OnDestroy {
    gp: Gamepad;
    connected = false;
    gamepadConnectedSubscription: any;
    gamepadDisconnectedSubscription: any;
    gamepads: Gamepad[];
    leftStickPosition: Coordinates = { x: 113, y: 160 };
    rightStickPosition: Coordinates = { x: 278, y: 238 };
    leftStickOpacity: number = 0.2;
    rightStickOpacity: number = 0.2;
    rightStickOpacityRaw: number = 0;
    leftStickOpacityRaw: number = 0;
    leftTriggerOpacity: number = 0.2;
    leftTriggerOpacityRaw: number = 0;
    rightTriggerOpacity: number = 0.2;
    rightTriggerOpacityRaw: number = 0;
    l1Pressed: number = 0.2;
    l1PressedRaw: number = 0;
    r1Pressed: number = 0.2;
    r1PressedRaw: number = 0;
    leftOptionButtonRaw: number = 0;
    leftOptionButton: number = 0.2;
    rightOptionButtonRaw: number = 0;
    rightOptionButton: number = 0.2;
    bottomButtonRaw: number = 0;
    bottomButton: number = 0.2;
    rightButtonRaw: number = 0;
    rightButton: number = 0.2;
    leftButtonRaw: number = 0;
    leftButton: number = 0.2;
    topButtonRaw: number = 0;
    topButton: number = 0.2;
    downDPadButtonRaw: number = 0;
    downDPadButton: number = 0.2;
    rightDPadButtonRaw: number = 0;
    rightDPadButton: number = 0.2;
    leftDPadButtonRaw: number = 0;
    leftDPadButton: number = 0.2;
    upDPadButtonRaw: number = 0;
    upDPadButton: number = 0.2;
    constructor(public gs: GamepadService) {}

    ngOnInit(): void {
        this.gamepadConnectedSubscription = this.gs.onGamepadConnected.subscribe(
            (e: GamepadEvent) => {
                if (e) {
                    this.connected = true;
                    this.gp = e.gamepad;
                    this.componentDidMount();
                }
            }
        );
        this.gamepadDisconnectedSubscription = this.gs.onGamepadDisconnected.subscribe(
            (e: GamepadEvent) => {
                if (e) {
                    this.connected = false;
                    this.gp = e.gamepad;
                }
            }
        );
    }

    componentDidMount() {
        this.tick();
    }

    tick() {
        this.gamepads = this.pollGamepads();
        this.extractGamepadData(this.gamepads);
        window.requestAnimationFrame(() => this.tick());
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

    pollGamepads() {
        return navigator.getGamepads();
    }

    ngOnDestroy(): void {
        this.gamepadConnectedSubscription.unsubscribe();
        this.gamepadDisconnectedSubscription.unsubscribe();
    }
}

interface Coordinates {
    x: number;
    y: number;
}
