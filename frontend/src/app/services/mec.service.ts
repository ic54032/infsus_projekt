import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mec } from '../models/mec.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MecService {
    private apiUrl = `${environment.apiUrl}/mec`;

    constructor(private http: HttpClient) { }

    dohvatiSveMeceve(): Observable<Mec[]> {
        return this.http.get<Mec[]>(`${this.apiUrl}/all`);
    }

    dohvatiMeceveZaLigu(ligaId: number): Observable<Mec[]> {
        return this.http.get<Mec[]>(`${this.apiUrl}/liga/${ligaId}`);
    }

    kreirajMec(mecData: any): Observable<Mec> {
        console.log('MecService - Creating match with data:', mecData);
        return this.http.post<Mec>(`${this.apiUrl}/create`, mecData);
    }

    azurirajMec(id: number | undefined, mecData: any): Observable<Mec> {
        console.log('MecService - Updating match with data:', mecData);
        return this.http.post<Mec>(`${this.apiUrl}/update/${id}`, mecData);
    }

    obrisiMec(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
