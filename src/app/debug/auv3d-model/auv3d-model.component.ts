import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import '@google/model-viewer';
import { FormControl, Validators } from '@angular/forms';
import { RosService } from '../../ros.service';
import { Euler, Quaternion } from 'three';
import ROSLIB from 'roslib';
import { ImuMessage } from '../../ros-model.enum';

@Component({
    selector: 'app-auv3d-model',
    templateUrl: './auv3d-model.component.html',
    styleUrls: ['./auv3d-model.component.scss'],
})
export class Auv3dModelComponent implements AfterViewInit {
    @ViewChild('auv') auvElement: ElementRef;
    camTarget = '0deg 0deg 1m';
    pitch = new FormControl(0, [Validators.required, Validators.min(-359), Validators.max(359)]);
    roll = new FormControl(0, [Validators.required, Validators.min(-359), Validators.max(359)]);
    yaw = new FormControl(0, [Validators.required, Validators.min(-359), Validators.max(359)]);

    constructor(private rs: RosService) {}

    ngAfterViewInit(): void {
        this.rs.imuData.subscribe((msg: ImuMessage) => {
            if (msg) {
                const { x, y, z, w } = msg.orientation;
                const quaternion = new Quaternion(x, y, z, w);
                const euler = new Euler().setFromQuaternion(quaternion, 'XYZ');
                this.orientation = {
                    x: this.rad2deg(euler.x),
                    y: this.rad2deg(euler.y),
                    z: this.rad2deg(euler.z),
                };
                this.roll.setValue(this.rad2deg(euler.x));
                this.pitch.setValue(this.rad2deg(euler.y));
                this.yaw.setValue(this.rad2deg(euler.z));
            }
        });
    }

    set orientation(newValue: ROSLIB.Vector3Like) {
        this.auvElement.nativeElement.orientation = `${newValue.x}deg ${newValue.y}deg ${newValue.z}deg`;
    }

    updateOrientationFormCallback() {
        this.orientation = { x: this.roll.value, y: this.pitch.value, z: this.yaw.value };
    }

    scrollRoll(event: WheelEvent) {
        event.preventDefault();
        this.roll.setValue(this.roll.value + event.deltaY * -0.01);
        this.updateOrientationFormCallback();
    }

    scrollPitch(event: WheelEvent) {
        event.preventDefault();
        this.pitch.setValue(this.pitch.value + event.deltaY * -0.01);
        this.updateOrientationFormCallback();
    }

    scrollYaw(event: WheelEvent) {
        event.preventDefault();
        this.yaw.setValue(this.yaw.value + event.deltaY * -0.01);
        this.updateOrientationFormCallback();
    }

    rad2deg(radians: number): number {
        return radians * (180 / Math.PI);
    }
}
