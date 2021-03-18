import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecondaryRoutingModule } from './secondary-routing.module';
import { SecondaryPageComponent } from './secondary-page/secondary-page.component';
import { ControlLqrParametersComponent } from './control-lqr-parameters/control-lqr-parameters.component';
import { NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbThemeModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { LqrParametersSaveDialogComponent } from './lqr-parameters-save-dialog/lqr-parameters-save-dialog.component';
import { ChangeLqrAttFactorComponent } from './change-lqr-att-factor/change-lqr-att-factor.component';

@NgModule({
    declarations: [
        SecondaryPageComponent,
        ControlLqrParametersComponent,
        LqrParametersSaveDialogComponent,
        ChangeLqrAttFactorComponent,
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
