import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestPointComponent } from './quest-point.component';

describe('QuestPointComponent', () => {
  let component: QuestPointComponent;
  let fixture: ComponentFixture<QuestPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
