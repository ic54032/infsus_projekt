import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IgracDetailsDialogComponent } from './igrac-details-dialog.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClanService } from '../../services/clan.service';
import { of, throwError } from 'rxjs';
import { Clan } from '../../models/clan.model';
import { StatistikaDTO } from '../../models/statistikaDTO.model';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('IgracDetailsDialogComponent', () => {
  let component: IgracDetailsDialogComponent;
  let fixture: ComponentFixture<IgracDetailsDialogComponent>;
  let clanService: jasmine.SpyObj<ClanService>;

  const mockClan: Clan = {
    id: 1,
    ime: 'Marko',
    prezime: 'Marić',
    email: 'marko.maric@gmail.com',
    nadimak: 'Maki',
  };

  const mockStatistika: StatistikaDTO = {
    igracId: 1,
    brojPobjeda: 10,
    brojPoraza: 5,
  };

  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  const mockDialogData = { igrac: mockClan };

  beforeEach(async () => {
    const clanServiceSpy = jasmine.createSpyObj('ClanService', ['dohvatiStatistikuClana']);

    await TestBed.configureTestingModule({
      imports: [IgracDetailsDialogComponent, MatDialogModule, MatButtonModule, MatProgressSpinnerModule],
      providers: [
        { provide: ClanService, useValue: clanServiceSpy },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IgracDetailsDialogComponent);
    component = fixture.componentInstance;
    clanService = TestBed.inject(ClanService) as jasmine.SpyObj<ClanService>;
  });

  it('ucitaj statistiku na inicijalizaciji', () => {
    clanService.dohvatiStatistikuClana.and.returnValue(of(mockStatistika));

    component.ngOnInit();

    expect(clanService.dohvatiStatistikuClana).toHaveBeenCalledWith(1);
    expect(component.statistika).toEqual(mockStatistika);
    expect(component.loading).toBeFalse();
    expect(component.error).toBeFalse();
  });

  it('točan izračun pobjeda', () => {
    component.statistika = mockStatistika;

    const winRate = component.getWinRate();

    expect(winRate).toBe('67%');
  });

  it('0% ako nema statistike', () => {
    component.statistika = undefined;

    const winRate = component.getWinRate();

    expect(winRate).toBe('0%');
  });

  it('zatvori dialog', () => {
    component.onClose();

    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});