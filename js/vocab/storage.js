/*
 * Atomarer Zustandscontainer fuer den Vokabeltrainer.
 * Ein gemeinsamer, versionierter Storage-Key pro profileId+fachKey:
 *   srs_<profileId>_<fachKey>_state_v1
 * enthaelt progress + activeSession + eventState + migrationState in EINEM
 * Objekt. Jede Antwort wird ueber wendeAntwortEreignisAn() in genau einem
 * store.setItem()-Aufruf konsistent gehalten (keine getrennten Keys mehr).
 *
 * `store` ist ueberall ein injizierbares Objekt { getItem, setItem } -
 * im Browser der echte `localStorage`, in Tests ein einfaches Mock.
 */
(function (root, factory) {
  var api = factory(
    typeof module !== "undefined" && module.exports ? require("./model.js") : root.SCHULWEG_VOCAB.model,
    typeof module !== "undefined" && module.exports ? require("./srs.js") : root.SCHULWEG_VOCAB.srs
  );
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else { root.SCHULWEG_VOCAB = root.SCHULWEG_VOCAB || {}; root.SCHULWEG_VOCAB.storage = api; }
})(typeof window !== "undefined" ? window : global, function (model, srsModul) {
  "use strict";

  function containerKey(profileId, fachKey) {
    return "srs_" + profileId + "_" + fachKey + "_state_v1";
  }
  function altHardKey(profilName, fachKey) { return "vok_" + profilName + "_" + fachKey + "_hard"; }
  function altPtrKey(profilName, fachKey) { return "vok_" + profilName + "_" + fachKey + "_ptr"; }

  function leererContainer(profileId, fachKey, heute) {
    return {
      schemaVersion: 1,
      profileId: profileId,
      fachKey: fachKey,
      progress: {},
      activeSession: null,
      eventState: { sessionId: null, lastAppliedSequenceNumber: 0, recentEventIds: [] },
      migrationState: { hardV1Completed: false, completedAt: null, altPtrObserved: null },
      updatedAt: heute || null
    };
  }

  function tiefeKopie(obj) { return JSON.parse(JSON.stringify(obj)); }

  var UNTERSTUETZTE_SCHEMA_VERSION = 1;

  /**
   * Laedt+validiert den Container. Schreibt NIE etwas.
   * @returns {{status: "empty"|"ok"|"corruptState"|"unsupportedSchema", container: object|null, raw: string|null}}
   */
  function ladeZustand(profileId, fachKey, store, heute) {
    var key = containerKey(profileId, fachKey);
    var raw;
    try { raw = store.getItem(key); } catch (e) { return { status: "corruptState", container: null, raw: null }; }
    if (raw == null) return { status: "empty", container: leererContainer(profileId, fachKey, heute), raw: null };
    var parsed;
    try { parsed = JSON.parse(raw); } catch (e) { return { status: "corruptState", container: null, raw: raw }; }
    if (!parsed || typeof parsed !== "object" || !parsed.progress || typeof parsed.progress !== "object") {
      return { status: "corruptState", container: null, raw: raw };
    }
    var version = typeof parsed.schemaVersion === "number" ? parsed.schemaVersion : 1;
    if (version > UNTERSTUETZTE_SCHEMA_VERSION) {
      return { status: "unsupportedSchema", container: parsed, raw: raw };
    }
    return { status: "ok", container: parsed, raw: null };
  }

  /**
   * Reine Berechnung: bekommt den bereits geladenen Container, fuehrt KEINE
   * Storage-Operation aus. status siehe Kopf der Datei.
   */
  function berechneAntwortErgebnis(container, event, dependencies) {
    var config = dependencies.config, heute = dependencies.heute;

    if (!container.activeSession) {
      return { status: "noActiveSession", container: container };
    }
    var session = container.activeSession;
    if (event.sessionId !== session.sessionId) {
      return { status: "foreignSession", container: container };
    }
    if (event.sessionId !== container.eventState.sessionId) {
      return { status: "foreignSession", container: container };
    }
    // Duplikat-/Sequenzpruefung LAUFEN VOR der Queue-Item-Bindung: ein
    // erneut gesendetes (bereits angewendetes) Event darf nicht als
    // queueItemMismatch erscheinen, nur weil sich currentPosition durch die
    // erste (bereits erfolgreiche) Verarbeitung inzwischen weiterbewegt hat.
    if (container.eventState.recentEventIds.indexOf(event.eventId) !== -1) {
      return { status: "duplicateEvent", container: container };
    }
    if (event.sequenceNumber <= container.eventState.lastAppliedSequenceNumber) {
      return { status: "staleSequence", container: container };
    }
    if (event.sequenceNumber > container.eventState.lastAppliedSequenceNumber + 1) {
      return { status: "sequenceGap", container: container };
    }
    // Erst jetzt (echtes, neues, in-Sequenz-Event) die Bindung an den
    // aktuell faelligen Queue-Eintrag pruefen.
    var qi = session.queue[session.currentPosition];
    if (!qi) {
      return { status: "queueItemMismatch", container: container };
    }
    if (qi.itemId !== event.itemId || qi.vocabularyId !== event.vocabularyId || qi.taskType !== event.taskType) {
      return { status: "queueItemMismatch", container: container };
    }

    // --- angewendet ---
    var neu = tiefeKopie(container);
    var neueSession = neu.activeSession;
    var neuesQi = neueSession.queue[neueSession.currentPosition];

    var isRetry = neuesQi.purpose === "retry";
    var korrekt = event.result === "correct";
    var srsErgebnis = srsModul.verarbeiteAntwort(
      neu.progress[event.vocabularyId] || null,
      event.vocabularyId,
      {
        taskType: event.taskType,
        correct: korrekt,
        isRetry: isRetry,
        stageBeforeFailure: neuesQi.stageBeforeFailure,
        errorType: event.errorType || null
      },
      config,
      heute
    );
    neu.progress[event.vocabularyId] = srsErgebnis.progress;

    neueSession.answers.push({
      vocabularyId: event.vocabularyId,
      taskType: event.taskType,
      richtig: korrekt,
      hilfeGenutzt: !!event.hilfeGenutzt,
      zeit: event.answeredAt
    });
    var beantwortetePosition = neueSession.currentPosition;
    neueSession.currentPosition = beantwortetePosition + 1;
    neueSession.updatedAt = heute;

    if (srsErgebnis.retryNeeded) {
      var scheduledAfterPosition = neueSession.currentPosition + (config.RETRY_AFTER_TASKS || 2) - 1;
      var retryEintrag = {
        itemId: neuesQi.itemId + "_retry" + (neuesQi.attempt + 1),
        vocabularyId: neuesQi.vocabularyId,
        taskType: neuesQi.taskType,
        purpose: "retry",
        attempt: neuesQi.attempt + 1,
        retryOf: neuesQi.itemId,
        scheduledAfterPosition: scheduledAfterPosition,
        stageBeforeFailure: srsErgebnis.stageBeforeFailure,
        failureEventId: event.eventId
      };
      var einfuegePos = Math.min(neueSession.queue.length, scheduledAfterPosition);
      neueSession.queue.splice(einfuegePos, 0, retryEintrag);
    }

    neu.eventState.lastAppliedSequenceNumber = event.sequenceNumber;
    var neueIds = neu.eventState.recentEventIds.concat([event.eventId]);
    var max = config.RECENT_EVENT_IDS_MAX || 50;
    if (neueIds.length > max) neueIds = neueIds.slice(neueIds.length - max);
    neu.eventState.recentEventIds = neueIds;
    neu.updatedAt = heute;

    return { status: "applied", container: neu };
  }

  /**
   * Orchestrierung, einzige Funktion mit Schreibzugriff fuer Antwort-Events.
   */
  function wendeAntwortEreignisAn(profileId, fachKey, event, dependencies) {
    var geladen = ladeZustand(profileId, fachKey, dependencies.store, dependencies.heute);
    if (geladen.status === "corruptState") return { status: "corruptState", raw: geladen.raw };
    if (geladen.status === "unsupportedSchema") return { status: "unsupportedSchema" };

    var ergebnis = berechneAntwortErgebnis(geladen.container, event, dependencies);
    if (ergebnis.status !== "applied") return { status: ergebnis.status };

    try {
      dependencies.store.setItem(containerKey(profileId, fachKey), JSON.stringify(ergebnis.container));
    } catch (e) {
      return { status: "storageError" };
    }
    return { status: "applied", container: ergebnis.container };
  }

  /**
   * Einzige Stelle, die eventState zuruecksetzt. Ueberschreibt NIE eine
   * bereits laufende Sitzung (Ueberschreibschutz).
   */
  function starteNeueSitzung(profileId, fachKey, sessionId, einheitTyp, sections, queue, store, heute) {
    var geladen = ladeZustand(profileId, fachKey, store, heute);
    if (geladen.status === "corruptState") return { status: "corruptState", raw: geladen.raw };
    if (geladen.status === "unsupportedSchema") return { status: "unsupportedSchema" };

    var container = tiefeKopie(geladen.container);
    if (container.activeSession !== null) {
      return { status: "activeSessionExists" };
    }
    container.activeSession = {
      sessionId: sessionId,
      einheitTyp: einheitTyp,
      sections: sections,
      queue: queue,
      currentPosition: 0,
      answers: [],
      startedAt: heute,
      updatedAt: heute
    };
    container.eventState = { sessionId: sessionId, lastAppliedSequenceNumber: 0, recentEventIds: [] };
    container.updatedAt = heute;

    try { store.setItem(containerKey(profileId, fachKey), JSON.stringify(container)); }
    catch (e) { return { status: "storageError" }; }
    return { status: "started", container: container };
  }

  /**
   * Entfernt ausschliesslich die aktive Sitzung. progress/migrationState
   * bleiben unberuehrt.
   */
  function verwerfeAktiveSitzung(profileId, fachKey, store, heute) {
    var geladen = ladeZustand(profileId, fachKey, store, heute);
    if (geladen.status === "corruptState") return { status: "corruptState", raw: geladen.raw };
    if (geladen.status === "unsupportedSchema") return { status: "unsupportedSchema" };

    var container = tiefeKopie(geladen.container);
    container.activeSession = null;
    container.updatedAt = heute;

    try { store.setItem(containerKey(profileId, fachKey), JSON.stringify(container)); }
    catch (e) { return { status: "storageError" }; }
    return { status: "discarded", container: container };
  }

  /**
   * Liest die alten namensbasierten Schlüssel (vok_<Profilname>_<fachKey>_hard/_ptr)
   * unveraendert; loescht sie NIE.
   */
  function ladeAltdaten(profilNameOderListe, fachKey, store) {
    // F-02: Ein Profil kann umbenannt worden sein; die Altdaten liegen dann
    // weiterhin unter dem FRUEHEREN Namen. Es werden daher alle bekannten
    // Namenskandidaten der Reihe nach geprueft (aktueller Name zuerst).
    var kandidaten = Array.isArray(profilNameOderListe) ? profilNameOderListe : [profilNameOderListe];
    for (var i = 0; i < kandidaten.length; i++) {
      var treffer = ladeAltdatenFuerNamen(kandidaten[i], fachKey, store);
      if (Object.keys(treffer.hard).length > 0 || treffer.ptr !== null) {
        treffer.gefundenUnter = kandidaten[i];
        return treffer;
      }
    }
    return { hard: {}, ptr: null, gefundenUnter: null };
  }

  function ladeAltdatenFuerNamen(profilName, fachKey, store) {
    var hard = {};
    try {
      var rawHard = store.getItem(altHardKey(profilName, fachKey));
      var parsed = rawHard ? JSON.parse(rawHard) : {};
      if (parsed && typeof parsed === "object") hard = parsed;
    } catch (e) { hard = {}; }
    var ptr = null;
    try {
      var rawPtr = store.getItem(altPtrKey(profilName, fachKey));
      if (rawPtr != null) {
        var n = parseInt(rawPtr, 10);
        if (!isNaN(n)) ptr = n;
      }
    } catch (e) { ptr = null; }
    return { hard: hard, ptr: ptr };
  }

  /**
   * Migriert ausschliesslich `hard` (belastbare Evidenz) in progress.
   * `ptr` wird rein informativ unter migrationState.altPtrObserved notiert -
   * erzeugt KEINEN Fortschrittseintrag und beeinflusst keine Entscheidung.
   * Liest die Altdaten ueber den BISHERIGEN Profilnamen, speichert das
   * Ergebnis unter profileId. Idempotent (migrationState.hardV1Completed).
   */
  function migriereHardInContainer(profileId, profilName, fachKey, alleVokabelnNormalisiert, store, heute) {
    var geladen = ladeZustand(profileId, fachKey, store, heute);
    if (geladen.status === "corruptState") return { status: "corruptState", raw: geladen.raw };
    if (geladen.status === "unsupportedSchema") return { status: "unsupportedSchema" };

    var container = tiefeKopie(geladen.container);
    if (container.migrationState.hardV1Completed) {
      return { status: "alreadyMigrated", container: container };
    }

    var alt = ladeAltdaten(profilName, fachKey, store);
    Object.keys(alt.hard).forEach(function (idxStr) {
      var anzahl = alt.hard[idxStr];
      if (!(anzahl > 0)) return;
      var idx = parseInt(idxStr, 10);
      if (isNaN(idx) || idx < 0 || idx >= alleVokabelnNormalisiert.length) return;
      var vokabel = alleVokabelnNormalisiert[idx];
      if (!vokabel || !vokabel.id) return;
      var fortschritt = srsModul.leeresFortschritt(vokabel.id);
      fortschritt.stage = 0;
      fortschritt.dueDate = heute;
      fortschritt.incorrectAnswers = anzahl;
      fortschritt.updatedAt = heute;
      container.progress[vokabel.id] = fortschritt;
    });

    container.migrationState = {
      hardV1Completed: true,
      completedAt: heute,
      altPtrObserved: alt.ptr
    };
    container.updatedAt = heute;

    try { store.setItem(containerKey(profileId, fachKey), JSON.stringify(container)); }
    catch (e) { return { status: "storageError" }; }
    return { status: "migrated", container: container };
  }

  /**
   * Optionales Recovery-Backup eines beschaedigten Rohwerts. Schreibt NUR,
   * wenn dieser Schreibvorgang selbst erfolgreich ist.
   */
  function sichereBeschaedigtenContainer(profileId, fachKey, rawValue, store, zeitstempel) {
    var key = "srs_" + profileId + "_" + fachKey + "_corrupt_backup_" + zeitstempel;
    try {
      store.setItem(key, rawValue);
      return { status: "backedUp", key: key };
    } catch (e) {
      return { status: "backupFailed" };
    }
  }

  return {
    containerKey: containerKey,
    altHardKey: altHardKey,
    altPtrKey: altPtrKey,
    leererContainer: leererContainer,
    ladeZustand: ladeZustand,
    berechneAntwortErgebnis: berechneAntwortErgebnis,
    wendeAntwortEreignisAn: wendeAntwortEreignisAn,
    starteNeueSitzung: starteNeueSitzung,
    verwerfeAktiveSitzung: verwerfeAktiveSitzung,
    ladeAltdaten: ladeAltdaten,
    migriereHardInContainer: migriereHardInContainer,
    sichereBeschaedigtenContainer: sichereBeschaedigtenContainer
  };
});
