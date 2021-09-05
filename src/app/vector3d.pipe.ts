import { Pipe, PipeTransform } from '@angular/core';
import { Vector3Message } from 'ngx-roslib';

@Pipe({
    name: 'vector3d',
})
export class Vector3dPipe implements PipeTransform {
    transform(value: Vector3Message): string {
        if (value) {
            return `x: ${value.x}, y: ${value.y}, z: ${value.z}`;
        }
    }
}
