import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RosRemoteComponent } from './ros-remote.component';
import { HttpClientModule } from '@angular/common/http';
import { NbIconModule, NbLayoutModule, NbThemeModule, NbToastrModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

describe('RosRemoteComponent', () => {
    let component: RosRemoteComponent;
    let fixture: ComponentFixture<RosRemoteComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RosRemoteComponent],
            imports: [
                HttpClientModule,
                NbToastrModule.forRoot(),
                NbThemeModule.forRoot(),
                NbLayoutModule,
                NbEvaIconsModule,
                NbIconModule,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RosRemoteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
