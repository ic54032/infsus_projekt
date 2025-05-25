# Spring Backend - Upute za pokretanje

Ovaj dokument sadrži upute za postavljanje i pokretanje Spring backend aplikacije za projekt infsus_projekt.

## Preduvjeti

Prije pokretanja backend aplikacije, osigurajte da imate instalirane sljedeće alate:

- Java JDK 17
- Maven (ili Gradle, ovisno koji build tool koristite)
- Baza podataka PostgreSQL
- IDE po izboru (IntelliJ IDEA, Eclipse, VS Code)

## Konfiguracija

1. Klonirajte repozitorij:
   ```bash
   git clone https://github.com/ic54032/infsus_projekt.git
   cd infsus_projekt/backend
   ```

2. Provjerite konfiguraciju baze podataka u `src/main/resources/application.properties` datoteci:
   ```properties
   # Primjer konfiguracije za MySQL
   spring.datasource.url=jdbc:mysql://localhost:3306/infsus_db
   spring.datasource.username=root
   spring.datasource.password=password
   
   # JPA/Hibernate postavke
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   ```

### Korištenjem IDE-a

1. Otvorite projekt u vašem IDE-u (IntelliJ IDEA, Eclipse, itd.)
2. Pronađite glavnu klasu aplikacije (obično ima anotaciju `@SpringBootApplication`)
3. Pokrenite glavnu klasu kao Java aplikaciju

## Provjera rada aplikacije

Nakon pokretanja, backend će biti dostupan na:

- http://localhost:8080

