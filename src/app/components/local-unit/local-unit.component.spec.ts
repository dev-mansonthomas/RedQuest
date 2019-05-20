import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalUnitComponent } from './local-unit.component';

describe('LocalUnitComponent', () => {
  let component: LocalUnitComponent;
  let fixture: ComponentFixture<LocalUnitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalUnitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
