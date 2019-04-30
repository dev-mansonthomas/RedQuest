import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationNeededComponent } from './registration-needed.component';

describe('RegistrationNeededComponent', () => {
  let component: RegistrationNeededComponent;
  let fixture: ComponentFixture<RegistrationNeededComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationNeededComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationNeededComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
