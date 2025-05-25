import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { SifrarnikIgracaComponent } from './sifrarnik-igraca.component';
import { ClanService } from '../../services/clan.service';
import { of } from 'rxjs';
import { Clan } from '../../models/clan.model';
import { IgracFormDialogComponent } from '../../dialogs/igrac-form-dialog/igrac-form-dialog.component';
import { IgracDetailsDialogComponent } from '../../dialogs/igrac-details-dialog/igrac-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';

describe('SifrarnikIgracaComponent', () => {
  let component: SifrarnikIgracaComponent;
  let fixture: ComponentFixture<SifrarnikIgracaComponent>;
  let clanService: jasmine.SpyObj<ClanService>;
  let dialog: jasmine.SpyObj<MatDialog>;

  const mockClan: Clan = {
    id: 1,
    ime: 'Marko',
    prezime: 'Marić',
    email: 'marko@example.com',
    nadimak: 'Maki'
  };

  beforeEach(async () => {
    const clanServiceSpy = jasmine.createSpyObj('ClanService', ['dohvatiSveClanove', 'kreirajClana', 'azurirajClana', 'obrisiClana']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    await TestBed.configureTestingModule({
      imports: [SifrarnikIgracaComponent, HttpClientTestingModule, MatDialogModule],
      providers: [
        { provide: ClanService, useValue: clanServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        DatePipe
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SifrarnikIgracaComponent);
    component = fixture.componentInstance;
    clanService = TestBed.inject(ClanService) as jasmine.SpyObj<ClanService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    component.igraci = [];
    component.filtriraniIgraci = [];

    clanService.dohvatiSveClanove.and.returnValue(of([]));
  });

  it('ucitaj igrace pri inicijalizaciji', () => {
    const mockIgraci = [
      { id: 1, ime: 'Marko', prezime: 'Marić', email: 'marko@example.com', nadimak: 'Maki' },
    ];
    clanService.dohvatiSveClanove.and.returnValue(of(mockIgraci));

    component.ngOnInit();

    expect(clanService.dohvatiSveClanove).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('filter radi ispravno', () => {
    component.igraci = [
      { id: 1, ime: 'Marko', prezime: 'Marić', email: 'marko@example.com', nadimak: 'Maki' },
      { id: 2, ime: 'Ana', prezime: 'Anić', email: 'ana@example.com', nadimak: 'Ani' }
    ];
    component.pretraga = 'Marko';

    component.filtrirajIgrace();

    expect(component.filtriraniIgraci.length).toBe(1);
    expect(component.filtriraniIgraci[0].ime).toBe('Marko');
  });
  it('spremi postojeceg igraca', () => {
    const updatedClan = { ...mockClan, ime: 'Petar' };
    component.igraci = [mockClan];
    clanService.azurirajClana.and.returnValue(of(updatedClan));
    spyOn(component, 'filtrirajIgrace');

    component.handleSave(updatedClan);

    expect(clanService.azurirajClana).toHaveBeenCalledWith(updatedClan.id!, updatedClan);
    expect(component.igraci[0]).toEqual(updatedClan);
    expect(component.filtrirajIgrace).toHaveBeenCalled();
  });

  it('spremi novog igraca', () => {
    const newClan = { ...mockClan, id: undefined };
    const createdClan = { ...newClan, id: 2 };
    clanService.kreirajClana.and.returnValue(of(createdClan));
    spyOn(component, 'filtrirajIgrace');

    component.handleSave(newClan);

    expect(clanService.kreirajClana).toHaveBeenCalledWith(newClan);
    expect(component.igraci).toContain(createdClan);
    expect(component.filtrirajIgrace).toHaveBeenCalled();
  });
});