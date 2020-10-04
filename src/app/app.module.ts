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
    NbThemeModule,
    NbLayoutModule,
    NbButtonModule,
    NbActionsModule,
    NbSpinnerModule,
    NbIconModule,
    NbPopoverModule,
    NbListModule,
    NbToggleModule,
    NbSidebarModule,
    NbCardModule,
    NbChatModule,
    NbSidebarService,
    NbThemeService,
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
    ],
    providers: [
        CookieService,
        NbSidebarService,
        NbThemeService,
        DeviceDetectorService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
