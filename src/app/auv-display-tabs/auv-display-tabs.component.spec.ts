import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuvDisplayTabsComponent } from './auv-display-tabs.component';

describe('AuvDisplayTabsComponent', () => {
  let component: AuvDisplayTabsComponent;
  let fixture: ComponentFixture<AuvDisplayTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuvDisplayTabsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuvDisplayTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
