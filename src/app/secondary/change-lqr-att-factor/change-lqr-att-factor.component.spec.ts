import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeLqrAttFactorComponent } from './change-lqr-att-factor.component';

describe('ChangeLqrAttFactorComponent', () => {
  let component: ChangeLqrAttFactorComponent;
  let fixture: ComponentFixture<ChangeLqrAttFactorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeLqrAttFactorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeLqrAttFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
