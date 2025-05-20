import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Liga } from '../models/liga.model';
import { Mec } from '../models/mec.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LigaService {
    private apiUrl = `${environment.apiUrl}/liga`;

    constructor(private http: HttpClient) { }

    dohvatiSveLige(): Observable<Liga[]> {
        return this.http.get<Liga[]>(`${this.apiUrl}/all`);
    }

    dohvatiLiguPoNazivu(naziv: string): Observable<Liga> {
        return this.http.get<Liga>(`${this.apiUrl}/${naziv}`);
    }

    kreirajLigu(liga: Liga): Observable<Liga> {
        return this.http.post<Liga>(`${this.apiUrl}/create`, liga);
    }

    azurirajLigu(id: number, liga: Liga): Observable<Liga> {
        return this.http.post<Liga>(`${this.apiUrl}/update/${id}`, liga);
    }

    obrisiLigu(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
    }

    dohvatiMeceveLige(nazivLige: string): Observable<Mec[]> {
        return this.http.get<Mec[]>(`${this.apiUrl}/${nazivLige}/mecevi`);
    }
}
