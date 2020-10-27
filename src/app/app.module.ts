/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { FooterComponent } from './footer/footer.component';
import { GamepadComponent } from './gamepad/gamepad.component';
import { RosbridgeComponent } from './rosbridge/rosbridge.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    NbAccordionModule,
    NbActionsModule,
    NbButtonModule,
    NbCardModule,
    NbChatModule,
    NbGlobalLogicalPosition,
    NbIconModule,
    NbInputModule,
    NbLayoutModule,
    NbListModule,
    NbMenuModule,
    NbPopoverModule,
    NbSidebarModule,
    NbSidebarService,
    NbSpinnerModule,
    NbThemeModule,
    NbThemeService,
    NbToastrModule,
    NbToastrService,
    NbToggleModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { StatusComponent } from './status/status.component';
import { PopoverComponent } from './popover/popover.component';
import { ThemeChangerComponent } from './theme-changer/theme-changer.component';
import { CookieService } from 'ngx-cookie-service';
import { SidebarSettingsComponent } from './sidebar-settings/sidebar-settings.component';
import { AuvMotorDisplayComponent } from './auv-motor-display/auv-motor-display.component';
import { ViewSettingsComponent } from './view-settings/view-settings.component';
import { RosoutComponent } from './rosout/rosout.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ControlStateDisplayComponent } from './control-state-display/control-state-display.component';
import { ControlLQRComponent } from './control-lqr/control-lqr.component';
import { ControlToggleComponent } from './control-toggle/control-toggle.component';
import { RosRemoteComponent } from './ros-remote/ros-remote.component';
import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';
import { MainPageComponent } from './main-page/main-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CameraFeedComponent } from './camera-feed/camera-feed.component';
import { HttpClientModule } from '@angular/common/http';
import { SecondaryPageComponent } from './secondary-page/secondary-page.component';
import { ControlLqrParametersComponent } from './control-lqr-parameters/control-lqr-parameters.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        AppComponent,
        ToolbarComponent,
        FooterComponent,
        GamepadComponent,
        RosbridgeComponent,
        StatusComponent,
        PopoverComponent,
        ThemeChangerComponent,
        SidebarSettingsComponent,
        AuvMotorDisplayComponent,
        ViewSettingsComponent,
        RosoutComponent,
        ControlStateDisplayComponent,
        ControlLQRComponent,
        ControlToggleComponent,
        RosRemoteComponent,
        MainPageComponent,
        PageNotFoundComponent,
        CameraFeedComponent,
        SecondaryPageComponent,
        ControlLqrParametersComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        NbThemeModule.forRoot({ name: 'default' }),
        NbLayoutModule,
        NbEvaIconsModule,
        NbButtonModule,
        NbActionsModule,
        NbSpinnerModule,
        NbIconModule,
        NbPopoverModule,
        NbListModule,
        NbToggleModule,
        NbSidebarModule.forRoot(),
        NbCardModule,
        NbChatModule,
        NbMenuModule.forRoot(),
        KeyboardShortcutsModule.forRoot(),
        HttpClientModule,
        NbToastrModule.forRoot({
            limit: 3,
            position: NbGlobalLogicalPosition.TOP_END,
        }),
        NbAccordionModule,
        NbInputModule,
        ReactiveFormsModule,
    ],
    providers: [
        CookieService,
        NbSidebarService,
        NbThemeService,
        DeviceDetectorService,
        NbToastrService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
