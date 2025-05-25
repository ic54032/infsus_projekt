import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClanService } from './clan.service';
import { Clan } from '../models/clan.model';
import { StatistikaDTO } from '../models/statistikaDTO.model';

describe('ClanService', () => {
    let service: ClanService;
    let httpMock: HttpTestingController;

    const mockClan: Clan = {
        id: 1,
        ime: 'Marko',
        prezime: 'Marić',
        email: 'marko@example.com',
        nadimak: 'Maki',
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ClanService]
        });
        service = TestBed.inject(ClanService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('dohvati sve clanove', () => {
        const mockClanovi: Clan[] = [mockClan];

        service.dohvatiSveClanove().subscribe(clanovi => {
            expect(clanovi.length).toBe(1);
            expect(clanovi).toEqual(mockClanovi);
        });

        const req = httpMock.expectOne('http://localhost:8080/api/clan/all');
        expect(req.request.method).toBe('GET');
        req.flush(mockClanovi);
    });

    it('kreiraj clana', () => {
        service.kreirajClana(mockClan).subscribe(clan => {
            expect(clan).toEqual(mockClan);
        });

        const req = httpMock.expectOne('http://localhost:8080/api/clan/create');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(mockClan);
        req.flush(mockClan);
    });

    it('azuriraj clana', () => {
        const updatedClan = { ...mockClan, ime: 'Petar' };

        service.azurirajClana(1, updatedClan).subscribe(clan => {
            expect(clan).toEqual(updatedClan);
        });

        const req = httpMock.expectOne('http://localhost:8080/api/clan/update/1');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(updatedClan);
        req.flush(updatedClan);
    });

    it('obrisi clana', () => {
        service.obrisiClana(1).subscribe(response => {
            expect(response).toBeTruthy();
        });

        const req = httpMock.expectOne('http://localhost:8080/api/clan/delete/1');
        expect(req.request.method).toBe('DELETE');
        req.flush({});
    });
    it('dohvati statistiku clana', () => {
        const mockStatistika: StatistikaDTO = {
            igracId: 1,
            brojPobjeda: 10,
            brojPoraza: 5,
        }

        service.dohvatiStatistikuClana(1).subscribe(statistika => {
            expect(statistika).toEqual(mockStatistika);
        });
        const req = httpMock.expectOne('http://localhost:8080/api/clan/statistika/1');
        expect(req.request.method).toBe('GET');
        req.flush(mockStatistika);

    }
    );
});