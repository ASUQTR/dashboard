import { Component, OnInit } from '@angular/core';
import { RoslibService } from '../roslib.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-nav-get-position',
    templateUrl: './nav-get-position.component.html',
    styleUrls: ['./nav-get-position.component.scss'],
})
export class NavGetPositionComponent implements OnInit {
    posName = new FormControl(null, Validators.required);

    constructor(public rs: RoslibService) {}

    ngOnInit(): void {}

    getPosition(): void {
        this.rs.requestGetPosition(this.posName.value);
    }
}
