import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    providers: [DatePipe]
})
export class HeaderComponent {
    @Input() title = 'Pikado klub "Triple-double"';
    today = new Date();

    constructor(private datePipe: DatePipe) { }

    getCurrentDate(): string {
        return this.datePipe.transform(this.today, 'dd.MM.yyyy') || '';
    }
}
