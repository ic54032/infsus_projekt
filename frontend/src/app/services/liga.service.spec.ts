import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LigaService } from './liga.service';
import { Liga } from '../models/liga.model';

describe('LigaService', () => {
    let service: LigaService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [LigaService]
        });
        service = TestBed.inject(LigaService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });
    it('dohvati sve lige', () => {
        const mockLige: Liga[] = [
            {
                id: 1,
                naziv: 'Test Liga',
                status: 'AKTIVNA',
                datumPocetka: '2024-01-01',
                datumZavrsetka: '2024-12-31',
                format: 'Round Robin',
                max_igraca: 16
            }
        ];

        service.dohvatiSveLige().subscribe(lige => {
            expect(lige.length).toBe(1);
            expect(lige).toEqual(mockLige);
        });

        const req = httpMock.expectOne('http://localhost:8080/api/liga/all');
        expect(req.request.method).toBe('GET');
        req.flush(mockLige);
    });

    it('kreiraj novu ligu', () => {
        const newLiga: Liga = {
            id: 0,
            naziv: 'Nova Liga',
            status: 'AKTIVNA',
            datumPocetka: '2024-01-01',
            datumZavrsetka: '2024-12-31',
            format: 'Round Robin',
            max_igraca: 16
        };

        service.kreirajLigu(newLiga).subscribe(liga => {
            expect(liga).toEqual(newLiga);
        });

        const req = httpMock.expectOne('http://localhost:8080/api/liga/create');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(newLiga);
        req.flush(newLiga);
    });
    it('azuriraj ligu', () => {
        const updatedLiga: Liga = {
            id: 1,
            naziv: 'Ažurirana Liga',
            status: 'AKTIVNA',
            datumPocetka: '2024-01-01',
            datumZavrsetka: '2024-12-31',
            format: 'Round Robin',
            max_igraca: 16
        };

        service.azurirajLigu(1, updatedLiga).subscribe(liga => {
            expect(liga).toEqual(updatedLiga);
        });

        const req = httpMock.expectOne('http://localhost:8080/api/liga/update/1');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(updatedLiga);
        req.flush(updatedLiga);
    }
    );
    it('obrisi ligu', () => {
        service.obrisiLigu(1).subscribe(response => {
            expect(response).toBeTruthy();
        });

        const req = httpMock.expectOne('http://localhost:8080/api/liga/delete/1');
        expect(req.request.method).toBe('DELETE');
        req.flush({});
    }
    );
});