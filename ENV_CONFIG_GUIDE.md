# Configuration de NODE_ENV

## Pour définir manuellement NODE_ENV

### Option 1 : Dans le fichier .env.local (Recommandé pour le dev local)

Éditez le fichier `.env.local` :

```env
# Pour le développement
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:8001
NEXT_PUBLIC_SOCKET_URL=localhost:8001

# Pour la production (décommentez ces lignes)
# NODE_ENV=production
# NEXT_PUBLIC_API_URL=http://161.97.162.47:8000
# NEXT_PUBLIC_SOCKET_URL=161.97.162.47:8000
```

### Option 2 : Via la ligne de commande

#### Windows PowerShell
```powershell
# Développement
$env:NODE_ENV="development"; yarn dev

# Production
$env:NODE_ENV="production"; yarn build
$env:NODE_ENV="production"; yarn start
```

#### Windows CMD
```cmd
set NODE_ENV=development && yarn dev
set NODE_ENV=production && yarn build && yarn start
```

#### Linux/Mac
```bash
NODE_ENV=development yarn dev
NODE_ENV=production yarn build && yarn start
```

### Option 3 : Créer des scripts dans package.json

Éditez `package.json` :

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:prod": "NODE_ENV=production next dev",
    "build": "next build",
    "build:dev": "NODE_ENV=development next build",
    "start": "next start",
    "start:dev": "NODE_ENV=development next start"
  }
}
```

Ensuite utilisez :
```bash
yarn dev:prod   # Dev avec config prod
yarn build:dev  # Build avec config dev
yarn start:dev  # Start avec config dev
```

### Option 4 : Utiliser cross-env (Cross-platform)

Installez cross-env :
```bash
yarn add -D cross-env
```

Modifiez `package.json` :
```json
{
  "scripts": {
    "dev": "cross-env NODE_ENV=development next dev",
    "dev:prod": "cross-env NODE_ENV=production next dev",
    "build": "cross-env NODE_ENV=production next build",
    "start": "cross-env NODE_ENV=production next start"
  }
}
```

## Vérifier l'environnement actuel

Dans la console du navigateur ou dans les logs du serveur, vous verrez :
```
Current Environment: development
```
ou
```
Current Environment: production
```

## Priorité des fichiers .env

Next.js charge les fichiers dans cet ordre (le dernier écrase le précédent) :

1. `.env`
2. `.env.local` (ignoré pour `test`)
3. `.env.development` / `.env.production` / `.env.test`
4. `.env.development.local` / `.env.production.local` / `.env.test.local`

**Le fichier `.env.local` a la priorité la plus élevée !**

## Recommandation

Pour un contrôle manuel facile, utilisez le fichier `.env.local` :
- Modifiez simplement `NODE_ENV=development` ou `NODE_ENV=production`
- Relancez `yarn dev`
- L'application utilisera automatiquement les bonnes URLs
