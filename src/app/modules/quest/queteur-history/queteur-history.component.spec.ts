import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueteurHistoryComponent } from './queteur-history.component';

describe('QueteurHistoryComponent', () => {
    let component: QueteurHistoryComponent;
    let fixture: ComponentFixture<QueteurHistoryComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ QueteurHistoryComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(QueteurHistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
