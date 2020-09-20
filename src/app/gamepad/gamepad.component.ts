import { Component, OnInit } from '@angular/core';
import { GamepadService } from '../gamepad.service';

@Component({
    selector: 'app-gamepad',
    templateUrl: './gamepad.component.html',
    styleUrls: ['./gamepad.component.scss'],
})
export class GamepadComponent implements OnInit {
    gp: Gamepad;
    connected = false;
    constructor(public gs: GamepadService) {}

    ngOnInit(): void {
        this.gs.onGamepadConnected.subscribe((e: GamepadEvent) => {
            this.connected = true;
            this.gp = e.gamepad;
        });
        this.gs.onGamepadDisconnected.subscribe((e: GamepadEvent) => {
            this.connected = false;
            this.gp = e.gamepad;
        });
    }
}
