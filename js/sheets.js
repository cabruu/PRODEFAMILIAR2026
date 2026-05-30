const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyBGkFYZYMOCKreIueGIlIsHKDn3DE2PC45Yj-RLBekRnfecxgYl2FwRHivyQKEX-54/exec';

async function sha256(text) {
  const encoder = new TextEncoder();
  const data    = encoder.encode(text);
  const hashBuf = await crypto.subtle.digest('SHA-256', data);
  const hashArr = Array.from(new Uint8Array(hashBuf));
  return hashArr.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function apiCall(body) {
  const encoded  = encodeURIComponent(JSON.stringify(body));
  const url      = `${APPS_SCRIPT_URL}?data=${encoded}`;
  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
  return await response.json();
}

async function apiLogin(userId, password) {
  const passwordHash = await sha256(password);
  return apiCall({ action: 'login', userId, passwordHash });
}

async function apiGetPartidos() {
  return apiCall({ action: 'getPartidos' });
}

async function apiGetPredicciones(userId) {
  return apiCall({ action: 'getPredicciones', userId });
}

async function apiSavePrediccion(userId, partidoId, golesA, golesB, comodin) {
  return apiCall({ action: 'savePredicion', userId, partidoId, golesA: Number(golesA), golesB: Number(golesB), comodin: !!comodin });
}

async function apiGetPuntajes() {
  return apiCall({ action: 'getPuntajes' });
}

async function apiCalcularPuntajes(adminId, partidoId, golesA, golesB) {
  return apiCall({ action: 'calcularPuntajes', adminId, partidoId, golesA: Number(golesA), golesB: Number(golesB) });
}

async function apiSetEquipos(adminId, partidoId, equipoA, equipoB) {
  return apiCall({ action: 'setEquipos', adminId, partidoId, equipoA, equipoB });
}

// Trae la lista de equipos desde la pestaña "equipos" del Sheets
async function apiGetEquipos() {
  return apiCall({ action: 'getEquipos' });
}
