import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavGetPositionComponent } from './nav-get-position.component';
import { NbLayoutModule, NbThemeModule, NbToastrModule } from '@nebular/theme';
import { Vector3dPipe } from '../vector3d.pipe';

describe('NavGetPositionComponent', () => {
    let component: NavGetPositionComponent;
    let fixture: ComponentFixture<NavGetPositionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NavGetPositionComponent, Vector3dPipe],
            imports: [NbToastrModule.forRoot(), NbThemeModule.forRoot(), NbLayoutModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NavGetPositionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
