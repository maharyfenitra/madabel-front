# Frontend Refactoring - MADABEL

## 📋 Vue d'ensemble

Le frontend a été refactoré pour améliorer la maintenabilité, réduire la duplication de code et suivre les meilleures pratiques React/Next.js.

## 🏗️ Structure

```
front/src/app/lib/
├── utils/                # Fonctions utilitaires
│   ├── toast.ts          # Helpers de notifications
│   ├── validation.ts     # Validation de formulaires
│   ├── format.ts         # Formatage de données
│   ├── storage.ts        # LocalStorage helpers
│   ├── arrays.ts         # Manipulation de tableaux
│   └── index.ts
├── hooks/                # Hooks React réutilisables
│   ├── useDelete.ts      # Hook pour suppression avec confirmation
│   ├── useForm.ts        # Hook pour gestion de formulaires
│   ├── usePagination.ts  # Hook pour pagination
│   └── index.ts
└── api/                  # API et queries
```

## 🎯 Améliorations principales

### 1. Toast Notifications

**Avant :**
```typescript
toast.success("Utilisateur créé avec succès");
toast.error("Erreur lors de la création", {
  description: error?.message || "Une erreur est survenue"
});
console.error("API Error:", error);
```

**Après :**
```typescript
import { successToasts, handleApiError } from "@/app/lib/utils";

successToasts.created("Utilisateur");
handleApiError(error, "Erreur lors de la création");
```

### 2. Validation de Formulaires

**Avant :**
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  setError("Email invalide");
}
```

**Après :**
```typescript
import { isValidEmail, validateFields } from "@/app/lib/utils";

if (!isValidEmail(email)) {
  setError("Email invalide");
}

// Ou validation multiple
const { valid, errors } = validateFields([
  { field: 'email', value: email, rules: { required: true, email: true } },
  { field: 'name', value: name, rules: { required: true, minLength: 3 } }
]);
```

### 3. Formatage de Données

**Avant :**
```typescript
const formatted = date 
  ? new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  : "Non renseigné";
```

**Après :**
```typescript
import { formatDate, formatDateTime, formatRole } from "@/app/lib/utils";

const formatted = formatDate(date);
const withTime = formatDateTime(date);
const roleName = formatRole(user.role);
```

### 4. Suppression avec Confirmation

**Avant :**
```typescript
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [itemToDelete, setItemToDelete] = useState<number | null>(null);
const [isDeleting, setIsDeleting] = useState(false);

const handleDelete = (id: number) => {
  setItemToDelete(id);
  setDeleteDialogOpen(true);
};

const confirmDelete = async () => {
  if (!itemToDelete) return;
  setIsDeleting(true);
  try {
    await deleteItem(itemToDelete);
    toast.success("Supprimé avec succès");
    refetch();
  } catch (error) {
    toast.error("Erreur");
  } finally {
    setIsDeleting(false);
  }
};
```

**Après :**
```typescript
import { useDelete } from "@/app/lib/hooks";

const {
  isDeleting,
  deleteDialogOpen,
  handleDelete,
  confirmDelete,
  cancelDelete,
} = useDelete({
  onDelete: async (id) => await deleteItem(id),
  onSuccess: () => refetch(),
  itemName: "l'utilisateur",
});
```

## 📚 Utilisation des Helpers

### Toast Notifications

```typescript
import { 
  showSuccess, 
  showError, 
  handleApiError,
  successToasts,
  errorToasts 
} from "@/app/lib/utils";

// Notifications simples
showSuccess("Opération réussie");
showError("Une erreur est survenue");

// Avec description
showSuccess("Envoyé", { description: "Email envoyé à l'utilisateur" });

// Notifications communes
successToasts.created("Quiz");
successToasts.updated("Évaluation");
successToasts.deleted("Participant");

errorToasts.create("le quiz");
errorToasts.network();

// Gestion automatique des erreurs API
try {
  await apiCall();
} catch (error) {
  handleApiError(error, "Message personnalisé");
}
```

### Validation

```typescript
import { 
  isValidEmail,
  isValidPhone,
  validatePassword,
  validateFields,
  validateFile
} from "@/app/lib/utils";

// Validations simples
if (!isValidEmail(email)) {
  showError("Email invalide");
}

// Validation de mot de passe
const { valid, errors } = validatePassword(password);
if (!valid) {
  showError(errors[0]);
}

