# Déploiement — Console de crédits IA (PWA)

## Étape 1 — Web App Apps Script (source des données)

1. Ouvre le Sheet studio > **Extensions > Apps Script**.
2. Remplace le contenu de `Code.gs` par le fichier `Code.gs` fourni ici (ajoute `doGet`, garde tout le reste).
3. **Déployer > Nouveau déploiement**
   - Type : **Application Web**
   - Exécuter en tant que : **Moi**
   - Qui a accès : **Tout le monde** (nécessaire pour que GitHub Pages puisse appeler l'URL sans compte Google ; à restreindre à "Tout le monde avec Google" si tu préfères, mais alors chaque utilisateur devra être connecté à un compte Google autorisé)
4. Copie l'URL générée, qui se termine par `/exec`.
5. Teste-la directement dans un navigateur : elle doit renvoyer du JSON (`{"top":{...},"comfyReserve":[...],...}`).

## Étape 2 — Configurer la PWA

Dans `index.html`, remplace :
```js
const WEBAPP_URL = "COLLE_ICI_TON_URL_WEBAPP_/exec";
```
par ton URL réelle de l'étape 1.

## Étape 3 — Héberger sur GitHub Pages

1. Crée un repo GitHub (public, ou privé si tu as GitHub Pro/Team pour Pages privé).
2. Pousse le contenu du dossier `pwa/` (sauf `Code.gs` et `DEPLOIEMENT.md`, qui n'ont rien à faire côté web) à la racine du repo :
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - `icons/` (icon-192.png, icon-512.png, icon-512-maskable.png, apple-touch-icon.png)
3. **Settings > Pages** :
   - Source : `Deploy from a branch`
   - Branch : `main` / `root`
4. L'URL sera du type `https://TON-USER.github.io/TON-REPO/`.

Commandes type (une fois le repo créé sur github.com) :
```bash
cd pwa
git init
git add index.html manifest.json sw.js icons
git commit -m "PWA console crédits IA"
git branch -M main
git remote add origin https://github.com/TON-USER/TON-REPO.git
git push -u origin main
```

## Étape 4 — Installer l'app

- **Android/Chrome desktop** : le bouton "⭳ Installer l'app" apparaît automatiquement en haut à droite dès que le navigateur détecte que la PWA est installable.
- **iOS/Safari** : pas de `beforeinstallprompt` sur iOS — utiliser le bouton de partage Safari > "Sur l'écran d'accueil".

## Notes

- Les graphiques hebdo/mensuel/7 jours restent des **snapshots manuels** codés en dur dans `index.html` (comme dans la version Sheet d'origine) — à régénérer à la main périodiquement, ou à automatiser plus tard via le Web App si besoin.
- La **réserve de crédit** (ComfyUI + RunComfy) est **live**, lue directement depuis les onglets "Historique Comfy" / "Historique RunComfy" à chaque rechargement.
- Le service worker met en cache uniquement l'app shell (HTML/CSS/JS/icônes), jamais les données live du Web App — donc en hors-ligne tu verras l'interface mais avec les derniers chiffres connus (mise en cache légère via localStorage), pas de faux frais de fraîcheur.
