import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TroncHistoryDialogComponent } from './tronc-history-dialog.component';

describe('TroncHistoryDialogComponent', () => {
  let component: TroncHistoryDialogComponent;
  let fixture: ComponentFixture<TroncHistoryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TroncHistoryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TroncHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
