import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Mec } from '../../models/mec.model';
import { ClanService } from '../../services/clan.service';
import { Clan } from '../../models/clan.model';

interface MecFormData {
  id?: number;
  ligaId: number;
  igrac1Id: number;
  igrac2Id: number;
  datum: string;
  vrijeme: string;
  rezultat?: string;
  status: string;
  napomena?: string;
  igrac1Ime?: string;
  igrac2Ime?: string;
}

@Component({
  selector: 'app-mec-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './mec-form-dialog.component.html',
  styleUrls: ['./mec-form-dialog.component.scss'],
})
export class MecFormDialogComponent implements OnInit {
  mecForm!: FormGroup;
  dialogTitle: string;
  igraci: Clan[] = [];

  statusOptions = ['ZAKAZAN', 'U_TIJEKU', 'ZAVRSEN', 'OTKAZAN'];

  constructor(
    public dialogRef: MatDialogRef<MecFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mec: Mec | null, ligaId: number | null },
    private fb: FormBuilder,
    private clanService: ClanService
  ) {
    this.dialogTitle = this.data.mec ? 'Uredi meč' : 'Novi meč';
  }

  ngOnInit(): void {
    this.loadIgraci();
    this.initForm();
  }

  loadIgraci(): void {
    this.clanService.dohvatiSveClanove().subscribe({
      next: (data) => {
        this.igraci = data;
      },
      error: (err) => {
        console.error('Greška prilikom dohvata igrača', err);
      }
    });
  }

  initForm(): void {
    const datePattern = '^\\d{2}\\.\\d{2}\\.\\d{4}$';
    const timePattern = '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$';

    let formattedTime = this.data.mec?.vrijeme || '18:00';

    this.mecForm = this.fb.group({
      id: [this.data.mec?.id || null],
      ligaId: [this.data.ligaId, Validators.required],
      igrac1Id: [this.data.mec?.igrac1Id || null, Validators.required],
      igrac2Id: [this.data.mec?.igrac2Id || null, Validators.required],
      datum: [
        this.formatDateForDisplay(this.data.mec?.datum) || this.getFormattedToday(),
        [Validators.required, Validators.pattern(datePattern)]
      ],
      vrijeme: [
        formattedTime,
        [Validators.required, Validators.pattern(timePattern)]
      ],
      rezultat: [this.data.mec?.rezultat || ''],
      status: [this.data.mec?.status || 'ZAKAZAN', Validators.required],
    });
  }

  formatDateForDisplay(dateString?: string): string {
    if (!dateString) return this.getFormattedToday();

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return this.getFormattedToday();

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    } catch (err) {
      return this.getFormattedToday();
    }
  }

  getFormattedToday(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}.${month}.${year}`;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.mecForm.invalid) {
      Object.keys(this.mecForm.controls).forEach(key => {
        const control = this.mecForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const formValue = this.mecForm.value;

    let datumBackend = null;
    if (formValue.datum) {
      const parts = formValue.datum.split('.');
      if (parts.length === 3) {
        datumBackend = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    const igrac1 = this.igraci.find(i => i.id === Number(formValue.igrac1Id));
    const igrac2 = this.igraci.find(i => i.id === Number(formValue.igrac2Id));

    const mecBackendDTO: MecFormData = {
      id: formValue.id,
      ligaId: formValue.ligaId,
      igrac1Id: formValue.igrac1Id,
      igrac2Id: formValue.igrac2Id,
      datum: datumBackend || this.getFormattedToday().split('.').reverse().join('-'),
      vrijeme: formValue.vrijeme,
      rezultat: formValue.rezultat || null,
      status: formValue.status
    };

    const mecData: Mec = {
      ...mecBackendDTO,
      igrac1Ime: igrac1 ? `${igrac1.ime} ${igrac1.prezime}` : 'Nepoznat',
      igrac2Ime: igrac2 ? `${igrac2.ime} ${igrac2.prezime}` : 'Nepoznat',
    };

    this.dialogRef.close({
      action: 'save',
      data: mecData,
      backendData: mecBackendDTO
    });
  }
}