/**
 * Réception des réponses RSVP dans un Google Sheet.
 * 1. Créez un Google Sheet vide, puis Extensions > Apps Script.
 * 2. Collez ce code, enregistrez.
 * 3. Déployer > Nouveau déploiement > Type : Application Web
 *    - Exécuter en tant que : Moi
 *    - Qui a accès : Tout le monde
 * 4. Copiez l'URL /exec dans js/main.js (RSVP_ENDPOINT).
 */
const SHEET_NAME = 'Réponses';
const NOTIFY_EMAIL = ''; // optionnel : adresse qui reçoit un courriel à chaque réponse

const COLUMNS = [
  'Date', 'nom', 'email', 'presence', 'brunch', 'voiture', 'places_voiture',
  'navette', 'personnes_navette', 'hotel', 'tarif', 'chanson', 'message'
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(SHEET_NAME);
    if (!sh) {
      sh = ss.insertSheet(SHEET_NAME);
      sh.appendRow(COLUMNS);
      sh.setFrozenRows(1);
    }
    const p = e.parameter || {};
    const row = COLUMNS.map(c => c === 'Date' ? new Date() : (p[c] || ''));
    sh.appendRow(row);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(NOTIFY_EMAIL, 'Nouvelle réponse RSVP : ' + (p.nom || ''),
        COLUMNS.slice(1).map(c => c + ' : ' + (p[c] || '')).join('\n'));
    }
    if (p.email && p.presence) {
      MailApp.sendEmail(p.email, 'Merci pour votre réponse – Solène & Vincent',
        'Bonjour ' + (p.nom || '') + ',\n\nNous avons bien reçu votre réponse (' + p.presence +
        ').\n\nÀ très vite,\nSolène & Vincent');
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
