import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebugRoutingModule } from './debug-routing.module';
import { DebugPageComponent } from './debug-page/debug-page.component';
import { DebugMotorsComponent } from './debug-motors/debug-motors.component';
import { DepthMeterComponent } from './depth-meter/depth-meter.component';
import { PcbTempMeterComponent } from './pcb-temp-meter/pcb-temp-meter.component';
import { LeakSensorComponent } from './leak-sensor/leak-sensor.component';
import { ControlLqrDebugInfoComponent } from './control-lqr-debug-info/control-lqr-debug-info.component';
import {
    NbButtonModule,
    NbCardModule,
    NbContextMenuModule,
    NbIconModule,
    NbInputModule,
    NbListModule,
    NbThemeModule,
    NbTooltipModule,
} from '@nebular/theme';
import { MotorTableComponent } from './motor-table/motor-table.component';
import { MotorGraphComponent } from './motor-graph/motor-graph.component';
import { ChartModule } from 'angular2-chartjs';
import { Auv3dModelComponent } from './auv3d-model/auv3d-model.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        DebugPageComponent,
        DebugMotorsComponent,
        DepthMeterComponent,
        PcbTempMeterComponent,
        LeakSensorComponent,
        ControlLqrDebugInfoComponent,
        MotorTableComponent,
        MotorGraphComponent,
        Auv3dModelComponent,
    ],
    imports: [
        CommonModule,
        DebugRoutingModule,
        NbListModule,
        NbCardModule,
        NbIconModule,
        NbButtonModule,
        NbContextMenuModule,
        ChartModule,
        NbThemeModule,
        NbInputModule,
        ReactiveFormsModule,
        NbTooltipModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DebugModule {}
