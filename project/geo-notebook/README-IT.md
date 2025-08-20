# "geo(AI)Notebook" Parla con i tuoi Spatial Data. No Code. Solo un'idea semplice, frutto di 22 anni di lavoro.

```context
EN: geoNotebook: Talk to Your Spatial Data. No Code. 
    Just A Simple Idea, 22 Years in the Making
===
“geoNotebook: A Simple Idea, 22 Years in the Making”
- "Built in 2 weeks, powered by decades of real-world GIS work."
“geoNotebook: Talk to Your Spatial Data. No Code. Just Answers.”
- This is bold, modern, and clearly aimed at urban planners 
  and data leaders. It positions geoNotebook as a workflow shift — 
  not a marginal upgrade.
```

Pioniere di un Notebook di analisi spaziale senza codice con intelligenza artificiale e database geografico PostGIS. LLM-native geo analytics notebook. Un ibrido tra BI conversazionale e geospatial analytics.

> Nessuno script. Nessuna formula. Query riproducibili.
> 
> LLM-native Notebook for Spatial Intelligence. Live data. Natural language. No code.
> 
> Your PostGIS, finally talkative.  Query your spatial database like you think: in blocks, in questions, with maps.

Recentemente, il ho sviluppato silenziosamente una piattaforma unica nel suo genere. Si tratta di un Notebook senza codice che consente di esplorare i dati geospaziali semplicemente ponendo domande in linguaggio naturale. Pensate a questo come a un incrocio tra Word, GIS e ChatGPT, il tutto in un unico strumento **innovativo**.

![image](./screenshoots/2025-08-08%2013_02_44-Settings.png)

## Cos'è (e perché è diverso)

Ho progettato questo prodotto intenzionalmente per **integrare funzionalità mai combinate prima**. In un unico ambiente, riunisce:

- **Interfaccia utente in stile notebook:** Un'interfaccia notebook interattiva per combinare mappe, grafici, tabelle e testo in blocchi di analisi coesi.
- **Connessione PostGIS diretta:** Un collegamento in tempo reale al tuo database spaziale (PostGIS) per query di geodati di livello aziendale (senza necessità di esportazione o layer intermedi).
- **Query basate su LLM:** Un agente di intelligenza artificiale (basato su LLM) che traduce al volo domande in italiano semplice in SQL spaziale. Tu chiedi, lui interroga PostGIS per te.
- **Tutto su uno stack moderno:** Sviluppato come SaaS multipiattaforma (stack JavaScript), accessibile tramite web o desktop, garantisce un'esperienza fluida e reattiva per flussi di lavoro con dati pesanti.

**Perché è così importante?** Perché fino ad ora, fare analisi geospaziali di tipo business significava dover lottare con software GIS o scrivere codice. Secondo sondaggi di settore, la maggior parte dei potenziali utenti GIS evita questi strumenti a causa della complessità tecnica. Ho trovato il modo di rimuovere questa barriera. **Nessuno script, nessun gergo GIS: basta chiedere e vedere i risultati.**

## Perche' funziona (dietro le quinte)

- **Schema grounding**: introspezione DB + dizionario/semantica (sinonimi, unità, SRID, categorie).
- **SQL guardrails**: generazione vincolata (grammar), **validator** (pglast), whitelist funzioni PostGIS, timeout/limiti righe, explain cost, rollback sicuro.
- **Trasparenza**: pulsanti **“Show SQL”**, **“Why this?”**, **“Edit & Re-run”**.
- **Riproducibilità**: versione del prompt+SQL allegata al blocco; **snapshot** dei risultati per export.
- **Performance**: risposte grandi → **MVT/H3** per mappe, **paginazione** per tabelle, **cache** risultati.
- **Sicurezza**: RLS/permessi per schema e colonna; mascheramento PII.
- **Costi/latency**: batching, caching dei piani, modelli piccoli on-prem per query-to-SQL; LLM grande solo per casi complessi.

### Rischi (cinici) e come li gestisci

- **Hallucination/SQL sbagliato** → rail guard + explain + require-confirm su query pericolose.
- **Join errate/semantica ambigua** → semantic layer con relazioni dichiarate.
- **Query lente/costi LLM** → caching, materialized views, policy di sampling.
- **Sfiducia del team dati** → log completo, audit, modalità **“manual override”**.

