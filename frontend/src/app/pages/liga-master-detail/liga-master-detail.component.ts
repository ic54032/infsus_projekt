import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Liga } from '../../models/liga.model';
import { LigaService } from '../../services/liga.service';
import { MecService } from '../../services/mec.service';
import { StatusLigeLabels } from '../../models/status-lige.enum';
import { StatusMecaLabels } from '../../models/status-meca.enum';
import { DatePipe } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { SearchComponent } from '../../components/search/search.component';
import { LigaTableComponent } from '../../components/liga-table/liga-table.component';
import { LigaDetailsDialogComponent } from '../../dialogs/liga-details-dialog/liga-details-dialog.component';
import { LigaEditDialogComponent } from '../../dialogs/liga-edit-dialog/liga-edit-dialog.component';
import { Mec } from '../../models/mec.model';

@Component({
    selector: 'app-liga-master-detail',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        FormsModule,
        HeaderComponent,
        SearchComponent,
        LigaTableComponent,
    ],
    templateUrl: './liga-master-detail.component.html',
    styleUrls: ['./liga-master-detail.component.scss'],
    providers: [DatePipe]
})
export class LigaMasterDetailComponent implements OnInit {
    lige: Liga[] = [];
    filtriranaLista: Liga[] = [];
    odabranaLiga: Liga | null = null;
    mecevi: Mec[] = [];
    loading = true;
    error = '';
    pretraga = '';
    today = new Date();

    statusLabels = StatusLigeLabels;
    mecStatusLabels = StatusMecaLabels;

    constructor(
        private ligaService: LigaService,
        private mecService: MecService,
        private dialog: MatDialog,
        private datePipe: DatePipe
    ) { }

    ngOnInit(): void {
        this.dohvatiLige();
    }

    dohvatiLige(): void {
        this.loading = true;
        this.ligaService.dohvatiSveLige().subscribe({
            next: (data) => {
                this.lige = data;
                this.filtriranaLista = [...this.lige];
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Došlo je do pogreške prilikom dohvata podataka';
                this.loading = false;
                console.error(err);
            }
        });
    }

    validirajDatum(datum: string): boolean {
        const regexDatum = /^\d{2}\.\d{2}\.\d{4}$/;
        if (!regexDatum.test(datum)) return false;

        const dijelovi = datum.split('.');
        const datumObj = new Date(`${dijelovi[2]}-${dijelovi[1]}-${dijelovi[0]}`);

        if (isNaN(datumObj.getTime())) return false;

        const danas = new Date();
        return datumObj > danas;
    }

    filterLige(): void {
        if (!this.pretraga.trim()) {
            this.filtriranaLista = [...this.lige];
            return;
        }

        const term = this.pretraga.toLowerCase();
        this.filtriranaLista = this.lige.filter(liga =>
            liga.naziv.toLowerCase().includes(term)
        );
    }

    dohvatiMeceveZaLigu(nazivIliId: string | number): void {
        let naziv: string;
        if (typeof nazivIliId === 'number') {
            const liga = this.lige.find(l => l.id === nazivIliId);
            if (!liga) {
                console.error(`Liga s ID-om ${nazivIliId} nije pronađena`);
                return;
            }
            naziv = liga.naziv;
        } else {
            naziv = nazivIliId;
        }

        this.ligaService.dohvatiMeceveLige(naziv).subscribe({
            next: (data) => {
                this.mecevi = data;
            },
            error: (err) => {
                console.error('Greška prilikom dohvata mečeva', err);
                this.error = 'Došlo je do greške prilikom dohvata mečeva.';
            }
        });
    }

    showLigaDetails(liga: Liga): void {
        this.ligaService.dohvatiMeceveLige(liga.naziv).subscribe({
            next: (mecevi) => {
                this.dialog.open(LigaDetailsDialogComponent, {
                    width: '800px',
                    data: { liga, mecevi }
                });
            },
            error: (err) => {
                console.error(`Greška prilikom dohvaćanja mečeva za ligu ${liga.id}`, err);
                this.dialog.open(LigaDetailsDialogComponent, {
                    width: '800px',
                    data: { liga, mecevi: [] }
                });
            }
        });
    }

    editLiga(liga: Liga): void {
        this.ligaService.dohvatiMeceveLige(liga.naziv).subscribe({
            next: (mecevi) => {
                const dialogRef = this.dialog.open(LigaEditDialogComponent, {
                    width: '900px',
                    data: { liga, mecevi },
                    disableClose: true
                });

                dialogRef.afterClosed().subscribe(result => {
                    if (result && result.action === 'save') {
                        this.handleSaveLiga(result.data.liga, result.data.mecevi);
                    }
                });
            },
            error: (err) => {
                const dialogRef = this.dialog.open(LigaEditDialogComponent, {
                    width: '900px',
                    data: { liga, mecevi: [] },
                    disableClose: true
                });

                dialogRef.afterClosed().subscribe(result => {
                    if (result && result.action === 'save') {
                        this.handleSaveLiga(result.data.liga, result.data.mecevi);
                    }
                });
            }
        });
    }

