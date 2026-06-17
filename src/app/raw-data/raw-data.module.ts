import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RawDataRoutingModule } from './raw-data-routing.module';
import { RawDataPageComponent } from './raw-data-page/raw-data-page.component';
import { LqrRawDebugComponent } from './lqr-raw-debug/lqr-raw-debug.component';
import { DvlRawDataComponent } from './dvl-raw-data/dvl-raw-data.component';
import { GpioSwitchesComponent } from './gpio-switches/gpio-switches.component';
import {
    NbCardModule,
    NbIconModule,
    NbListModule,
} from '@nebular/theme';

@NgModule({
    declarations: [
        RawDataPageComponent,
        LqrRawDebugComponent,
        DvlRawDataComponent,
        GpioSwitchesComponent,
    ],
    imports: [
        CommonModule,
        RawDataRoutingModule,
        NbCardModule,
        NbListModule,
        NbIconModule,
    ],
})
export class RawDataModule {}
