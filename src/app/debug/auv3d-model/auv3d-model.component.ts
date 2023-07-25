import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import '@google/model-viewer';
import { UntypedFormControl, Validators } from '@angular/forms';
import { RoslibService } from '../../roslib.service';
import { Euler, Quaternion } from 'three';
import { ImuMessage, Vector3Message } from 'ngx-roslib';

@Component({
    selector: 'app-auv3d-model',
    templateUrl: './auv3d-model.component.html',
    styleUrls: ['./auv3d-model.component.scss'],
})
export class Auv3dModelComponent implements AfterViewInit {
    @ViewChild('auv') auvElement: ElementRef;
    camTarget = '0deg 0deg 1m';
    pitch = new UntypedFormControl({ value: 0, disabled: true }, [
        Validators.required,
        Validators.min(-359),
        Validators.max(359),
    ]);
    roll = new UntypedFormControl({ value: 0, disabled: true }, [
        Validators.required,
        Validators.min(-359),
        Validators.max(359),
    ]);
    yaw = new UntypedFormControl({ value: 0, disabled: true }, [
        Validators.required,
        Validators.min(-359),
        Validators.max(359),
    ]);
    manualMode = false;

    constructor(private rs: RoslibService) {}

    ngAfterViewInit(): void {
        this.rs.imuData.subscribe((msg: ImuMessage) => {
            if (msg && !this.manualMode) {
                const { x, y, z, w } = msg.orientation;
                const quaternion = new Quaternion(x, y, z, w);
                const euler = new Euler().setFromQuaternion(quaternion, 'XYZ');
                const newOrientation = {
                    x: this.rad2deg(euler.x),
                    y: this.rad2deg(euler.y),
                    z: this.rad2deg(euler.z),
                };
                this.orientation = newOrientation;
                this.roll.setValue(newOrientation.x);
                this.pitch.setValue(newOrientation.y);
                this.yaw.setValue(newOrientation.z);
            }
        });

        this.rs.nodesListData.subscribe((allNodes: string[]) => {
            this.manualModeChange(!allNodes.includes('/vectornav'));
        });
    }

    manualModeChange(newValue: boolean) {
        this.manualMode = newValue;
        if (!newValue) {
            this.pitch.disable();
            this.roll.disable();
            this.yaw.disable();
        } else {
            this.pitch.enable();
            this.roll.enable();
            this.yaw.enable();
        }
    }

    set orientation(newValue: Vector3Message) {
        this.auvElement.nativeElement.orientation = `${newValue.x}deg ${newValue.y}deg ${newValue.z}deg`;
    }

    updateOrientationFormCallback() {
        this.orientation = { x: this.roll.value, y: this.pitch.value, z: this.yaw.value };
        if (this.manualMode) {
            const euler = new Euler(
                this.deg2rad(this.roll.value),
                this.deg2rad(this.pitch.value),
                this.deg2rad(this.yaw.value)
            );
            const quaternion = new Quaternion().setFromEuler(euler);
            this.rs.imuMockSource.next({
                header: {},
                orientation: {
                    x: quaternion.x,
                    y: quaternion.y,
                    z: quaternion.z,
                    w: quaternion.w,
                },
                orientation_covariance: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                angular_velocity: {
                    x: 0,
                    y: 0,
                    z: 0,
                },
                angular_velocity_covariance: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                linear_acceleration: {
                    x: 0,
                    y: 0,
                    z: 0,
                },
                linear_acceleration_covariance: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            });
        }
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

    deg2rad(degrees: number): number {
        return degrees * (Math.PI / 180);
    }
}
