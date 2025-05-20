import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
    selector: 'app-search',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    @Input() placeholder = 'Pretraži...';
    @Output() searchChange = new EventEmitter<string>();

    searchTerm = '';
    private searchSubject = new Subject<string>();

    ngOnInit(): void {
        this.searchSubject.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(term => {
            this.searchChange.emit(term);
        });
    }

    onSearch(): void {
        this.searchSubject.next(this.searchTerm);
    }
}
