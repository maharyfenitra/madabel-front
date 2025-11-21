# Configuration Serveur - Hook useServerConfig

## 📋 Vue d'ensemble

Le fichier `configServer.ts` a été transformé en hook React pour gérer dynamiquement les URL du serveur en fonction de l'environnement (développement ou production).

## 🔄 Changements effectués

### Avant
```typescript
export const URL_CONFIG = {
  uri: "http://localhost:8001", 
  ur_socket: "localhost:8001",
};
```

### Après
```typescript
"use client";

import { useMemo } from "react";

type Environment = "development" | "production";

const getEnvironment = (): Environment => {
  return process.env.NODE_ENV === "production" ? "production" : "development";
};

const CONFIG = {
  development: {
    uri: "http://localhost:8001",
    ur_socket: "localhost:8001",
  },
  production: {
    uri: "http://161.97.162.47:8000",
    ur_socket: "161.97.162.47:8000",
  },
} as const;

export const useServerConfig = () => {
  const config = useMemo(() => {
    const env = getEnvironment();
    return CONFIG[env];
  }, []);

  return config;
};

// Export pour compatibilité avec le code existant
export const URL_CONFIG = CONFIG[getEnvironment()];
```

## 🎯 Avantages

1. **Gestion automatique de l'environnement** : Détecte automatiquement si on est en dev ou prod
2. **Pas de configuration manuelle** : Plus besoin de commenter/décommenter des lignes
3. **Type-safe** : Utilisation de TypeScript pour la sécurité des types
4. **Hook React** : Utilisation dans les composants React avec `useServerConfig()`
5. **Rétrocompatible** : `URL_CONFIG` reste disponible pour les fichiers non-React

## 📝 Utilisation

### Dans les composants React (Nouveau)
```typescript
import { useServerConfig } from "@/app/lib/api/configServer";

export function MyComponent() {
  const { uri } = useServerConfig();
  
  const fetchData = async () => {
    const response = await fetch(`${uri}/api/endpoint`);
    // ...
  };
  
  return <div>...</div>;
}
```

### Dans les fichiers non-React (Compatible)
```typescript
import { URL_CONFIG } from "@/app/lib/api/configServer";

// Utilisation directe
const endpoint = `${URL_CONFIG.uri}/api/endpoint`;
```

## 📦 Fichiers mis à jour

### Composants React utilisant maintenant `useServerConfig()`
1. ✅ `ParticipantList.tsx`
2. ✅ `MailButton.tsx`
3. ✅ `UpdateProfile.tsx`
4. ✅ `QuestionList.tsx`
5. ✅ `forgot-password/page.tsx`
6. ✅ `reset-password/page.tsx`

### Fichiers utilisant toujours `URL_CONFIG` (hooks/utilitaires)
1. ✅ `useGenericQuery.ts` - Utilise la constante
2. ✅ `useGenericMutation.ts` - Utilise la constante
3. ✅ `useQuestions.tsx` - Import retiré (non utilisé)

## 🔧 Configuration des environnements

### Développement (local)
- **URI** : `http://localhost:8001`
- **Socket** : `localhost:8001`
- **Activé quand** : `NODE_ENV !== "production"`

### Production
- **URI** : `http://161.97.162.47:8000`
- **Socket** : `161.97.162.47:8000`
- **Activé quand** : `NODE_ENV === "production"`

## 🚀 Déploiement

### Build de production
```bash
yarn build
```

Le système détectera automatiquement l'environnement de production et utilisera les bonnes URLs.

### Variables d'environnement (optionnel)
Pour plus de flexibilité, vous pouvez ajouter des variables d'environnement :

```env
# .env.local (development)
NEXT_PUBLIC_API_URL=http://localhost:8001

# .env.production
NEXT_PUBLIC_API_URL=http://161.97.162.47:8000
```

Puis modifier le code :
```typescript
const CONFIG = {
  development: {
    uri: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001",
    ur_socket: process.env.NEXT_PUBLIC_SOCKET_URL || "localhost:8001",
  },
  production: {
    uri: process.env.NEXT_PUBLIC_API_URL || "http://161.97.162.47:8000",
    ur_socket: process.env.NEXT_PUBLIC_SOCKET_URL || "161.97.162.47:8000",
  },
};
```

## ⚠️ Notes importantes

1. **"use client"** : Le fichier doit être marqué comme client component pour utiliser les hooks React
2. **useMemo** : Optimise les performances en mémorisant la configuration
3. **Rétrocompatibilité** : L'export `URL_CONFIG` est maintenu pour ne pas casser le code existant
4. **TypeScript** : Le type `as const` assure que les valeurs ne sont pas modifiées

## 🧪 Tests

### Tester en développement
```bash
yarn dev
# Les URLs pointent vers localhost:8001
```

### Tester en production
```bash
yarn build
yarn start
# Les URLs pointent vers 161.97.162.47:8000
```

## 🐛 Dépannage

### Erreur "useServerConfig is not a function"
- Vérifier que le composant est marqué "use client"
- Vérifier l'import : `import { useServerConfig } from "@/app/lib/api/configServer"`

### Mauvaise URL utilisée
- Vérifier `process.env.NODE_ENV`
- En dev : devrait être `"development"`
- En prod : devrait être `"production"`

### Erreur de compilation
- Les erreurs sur les fichiers `questions` sont normales (fichiers manquants)
- Ignorer avec `--skipLibCheck` ou créer les fichiers manquants
