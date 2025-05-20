import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Mec } from '../../models/mec.model';

@Component({
    selector: 'app-mec-table',
    standalone: true,
    imports: [CommonModule, MatButtonModule],
    templateUrl: './mec-table.component.html',
    styleUrls: ['./mec-table.component.scss'],
    providers: [DatePipe]
})
export class MecTableComponent {
    @Input() mecevi: Mec[] = [];
    @Input() readOnly = false;

    @Output() editMec = new EventEmitter<Mec>();
    @Output() deleteMec = new EventEmitter<number>();

    statusMeca = {
        ZAKAZAN: 'ZAKAZAN',
        U_TIJEKU: 'U_TIJEKU',
        ZAVRSEN: 'ZAVRSEN',
        OTKAZAN: 'OTKAZAN'
    };

    constructor(private datePipe: DatePipe) { }

    formatDate(dateString: string): string {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);
            return this.datePipe.transform(date, 'dd.MM.yyyy') || '';
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateString;
        }
    }

    onEdit(mec: Mec, event: Event): void {
        event.stopPropagation();
        this.editMec.emit(mec);
    }

    onDelete(id: number | undefined, event: Event): void {
        if (id === undefined) return;

        event.stopPropagation();
        if (confirm('Jeste li sigurni da želite obrisati ovaj meč?')) {
            this.deleteMec.emit(id);
        }
    }

    getStatusLabel(status: string): string {
        switch (status) {
            case this.statusMeca.ZAKAZAN:
                return 'Zakazan';
            case this.statusMeca.U_TIJEKU:
                return 'U tijeku';
            case this.statusMeca.ZAVRSEN:
                return 'Završen';
            case this.statusMeca.OTKAZAN:
                return 'Otkazan';
            default:
                return status;
        }
    }
}