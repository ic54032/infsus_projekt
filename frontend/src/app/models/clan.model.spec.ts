import { Clan } from './clan.model';

describe('Clan Model', () => {
    it('kreiraj instancu clana', () => {
        const clan: Clan = {
            id: 1,
            ime: 'Test',
            prezime: 'User',
            email: 'test@example.com',
            nadimak: 'Tester',
        };
        expect(clan).toBeTruthy();
        expect(clan.ime).toBe('Test');
        expect(clan.prezime).toBe('User');
    });

    it('provjera atributa clana', () => {
        const clan: Clan = {
            id: 1,
            ime: 'Test',
            prezime: 'User',
            email: 'test@example.com',
            nadimak: 'Tester',
        };

        expect(clan.id).toBeDefined();
        expect(clan.ime).toBeDefined();
        expect(clan.prezime).toBeDefined();
        expect(clan.email).toBeDefined();
        expect(clan.nadimak).toBeDefined();
    });
});