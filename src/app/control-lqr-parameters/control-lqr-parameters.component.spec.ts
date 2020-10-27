import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlLqrParametersComponent } from './control-lqr-parameters.component';

describe('ControlLqrParametersComponent', () => {
  let component: ControlLqrParametersComponent;
  let fixture: ComponentFixture<ControlLqrParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlLqrParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlLqrParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
