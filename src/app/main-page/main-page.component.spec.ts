import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MainPageComponent } from './main-page.component';
import { AuvMotorDisplayComponent } from '../auv-motor-display/auv-motor-display.component';
import { ControlLQRComponent } from '../control-lqr/control-lqr.component';
import { CameraFeedComponent } from '../camera-feed/camera-feed.component';
import { GamepadComponent } from '../gamepad/gamepad.component';
import { RosoutComponent } from '../rosout/rosout.component';
import { RosRemoteComponent } from '../ros-remote/ros-remote.component';
import { HttpClientModule } from '@angular/common/http';
import { NbIconModule, NbLayoutModule, NbThemeModule, NbToastrModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { RouterTestingModule } from '@angular/router/testing';

describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [
                    MainPageComponent,
                    AuvMotorDisplayComponent,
                    ControlLQRComponent,
                    CameraFeedComponent,
                    GamepadComponent,
                    RosoutComponent,
                    RosRemoteComponent,
                ],
                imports: [
                    HttpClientModule,
                    NbToastrModule.forRoot(),
                    NbThemeModule.forRoot(),
                    NbLayoutModule,
                    NbEvaIconsModule,
                    NbIconModule,
                    RouterTestingModule.withRoutes([]),
                ],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(MainPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
