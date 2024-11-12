# Progetto di Tecnologie Informatiche per il Web A.A. 2023/2024

🌐 Progetto sviluppato per il corso "Tecnologie Informatiche per il Web". Questo progetto è una web application per la gestione di gruppi di lavoro, sviluppato in due versioni: una versione in puro HTML e una versione utilizzando JavaScript.

📜 Le specifiche del progetto sono disponibili nella [documentazione](Matteo%20Leonardo%20Luraghi%20-%20Progetto%20TIW%202023-2024.pdf)

✅ Valutazione finale: 30/30L

## 🌟 Funzionalità Principali
### Versione Pure HTML

- 🔑 Registrazione e Login: Gestione dell'autenticazione utente con controlli su email, password e unicità dello username.
- 🛠 Gestione Gruppi: Creazione, visualizzazione e gestione dei gruppi di lavoro.
- 📧 Invito Partecipanti: Selezione degli utenti e invito ai gruppi con controlli sui limiti minimi e massimi di partecipanti.

### Versione RIA (JavaScript)

- ⚡ Single Page Application: L'applicazione è gestita su un'unica pagina, con aggiornamenti in tempo reale.
- 🖱 Drag & Drop: Funzionalità di drag & drop per rimuovere partecipanti dai gruppi.
- 💬 Modalità Modale: Invita i partecipanti utilizzando una finestra modale.
- 🚦 Controlli Lato Client: Verifica dei vincoli sui partecipanti e conteggio dei tentativi direttamente sul client.

## 🗂 Struttura della Repository

- [RIA](RIA): 🌐 Contiene il codice sorgente della versione RIA (Rich Internet Application), che offre un'interazione utente avanzata grazie all'uso di JavaScript.
  - [src/main/java/](RIA/src/main/java): 💻 Codice Java per la logica lato server.
  - [src/main/webapp/](RIA/src/main/webapp): 🎨 Codice HTML, CSS e JavaScript per l'interfaccia utente.

- [pure-HTML](pure-HTML): 📝 Contiene il codice sorgente della versione in puro HTML, che implementa le funzionalità di base dell'applicazione.
  - [src/main/java/](pure-HTML/src/main/java): 💻 Codice Java per la logica lato server.
  - [src/main/webapp/](pure-HTML/src/main/webapp): 🎨 Codice HTML e CSS per l'interfaccia utente.

- [tests](tests): 🔍 Contiene codice per la creazione di dati randomici da inserire nel database.

- [db.sql](db.sql): 🗄 Script SQL per creare il database necessario per l'applicazione.

## 🚀 Esecuzione Locale dell'Applicazione

Per eseguire l'applicazione in locale, assicurati di avere [Docker](https://www.docker.com/) installato. 

Segui i passaggi seguenti:

1. **Clona la repo**:
   ```bash
   git clone https://github.com/matteo-luraghi/progetto-tiw-2024.git
   cd progetto-tiw-2024
   ```

2. **Disabilita i dati randomici nel DB** (opzionale): Di default, il database viene popolato con dati randomici all'avvio.

   Se desideri avviare l'applicazione senza questi dati, puoi rimuovere la seguente riga nel file [docker-compose.yaml](docker-compose.yaml), sotto la sezione **tiw-mysql**, **volumes**:
   ```yaml
   - ./tests/dbfiller.sql:/docker-entrypoint-initdb.d/dbfiller.sql  # Fill the DB with random data at initialization
   ```

3. **Compila e avvia i container Docker**: Nella directory del progetto, esegui il seguente comando:
   ```bash
   docker compose up --build
   ```
   Questo comando creerà e avvierà i container necessari per eseguire l'applicazione e il database MySQL.

4. **Accedi all'applicazione**: Una volta avviati i container, puoi accedere alle due versioni della web app ai seguenti link:
     - Versione RIA: http://localhost:8080/ria
     - Versione Pure HTML: http://localhost:8080/pure
       
Con questi passaggi, l'applicazione sarà pronta per l'uso in locale 🎉!
