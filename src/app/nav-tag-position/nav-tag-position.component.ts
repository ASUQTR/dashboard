import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { RoslibService } from '../roslib.service';

@Component({
    selector: 'app-nav-tag-position',
    templateUrl: './nav-tag-position.component.html',
    styleUrls: ['./nav-tag-position.component.scss'],
})
export class NavTagPositionComponent implements OnInit {
    tagName = new UntypedFormControl(null, Validators.required);

    constructor(private rs: RoslibService) {}

    ngOnInit(): void {}

    tagPosition(): void {
        this.rs.requestTagPosition(this.tagName.value);
    }
}
