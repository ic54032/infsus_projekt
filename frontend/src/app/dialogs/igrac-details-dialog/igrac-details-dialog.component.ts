import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Clan } from '../../models/clan.model';
import { ClanService } from '../../services/clan.service';
import { StatistikaDTO } from '../../models/statistikaDTO.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-igrac-details-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './igrac-details-dialog.component.html',
  styleUrls: ['./igrac-details-dialog.component.scss']
})
export class IgracDetailsDialogComponent implements OnInit {
  statistika?: StatistikaDTO;
  loading = false;
  error = false;

  constructor(
    public dialogRef: MatDialogRef<IgracDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { igrac: Clan },
    private clanService: ClanService
  ) { }

  ngOnInit(): void {
    this.loadStatistika();
  }

  loadStatistika(): void {
    if (!this.data.igrac.id) return;

    this.loading = true;
    this.error = false;

    this.clanService.dohvatiStatistikuClana(this.data.igrac.id).subscribe({
      next: (data) => {
        this.statistika = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching player statistics', err);
        this.loading = false;
        this.error = true;
      }
    });
  }

  getWinRate(): string {
    if (!this.statistika) return '0%';

    const totalGames = this.statistika.brojPobjeda + this.statistika.brojPoraza;
    if (totalGames === 0) return '0%';

    const winRate = (this.statistika.brojPobjeda / totalGames) * 100;
    return `${Math.round(winRate)}%`;
  }

  onClose(): void {
    this.dialogRef.close();
  }
}