### Perché fidarsi

- **SQL verificato**: generazione vincolata + validazione sintattica + limiti risorse.
- **Riproducibile**: ogni blocco salva prompt, SQL e versione dei dati.
- **On-prem o cloud**: connettori sicuri; modelli LLM locali disponibili su richiesta.

### Sezione FAQ

- **Posso vedere la query?** Sì, “Show SQL”. Puoi modificarla e rieseguire.
- **Rischio query sbagliate?** Usa vincoli, validatori e limiti. Hai sempre conferma prima di operazioni pesanti.
- **Funziona senza PostGIS?** No.
- **Dati sensibili?** Supportiamo RLS, masking e deploy on-prem.

## Metriche che misurano il valore (telemetria)

- **TTFI (time to first insight)** < 60s.
- Bassa % prompt **eseguiti al primo colpo** (senza correzione).
- (**SQL error rate** e **timeout rate**.) Le query sono validate, sottoposte a **limiti di tempo e righe**, e rispettano i **permessi RLS** del tuo database.
- **Costo medio per risposta** (LLM + DB): 15 euro/giorno per persona (utilizzo medio)

## Come funziona (in azione)

Immagina un urbanista che esplora i dati con facilità: 

```
Mostrami quali zone periferiche hanno avuto una crescita demografica 
superiore al 10% e un valore degli immobili al di sotto della media.
```

In pochi secondi, l'agente di intelligenza artificiale di geoNotebook comprende la domanda, esegue le query PostGIS appropriate e **produce una mappa, un grafico e una tabella interattiva e provvede una descrizione basata sia su questi dati, sia in base al contesto precedentemente descritto** il tutto all'interno della Nota aperta, senza usare tool esterni o fare copia incolla. L'urbanista può quindi perfezionare la domanda o aggiungere contesto in un blocco di testo, senza scrivere una sola riga di codice SQL o Python. Il sistema gestisce il lavoro più pesante (join spaziali, buffer, aggregazioni, indici spaziali come H3 e heatmaps) dietro le quinte, in modo che gli utenti possano concentrarsi sulle informazioni, non sulla sintassi.

Dietro questa semplice interfaccia, abbiamo combinato **tecnologia robusta e scelte di design**. L'interfaccia utente di geoNotebook non è solo esteticamente gradevole; è progettata per flussi di lavoro di analisi seri: pensate a documenti di ricerca riproducibili che combinano narrativa e elementi visivi. La connessione diretta al database fa sì che i dati rimangano dove si trovano (fondamentale per i team governativi e aziendali). E l'agente LLM è ottimizzato per il ragionamento spaziale, sfruttando i più recenti progressi nell'intelligenza artificiale da testo a SQL. (Infatti, ricerche recenti confermano che modelli linguistici di grandi dimensioni possono generare codice SQL geospaziale con elevata precisione, fungendo efficacemente da assistente per gli analisti GIS: esattamente ciò che vi sto descrivendo. Rif: [Is ChatGPT a Good Geospatial Data Analyst?](https://www.mdpi.com/2220-9964/13/1/26) - NSF Spatiotemporal Innovation Center,)

## Impatto per gli urbanisti e l'analisi del settore pubblico

Questo progetto nasce da esigenze reali in ambito di **pianificazione urbana, monitoraggio ambientale e urban data science**. Urbanisti e analisti del settore pubblico dispongono spesso di vasti set di dati spaziali (zonizzazione, trasporti, censimento, sensori ambientali), ma di personale limitato per analizzarli. Questo geoNotebook no-code colma questa lacuna. Consente agli esperti di porre domande spaziali complesse e ottenere risposte immediate:

- ****Pianificazione urbana:** Valuta le esigenze infrastrutturali o l'impatto della zonizzazione interrogando i database cittadini in linguaggio naturale. Visualizza immediatamente i risultati su una mappa per supportare le decisioni politiche.
- **Monitoraggio ambientale:** Monitora i cambiamenti nell'uso del suolo o identifica le aree a rischio (zone alluvionali, isole di calore) ponendo domande semplici. Ottieni grafici e mappe che si aggiornano man mano che nuovi dati dei sensori vengono inviati a PostGIS.
- **Scienza e ricerca sui dati urbani:** Analisi dei prototipi più rapide. Un ricercatore urbano può iterare sulle ipotesi senza dover scrivere codice, ad esempio correlando la qualità dell'aria con i modelli di traffico semplicemente chiedendo e lasciando che l'IA elabori i dati spaziali.

