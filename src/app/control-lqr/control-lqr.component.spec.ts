import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlLQRComponent } from './control-lqr.component';

describe('ControlLQRComponent', () => {
  let component: ControlLQRComponent;
  let fixture: ComponentFixture<ControlLQRComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlLQRComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlLQRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
