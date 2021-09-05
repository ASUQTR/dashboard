import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavCurrentPositionDisplayComponent } from './nav-current-position-display.component';
import { NbLayoutModule, NbThemeModule, NbToastrModule } from '@nebular/theme';
import { Vector3dPipe } from '../vector3d.pipe';

describe('NavCurrentPositionDisplayComponent', () => {
    let component: NavCurrentPositionDisplayComponent;
    let fixture: ComponentFixture<NavCurrentPositionDisplayComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NavCurrentPositionDisplayComponent, Vector3dPipe],
            imports: [NbToastrModule.forRoot(), NbThemeModule.forRoot(), NbLayoutModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NavCurrentPositionDisplayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
