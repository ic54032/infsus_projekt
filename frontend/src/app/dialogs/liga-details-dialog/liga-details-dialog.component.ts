import { Component, Inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Liga } from '../../models/liga.model';
import { Mec } from '../../models/mec.model';
import { MecTableComponent } from '../../components/mec-table/mec-table.component';
import { StatusLige } from '../../models/status-lige.enum';

@Component({
  selector: 'app-liga-details-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MecTableComponent],
  templateUrl: './liga-details-dialog.component.html',
  styleUrls: ['./liga-details-dialog.component.scss'],
  providers: [DatePipe]
})
export class LigaDetailsDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { liga: Liga, mecevi: Mec[] },
    private datePipe: DatePipe
  ) { }

  statusLige = StatusLige;

  formatDate(dateString: string | null): string {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      return this.datePipe.transform(date, 'dd.MM.yyyy') || '';
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case this.statusLige.AKTIVNA:
        return 'Aktivna';
      case this.statusLige.NADOLAZECA:
        return 'Nadolazeća';
      case this.statusLige.ZAVRSENA:
        return 'Završena';
      default:
        return status;
    }
  }
}