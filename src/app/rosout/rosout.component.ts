import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { RosoutLevel, RosService } from '../ros.service';

@Component({
    selector: 'app-rosout',
    templateUrl: './rosout.component.html',
    styleUrls: ['./rosout.component.scss'],
})
export class RosoutComponent implements OnInit {
    messages = new Array<RosoutMessageOutput>();
    constructor(private rs: RosService) {}

    ngOnInit(): void {
        this.rs.rosoutData.subscribe((msg) => {
            console.log(msg);
            if (msg) {
                const rosoutMessage = new RosoutMessageOutput(
                    msg.msg,
                    msg.header.stamp,
                    msg.name,
                    msg.level
                );
                this.messages.push(rosoutMessage);
            }
        });
    }
}

class RosoutMessageOutput {
    text: string;
    date: Date;
    nodeName: string;
    level: string;
    constructor(text: string, date: any, nodeName: string, level: RosoutLevel) {
        this.text = text;
        this.date = new Date();
        this.date.setTime(date.secs * 1000);
        this.nodeName = nodeName;
        this.level = level.toString();
    }
}
