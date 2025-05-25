import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { LigaMasterDetailComponent } from './liga-master-detail.component';
import { LigaService } from '../../services/liga.service';
import { MecService } from '../../services/mec.service';
import { of, throwError } from 'rxjs';
import { Liga } from '../../models/liga.model';
import { Mec } from '../../models/mec.model';

describe('LigaMasterDetailComponent', () => {
	let component: LigaMasterDetailComponent;
	let fixture: ComponentFixture<LigaMasterDetailComponent>;
	let ligaService: jasmine.SpyObj<LigaService>;
	let mecService: jasmine.SpyObj<MecService>;
	let dialog: jasmine.SpyObj<MatDialog>;

	const mockLiga: Liga = {
		id: 1,
		naziv: 'Liga 1',
		status: 'AKTIVNA',
		datumPocetka: '2024-01-01',
		datumZavrsetka: '2024-12-31',
		format: 'Round Robin',
		max_igraca: 16
	};

	const mockMec: Mec = {
		id: 1,
		ligaId: 1,
		igrac1Id: 1,
		igrac2Id: 2,
		datum: '2024-05-01',
		vrijeme: '18:00',
		rezultat: '3:2',
		status: 'ZAVRSEN',
		igrac1Ime: 'Marko',
		igrac2Ime: 'Ana'
	};

	beforeEach(async () => {
		const ligaServiceSpy = jasmine.createSpyObj('LigaService', [
			'dohvatiSveLige',
			'dohvatiMeceveLige',
			'kreirajLigu',
			'azurirajLigu',
			'obrisiLigu'
		]);
		const mecServiceSpy = jasmine.createSpyObj('MecService', ['kreirajMec', 'azurirajMec']);
		const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

		await TestBed.configureTestingModule({
			imports: [LigaMasterDetailComponent, HttpClientTestingModule, MatDialogModule],
			providers: [
				{ provide: LigaService, useValue: ligaServiceSpy },
				{ provide: MecService, useValue: mecServiceSpy },
				{ provide: MatDialog, useValue: dialogSpy },
				DatePipe
			]
		}).compileComponents();

		fixture = TestBed.createComponent(LigaMasterDetailComponent);
		component = fixture.componentInstance;
		ligaService = TestBed.inject(LigaService) as jasmine.SpyObj<LigaService>;
		mecService = TestBed.inject(MecService) as jasmine.SpyObj<MecService>;
		dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

		ligaService.dohvatiSveLige.and.returnValue(of([]));
	});

	it('ucitaj lige na inicjalizaciji', () => {
		const mockLige = [mockLiga];
		ligaService.dohvatiSveLige.and.returnValue(of(mockLige));

		component.ngOnInit();

		expect(ligaService.dohvatiSveLige).toHaveBeenCalled();
		expect(component.lige).toEqual(mockLige);
		expect(component.filtriranaLista).toEqual(mockLige);
		expect(component.loading).toBeFalse();
	});

	it('filter radi', () => {
		component.lige = [
			mockLiga,
			{ ...mockLiga, id: 2, naziv: 'Liga 2' }
		];
		component.pretraga = 'Liga 1';

		component.filterLige();

		expect(component.filtriranaLista.length).toBe(1);
		expect(component.filtriranaLista[0].naziv).toBe('Liga 1');
	});

	it('reset filter', () => {
		component.lige = [mockLiga];
		component.filtriranaLista = [];
		component.pretraga = '';

		component.filterLige();

		expect(component.filtriranaLista).toEqual(component.lige);
	});

	it('validiraj datum', () => {
		expect(component.validirajDatum('25.12.2025')).toBeTrue();
		expect(component.validirajDatum('32.13.2020')).toBeFalse();
		expect(component.validirajDatum('01.01.2020')).toBeFalse();
		expect(component.validirajDatum('invalid')).toBeFalse();
	});

	it('dohvati meceve za određenu ligu', () => {
		const mockMecevi = [mockMec];
		component.lige = [mockLiga];
		ligaService.dohvatiMeceveLige.and.returnValue(of(mockMecevi));

		component.dohvatiMeceveZaLigu('Liga 1');

		expect(ligaService.dohvatiMeceveLige).toHaveBeenCalledWith('Liga 1');
		expect(component.mecevi).toEqual(mockMecevi);
	});

	it('ako nema lige baci error', () => {
		spyOn(console, 'error');
		ligaService.dohvatiMeceveLige.and.returnValue(throwError('Error'));

		component.dohvatiMeceveZaLigu('Liga 1');

		expect(component.error).toBe('Došlo je do greške prilikom dohvata mečeva.');
	});

	it('otvori detalje lige', () => {
		const mockMecevi = [mockMec];
		ligaService.dohvatiMeceveLige.and.returnValue(of(mockMecevi));

		component.showLigaDetails(mockLiga);

		expect(ligaService.dohvatiMeceveLige).toHaveBeenCalledWith(mockLiga.naziv);
		expect(dialog.open).toHaveBeenCalled();
	});

	it('otovri detalje iako nema meceva', () => {
		spyOn(console, 'error');
		ligaService.dohvatiMeceveLige.and.returnValue(throwError('Error'));

		component.showLigaDetails(mockLiga);

		expect(dialog.open).toHaveBeenCalledWith(jasmine.any(Function), {
			width: '800px',
			data: { liga: mockLiga, mecevi: [] }
		});
	});

	it('otvori urei prozor', () => {
		const mockDialogRef = { afterClosed: () => of({ action: 'save', data: { liga: mockLiga, mecevi: [] } }) };
		ligaService.dohvatiMeceveLige.and.returnValue(of([]));
		dialog.open.and.returnValue(mockDialogRef as any);
		spyOn(component, 'handleSaveLiga');

		component.editLiga(mockLiga);

		expect(dialog.open).toHaveBeenCalled();
		expect(component.handleSaveLiga).toHaveBeenCalled();
	});

	it('otvori nova liga prozor', () => {
		const mockDialogRef = { afterClosed: () => of({ action: 'save', data: { liga: mockLiga, mecevi: [] } }) };
		dialog.open.and.returnValue(mockDialogRef as any);
		spyOn(component, 'handleSaveLiga');

		component.openNewLigaDialog();

		expect(dialog.open).toHaveBeenCalled();
		expect(component.handleSaveLiga).toHaveBeenCalled();
	});

	it('spremanje postojeće lige', () => {
		const updatedLiga = { ...mockLiga, naziv: 'Updated Liga' };
		component.lige = [mockLiga];
		component.filtriranaLista = [mockLiga];
		ligaService.azurirajLigu.and.returnValue(of(updatedLiga));
		spyOn(component, 'handleSaveMecevi' as any);

		component.handleSaveLiga(updatedLiga, []);

		expect(ligaService.azurirajLigu).toHaveBeenCalledWith(updatedLiga.id!, updatedLiga);
		expect(component.lige[0]).toEqual(updatedLiga);
		expect(component.filtriranaLista[0]).toEqual(updatedLiga);
	});

	it('spremanje nove lige', () => {
		const newLiga = { ...mockLiga, id: undefined };
		const createdLiga = { ...newLiga, id: 2 };
		ligaService.kreirajLigu.and.returnValue(of(createdLiga));
		spyOn(component, 'handleSaveMecevi' as any);

		component.handleSaveLiga(newLiga, []);

		expect(ligaService.kreirajLigu).toHaveBeenCalledWith(newLiga);
		expect(component.lige).toContain(createdLiga);
		expect(component.filtriranaLista).toContain(createdLiga);
	});

	it('spremi kombinaciju novih i starih mečeva', () => {
		const existingMec = { ...mockMec, id: 1 };
		const newMec = { ...mockMec, id: 0 };
		mecService.azurirajMec.and.returnValue(of(existingMec));
		mecService.kreirajMec.and.returnValue(of(newMec));
		spyOn(component, 'dohvatiMeceveZaLigu');

		(component as any).handleSaveMecevi(1, [existingMec, newMec]);

		expect(mecService.azurirajMec).toHaveBeenCalled();
		expect(mecService.kreirajMec).toHaveBeenCalled();
	});

	it('should call dohvatiMeceveZaLigu when no mecevi to save', () => {
		spyOn(component, 'dohvatiMeceveZaLigu');

		(component as any).handleSaveMecevi(1, []);

		expect(component.dohvatiMeceveZaLigu).toHaveBeenCalledWith(1);
	});
});