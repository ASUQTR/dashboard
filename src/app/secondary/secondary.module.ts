import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecondaryRoutingModule } from './secondary-routing.module';
import { SecondaryPageComponent } from './secondary-page/secondary-page.component';
import { ControlLqrParametersComponent } from './control-lqr-parameters/control-lqr-parameters.component';
import {
    NbButtonModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    NbThemeModule,
} from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { LqrParametersSaveDialogComponent } from './lqr-parameters-save-dialog/lqr-parameters-save-dialog.component';
import { ChangeLqrAttFactorComponent } from './change-lqr-att-factor/change-lqr-att-factor.component';
import { ChangeLqrRatesComponent } from './change-lqr-rates/change-lqr-rates.component';
import { ChangeLqrPosAngleThresholdComponent } from './change-lqr-pos-angle-threshold/change-lqr-pos-angle-threshold.component';
import { ChangeMotorsPwmOffsetComponent } from './change-lqr-pwm-offset/change-motors-pwm-offset.component';

@NgModule({
    declarations: [
        SecondaryPageComponent,
        ControlLqrParametersComponent,
        LqrParametersSaveDialogComponent,
        ChangeLqrAttFactorComponent,
        ChangeLqrRatesComponent,
        ChangeLqrPosAngleThresholdComponent,
        ChangeMotorsPwmOffsetComponent,
    ],
    imports: [
        CommonModule,
        SecondaryRoutingModule,
        NbCardModule,
        ReactiveFormsModule,
        NbInputModule,
        NbButtonModule,
        NbThemeModule,
        NbIconModule,
    ],
})
export class SecondaryModule {}
