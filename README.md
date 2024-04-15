# PROGETTO TECNOLOGIE INFORMATICHE PER IL WEB 2024

Matteo Leonardo Luraghi - 10772886 983996

## Specifica

### Versione pure HTML
Un’applicazione web consente la gestione di gruppi di lavoro. L’applicazione supporta registrazione 
e login mediante una pagina pubblica con opportune form. La registrazione controlla la
validità sintattica dell’indirizzo di email e l’uguaglianza tra i campi “password” e “ripeti password”.
La registrazione controlla l’unicità dello username.
Un gruppo ha un titolo, una data di creazione, una durata dell’attività in giorni e un numero
minimo e massimo di partecipanti. L’utente fa il login e, se autenticato, accede all’HOME page
che mostra l’elenco dei gruppi creati da lui e ancora attivi, l’elenco delle gruppi cui è stato invitato
e ancora attivi, e una form per creare un nuovo gruppo.
Quando l’utente seleziona un gruppo compare una pagina DETTAGLI GRUPPO che mostra i
dati del gruppo e la lista degli utenti partecipanti identificati da nome e cognome. Quando
l’utente inoltra la form di creazione di un nuovo gruppo con il bottone INVIA, appare una pagina
ANAGRAFICA con l’elenco degli utenti registrati identificati da nome e cognome e ordinata
alfabeticamente per cognome crescente.
L’utente può scegliere uno o più partecipanti dall’elenco e premere il bottone INVITA per invitarli
al gruppo. Se il numero d’invitati è inferiore di X unità rispetto al minimo ammissibile, appare di
nuovo la pagina ANAGRAFICA con un messaggio “Troppo pochi utenti selezionati, aggiungerne
almeno X”. Gli utenti precedentemente selezionati devono rimanere selezionati, ma possono
essere sostituiti, in tutto o in parte, da altri utenti. Se il numero d’invitati è superiore di X unità
rispetto al massimo ammissibile, appare di nuovo la pagina ANAGRAFICA con un messaggio
“Troppi utenti selezionati, eliminarne almeno X”. In questo caso, la pagina evidenzia nell’elenco
gli utenti scelti in precedenza come preselezionati, in modo che l’utente possa deselezionarne
alcuni. Se alla pressione del bottone INVITA il numero d’invitati rispetta i vincoli, il gruppo è
memorizzato nella base di dati e associato agli utenti invitati e l’utente è rimandato alla HOME
PAGE. Al terzo tentativo scorretto di assegnare un numero errato di invitati a un gruppo appare
una pagina CANCELLAZIONE con un messaggio “Tre tentativi di definire un gruppo con un
numero di partecipanti errato, il gruppo non sarà creato” e un link per tornare all’HOME PAGE. In
questo caso il gruppo NON è memorizzato nella base di dati. L’applicazione non deve registrare
nella base di dati gruppi con numero errato di partecipanti. L’applicazione consente il logout
dell’utente.
### Versione con JavaScript
Si realizzi un’applicazione client-server web che modifica le specifiche precedenti come segue:
- L’applicazione supporta registrazione e login mediante una pagina pubblica con opportune
form. La registrazione controlla la validità sintattica dell’indirizzo di email e l’uguaglianza
tra i campi “password” e “ripeti password”, anche a lato client. La registrazione controlla
l’unicità dello username.
- Dopo il login dell’utente, l’intera applicazione è realizzata con un’unica pagina.
- Ogni interazione dell’utente è gestita senza ricaricare completamente la pagina, ma produ-
ce l’invocazione asincrona del server e l’eventuale modifica del contenuto da aggiornare a
seguito dell’evento.
- Nella pagina DETTAGLI GRUPPO se l’utente è il creatore del gruppo appare l’icona di un
cestino. L’utente può trascinare il nome e cognome di un partecipante sul cestino per
cancellarne la partecipazione. A seguito del rilascio sul cestino l’applicazione controlla che
sia rispettato il numero minimo di partecipanti. Se il vincolo è rispettato l’operazione è
eseguita nella base di dati e un messaggio di conferma viene emesso. Se il vincolo NON è
rispettato l’operazione NON è eseguita nella base di dati e un messaggio di diniego viene
emesso
- La scelta dall’anagrafica deve essere realizzata con una pagina modale con i bottoni invia e
cancella.
NB: una pagina modale è una finestra che si apre per dare una qualche scelta o un qualche
messaggio all’utente: [Finestra Modale](https://it.wikipedia.org/wiki/Finestra_modale)
- I controlli di correttezza del numero di invitati e del massimo numero di tentativi, con i
relativi messaggi di avvertimento, devono essere realizzati anche a lato client.
- Lo stato dell’interazione (numero di tentativi) deve essere memorizzato a lato client.
