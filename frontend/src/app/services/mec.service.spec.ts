import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MecService } from './mec.service';
import { environment } from '../../environments/environment';
import { Mec } from '../models/mec.model';

describe('MecService', () => {
    let service: MecService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [MecService]
        });
        service = TestBed.inject(MecService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('dohvati sve meceve', () => {

        const mockMatches: Mec[] = [
            { id: 1, ligaId: 1, igrac1Id: 2, igrac2Id: 3, datum: '2024-01-01', vrijeme: '10:00', rezultat: '2:1', status: 'ZAVRSEN', igrac1Ime: 'Igrac 1', igrac2Ime: 'Igrac 2' },
            { id: 2, ligaId: 1, igrac1Id: 4, igrac2Id: 5, datum: '2024-01-02', vrijeme: '11:00', rezultat: '1:3', status: 'ZAVRSEN', igrac1Ime: 'Igrac 3', igrac2Ime: 'Igrac 4' }
        ];

        service.dohvatiSveMeceve().subscribe(matches => {
            expect(matches.length).toBe(2);
            expect(matches).toEqual(mockMatches);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/mec/all`);
        expect(req.request.method).toBe('GET');
        req.flush(mockMatches);
    });

    it('kreiraj mec', () => {
        const newMatch: Mec = { id: 0, ligaId: 1, igrac1Id: 2, igrac2Id: 3, datum: '2024-01-01', vrijeme: '10:00', rezultat: '', status: 'PLANIRAN', igrac1Ime: 'Igrac 1', igrac2Ime: 'Igrac 2' };

        service.kreirajMec(newMatch).subscribe(match => {
            expect(match).toEqual(newMatch);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/mec/create`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(newMatch);
        req.flush(newMatch);
    });

    it('azuriraj mec', () => {
        const updatedMatch: Mec = { id: 1, ligaId: 1, igrac1Id: 2, igrac2Id: 3, datum: '2024-01-01', vrijeme: '10:00', rezultat: '2:1', status: 'ZAVRSEN', igrac1Ime: 'Igrac 1', igrac2Ime: 'Igrac 2' };
        const matchId = 1;
        service.azurirajMec(matchId, updatedMatch).subscribe(match => {
            expect(match).toEqual(updatedMatch);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/mec/update/${matchId}`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(updatedMatch);
        req.flush(updatedMatch);
    });

    it('obrisi mec', () => {
        const matchId = 1;

        service.obrisiMec(matchId).subscribe(response => {
            expect(response).toBeTruthy();
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/mec/${matchId}`);
        expect(req.request.method).toBe('DELETE');
        req.flush(true);
    });
});