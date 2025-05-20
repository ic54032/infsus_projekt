select * from clanovi

select * from korisnici

select * from lige

select * from mecevi

select * from voditelji

DELETE FROM mecevi
WHERE id = 24;


INSERT INTO lige (naziv, datum_pocetka, datum_zavrsetka, format, max_igraca, status, voditelj_id)
VALUES 
  ('Zimska Liga', '2025-01-10', '2025-03-20', 'round-robin', 16, 'AKTIVNA', 1),
  ('Proljetna Liga', '2025-04-01', '2025-06-15', 'knockout', 12, 'ZAVRSENA', 2),
  ('Ljetna Liga', '2025-07-05', '2025-08-30', 'round-robin', 10, 'AKTIVNA', 1),
  ('Jesenska Liga', '2025-09-10', '2025-11-25', 'swiss', 14, 'NADOLAZECA', 2),
  ('Božićna Liga', '2025-12-01', '2025-12-31', 'knockout', 8, 'NADOLAZECA', 1);

  
INSERT INTO korisnici (ime, prezime, email, lozinka)
VALUES 
  ('Ivan', 'Horvat', 'ivan.horvat@example.com', 'lozinka123'),  -- ID = 1
  ('Ana', 'Marić', 'ana.maric@example.com', 'lozinka456');      -- ID = 2

-- 2. Insert into Voditelji table (joined by ID from Korisnik)
INSERT INTO voditelji (id, opis_zaduzenja, telefon)
VALUES 
  (1, 'Organizira zimske i ljetne lige', '0911234567'),
  (2, 'Zadužena za komunikaciju s članovima', '0927654321');

-- 3. Insert 5 Korisnik records for Clan
INSERT INTO korisnici (ime, prezime, email, lozinka)
VALUES 
  ('Marko', 'Kovač', 'marko.kovac@example.com', 'lozinka1'),     -- ID = 3
  ('Petra', 'Barić', 'petra.baric@example.com', 'lozinka2'),     -- ID = 4
  ('Luka', 'Jurić', 'luka.juric@example.com', 'lozinka3'),       -- ID = 5
  ('Maja', 'Rajić', 'maja.rajic@example.com', 'lozinka4'),       -- ID = 6
  ('Nikola', 'Šimić', 'nikola.simic@example.com', 'lozinka5');   -- ID = 7

-- 4. Insert into Clan table
INSERT INTO clanovi (id, nadimak)
VALUES 
  (3, 'MKovac'),
  (4, 'PetraB'),
  (5, 'LukiJ'),
  (6, 'MajaR'),
  (7, 'NikoS');
  
INSERT INTO mecevi (liga_id, igrac1, igrac2, datum, vrijeme, rezultat, status)
VALUES
  (7, 3, 4, '2025-01-15', '18:00:00', '3:2', 'ZAVRSEN'),
  (7, 5, 6, '2025-01-17', '17:30:00', '2:3', 'ZAVRSEN'),
  (7, 6, 8, '2025-01-20', '19:00:00', NULL, 'ZAKAZAN');
  (7, 4, 5, '2025-04-05', '16:00:00', '1:3', 'ZAVRSEN'),
  (7, 6, 7, '2025-04-10', '20:00:00', NULL, 'OTKAZAN'),
  (7, 3, 6, '2025-07-10', '17:00:00', NULL, 'ZAKAZAN'),
  (3, 4, 7, '2025-07-12', '18:00:00', NULL, 'U_TIJEKU'),
  (4, 5, 3, '2025-09-15', '18:30:00', '2:2', 'ZAVRSEN'),
  (5, 7, 6, '2025-12-10', '19:00:00', NULL, 'ZAKAZAN');

  
