import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SecondaryPageComponent } from './secondary-page/secondary-page.component';

const routes: Routes = [{ path: '', component: SecondaryPageComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SecondaryRoutingModule {}
