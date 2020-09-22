import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'app-auv-motor-display',
    templateUrl: './auv-motor-display.component.html',
    styleUrls: ['./auv-motor-display.component.scss'],
})
export class AuvMotorDisplayComponent implements OnInit {
    // @ViewChild('canvas', { static: true })
    // canvas: ElementRef<HTMLCanvasElement>;
    // private ctx: CanvasRenderingContext2D;
    constructor() {}

    ngOnInit(): void {
        // this.ctx = this.canvas.nativeElement.getContext('2d');
        // const path = new Path2D(
        //     'm5.23252,67.31465l110.71307,-62.67882l156.57388,0l110.71307,62.67882l0,88.64236l-110.71307,62.67883l-156.57388,0l-110.71307,-62.67883l0,-88.64236z'
        // );
        // this.ctx.stroke(path);
    }
}
