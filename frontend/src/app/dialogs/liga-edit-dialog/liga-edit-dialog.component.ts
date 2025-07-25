import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Liga } from '../../models/liga.model';
import { Mec } from '../../models/mec.model';
import { MecTableComponent } from '../../components/mec-table/mec-table.component';
import { MecFormDialogComponent } from '../mec-form-dialog/mec-form-dialog.component';
import { MecService } from '../../services/mec.service';

@Component({
    selector: 'app-liga-edit-dialog',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, MecTableComponent],
    templateUrl: './liga-edit-dialog.component.html',
    styleUrls: ['./liga-edit-dialog.component.scss']
})
export class LigaEditDialogComponent implements OnInit {
    ligaForm!: FormGroup;
    dialogTitle: string;
    mecevi: Mec[] = [];

    constructor(
        public dialogRef: MatDialogRef<LigaEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { liga: Liga | null, mecevi: Mec[] },
        private fb: FormBuilder,
        private dialog: MatDialog,
        private mecService: MecService
    ) {
        this.dialogTitle = this.data.liga ? 'Uredi ligu' : 'Nova liga';
        this.mecevi = [...this.data.mecevi];
    }

    ngOnInit(): void {
        this.initForm();
    }

    initForm(): void {
        const datePattern = '^\\d{2}\\.\\d{2}\\.\\d{4}$';

        let formattedStartDate = '';
        let formattedEndDate = '';

        if (this.data.liga?.datumPocetka) {
            formattedStartDate = this.formatDateForDisplay(this.data.liga.datumPocetka);
        }

        if (this.data.liga?.datumZavrsetka) {
            formattedEndDate = this.formatDateForDisplay(this.data.liga.datumZavrsetka);
        }

        this.ligaForm = this.fb.group({
            id: [this.data.liga?.id || null],
            naziv: [this.data.liga?.naziv || '', [Validators.required, Validators.minLength(3)]],
            status: [this.data.liga?.status || 'NADOLAZECA', Validators.required],
            datumPocetka: [
                formattedStartDate || this.getFormattedToday(),
                [Validators.required, Validators.pattern(datePattern), this.futureDateValidator.bind(this)]
            ],
            datumZavrsetka: [
                formattedEndDate,
                [Validators.pattern(datePattern), this.endDateValidator.bind(this)]
            ],
            format: [this.data.liga?.format || 'Round Robin', Validators.required],
            maxIgraca: [this.data.liga?.max_igraca || 16, [Validators.required, Validators.min(1), Validators.max(100)]]
        });

        // Subscribe to date changes to update available statuses
        this.ligaForm.get('datumZavrsetka')?.valueChanges.subscribe(() => {
            this.updateAvailableStatuses();
        });

        this.ligaForm.get('datumPocetka')?.valueChanges.subscribe(() => {
            this.updateAvailableStatuses();
        });

        // Initial status update
        this.updateAvailableStatuses();
    }

    // Custom validator for future dates
    futureDateValidator(control: AbstractControl): ValidationErrors | null {
        if (!control.value) return null;

        const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
        if (!dateRegex.test(control.value)) return null;

        const parts = control.value.split('.');
        const inputDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (inputDate < today) {
            return { pastDate: true };
        }

        return null;
    }

    // Custom validator for end date
    endDateValidator(control: AbstractControl): ValidationErrors | null {
        if (!control.value) return null;

        const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
        if (!dateRegex.test(control.value)) return null;

        const startDateControl = this.ligaForm?.get('datumPocetka');
        if (!startDateControl?.value) return null;

        const startParts = startDateControl.value.split('.');
        const endParts = control.value.split('.');

        const startDate = new Date(`${startParts[2]}-${startParts[1]}-${startParts[0]}`);
        const endDate = new Date(`${endParts[2]}-${endParts[1]}-${endParts[0]}`);

        if (endDate <= startDate) {
            return { endDateBeforeStart: true };
        }

        return null;
    }

