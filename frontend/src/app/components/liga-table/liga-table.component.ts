import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Liga } from '../../models/liga.model';
import { MatButtonModule } from '@angular/material/button';
import { StatusLige } from '../../models/status-lige.enum';

@Component({
    selector: 'app-liga-table',
    standalone: true,
    imports: [CommonModule, MatButtonModule,],
    templateUrl: './liga-table.component.html',
    styleUrls: ['./liga-table.component.scss'],
    providers: [DatePipe]
})
export class LigaTableComponent {
    @Input() lige: Liga[] = [];
    @Input() selectedLigaId: number | undefined = undefined;

    @Output() ligaSelected = new EventEmitter<Liga>();
    @Output() showDetails = new EventEmitter<Liga>();
    @Output() editLiga = new EventEmitter<Liga>();
    @Output() deleteLiga = new EventEmitter<number>();
    // Expose enum as property for template usage
    statusLige = StatusLige;

    constructor(private datePipe: DatePipe) { }

    onShowDetails(liga: Liga, event: Event): void {
        event.stopPropagation();
        this.showDetails.emit(liga);
    }

    onEdit(liga: Liga, event: Event): void {
        event.stopPropagation();
        this.editLiga.emit(liga);
    }

    onDelete(id: number | undefined, event: Event): void {
        event.stopPropagation();
        this.deleteLiga.emit(id);
    }

    onLigaClick(liga: Liga): void {
        this.ligaSelected.emit(liga);
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
