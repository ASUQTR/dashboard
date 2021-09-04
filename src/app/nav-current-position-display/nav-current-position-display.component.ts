import { Component, OnInit } from '@angular/core';
import { RoslibService } from '../roslib.service';

@Component({
    selector: 'app-nav-current-position-display',
    templateUrl: './nav-current-position-display.component.html',
    styleUrls: ['./nav-current-position-display.component.scss'],
})
export class NavCurrentPositionDisplayComponent implements OnInit {
    constructor(public rs: RoslibService) {}

    ngOnInit(): void {}
}
