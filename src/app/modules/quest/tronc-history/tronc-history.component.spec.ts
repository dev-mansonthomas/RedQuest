import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TroncHistoryComponent } from './tronc-history.component';

describe('TroncHistoryComponent', () => {
  let component: TroncHistoryComponent;
  let fixture: ComponentFixture<TroncHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TroncHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TroncHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
