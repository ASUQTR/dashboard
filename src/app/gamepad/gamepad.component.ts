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
    leftStickOpacity: number;
    rightStickOpacity: number;
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
                this.leftStickOpacity = Math.sqrt(
                    Math.pow(axes[0], 2) + Math.pow(axes[1], 2)
                );
                if (this.leftStickOpacity < 0.2) this.leftStickOpacity = 0.2;
                this.rightStickPosition.x = axes[2] * 12 + 278;
                this.rightStickPosition.y = axes[3] * 12 + 238;
                this.rightStickOpacity = Math.sqrt(
                    Math.pow(axes[2], 2) + Math.pow(axes[3], 2)
                );
                if (this.rightStickOpacity < 0.2) this.rightStickOpacity = 0.2;
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
