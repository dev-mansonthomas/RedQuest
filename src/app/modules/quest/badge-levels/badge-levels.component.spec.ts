import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeLevelsComponent } from './badge-levels.component';

describe('BadgeLevelsComponent', () => {
    let component: BadgeLevelsComponent;
    let fixture: ComponentFixture<BadgeLevelsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ BadgeLevelsComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BadgeLevelsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
