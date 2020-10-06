/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

import {
    Injectable,
    OnDestroy,
    RendererFactory2,
    Renderer2,
} from '@angular/core';
import { Subject, Observable, fromEventPattern, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RosService, JoyMessage } from './ros.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
    providedIn: 'root',
})
export class GamepadService implements OnDestroy {
    private destroy$ = new Subject();
    private onGamepadConnected$: Observable<GamepadEvent>;
    private onGamepadDisconnected$: Observable<GamepadEvent>;
    public onGamepadConnected: BehaviorSubject<GamepadEvent>;
    public onGamepadDisconnected: BehaviorSubject<GamepadEvent>;
    public gamepadConnected = false;
    private gamepads: Gamepad[];
    private gamepadSource = new BehaviorSubject<Array<Gamepad>>(null);
    gamepadData = this.gamepadSource.asObservable();
    private gamepadInterval: NodeJS.Timeout;

    constructor(
        private rendererFactory2: RendererFactory2,
        private rs: RosService,
        private platformDetector: DeviceDetectorService
    ) {
        const renderer = this.rendererFactory2.createRenderer(null, null);
        const renderer2 = this.rendererFactory2.createRenderer(null, null);

        this.createOnGamepadConnectedObservable(renderer);
        this.createOnGamepadDisconnectedObservable(renderer2);
    }

    private createOnGamepadConnectedObservable(renderer: Renderer2) {
        let removeGamepadConnectedEventListener: () => void;
        const createGamepadConnectedEventListener = (
            handler: (e: Event) => boolean | void
        ) => {
            removeGamepadConnectedEventListener = renderer.listen(
                'window',
                'gamepadconnected',
                handler
            );
        };

        this.onGamepadConnected$ = fromEventPattern<GamepadEvent>(
            createGamepadConnectedEventListener,
            () => {
                removeGamepadConnectedEventListener();
            }
        ).pipe(takeUntil(this.destroy$));
        this.onGamepadConnected = new BehaviorSubject(null);
        this.onGamepadConnected$.subscribe((e: GamepadEvent) => {
            this.onGamepadConnected.next(e);
            this.gamepadConnected = true;
            this.gameLoop();
        });
    }

    private createOnGamepadDisconnectedObservable(renderer2: Renderer2) {
        let removeGamepadDisconnectedEventListener: () => void;
        const createGamepadDisconnectedEventListener = (
            handler2: (e: Event) => boolean | void
        ) => {
            removeGamepadDisconnectedEventListener = renderer2.listen(
                'window',
                'gamepaddisconnected',
                handler2
            );
        };

        this.onGamepadDisconnected$ = fromEventPattern<GamepadEvent>(
            createGamepadDisconnectedEventListener,
            () => {
                removeGamepadDisconnectedEventListener();
            }
        ).pipe(takeUntil(this.destroy$));
        this.onGamepadDisconnected = new BehaviorSubject(null);
        this.onGamepadDisconnected$.subscribe((e: GamepadEvent) => {
            this.onGamepadDisconnected.next(e);
            this.gamepadConnected = false;
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        this.onGamepadConnected.complete();
        this.onGamepadDisconnected.complete();
        clearInterval(this.gamepadInterval);
    }

    gameLoop() {
        this.gamepads = this.pollGamepads();
        this.gamepadSource.next(this.gamepads);
        this.rs.joySource.next(this.toJoyMessage(this.gamepads[0]));
        if (this.gamepadConnected) {
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    toJoyMessage(gamepad: Gamepad) {
        const os = this.platformDetector.os;
        let joyData: JoyMessage;
        switch (os) {
            case 'Windows':
                joyData = {
                    header: {},
                    axes: [
                        gamepad.axes[0], // Left Stick X
                        gamepad.axes[1] * -1, // Left Stick Y
                        gamepad.buttons[6].value, // Left Trigger
                        gamepad.axes[2], // Right Stick X
                        gamepad.axes[3] * -1, // Right Stick Y
                        gamepad.buttons[7].value, // Right Trigger
                        gamepad.buttons[14].pressed
                            ? -1
                            : gamepad.buttons[15].pressed
                            ? 1
                            : 0, // DPAD Left/Right
                        gamepad.buttons[13].pressed
                            ? -1
                            : gamepad.buttons[12].pressed
                            ? 1
                            : 0, // DPAD Up/Down
                    ],
                    buttons: [
                        gamepad.buttons[0].value, // Button A
                        gamepad.buttons[1].value, // Button B
                        gamepad.buttons[2].value, // Button X
                        gamepad.buttons[3].value, // Button Y
                        gamepad.buttons[4].value, // Button Left Trigger
                        gamepad.buttons[5].value, // Button Right Trigger
                        gamepad.buttons[8].value, // Button Back
                        gamepad.buttons[9].value, // Button Start
                        gamepad.buttons[16].value, // Button Xbox
                        gamepad.buttons[10].value, // Button Left Stick
                        gamepad.buttons[11].value, // Button Right Stick
                    ],
                };
                break;
            case 'Linux':
                joyData = {
                    header: {},
                    axes: [
                        gamepad.axes[0], // Left Stick X
                        gamepad.axes[1] * -1, // Left Stick Y
                        gamepad.axes[2], // Left Trigger
                        gamepad.axes[3], // Right Stick X
                        gamepad.axes[4] * -1, // Right Stick Y
                        gamepad.axes[5], // Right Trigger
                        gamepad.axes[6], // DPAD Left/Right
                        gamepad.axes[7], // DPAD Up/Down
                    ],
                    buttons: [
                        gamepad.buttons[0].value, // Button A
                        gamepad.buttons[1].value, // Button B
                        gamepad.buttons[2].value, // Button X
                        gamepad.buttons[3].value, // Button Y
                        gamepad.buttons[4].value, // Button Left Trigger
                        gamepad.buttons[5].value, // Button Right Trigger
                        gamepad.buttons[6].value, // Button Back
                        gamepad.buttons[7].value, // Button Start
                        gamepad.buttons[8].value, // Button Xbox
                        gamepad.buttons[9].value, // Button Left Stick
                        gamepad.buttons[10].value, // Button Right Stick
                    ],
                };
                break;
        }
        return joyData;
    }

    pollGamepads() {
        return navigator.getGamepads();
    }
}
