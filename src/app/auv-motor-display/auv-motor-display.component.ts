import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';
import { GamepadService } from '../gamepad.service';

@Component({
    selector: 'app-auv-motor-display',
    templateUrl: './auv-motor-display.component.html',
    styleUrls: ['./auv-motor-display.component.scss'],
    animations: [
        trigger('goFast', [
            state(
                'start',
                style({
                    'stroke-dashoffset': 0,
                })
            ),
            state(
                'end',
                style({
                    'stroke-dashoffset': '{{ animationSpeed }}',
                }),
                { params: { animationSpeed: '200' } }
            ),
            transition('start => end', [animate('2s')]),
            transition('end => start', [animate('2s')]),
        ]),
    ],
})
export class AuvMotorDisplayComponent implements OnInit, OnDestroy {
    isActive = false;
    animationSpeed: number;
    gamepadConnectedSubscription: any;
    gamepadDisconnectedSubscription: any;
    gamepads: Gamepad[];
    connected: boolean;
    startTime: number;
    offset: number;
    intensityForward = 0;
    intensityBackward = 0;

    constructor(public gs: GamepadService) {}

    ngOnInit(): void {
        this.gamepadConnectedSubscription = this.gs.onGamepadConnected.subscribe(
            (e: GamepadEvent) => {
                if (e) {
                    this.connected = true;
                    this.componentDidMount();
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
    }

    componentDidMount() {
        this.startTime = performance.now();
        this.tick();
    }

    tick() {
        this.gamepads = this.pollGamepads();
        const intensity = this.gamepads[0].axes[0];
        this.intensityForward = intensity > 0 ? intensity : 0;
        this.intensityBackward = intensity < 0 ? intensity * -1 : 0;
        // const timePassed = performance.now() - this.startTime;
        // const progress = (timePassed % 2000) / 2000;
        // this.offset = progress * 500 * intensity;
        // console.log(this.offset);
        if (this.connected) {
            window.requestAnimationFrame(() => this.tick());
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
