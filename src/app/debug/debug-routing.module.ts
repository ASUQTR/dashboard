import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DebugPageComponent } from './debug-page/debug-page.component';

const routes: Routes = [{ path: '', component: DebugPageComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DebugRoutingModule {}
