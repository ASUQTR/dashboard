import { Component, OnInit } from '@angular/core';
import { RosService } from '../ros.service';
import { pluck } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-leak-sensor',
    templateUrl: './leak-sensor.component.html',
    styleUrls: ['./leak-sensor.component.scss'],
})
export class LeakSensorComponent implements OnInit {
    leak$: Observable<boolean>;

    constructor(private rs: RosService) {}

    ngOnInit(): void {
        this.leak$ = this.rs.leakSensorData.pipe(pluck('data'));
    }
}
