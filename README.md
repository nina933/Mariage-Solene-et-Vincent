# Solène & Vincent — site du mariage

Site statique (HTML/CSS/JS) prêt pour **GitHub Pages**. Aucune dépendance à SITE123.

## 1. Mettre le site sur GitHub
1. Sur github.com, **New repository** → nom par ex. `mariage-solene-vincent` → Public → *Create*.
2. Cliquez **uploading an existing file**, glissez-déposez **tout le contenu** de ce dossier
   (les fichiers `index.html`, `css/`, `js/`, `images/`, etc. — pas le dossier parent) → *Commit changes*.
3. **Settings → Pages** → *Source : Deploy from a branch* → Branche `main`, dossier `/ (root)` → *Save*.
4. Après 1–2 min, le site est en ligne sur `https://<votre-compte>.github.io/mariage-solene-vincent/`.

## 2. Photos
Les photos s'affichent pour l'instant depuis le serveur SITE123.
Pour être 100 % indépendant, déposez vos photos dans `images/` avec ces noms exacts :
- `images/hero.jpg` — photo de fond de l'accueil
- `images/abbaye.jpg` — Abbaye de Villeneuve
- `images/hotel.jpg` — Hôtel Akena

Dès qu'un fichier existe, il remplace automatiquement l'ancien.

## 3. Formulaire de réponse (RSVP) → Google Sheet
GitHub Pages n'héberge pas de serveur : les réponses sont envoyées vers un Google Sheet.
1. Créez un Google Sheet → **Extensions → Apps Script**.
2. Collez le contenu de `apps-script/Code.gs`, enregistrez.
3. **Déployer → Nouveau déploiement** → Application Web, *Exécuter en tant que : Moi*, *Accès : Tout le monde* → autorisez.
4. Copiez l'URL qui finit par `/exec` et collez-la dans `js/main.js` :
   `const RSVP_ENDPOINT = "https://script.google.com/macros/s/…/exec";`
5. Les réponses arrivent dans l'onglet **Réponses** ; chaque invité reçoit un courriel de confirmation.

## Modifier le contenu
- Textes : directement dans chaque fichier `.html`.
- Menu et pied de page : `js/main.js` (`PAGES`).
- Date du compte à rebours : `WEDDING_DATE` dans `js/main.js`.
- Couleurs / polices : variables en haut de `css/style.css`.

## Domaine personnalisé (optionnel)
Settings → Pages → *Custom domain*, puis ajoutez un enregistrement CNAME chez votre registraire.


