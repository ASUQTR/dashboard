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
    constructor(public gs: GamepadService) {}

    ngOnInit(): void {
        this.gamepadConnectedSubscription = this.gs.onGamepadConnected.subscribe(
            (e: GamepadEvent) => {
                if (e) {
                    this.connected = true;
                    this.gp = e.gamepad;
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
    ngOnDestroy(): void {
        this.gamepadConnectedSubscription.unsubscribe();
        this.gamepadDisconnectedSubscription.unsubscribe();
    }
}
