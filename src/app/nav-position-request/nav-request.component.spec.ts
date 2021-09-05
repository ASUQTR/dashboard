import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavRequestComponent } from './nav-request.component';

describe('NavPositionRequestComponent', () => {
    let component: NavRequestComponent;
    let fixture: ComponentFixture<NavRequestComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NavRequestComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NavRequestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
