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
    NbBadgeModule,
    NbButtonModule,
    NbCardModule,
    NbChatModule,
    NbContextMenuModule,
    NbDialogModule,
    NbGlobalLogicalPosition,
    NbIconModule,
    NbInputModule,
    NbLayoutModule,
    NbListModule,
    NbMenuModule,
    NbPopoverModule,
    NbSelectModule,
    NbSidebarModule,
    NbSidebarService,
    NbSpinnerModule,
    NbTabsetModule,
    NbThemeModule,
    NbThemeService,
    NbToastrModule,
    NbToastrService,
    NbToggleModule,
    NbTooltipModule,
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

import { NgxRoslibService } from 'ngx-roslib';

import { TrueFalsePipe } from './true-false.pipe';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { AngularFirePerformanceModule } from '@angular/fire/compat/performance';
import { FlexbeCardComponent } from './flexbe-card/flexbe-card.component';
import { FlexbeBehaviorKillswitchComponent } from './flexbe-behavior-killswitch/flexbe-behavior-killswitch.component';
import { GamepadShellComponent } from './gamepad-shell/gamepad-shell.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UpdateAvailableDialogComponent } from './update-available-dialog/update-available-dialog.component';
import { AngularFireAnalyticsModule, ScreenTrackingService } from '@angular/fire/compat/analytics';
import { AuvDisplayTabsComponent } from './auv-display-tabs/auv-display-tabs.component';
import { NavRepositionComponent } from './nav-reposition/nav-reposition.component';
import { NavTagPositionComponent } from './nav-tag-position/nav-tag-position.component';
import { NavGetPositionComponent } from './nav-get-position/nav-get-position.component';
import { Vector3dPipe } from './vector3d.pipe';
import { NavCurrentPositionDisplayComponent } from './nav-current-position-display/nav-current-position-display.component';

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
        TrueFalsePipe,
        FlexbeCardComponent,
        FlexbeBehaviorKillswitchComponent,
        GamepadShellComponent,
        UpdateAvailableDialogComponent,
        AuvDisplayTabsComponent,
        NavRepositionComponent,
        NavTagPositionComponent,
        NavGetPositionComponent,
        Vector3dPipe,
        NavCurrentPositionDisplayComponent,
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
        NbDialogModule.forRoot({
            autoFocus: false,
            closeOnBackdropClick: true,
            closeOnEsc: true,
            hasBackdrop: true,
        }),
        NbAccordionModule,
        NbInputModule,
        NbContextMenuModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAnalyticsModule,
        AngularFirePerformanceModule,
        NbTooltipModule,
        NbSelectModule,
        ReactiveFormsModule,
        NbBadgeModule,
        NbTabsetModule,
    ],
    providers: [
        CookieService,
        NbSidebarService,
        NbThemeService,
        DeviceDetectorService,
        NbToastrService,
        ScreenTrackingService,
        NgxRoslibService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
