import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavRepositionComponent } from './nav-reposition.component';
import { NbLayoutModule, NbThemeModule, NbToastrModule } from '@nebular/theme';

describe('NavRepositionComponent', () => {
    let component: NavRepositionComponent;
    let fixture: ComponentFixture<NavRepositionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NavRepositionComponent],
            imports: [NbToastrModule.forRoot(), NbThemeModule.forRoot(), NbLayoutModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NavRepositionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
