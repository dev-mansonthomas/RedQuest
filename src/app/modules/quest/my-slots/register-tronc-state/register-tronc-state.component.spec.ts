import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterTroncStateComponent } from './register-tronc-state.component';

describe('RegisterTroncStateComponent', () => {
  let component: RegisterTroncStateComponent;
  let fixture: ComponentFixture<RegisterTroncStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterTroncStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterTroncStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
