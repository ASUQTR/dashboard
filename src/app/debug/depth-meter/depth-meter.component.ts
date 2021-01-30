import { Component, OnInit } from '@angular/core';
import { RosService } from '../../ros.service';
import { pluck } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-depth-meter',
    templateUrl: './depth-meter.component.html',
    styleUrls: ['./depth-meter.component.scss'],
})
export class DepthMeterComponent implements OnInit {
    depth: Observable<number>;
    constructor(private rs: RosService) {}

    ngOnInit(): void {
        this.depth = this.rs.depthData.pipe(pluck('data'));
    }
}