// Validation multiple
const validation = validateFields([
  { field: 'name', value: name, rules: { required: true, minLength: 3 } },
  { field: 'email', value: email, rules: { required: true, email: true } },
  { field: 'phone', value: phone, rules: { phone: true } },
]);

// Validation de fichier
const fileValidation = validateFile(file, {
  maxSize: 5 * 1024 * 1024, // 5 MB
  allowedTypes: ['image/jpeg', 'image/png'],
  allowedExtensions: ['jpg', 'jpeg', 'png']
});
```

### Formatage

```typescript
import { 
  formatDate,
  formatDateTime,
  formatDateShort,
  formatRelativeTime,
  formatRole,
  formatEvaluatorType,
  formatPhoneNumber,
  formatFileSize,
  formatPercentage,
  getInitials
} from "@/app/lib/utils";

// Dates
formatDate(user.createdAt);              // "6 décembre 2025"
formatDateTime(evaluation.deadline);      // "6 décembre 2025 à 14:30"
formatDateShort(date);                   // "06/12/2025"
formatRelativeTime(comment.createdAt);   // "Il y a 2 heures"

// Données utilisateur
formatRole(user.role);                   // "Administrateur"
formatEvaluatorType(participant.type);   // "Manager Direct"
formatPhoneNumber(user.phone);           // "06 12 34 56 78"
getInitials(user.name);                  // "JD" pour "John Doe"

// Nombres
formatFileSize(1024000);                 // "1 MB"
formatPercentage(75.5, 1);               // "75.5%"
```

### Storage

```typescript
import { 
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  StorageKeys 
} from "@/app/lib/utils";

// Sauvegarder
setStorageItem(StorageKeys.USER, userData);
setStorageItem('preferences', { theme: 'dark' });

// Récupérer
const user = getStorageItem<User>(StorageKeys.USER);
const prefs = getStorageItem('preferences', { theme: 'light' });

// Supprimer
removeStorageItem(StorageKeys.ACCESS_TOKEN);
```

### Arrays

```typescript
import { 
  groupBy,
  unique,
  sortBy,
  searchArray,
  paginate
} from "@/app/lib/utils";

// Grouper par clé
const grouped = groupBy(evaluations, 'status');

// Trier
const sorted = sortBy(users, 'name', 'asc');

// Recherche
const results = searchArray(users, 'john', ['name', 'email']);

// Pagination côté client
const { data, totalPages } = paginate(items, page, 10);
```

### Hooks Personnalisés

```typescript
import { useDelete, useForm, usePagination } from "@/app/lib/hooks";

// Hook de suppression
const deleteOps = useDelete({
  onDelete: async (id) => await api.delete(`/users/${id}`),
  onSuccess: () => refetch(),
  itemName: "l'utilisateur",
});

// Hook de formulaire
const form = useForm({
  initialValues: { name: '', email: '' },
  onSubmit: async (values) => {
    await api.post('/users', values);
    successToasts.created('Utilisateur');
  },
  validate: (values) => {
    const errors: any = {};
    if (!values.name) errors.name = 'Nom requis';
    if (!isValidEmail(values.email)) errors.email = 'Email invalide';
    return errors;
  }
});

// Hook de pagination
const pagination = usePagination({
  initialPage: 1,
  initialLimit: 10,
  totalItems: data?.meta?.total || 0,
});
```

## 📝 Composants Refactorés

- ✅ `ParticipantList.tsx` - Toast et formatage
- ✅ `useUpdateEvaluation.ts` - Toast et gestion d'erreurs

## 🎨 Principes de Code

1. **DRY** - Pas de duplication de logique
2. **Composable** - Hooks et helpers réutilisables
3. **Type-Safe** - TypeScript strict
4. **Consistent** - Patterns uniformes
5. **Maintainable** - Code facile à lire

## 🚀 Prochaines Étapes

- [ ] Refactorer tous les hooks de modules
- [ ] Refactorer tous les composants de formulaires
- [ ] Ajouter des tests pour les helpers
- [ ] Créer des composants UI réutilisables
- [ ] Documenter les patterns de design

## 📖 Documentation

Tous les helpers sont documentés avec JSDoc et TypeScript.

## 🤝 Contribution

Utilisez toujours les helpers et hooks existants. Si besoin d'une nouvelle fonction, ajoutez-la aux helpers appropriés.
