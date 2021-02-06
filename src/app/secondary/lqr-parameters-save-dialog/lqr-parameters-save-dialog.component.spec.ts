import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LqrParametersSaveDialogComponent } from './lqr-parameters-save-dialog.component';

describe('LqrParametersSaveDialogComponent', () => {
  let component: LqrParametersSaveDialogComponent;
  let fixture: ComponentFixture<LqrParametersSaveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LqrParametersSaveDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LqrParametersSaveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
