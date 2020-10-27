/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

import { Injectable, OnDestroy, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, fromEventPattern, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RosService } from './ros.service';
import { JoyMessage } from './ros-model.enum';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class GamepadService implements OnDestroy {
    readonly enableLQRCookieName = 'enableLQRCookie';
    public onGamepadConnected: BehaviorSubject<GamepadEvent>;
    public onGamepadDisconnected: BehaviorSubject<GamepadEvent>;
    public gamepadConnected = false;
    private destroy$ = new Subject();
    private onGamepadConnected$: Observable<GamepadEvent>;
    private onGamepadDisconnected$: Observable<GamepadEvent>;
    private gamepads: Gamepad[];
    private gamepadSource = new BehaviorSubject<Array<Gamepad>>(null);
    gamepadData = this.gamepadSource.asObservable();
    private gamepadInterval: NodeJS.Timeout;
    private lqrEnabled = false;
    private menuButtonPressedOld = false;
    private homeButtonPressedOld = false;

    constructor(
        private rendererFactory2: RendererFactory2,
        private rs: RosService,
        private cookies: CookieService,
        private router: Router
    ) {
        const renderer = this.rendererFactory2.createRenderer(null, null);
        const renderer2 = this.rendererFactory2.createRenderer(null, null);

        this.createOnGamepadConnectedObservable(renderer);
        this.createOnGamepadDisconnectedObservable(renderer2);
        this.rs.lqrControlSource.subscribe((newValue) => {
            this.lqrEnabled = newValue;
        });
        if (this.cookies.check(this.enableLQRCookieName)) {
            const cookieStartingValue = this.cookies.get(this.enableLQRCookieName) === 'true';
            this.rs.lqrControlSource.next(cookieStartingValue);
        }
    }

    /**
     * Converts the Dpad buttons value to an axes format which combines the 'negative' and 'positive' dpad into a single value [-1..1]
     *
     * @param negativeSide Negative part of the dpad axes element
     * @param positiveSide Positive part of the dpad axes element
     * @static
     */
    static getDpadAxeValueFromButtons(negativeSide: boolean, positiveSide: boolean): number {
        let value: number;
        if (negativeSide) {
            value = -1;
        } else if (positiveSide) {
            value = 1;
        } else {
            value = 0;
        }
        return value;
    }

    static mapToJoyButtonsNotStandard(gamepad: Gamepad): number[] {
        return [
            gamepad?.buttons[0].value, // Button A
            gamepad?.buttons[1].value, // Button B
            gamepad?.buttons[2].value, // Button X
            gamepad?.buttons[3].value, // Button Y
            gamepad?.buttons[4].value, // Button Left Trigger
            gamepad?.buttons[5].value, // Button Right Trigger
            gamepad?.buttons[6].value, // Button Back
            gamepad?.buttons[7].value, // Button Start
            gamepad?.buttons[8].value, // Button Xbox
            gamepad?.buttons[9].value, // Button Left Stick
            gamepad?.buttons[10].value, // Button Right Stick
        ];
    }

    static mapToJoyAxesNotStandard(gamepad: Gamepad): number[] {
        return [
            gamepad?.axes[0], // Left Stick X
            gamepad?.axes[1] * -1, // Left Stick Y
            gamepad?.axes[2], // Left Trigger
            gamepad?.axes[3], // Right Stick X
            gamepad?.axes[4] * -1, // Right Stick Y
            gamepad?.axes[5], // Right Trigger
            gamepad?.axes[6], // DPAD Left/Right
            gamepad?.axes[7], // DPAD Up/Down
        ];
    }

    static mapToJoyButtonsStandard(gamepad: Gamepad): number[] {
        return [
            gamepad?.buttons[0].value, // Button A
            gamepad?.buttons[1].value, // Button B
            gamepad?.buttons[2].value, // Button X
            gamepad?.buttons[3].value, // Button Y
            gamepad?.buttons[4].value, // Button Left Trigger
            gamepad?.buttons[5].value, // Button Right Trigger
            gamepad?.buttons[8].value, // Button Back
            gamepad?.buttons[9].value, // Button Start
            gamepad?.buttons[16].value, // Button Xbox
            gamepad?.buttons[10].value, // Button Left Stick
            gamepad?.buttons[11].value, // Button Right Stick
        ];
    }

    static mapToJoyAxesStandard(gamepad: Gamepad): number[] {
        return [
            gamepad?.axes[0], // Left Stick X
            gamepad?.axes[1] * -1, // Left Stick Y
            gamepad?.buttons[6].value, // Left Trigger
            gamepad?.axes[2], // Right Stick X
            gamepad?.axes[3] * -1, // Right Stick Y
            gamepad?.buttons[7].value, // Right Trigger
            GamepadService.getDpadAxeValueFromButtons(
                gamepad?.buttons[14].pressed,
                gamepad?.buttons[15].pressed
            ), // DPAD Left/Right
            GamepadService.getDpadAxeValueFromButtons(
                gamepad?.buttons[13].pressed,
                gamepad?.buttons[12].pressed
            ), // DPAD Up/Down
        ];
    }

    /**
     * Disposes of the BehaviorSubject and intervals used in this service.
     */
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.onGamepadConnected.complete();
        this.onGamepadDisconnected.complete();
        clearInterval(this.gamepadInterval);
    }

    /**
     * Gets the data from the gamepad API and pushes it into the appropriate Subject. The function also sends the converted data to the Joy
     * topic located in the RosService. When the Subject are updated, the function request a new animation frame with itself as the
     * callback.
     */
    gameLoop(): void {
        this.gamepads = this.pollGamepads();

        /* Action on menu button press */
        const menuPressed = this.getMenuButton();
        if (!this.menuButtonPressedOld && menuPressed) {
            this.lqrEnabled = !this.lqrEnabled;
            this.rs.lqrControlSource.next(this.lqrEnabled);
        }
        this.menuButtonPressedOld = menuPressed;

        /* Action on home button press (Xbox button) */
        const homePressed = this.getHomeButton();
        if (!this.homeButtonPressedOld && homePressed) {
            this.router.navigate(['main']);
        }
        this.homeButtonPressedOld = homePressed;

        this.gamepadSource.next(this.gamepads);
        this.rs.joySource.next(this.toJoyMessage(this.gamepads[0]));
        if (this.gamepadConnected) {
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    private getMenuButton(): boolean {
        if (this.gamepads[0].mapping === 'standard') {
            return this.gamepads[0].buttons[9].pressed;
        } else if (this.gamepads[0].mapping === '') {
            return this.gamepads[0].buttons[7].pressed;
        } else {
            return false;
        }
    }

    private getHomeButton(): boolean {
        if (this.gamepads[0].mapping === 'standard') {
            return this.gamepads[0].buttons[16].pressed;
        } else if (this.gamepads[0].mapping === '') {
            return this.gamepads[0].buttons[8].pressed;
        } else {
            return false;
        }
    }

    /**
     * Function to convert the gamepad data into Joy topic format depending on the OS. The gamepad mapping is different from
     * Windows to Linux. The mapping to send to the Joy topic is the Linux mapping.
     *
     * @param gamepad Gamepad raw data
     */
    toJoyMessage(gamepad: Gamepad): JoyMessage {
        let joyData: JoyMessage;
        switch (gamepad.mapping) {
            case 'standard':
                joyData = {
                    header: {},
                    axes: GamepadService.mapToJoyAxesStandard(gamepad),
                    buttons: GamepadService.mapToJoyButtonsStandard(gamepad),
                };
                break;
            case '':
                joyData = {
                    header: {},
                    axes: GamepadService.mapToJoyAxesNotStandard(gamepad),
                    buttons: GamepadService.mapToJoyButtonsNotStandard(gamepad),
                };
                break;
        }
        return joyData;
    }

    /**
     * Helper function to get all connected gamepads from the Gamepad API
     */
    pollGamepads(): Gamepad[] {
        return navigator.getGamepads();
    }

    /**
     * Function to manage the event listener for window:gamepadconnected and push the event into the Subject
     *
     * @param renderer DOM object used to render stuff
     * @private
     */
    private createOnGamepadConnectedObservable(renderer: Renderer2) {
        let removeGamepadConnectedEventListener: () => void;
        const createGamepadConnectedEventListener = (handler: (e: Event) => boolean | void) => {
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
        this.onGamepadConnected = new BehaviorSubject<GamepadEvent>(null);
        this.onGamepadConnected$.subscribe((e: GamepadEvent) => {
            this.onGamepadConnected.next(e);
            this.gamepadConnected = true;
            this.gameLoop();
        });
    }

    /**
     * Function to manage the event listener for window:gamepaddisconnected and push the event into the Subject
     *
     * @param renderer2 DOM object used to render stuff
     * @private
     */
    private createOnGamepadDisconnectedObservable(renderer2: Renderer2) {
        let removeGamepadDisconnectedEventListener: () => void;
        const createGamepadDisconnectedEventListener = (handler2: (e: Event) => boolean | void) => {
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
        this.onGamepadDisconnected = new BehaviorSubject<GamepadEvent>(null);
        this.onGamepadDisconnected$.subscribe((e: GamepadEvent) => {
            this.onGamepadDisconnected.next(e);
            this.gamepadConnected = false;
        });
    }
}
