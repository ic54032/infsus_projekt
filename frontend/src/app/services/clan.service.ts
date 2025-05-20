import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Clan } from '../models/clan.model';
import { environment } from '../../environments/environment';
import { StatistikaDTO } from '../models/statistikaDTO.model';

@Injectable({
    providedIn: 'root'
})
export class ClanService {
    private apiUrl = `${environment.apiUrl}/clan`;

    constructor(private http: HttpClient) { }

    dohvatiSveClanove(): Observable<Clan[]> {
        return this.http.get<Clan[]>(`${this.apiUrl}/all`);
    }

    dohvatiClanaPremId(id: number): Observable<Clan> {
        return this.http.get<Clan>(`${this.apiUrl}/${id}`);
    }

    dohvatiClanaPremEmail(email: string): Observable<Clan> {
        return this.http.get<Clan>(`${this.apiUrl}/email/${email}`);
    }

    kreirajClana(clan: Clan): Observable<Clan> {
        return this.http.post<Clan>(`${this.apiUrl}/create`, clan);
    }

    azurirajClana(id: number, clan: Clan): Observable<Clan> {
        return this.http.post<Clan>(`${this.apiUrl}/update/${id}`, clan);
    }

    obrisiClana(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
    }

    dohvatiStatistikuClana(id: number): Observable<StatistikaDTO> {
        return this.http.get<StatistikaDTO>(`${this.apiUrl}/statistika/${id}`);
    }
}