    openNewLigaDialog(): void {
        const dialogRef = this.dialog.open(LigaEditDialogComponent, {
            width: '900px',
            data: { liga: null, mecevi: [] },
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.action === 'save') {
                this.handleSaveLiga(result.data.liga, result.data.mecevi);
            }
        });
    }

    handleDeleteLiga(ligaId: number): void {
        const liga = this.lige.find(l => l.id === ligaId);
        if (!liga) return;

        if (confirm(`Jeste li sigurni da želite obrisati ligu "${liga.naziv}"?`)) {
            this.ligaService.obrisiLigu(ligaId).subscribe({
                next: () => {
                    this.lige = this.lige.filter(l => l.id !== ligaId);
                    this.filtriranaLista = this.filtriranaLista.filter(l => l.id !== ligaId);

                    if (this.odabranaLiga?.id === ligaId) {
                        this.odabranaLiga = null;
                        this.mecevi = [];
                    }
                },
                error: (err) => {
                    console.error('Greška prilikom brisanja lige', err);
                    this.error = 'Došlo je do greške prilikom brisanja lige.';
                }
            });
        }
    }

    handleSaveLiga(liga: Liga, mecevi: Mec[]): void {
        if (liga.id) {
            this.ligaService.azurirajLigu(liga.id, liga).subscribe({
                next: (updatedLiga) => {
                    this.lige = this.lige.map(l => l.id === updatedLiga.id ? updatedLiga : l);
                    this.filtriranaLista = this.filtriranaLista.map(l => l.id === updatedLiga.id ? updatedLiga : l);

                    if (this.odabranaLiga?.id === updatedLiga.id) {
                        this.odabranaLiga = updatedLiga;
                    }

                    if (updatedLiga.id) {
                        this.handleSaveMecevi(updatedLiga.id, mecevi);
                    }
                },
                error: (err) => {
                    console.error('Greška prilikom ažuriranja lige', err);
                    this.error = 'Došlo je do greške prilikom ažuriranja lige.';
                }
            });
        } else {
            this.ligaService.kreirajLigu(liga).subscribe({
                next: (createdLiga) => {
                    this.lige.push(createdLiga);
                    this.filtriranaLista.push(createdLiga);

                    if (createdLiga.id) {
                        this.handleSaveMecevi(createdLiga.id, mecevi);
                    }
                },
                error: (err) => {
                    console.error('Greška prilikom kreiranja lige', err);
                    this.error = 'Došlo je do greške prilikom kreiranja lige.';
                }
            });
        }
    }

    private handleSaveMecevi(ligaId: number, mecevi: Mec[]): void {
        const existingMecevi = mecevi.filter(m => m.id && m.id > 0);
        const newMecevi = mecevi.filter(m => !m.id || m.id <= 0);

        let totalOperations = existingMecevi.length + newMecevi.length;
        let completedOperations = 0;

        if (totalOperations === 0) {
            this.dohvatiMeceveZaLigu(ligaId);
            return;
        }

        const checkAllOperationsComplete = () => {
            completedOperations++;
            if (completedOperations === totalOperations) {
                this.dohvatiMeceveZaLigu(ligaId);
            }
        };

        existingMecevi.forEach(mec => {
            const mecBackendData = this.prepareMecBackendData(mec, ligaId);

            this.mecService.azurirajMec(mec.id, mecBackendData).subscribe({
                next: () => {
                    console.log(`Meč ${mec.id} uspješno ažuriran`);
                    checkAllOperationsComplete();
                },
                error: (err) => {
                    console.error(`Greška prilikom ažuriranja meča ${mec.id}`, err);
                    checkAllOperationsComplete();
                }
            });
        });

        newMecevi.forEach(mec => {
            const mecBackendData = this.prepareMecBackendData(mec, ligaId);

            this.mecService.kreirajMec(mecBackendData).subscribe({
                next: () => {
                    console.log('Novi meč uspješno kreiran');
                    checkAllOperationsComplete();
                },
                error: (err) => {
                    console.error('Greška prilikom kreiranja meča', err);
                    checkAllOperationsComplete();
                }
            });
        });
    }

    private prepareMecBackendData(mec: Mec, ligaId: number): any {
        return {
            id: mec.id && mec.id > 0 ? mec.id : null,
            ligaId: ligaId,
            igrac1Id: mec.igrac1Id,
            igrac2Id: mec.igrac2Id,
            datum: mec.datum,
            vrijeme: mec.vrijeme,
            rezultat: mec.rezultat || null,
            status: mec.status
        };
    }
}
