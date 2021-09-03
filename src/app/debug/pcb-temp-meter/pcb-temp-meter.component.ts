import { Component, OnInit } from '@angular/core';
import { RoslibService } from '../../roslib.service';
import { pluck } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-pcb-temp-meter',
    templateUrl: './pcb-temp-meter.component.html',
    styleUrls: ['./pcb-temp-meter.component.scss'],
})
export class PcbTempMeterComponent implements OnInit {
    temp: Observable<number>;

    constructor(private rs: RoslibService) {}

    ngOnInit(): void {
        this.temp = this.rs.pcbTempData.pipe(pluck('data'));
    }
}