    // Update available statuses based on dates
    updateAvailableStatuses(): void {
        const endDateControl = this.ligaForm?.get('datumZavrsetka');
        const statusControl = this.ligaForm?.get('status');

        if (!endDateControl || !statusControl) return;

        const currentStatus = statusControl.value;
        const endDateValue = endDateControl.value;

        if (endDateValue) {
            const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
            if (dateRegex.test(endDateValue)) {
                const parts = endDateValue.split('.');
                const endDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                const today = new Date();
                today.setHours(23, 59, 59, 999);

                // If end date is in the past or today, allow ZAVRSENA status
                if (endDate <= today) {
                    this.canSetZavrsena = true;
                } else {
                    this.canSetZavrsena = false;
                    // If currently set to ZAVRSENA but end date is in future, change to AKTIVNA
                    if (currentStatus === 'ZAVRSENA') {
                        statusControl.setValue('AKTIVNA');
                    }
                }
            }
        } else {
            this.canSetZavrsena = false;
            if (currentStatus === 'ZAVRSENA') {
                statusControl.setValue('AKTIVNA');
            }
        }
    }

    canSetZavrsena = false;

    formatDateForDisplay(dateString: string): string {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '';

            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();

            return `${day}.${month}.${year}`;
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    }

    getFormattedToday(): string {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        return `${day}.${month}.${year}`;
    }

    openAddMecDialog(): void {
        const dialogRef = this.dialog.open(MecFormDialogComponent, {
            width: '600px',
            data: { mec: null, ligaId: this.data.liga?.id || null },
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.action === 'save') {
                if (!result.data.id) {
                    result.data.id = -Math.floor(Math.random() * 1000);
                }

                const newMec = {
                    ...result.data,
                    igrac1Ime: result.data.igrac1Ime,
                    igrac2Ime: result.data.igrac2Ime
                };

                this.mecevi.push(newMec);
            }
        });
    }

    editMec(mec: Mec): void {
        const dialogRef = this.dialog.open(MecFormDialogComponent, {
            width: '600px',
            data: { mec: mec, ligaId: this.data.liga?.id || null },
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.action === 'save') {
                const updatedMec = {
                    ...result.data,
                    igrac1Ime: result.data.igrac1Ime,
                    igrac2Ime: result.data.igrac2Ime
                };

                this.mecevi = this.mecevi.map(m =>
                    m.id === updatedMec.id ? updatedMec : m
                );
            }
        });
    }

    deleteMec(id: number): void {
        if (id > 0) {
            this.mecService.obrisiMec(id).subscribe({
                next: () => {
                    this.mecevi = this.mecevi.filter(m => m.id !== id);
                },
                error: (err: any) => {
                    console.error(`Greška prilikom brisanja meča ${id}`, err);
                    alert('Došlo je do greške prilikom brisanja meča.');
                }
            });
        } else {
            this.mecevi = this.mecevi.filter(m => m.id !== id);
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (this.ligaForm.invalid) {
            Object.keys(this.ligaForm.controls).forEach(key => {
                const control = this.ligaForm.get(key);
                control?.markAsTouched();
            });
            return;
        }

        const formValue = this.ligaForm.value;

        let datumPocetka = null;
        let datumZavrsetka = null;

        if (formValue.datumPocetka) {
            const parts = formValue.datumPocetka.split('.');
            if (parts.length === 3) {
                datumPocetka = `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
        }

        if (formValue.datumZavrsetka) {
            const parts = formValue.datumZavrsetka.split('.');
            if (parts.length === 3) {
                datumZavrsetka = `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
        }

        const ligaData: Liga = {
            id: formValue.id,
            naziv: formValue.naziv,
            status: formValue.status,
            datumPocetka: datumPocetka,
            datumZavrsetka: datumZavrsetka,
            format: formValue.format,
            max_igraca: formValue.maxIgraca
        };

        this.dialogRef.close({
            action: 'save',
            data: {
                liga: ligaData,
                mecevi: this.mecevi
            }
        });
    }
}