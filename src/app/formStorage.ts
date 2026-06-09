const FORM_KEY = "docbuilder_form";
const MODULE_KEY = "docbuilder_active_module";
const IDB_NAME = "biztrip-docbuilder";
const IDB_STORE = "state";

export type StoredPayload = {
  form: unknown;
  activeModule?: string;
};

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB não disponível"));
      return;
    }
    const request = indexedDB.open(IDB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(IDB_STORE);
    };
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

async function idbSet(key: string, value: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).put(value, key);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
}

async function idbGet(key: string): Promise<string | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readonly");
    const req = tx.objectStore(IDB_STORE).get(key);
    req.onsuccess = () => {
      db.close();
      resolve((req.result as string) ?? null);
    };
    req.onerror = () => reject(req.error);
  });
}

function parseStoredRaw(raw: string): StoredPayload | null {
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (parsed && typeof parsed === "object" && "cover" in parsed) {
      return {
        form: parsed,
        activeModule: localStorage.getItem(MODULE_KEY) ?? "cover",
      };
    }
    if (parsed && typeof parsed === "object" && "form" in parsed) {
      return parsed as StoredPayload;
    }
    return null;
  } catch {
    return null;
  }
}

/** Leitura síncrona do localStorage (formato legado ou novo). */
export function readLocalPayload(): StoredPayload | null {
  try {
    const raw = localStorage.getItem(FORM_KEY);
    if (!raw) return null;
    return parseStoredRaw(raw);
  } catch {
    return null;
  }
}

/** Leitura com fallback IndexedDB quando localStorage está vazio. */
export async function readStoredPayload(): Promise<StoredPayload | null> {
  const local = readLocalPayload();
  if (local) return local;
  try {
    const raw = await idbGet(FORM_KEY);
    if (!raw) return null;
    return parseStoredRaw(raw);
  } catch {
    return null;
  }
}

/** Persiste formulário + módulo ativo. Usa IndexedDB se localStorage estourar cota. */
export async function writeStoredPayload(payload: StoredPayload): Promise<void> {
  const serialized = JSON.stringify({
    form: payload.form,
    activeModule: payload.activeModule,
  });

  try {
    localStorage.setItem(FORM_KEY, serialized);
    if (payload.activeModule) {
      localStorage.setItem(MODULE_KEY, payload.activeModule);
    }
    return;
  } catch (e) {
    const isQuota =
      e instanceof DOMException &&
      (e.name === "QuotaExceededError" || e.code === 22);
    if (!isQuota) throw e;
  }

  await idbSet(FORM_KEY, serialized);
}

/** Gravação síncrona para beforeunload (melhor esforço no fechamento da aba). */
export function writeStoredPayloadSync(payload: StoredPayload): void {
  const serialized = JSON.stringify({
    form: payload.form,
    activeModule: payload.activeModule,
  });
  try {
    localStorage.setItem(FORM_KEY, serialized);
    if (payload.activeModule) {
      localStorage.setItem(MODULE_KEY, payload.activeModule);
    }
  } catch {
    // Cota excedida: auto-save assíncrono já tentará IndexedDB
  }
}
