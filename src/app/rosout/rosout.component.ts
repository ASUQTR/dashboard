import { Component, OnInit } from '@angular/core';
import { RosoutLevel, RosoutMessage, RosService } from '../ros.service';

@Component({
    selector: 'app-rosout',
    templateUrl: './rosout.component.html',
    styleUrls: ['./rosout.component.scss'],
})
export class RosoutComponent implements OnInit {
    messages = new Array<RosoutMessage>();
    rosoutLevel = RosoutLevel;
    date: Date;
    constructor(private rs: RosService) {}

    ngOnInit(): void {
        this.rs.rosoutData.subscribe((msg) => {
            if (msg) {
                this.messages.push(msg);
            }
        });
    }
}
