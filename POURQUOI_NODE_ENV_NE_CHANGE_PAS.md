# 🎯 Pourquoi NODE_ENV ne change pas ?

## Le problème

Next.js **FORCE** automatiquement la valeur de `NODE_ENV` :
- `yarn dev` → `NODE_ENV=development` (toujours)
- `yarn build` / `yarn start` → `NODE_ENV=production` (toujours)

**Vous ne pouvez PAS changer NODE_ENV manuellement dans les fichiers .env avec Next.js !**

## ✅ La solution

Utiliser **`NEXT_PUBLIC_APP_ENV`** à la place.

### Fichier `.env.local`

```env
# Changez cette ligne pour basculer entre dev et prod
NEXT_PUBLIC_APP_ENV=development  # ← Changez en "production" pour utiliser les URLs prod

NEXT_PUBLIC_API_URL=http://localhost:8001
NEXT_PUBLIC_SOCKET_URL=localhost:8001
```

### Comment ça marche maintenant

```typescript
// Dans configServer.ts
const getEnvironment = (): Environment => {
  // Utilise NEXT_PUBLIC_APP_ENV si défini, sinon NODE_ENV
  const appEnv = process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV;
  return appEnv === "production" ? "production" : "development";
};
```

### Résultat

| Fichier .env.local | Commande | Environnement utilisé | URLs utilisées |
|---|---|---|---|
| `NEXT_PUBLIC_APP_ENV=development` | `yarn dev` | **development** | localhost:8001 |
| `NEXT_PUBLIC_APP_ENV=production` | `yarn dev` | **production** | 161.97.162.47:8000 |
| `NEXT_PUBLIC_APP_ENV=development` | `yarn build` | **development** | localhost:8001 |
| `NEXT_PUBLIC_APP_ENV=production` | `yarn build` | **production** | 161.97.162.47:8000 |

## 🚀 Pour basculer entre dev et prod

**C'est simple :** Éditez `.env.local` et changez la première ligne :

```env
# Mode développement (localhost)
NEXT_PUBLIC_APP_ENV=development

# Mode production (serveur distant)
NEXT_PUBLIC_APP_ENV=production
```

Puis **relancez le serveur** (`Ctrl+C` puis `yarn dev`).

## 🔍 Pour vérifier

Dans la console du navigateur (F12), vous verrez :
```
Current Environment (APP_ENV): development
NODE_ENV (Next.js auto): development
```

ou

```
Current Environment (APP_ENV): production
NODE_ENV (Next.js auto): development
```

Maintenant vous avez le **contrôle total** ! 🎉
