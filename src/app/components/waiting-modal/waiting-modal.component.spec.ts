import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingModalComponent } from './waiting-modal.component';

describe('WaitingModalComponent', () => {
  let component: WaitingModalComponent;
  let fixture: ComponentFixture<WaitingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
