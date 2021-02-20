import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import '@google/model-viewer';
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-auv3d-model',
    templateUrl: './auv3d-model.component.html',
    styleUrls: ['./auv3d-model.component.scss'],
})
export class Auv3dModelComponent implements OnInit {
    @ViewChild('auv') auvElement: ElementRef;
    camTarget = '0deg 0deg 1m';
    pitch = new FormControl(0, [Validators.required, Validators.min(-359), Validators.max(359)]);
    roll = new FormControl(0, [Validators.required, Validators.min(-359), Validators.max(359)]);
    yaw = new FormControl(0, [Validators.required, Validators.min(-359), Validators.max(359)]);

    constructor() {}

    ngOnInit(): void {}

    updateOrientation() {
        console.log(this.roll.value);
        console.log(this.pitch.value);
        console.log(this.yaw.value);
        console.log(this.auvElement.nativeElement.getCameraOrbit());
        this.auvElement.nativeElement.orientation = `${this.roll.value}deg ${this.pitch.value}deg ${this.yaw.value}deg`;
    }

    radians_to_degrees(radians: number): number {
        return radians * (180 / Math.PI);
    }
}
