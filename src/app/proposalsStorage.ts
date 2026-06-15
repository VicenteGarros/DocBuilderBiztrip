const DB_NAME = "biztrip-saved-proposals";
const DB_STORE = "proposals";
const DB_VERSION = 1;

export type SavedProposalMeta = {
  id: string;
  name: string;
  company: string;
  createdAt: string;
};

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB não disponível"));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(DB_STORE, { keyPath: "id" });
    };
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function listProposals(): Promise<SavedProposalMeta[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, "readonly");
    const req = tx.objectStore(DB_STORE).getAll();
    req.onsuccess = () => {
      db.close();
      const all = req.result as Array<SavedProposalMeta & { pdfData: ArrayBuffer }>;
      const metas: SavedProposalMeta[] = all.map(({ pdfData: _pdfData, ...meta }) => meta);
      resolve(metas.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    };
    req.onerror = () => reject(req.error);
  });
}

export async function saveProposal(
  meta: SavedProposalMeta,
  pdfBlob: Blob,
): Promise<void> {
  const db = await openDB();
  const pdfData = await pdfBlob.arrayBuffer();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, "readwrite");
    tx.objectStore(DB_STORE).put({ ...meta, pdfData });
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => reject(tx.error);
  });
}

export async function getProposalPdfBlob(id: string): Promise<Blob | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, "readonly");
    const req = tx.objectStore(DB_STORE).get(id);
    req.onsuccess = () => {
      db.close();
      if (!req.result) return resolve(null);
      resolve(new Blob([req.result.pdfData], { type: "application/pdf" }));
    };
    req.onerror = () => reject(req.error);
  });
}

export async function deleteProposal(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, "readwrite");
    tx.objectStore(DB_STORE).delete(id);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => reject(tx.error);
  });
}
