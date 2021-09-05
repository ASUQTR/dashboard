import { Component, OnInit } from '@angular/core';
import { RoslibService } from '../roslib.service';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-nav-reposition',
    templateUrl: './nav-reposition.component.html',
    styleUrls: ['./nav-reposition.component.scss'],
})
export class NavRepositionComponent implements OnInit {
    repositionX = new FormControl();
    repositionY = new FormControl();
    repositionZ = new FormControl();

    constructor(private rs: RoslibService) {}

    ngOnInit(): void {}

    reposition(): void {
        this.rs.requestReposition(
            this.repositionX.value ?? 0,
            this.repositionY.value ?? 0,
            this.repositionZ.value ?? 0
        );
    }
}
