/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SecondaryPageComponent } from './secondary-page/secondary-page.component';

const routes: Routes = [
    { path: 'main', component: MainPageComponent },
    { path: 'secondary', component: SecondaryPageComponent },
    { path: '', redirectTo: 'main', pathMatch: 'full' },
    {
        path: 'debug',
        loadChildren: () => import('./debug/debug.module').then((m) => m.DebugModule),
    },
    { path: '**', component: PageNotFoundComponent },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            enableTracing: false,
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
