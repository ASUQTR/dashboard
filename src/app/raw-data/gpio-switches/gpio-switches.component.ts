import { Component, OnDestroy } from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';
import { RoslibService } from '../../roslib.service';

@Component({
    selector: 'app-gpio-switches',
    templateUrl: './gpio-switches.component.html',
    styleUrls: ['./gpio-switches.component.scss'],
})
export class GpioSwitchesComponent implements OnDestroy {
    killSwitch = false;
    magneticSwitch2 = false;
    magneticSwitch3 = false;

    private sub: Subscription;

    constructor(private rs: RoslibService) {
        this.sub = combineLatest([
            this.rs.killSwitchData,
            this.rs.magneticSwitch2Data,
            this.rs.magneticSwitch3Data,
        ]).subscribe(([kill, mag2, mag3]) => {
            this.killSwitch = kill.data ?? false;
            this.magneticSwitch2 = mag2.data ?? false;
            this.magneticSwitch3 = mag3.data ?? false;
        });
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
}
