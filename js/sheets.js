const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzdusgeMF4geA_0bvg1uW0wMUsg9S7QSoWOWzKfrYXkOwMUrtfx0-LHusYvNOE7yU2xGw/exec';

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
