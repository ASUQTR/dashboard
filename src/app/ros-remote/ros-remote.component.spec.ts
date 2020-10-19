import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RosRemoteComponent } from './ros-remote.component';

describe('RosRemoteComponent', () => {
  let component: RosRemoteComponent;
  let fixture: ComponentFixture<RosRemoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RosRemoteComponent ]
    })
    .compileComponents();
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
