import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';
import { GamepadService } from '../gamepad.service';
import { Subscription } from 'rxjs';

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
    private gamepadConnectedSubscription: Subscription;
    private gamepadDisconnectedSubscription: Subscription;
    connected: boolean;
    startTime: number;
    offset: number;
    intensityForward = 0;
    intensityBackward = 0;
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
        const intensity = gamepads[0].axes[0];
        this.intensityForward = intensity > 0 ? intensity : 0;
        this.intensityBackward = intensity < 0 ? intensity * -1 : 0;
    }

    ngOnDestroy(): void {
        this.gamepadConnectedSubscription.unsubscribe();
        this.gamepadDisconnectedSubscription.unsubscribe();
        this.gamepadDataSubscription.unsubscribe();
    }
}
