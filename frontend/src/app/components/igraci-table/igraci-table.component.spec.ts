import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IgraciTableComponent } from './igraci-table.component';
import { Clan } from '../../models/clan.model';
import { MatButtonModule } from '@angular/material/button';

describe('IgraciTableComponent', () => {
	let component: IgraciTableComponent;
	let fixture: ComponentFixture<IgraciTableComponent>;

	const mockIgraci: Clan[] = [
		{
			id: 1,
			ime: 'Marko',
			prezime: 'Marić',
			email: 'marko@example.com',
			nadimak: 'Maki',
		},
		{
			id: 2,
			ime: 'Ana',
			prezime: 'Anić',
			email: 'ana@example.com',
			nadimak: 'Ani',
		}
	];

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [IgraciTableComponent, MatButtonModule]
		}).compileComponents();

		fixture = TestBed.createComponent(IgraciTableComponent);
		component = fixture.componentInstance;
	});

	it('zove funkciju showDetails, prikaz detalja', () => {
		spyOn(component.showDetails, 'emit');
		const mockEvent = new Event('click');
		spyOn(mockEvent, 'stopPropagation');

		component.onShowDetails(mockIgraci[0], mockEvent);

		expect(mockEvent.stopPropagation).toHaveBeenCalled();
		expect(component.showDetails.emit).toHaveBeenCalledWith(mockIgraci[0]);
	});

	it('prikazuje editIgrac kda je onEdit', () => {
		spyOn(component.editIgrac, 'emit');
		const mockEvent = new Event('click');
		spyOn(mockEvent, 'stopPropagation');

		component.onEdit(mockIgraci[0], mockEvent);

		expect(mockEvent.stopPropagation).toHaveBeenCalled();
		expect(component.editIgrac.emit).toHaveBeenCalledWith(mockIgraci[0]);
	});

	it('brise igraca kada je onDelete', () => {
		spyOn(component.deleteIgrac, 'emit');
		const mockEvent = new Event('click');
		spyOn(mockEvent, 'stopPropagation');

		component.onDelete(1, mockEvent);

		expect(mockEvent.stopPropagation).toHaveBeenCalled();
		expect(component.deleteIgrac.emit).toHaveBeenCalledWith(1);
	});

	it('svi igraci u tablici', () => {
		component.igraci = mockIgraci;
		fixture.detectChanges();

		const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
		expect(rows.length).toBe(2);
	});

	it('ako nema igraca prazna tablica', () => {
		expect(component.igraci).toEqual([]);
	});
});