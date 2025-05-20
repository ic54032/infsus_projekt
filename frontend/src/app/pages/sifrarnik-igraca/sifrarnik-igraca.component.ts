import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ClanService } from '../../services/clan.service';
import { Clan } from '../../models/clan.model';
import { HeaderComponent } from '../../components/header/header.component';
import { SearchComponent } from '../../components/search/search.component';
import { IgraciTableComponent } from '../../components/igraci-table/igraci-table.component';
import { IgracFormDialogComponent } from '../../dialogs/igrac-form-dialog/igrac-form-dialog.component';
import { IgracDetailsDialogComponent } from '../../dialogs/igrac-details-dialog/igrac-details-dialog.component';

@Component({
    selector: 'app-sifrarnik-igraca',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatDialogModule,
        MatButtonModule,
        HeaderComponent,
        SearchComponent,
        IgraciTableComponent,
    ],
    templateUrl: './sifrarnik-igraca.component.html',
    styleUrls: ['./sifrarnik-igraca.component.scss'],
    providers: [DatePipe]
})
export class SifrarnikIgracaComponent implements OnInit {
    igraci: Clan[] = [];
    filtriraniIgraci: Clan[] = [];
    pretraga = '';
    loading = true;

    constructor(
        private clanService: ClanService,
        private datePipe: DatePipe,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.dohvatiIgrace();
    }

    openNewPlayerDialog(): void {
        const dialogRef = this.dialog.open(IgracFormDialogComponent, {
            width: '700px',
            data: { igrac: null, editMode: true },
            disableClose: true,
            panelClass: 'igrac-form-dialog'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.action === 'save') {
                this.handleSave(result.data);
            }
        });
    }

    showPlayerDetails(igrac: Clan): void {
        this.dialog.open(IgracDetailsDialogComponent, {
            width: '600px',
            data: { igrac }
        });
    }

    editPlayerDialog(igrac: Clan): void {
        const dialogRef = this.dialog.open(IgracFormDialogComponent, {
            width: '700px',
            data: { igrac, editMode: true },
            disableClose: true,
            panelClass: 'igrac-form-dialog'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.action === 'save') {
                this.handleSave(result.data);
            }
        });
    }

    dohvatiIgrace(): void {
        this.loading = true;
        this.clanService.dohvatiSveClanove().subscribe({
            next: (data) => {
                this.igraci = data.map(igrac => ({
                    ...igrac,
                }));
                this.filtriraniIgraci = [...this.igraci];
                this.loading = false;
            },
            error: (err) => {
                console.error('Greška prilikom dohvata igrača', err);
                this.loading = false;
            }
        });
    }

    private formatDate(date: Date): string {
        return this.datePipe.transform(date, 'dd.MM.yyyy') || '';
    }

    filtrirajIgrace(): void {
        if (!this.pretraga.trim()) {
            this.filtriraniIgraci = [...this.igraci];
            return;
        }

        const term = this.pretraga.toLowerCase();
        this.filtriraniIgraci = this.igraci.filter(igrac =>
            igrac.ime.toLowerCase().includes(term) ||
            igrac.prezime.toLowerCase().includes(term) ||
            igrac.email.toLowerCase().includes(term)
        );
    }

    handleSave(clanData: Clan): void {
        if (clanData.id) {
            this.clanService.azurirajClana(clanData.id, clanData).subscribe({
                next: (updated) => {
                    this.igraci = this.igraci.map(igrac =>
                        igrac.id === updated.id ? updated : igrac
                    );
                    this.filtrirajIgrace();
                },
                error: (err) => console.error('Greška prilikom ažuriranja igrača', err)
            });
        } else {
            this.clanService.kreirajClana(clanData).subscribe({
                next: (created) => {
                    this.igraci.push(created);
                    this.filtrirajIgrace();
                },
                error: (err) => {
                    console.error('Greška prilikom kreiranja igrača', err);
                }
            });
        }
    }

    handleDelete(igracId: number): void {
        const igrac = this.igraci.find(i => i.id === igracId);
        if (!igrac) return;

        if (confirm(`Jeste li sigurni da želite obrisati igrača ${igrac.ime} ${igrac.prezime}?`)) {
            this.clanService.obrisiClana(igracId).subscribe({
                next: () => {
                    this.igraci = this.igraci.filter(i => i.id !== igracId);
                    this.filtrirajIgrace();
                },
                error: (err) => console.error('Greška prilikom brisanja igrača', err)
            });
        }
    }

    private parseDate(dateStr: string): Date {
        if (!dateStr) return new Date();
        const parts = dateStr.split('.');
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }
}