Abbassando la barriera tecnica, stiamo ampliando l'accesso all'analisi geospaziale. Come ha osservato un commento del settore, la convergenza tra GIS e IA sta **aprendo la strada ad analisi e modellazione predittiva più sofisticate nella pianificazione e nella gestione ambientale**.

> In this pilot study, we explored the possibility of using natural language to interact with geospatial datasets with the help of LLMs. The results show that LLMs can be accurate in generating SQL code for most cases, including spatial joins, although there is still room for improvement. Even when it did not generate the correct solution, most of the answers were still on the right track. This method might not completely replace human geospatial data analysts at this point, but it could serve as an assistant or drafting partner to provide a reasonable starting point. We hope that the framework can serve as a proxy to improve the efficiency of geo-analytics and reduce barriers in geospatial analysis. ([Is ChatGPT a Good Geospatial Data Analyst?](https://www.mdpi.com/2633264))

Sono orgoglioso di essere all'avanguardia in questa convergenza. Lo stack tecnologico e il design di interazione che ho creato sono stati scelti *molto deliberatamente* per servire questa missione: non si tratta di uno strumento di BI generico riconfezionato, ma di un ambiente appositamente progettato per la risoluzione di problemi spaziali riguardo alle tematiche trattate nei campi:  site location, grande distribuzione, analisi socio-demografiche, real estate, ambiente e risorse naturali, logistica, banche, sanita' e assicurazioni.

## Punti di forza

- Funzionale per raccontare analisi, report veloci, supporto per la conoscenza del progetto, valutazione dati disponibili, verifica qualitativa dei dati.
- Blocchi disponibili: mappe, grafici, tabelle, immagini, diagrammi e testuali (con corsivo, grassetto, sottilineato, elenchi puntati o numerati, ...).
- Mappe, grafici, tabelle e diagrammi, sono generati tramite Linguaggio naturale, l'agente AI provvede ad analizzare la richiesta e restituisce l'output piu' appropriato, dando indicazioni (ad esempio la stringa SQL che ha utilizzato, per verifica ulteriore della coerenza) e con possibilita' di riformulare la domanda, in modo da ottenere risultati piu' coerenti.
- Sia Cloud based, sia Desktop version con dati in locale.
- Link univoco per versione non editabile, ma interattiva da consultare come un normale PDF.
- Ogni nota effettua uno snapshot dei dati e rimangono invariati anche se i dati nel database vengono aggiornati.

In sviluppo:

- Tag per note, pin/favorites, rename inline, tooltip chiari per i bottoni.
- Progetti/ruoli. Note personali e Note condivise, grazie all'accesso multiutente.
- Possibilita' "live", in cui i dati sono aggiornati direttamente dal database.
- Generazione batch di Note basate su template definiti per elementi geografici in sequenza.
- Commenti/track changes.
- Log utilizzo LLM.

## Esempi di prompt che “vendono” il prodotto

- **Mappa**: “Mostra i cantieri aperti negli ultimi 30 giorni e colora per stato; filtra entro 500 m dalle scuole.”
- **Tabella**: “Top 10 hotspot di incidenti 2024 per municipio con variazione vs 2023.”
- **Grafico**: “Linea mensile dei nuovi permessi edilizi 2022–oggi, confronto Centro vs Periferia.”
- **Testo**: “Riassumi in 5 punti le variazioni significative rispetto al trimestre precedente.”

## Il mercato e le soluzioni alternative

Ho cercato molto prima di arrivare a questa conclusion e penso proprio di essere il primo a a proporre questa esclusiva integrazione di interfaccia utente per notebook + blocchi di mappe/grafici interattivi + PostGIS + interfaccia LLM in linguaggio naturale. È un'affermazione audace, ma ho seguito una strada tortuosa tra svariati stack, papers e slides di pitch ed eventi del settore, ma il prodotto di sua natura completamente adattabile ad ogni esigenza e pronto per essere scalato per l'uso intensivo, e' funzionante sul mio cloud.

Il prodotto è attualmente in fase di sviluppo privato, non è ancora disponibile una demo pubblica o un accesso aperto, lo sto mantenendo sotto controllo mentre ricerco sample di dati "preziosi" per il continuo perfezioniamo dell'esperienza.

Di seguito le alternative che mi permetto di dire di avere preso spunto, ma purtroppo non offrono la stessa logica e tantomeno le stesse funzionalita'.

### Perché non è Notion/Obsidian/ArcGIS

- **Vs Notion/Obsidian**: loro sono editor di documenti. Tu **esegui query reali sul DB** e mostri **mappe native**. Qui c’è calcolo, governance dati e visualizzazione geospaziale live.

- **Vs ArcGIS**: ArcGIS è una **suite GIS completa** (editing, geoprocessing, gestione dati). Tu sei **analisi e storytelling conversazionale** con latenza bassa e **zero scripting**. È **complementare** e cannibalizza solo i casi “dashboard leggera/report veloce”.

### Concorrenti mentali

| NAME                        | URL                                                                            | NO-CODE | NOTE-BLOCK | MAP     | CHART   | TABLE | DIAGRAM | ONE-PAGE | POSTGIS                      |
| --------------------------- | ------------------------------------------------------------------------------ | ------- | ---------- | ------- | ------- | ----- | ------- | -------- | ---------------------------- |
| ArcGIS Insights             | [https://doc.arcgis.com/en/insights/](https://doc.arcgis.com/en/insights/)     | ✅       | ✅          | ✅       | ✅       | ✅     | ✗       | ✅        | ✅                            |
| ArcGIS StoryMaps            | [https://storymaps.arcgis.com/](https://storymaps.arcgis.com/)                 | ✅       | ✅          | ✅       | Partial | ✗     | Partial | ✅        | ✗                            |
| Google Geospatial Reasoning | – (trusted-tester)                                                             | ✅       | ✗          | ✅       | ✅       | ✅     | ✗       | ✅        | ✗                            |
| GeoNode / MapStore          | [https://geonode.org/](https://geonode.org/)                                   | ✅       | ✅          | ✅       | ✅       | ✅     | ✅       | ✅        | ✅                            |
| Tableau (+GPT)              | [https://tableau.com/](https://tableau.com/)                                   | ✅       | ✗          | ✅       | ✅       | ✅     | ✗       | ✅        | ✅                            |
| Power BI (+Copilot)         | [https://powerbi.microsoft.com/](https://powerbi.microsoft.com/)               | ✅       | ✗          | ✅       | ✅       | ✅     | ✗       | ✅        | Partial                      |
| CARTO Workspace             | [https://carto.com/](https://carto.com/)                                       | ✅       | ✗          | ✅       | ✅       | ✅     | ✗       | ✅        | ✅                            |
| Foursquare Studio           | [https://studio.foursquare.com/](https://studio.foursquare.com/)               | ✅       | ✗          | ✅       | ✅       | ✅     | ✗       | ✅        | ✅  |
| Felt                        | [https://felt.com/](https://felt.com/)                                         | ✅       | ✅          | ✅       | Partial | ✅     | ✗       | ✅        | ✅                            |
| Fused                       | [https://fused.ai/](https://fused.ai/)                                         | Partial | ✗          | ✅       | ✅       | ✅     | ✗       | ✅        | ✅                            |
| Notion   | [https://www.notion.so/](https://www.notion.so/) | ✅       | ✅          | ✅       | ✅       | ✅       | Partial | ✅        | ✗        |
| Obsidian | [https://obsidian.md/](https://obsidian.md/)     | Partial | ✅          | Partial | Partial | Partial | ✅       | ✅        | ✗  |
| Google Docs (+ Charts) | [https://docs.google.com/](https://docs.google.com/)   | ✅       | ✅          | Partial | ✅       | ✅       | Partial | ✅        | ✗       |                                  
| Jupyter               | [https://jupyter.org/](https://jupyter.org/)           | Partial | ✅          | Partial | Partial | Partial | Partial | ✅        | Partial | 
| Observable             | [https://observablehq.com/](https://observablehq.com/) | Partial | ✅          | Partial | ✅       | ✅       | Partial | ✅        | Partial | 
| Coda                   | [https://coda.io/](https://coda.io/)                   | ✅       | ✅          | ✅       | ✅       | ✅       | Partial | ✅        | Partial |
| Quarto                 | [https://quarto.org/](https://quarto.org/)             | Partial | ✅          | Partial | Partial | Partial | ✅       | ✅        | Partial | +
| Kepler.gl | [https://kepler.gl/](https://kepler.gl/) | ✅       | ✗          | ✅   | Partial | ✅     | ✗       | Partial  | ✗ |
| Hex                         | [https://hex.tech/](https://hex.tech/)                                         | Partial | ✅          | ✅       | ✅       | ✅     | ✗       | ✅        | ✅                            |
| GeoRetina                   | [https://georetina.ai/](https://georetina.ai/)                                 | ✅       | Partial    | ✅       | ✅       | ✅     | ✗       | ✅        | ✗                            |
| Aino AI                     | [https://aino.world/](https://aino.world/)                                     | ✅       | ✗          | ✅       | ✅       | ✅     | ✗       | ✅        | ✅                            |
| Alteryx                     | [https://alteryx.com/](https://alteryx.com/)                                   | ✅       | ✗          | ✅       | ✅       | ✅     | ✅       | ✅        | ✅                            |
| Dataiku DSS                 | [https://dataiku.com/](https://dataiku.com/)                                   | ✅       | ✗          | ✅       | ✅       | ✅     | ✅       | ✅        | ✅                            |
| LLM-Geo                     | https://github.com/gladcolor/LLM-Geo                                            | ✅       | ✅          | ✅       | ✅       | ✅     | ✗       | ✗        | Partial                      |
| QGIS Spatial-Agent        | [https://plugins.qgis.org](https://plugins.qgis.org/plugins/SpatialAnalysisAgent-master/)                           | ✅       | ✗          | ✅       | ✅       | ✅     | ✗       | ✅        | ✅                            |
| Maptionnaire                | [https://maptionnaire.com/](https://maptionnaire.com/)                         | ✅       | ✅          | ✅       | ✅       | ✅     | ✗       | ✅        | ✗                            |
| Humap                       | [https://humap.me/](https://humap.me/)                                         | ✅       | ✅          | ✅       | ✗       | ✅     | ✅       | ✅        | ✗                            |
| CartoVista                  | [https://cartovista.com/](https://cartovista.com/)                             | ✅       | ✅          | ✅       | ✅       | ✅     | ✅       | ✅        | ✗                            |
| StoryMapJS                  | [https://storymap.knightlab.com/](https://storymap.knightlab.com/)             | ✅       | ✅          | ✅       | ✗       | ✗     | ✗       | ✅        | ✗                            |
| Odyssey.js                  | [https://github.com/cartodb/odyssey.js](https://github.com/cartodb/odyssey.js) | Partial | Partial    | ✅       | ✗       | ✗     | ✗       | ✅        | ✗                            |
| MapStory                    | [https://mapstory.org/](https://mapstory.org/)                                 | ✅       | ✅          | ✅       | Partial | ✅     | ✗       | ✅        | ✗                            |
| Terrastories                | [https://terrastories.app/](https://terrastories.app/)                         | ✅       | ✅          | ✅       | Partial | ✅     | ✗       | ✅        | ✗                            |
| Mode                        | [https://mode.com/](https://mode.com/)                                         | Partial | ✅          | Partial | ✅       | ✅     | ✗       | ✅        | ✅                            |
| Monarcha                    | [https://monarcha.ai/](https://monarcha.ai/)                                   | ✅       | ✗          | ✅       | ✅       | ✅     | ✗       | ✅        | ✗                            |
| Julius AI                   | [https://julius.ai/](https://julius.ai/)                                       | ✅       | ✅          | ✗       | ✅       | ✅     | ✗       | ✅        | ✅                            |
| ChatGeoPT                   | [GitHub demo](https://github.com/earth-genome/ChatGeoPT)                       | ✅       | ✗          | ✗       | ✗       | ✅     | ✗       | ✗        | ✗                            |
