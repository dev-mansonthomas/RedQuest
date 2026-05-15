import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CloudFunctionService } from './cloud-function.service';
import { environment } from '../../../environments/environment';
import { Queteur } from '../../model/queteur';

describe('CloudFunctionService', () => {
    let service: CloudFunctionService;
    let httpMock: HttpTestingController;
    const baseUrl = environment.cloudFunctionsBaseUrl;
    const names = environment.cloudFunctionsNames;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CloudFunctionService]
        });
        service = TestBed.inject(CloudFunctionService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpMock.verify());

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('findQueteurById$ issues GET on the find-queteur-by-id endpoint', () => {
        service.findQueteurById$().subscribe(res => expect(res).toEqual({id: 42} as any));
        const req = httpMock.expectOne(`${baseUrl}${names.findQueteurById}`);
        expect(req.request.method).toBe('GET');
        req.flush({id: 42});
    });

    it('findULDetailsByToken$ issues GET with token query param', () => {
        const token = '11111111-2222-3333-4444-555555555555';
        service.findULDetailsByToken$(token).subscribe(res => expect(res).toBeTruthy());
        const req = httpMock.expectOne(`${baseUrl}${names.findULDetailsByToken}?token=${token}`);
        expect(req.request.method).toBe('GET');
        req.flush({ul_id: 1});
    });

    it('getULPrefs$ issues GET on the get-ul-prefs endpoint', () => {
        service.getULPrefs$().subscribe();
        const req = httpMock.expectOne(`${baseUrl}${names.getULPrefs}`);
        expect(req.request.method).toBe('GET');
        req.flush({ul_id: 1});
    });

    it('getULStats$ issues GET on the get-ul-stats endpoint', () => {
        service.getULStats$().subscribe();
        const req = httpMock.expectOne(`${baseUrl}${names.getULStats}`);
        expect(req.request.method).toBe('GET');
        req.flush({ul_id: 1});
    });

    it('registerQueteur$ POSTs the queteur and returns the parsed JSON token', () => {
        const queteur = {first_name: 'a', last_name: 'b'} as Queteur;
        service.registerQueteur$(queteur).subscribe(res =>
            expect(res.queteur_registration_token).toBe('uuid-1234')
        );
        const req = httpMock.expectOne(`${baseUrl}${names.registerQueteur}`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(queteur);
        req.flush({queteur_registration_token: 'uuid-1234'});
    });

    it('retrievePreparedTroncs$ converts depart_theorique and depart to Date', () => {
        let received: any[];
        service.retrievePreparedTroncs$().subscribe(rows => received = rows);
        const req = httpMock.expectOne(`${baseUrl}${names.troncListPrepared}`);
        expect(req.request.method).toBe('GET');
        req.flush([
            {tronc_queteur_id: 1, depart_theorique: '2024-05-01T08:00:00Z', depart: '2024-05-01T08:15:00Z'},
            {tronc_queteur_id: 2, depart_theorique: '2024-05-01T10:00:00Z', depart: null}
        ]);
        expect(received[0].depart_theorique instanceof Date).toBeTrue();
        expect(received[0].depart instanceof Date).toBeTrue();
        expect(received[1].depart_theorique instanceof Date).toBeTrue();
        expect(received[1].depart).toBeNull();
    });

    it('troncStateUpdate$ POSTs the update payload', () => {
        const update = {isDepart: true, date: '2024-05-01 06:00:00', tqId: 99};
        service.troncStateUpdate$(update).subscribe(res => expect(res.success).toBeTrue());
        const req = httpMock.expectOne(`${baseUrl}${names.troncSetDepartOrRetour}`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(update);
        req.flush({success: true});
    });

    it('historiqueTroncQueteur$ issues GET on the historique endpoint', () => {
        service.historiqueTroncQueteur$().subscribe(res => expect(Array.isArray(res)).toBeTrue());
        const req = httpMock.expectOne(`${baseUrl}${names.historiqueTroncQueteur}`);
        expect(req.request.method).toBe('GET');
        req.flush([]);
    });
});
