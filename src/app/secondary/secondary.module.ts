import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecondaryRoutingModule } from './secondary-routing.module';
import { SecondaryPageComponent } from './secondary-page/secondary-page.component';
import { ControlLqrParametersComponent } from './control-lqr-parameters/control-lqr-parameters.component';
import { NbButtonModule, NbCardModule, NbInputModule, NbThemeModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [SecondaryPageComponent, ControlLqrParametersComponent],
    imports: [
        CommonModule,
        SecondaryRoutingModule,
        NbCardModule,
        ReactiveFormsModule,
        NbInputModule,
        NbButtonModule,
        NbThemeModule,
    ],
})
export class SecondaryModule {}
