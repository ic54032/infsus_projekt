import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Clan } from '../../models/clan.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-igraci-table',
    standalone: true,
    imports: [CommonModule, MatButtonModule],
    templateUrl: './igraci-table.component.html',
    styleUrls: ['./igraci-table.component.scss']
})
export class IgraciTableComponent {
    @Input() igraci: Clan[] = [];

    @Output() showDetails = new EventEmitter<Clan>();
    @Output() editIgrac = new EventEmitter<Clan>();
    @Output() deleteIgrac = new EventEmitter<number>();

    onShowDetails(igrac: Clan, event: Event): void {
        event.stopPropagation();
        this.showDetails.emit(igrac);
    }

    onEdit(igrac: Clan, event: Event): void {
        event.stopPropagation();
        this.editIgrac.emit(igrac);
    }

    onDelete(id: number | undefined, event: Event): void {
        event.stopPropagation();
        this.deleteIgrac.emit(id);
    }
}