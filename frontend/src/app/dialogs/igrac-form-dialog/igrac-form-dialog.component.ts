import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Clan } from '../../models/clan.model';

@Component({
    selector: 'app-igrac-form-dialog',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule],
    templateUrl: './igrac-form-dialog.component.html',
    styleUrls: ['./igrac-form-dialog.component.scss']
})
export class IgracFormDialogComponent implements OnInit {
    igracForm!: FormGroup;
    dialogTitle: string;
    igrac: Clan | null;
    editMode: boolean;

    constructor(
        public dialogRef: MatDialogRef<IgracFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { igrac: Clan | null, editMode: boolean },
        private fb: FormBuilder
    ) {
        this.igrac = data.igrac;
        this.editMode = data.editMode;
        this.dialogTitle = data.igrac ? 'Uredi igrača' : 'Novi igrač';
    }

    ngOnInit(): void {
        this.initForm();
    }

    initForm(): void {
        const emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

        this.igracForm = this.fb.group({
            id: [this.igrac?.id || null],
            ime: [this.igrac?.ime || '', [Validators.required, Validators.minLength(2)]],
            prezime: [this.igrac?.prezime || '', [Validators.required, Validators.minLength(2)]],
            email: [this.igrac?.email || '', [Validators.required, Validators.pattern(emailPattern)]],
            nadimak: [this.igrac?.nadimak || '']
        });
    }

    getFormattedToday(): string {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        return `${day}.${month}.${year}`;
    }

    onDialogClose(): void {
        this.dialogRef.close();
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (this.igracForm.invalid) {
            Object.keys(this.igracForm.controls).forEach(key => {
                const control = this.igracForm.get(key);
                control?.markAsTouched();
            });
            return;
        }

        const formValue = this.igracForm.value;

        const clanData: Clan = {
            id: formValue.id,
            ime: formValue.ime,
            prezime: formValue.prezime,
            email: formValue.email,
            nadimak: formValue.nadimak
        };

        this.dialogRef.close({ action: 'save', data: clanData });
    }

}
