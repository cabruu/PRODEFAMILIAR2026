// ============================================================
//  PRODE FAMILIAR 2026 — Conector con Google Apps Script
// ============================================================

// ⚠️ REEMPLAZÁ ESTA URL CON LA TUYA
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz8vraGN-jq9KTc3qnkFK0yYZcnj31s829haeY_weOyusiMZx6Tah1OgChDUH2-V-F07w/exec';

// ── HELPER: SHA-256 en el navegador ───────────────────────
async function sha256(text) {
  const encoder = new TextEncoder();
  const data    = encoder.encode(text);
  const hashBuf = await crypto.subtle.digest('SHA-256', data);
  const hashArr = Array.from(new Uint8Array(hashBuf));
  return hashArr.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ── HELPER: llamada a la API ───────────────────────────────
// Usamos GET con el payload en ?data= para evitar el problema de CORS
// que bloquea los POST desde GitHub Pages hacia Apps Script.
async function apiCall(body) {
  const encoded  = encodeURIComponent(JSON.stringify(body));
  const url      = `${APPS_SCRIPT_URL}?data=${encoded}`;
  const response = await fetch(url, { redirect: 'follow' });

  if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
  return await response.json();
}

// ============================================================
//  LOGIN
// ============================================================
async function apiLogin(userId, password) {
  const passwordHash = await sha256(password);
  return apiCall({ action: 'login', userId, passwordHash });
}

// ============================================================
//  PARTIDOS
// ============================================================
async function apiGetPartidos() {
  return apiCall({ action: 'getPartidos' });
}

// ============================================================
//  PREDICCIONES DEL JUGADOR
// ============================================================
async function apiGetPredicciones(userId) {
  return apiCall({ action: 'getPredicciones', userId });
}

// ============================================================
//  GUARDAR PREDICCIÓN
// ============================================================
async function apiSavePrediccion(userId, partidoId, golesA, golesB, comodin) {
  return apiCall({
    action:    'savePredicion',
    userId,
    partidoId,
    golesA:    Number(golesA),
    golesB:    Number(golesB),
    comodin:   !!comodin,
  });
}

// ============================================================
//  PUNTAJES
// ============================================================
async function apiGetPuntajes() {
  return apiCall({ action: 'getPuntajes' });
}

// ============================================================
//  CALCULAR PUNTAJES (solo admin)
// ============================================================
async function apiCalcularPuntajes(adminId, partidoId, golesA, golesB) {
  return apiCall({
    action:    'calcularPuntajes',
    adminId,
    partidoId,
    golesA:    Number(golesA),
    golesB:    Number(golesB),
  });
}
