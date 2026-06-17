import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RawDataPageComponent } from './raw-data-page/raw-data-page.component';

const routes: Routes = [{ path: '', component: RawDataPageComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RawDataRoutingModule {}
