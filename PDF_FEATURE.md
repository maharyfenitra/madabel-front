# Fonctionnalité de Téléchargement de Rapport PDF

## Vue d'ensemble

La page des rapports (`/modules/reports`) permet maintenant de télécharger les rapports d'évaluation au format PDF directement depuis la liste.

## Caractéristiques

### Bouton de Téléchargement
- **Position**: À côté du bouton "Voir le rapport" dans chaque ligne du tableau
- **Icône**: Download (lucide-react)
- **Couleur**: Vert pour indiquer l'action de téléchargement
- **État**: Affiche un toast "Génération du PDF en cours..." pendant le traitement

### Contenu du PDF

Le PDF généré contient:
1. **En-tête jaune** avec le titre "Rapport d'Évaluation"
2. **Informations générales**:
   - Référence de l'évaluation
   - Nom du candidat (si disponible)
   - Date limite
3. **Rapport détaillé par catégorie**:
   - Titre de la catégorie (fond gris clair)
   - Questions avec:
     - Texte de la question
     - Moyenne globale (sur 5)
     - Moyennes par type d'évaluateur (Manager Direct, Collègue, etc.)
     - Nombre de répondants
4. **Pied de page**:
   - Numéro de page
   - Date et heure de génération

### Format du PDF

- **Format**: A4 Portrait
- **Marges**: 15mm
- **Pagination**: Automatique avec numéros de page
- **Nom du fichier**: `rapport-{référence}.pdf`

## Implémentation Technique

### Fichiers Modifiés

1. **`front/src/app/modules/reports/page.tsx`**
   - Ajout du bouton "Télécharger PDF"
   - Fonction `handleDownloadPDF()` pour gérer le téléchargement

2. **`front/src/app/lib/utils/pdf.ts`** (NOUVEAU)
   - Fonction `generateReportPDF()` pour créer le PDF
   - Fonction `getEvaluatorTypeLabel()` pour formater les types d'évaluateurs
   - Utilise jsPDF pour la génération

### Dépendances Ajoutées

```json
{
  "jspdf": "^3.0.4",
  "html2canvas": "^1.4.1"
}
```

### Flux de Travail

1. L'utilisateur clique sur "Télécharger PDF"
2. Un toast "Génération du PDF en cours..." s'affiche
3. L'application récupère les données du rapport via l'API
4. La fonction `generateReportPDF()` crée le document PDF
5. Le fichier est automatiquement téléchargé
6. Un toast de succès s'affiche

## Utilisation

### Pour les Administrateurs
- Télécharger tous les rapports d'évaluation

### Pour les Évaluateurs
- Télécharger les rapports auxquels ils ont participé

### Pour les Candidats
- Télécharger leurs propres rapports d'évaluation

## Améliorations Futures

- [ ] Ajouter des graphiques dans le PDF (charts)
- [ ] Personnaliser le style du PDF (logo, couleurs entreprise)
- [ ] Compression du PDF pour les longs rapports
- [ ] Option d'envoi par email du PDF
- [ ] Génération en arrière-plan pour les très gros rapports
- [ ] Aperçu avant téléchargement

## Notes de Performance

- La génération d'un PDF prend généralement 1-3 secondes
- Les rapports longs (>10 pages) peuvent prendre un peu plus de temps
- Le téléchargement se fait côté client (pas de charge serveur)
- La bibliothèque jsPDF est chargée de manière asynchrone pour optimiser le bundle

## Gestion des Erreurs

- **API indisponible**: Toast d'erreur "Erreur lors de la génération du PDF"
- **Données invalides**: Gestion gracieuse avec valeurs par défaut ("N/A")
- **Échec de génération**: Message d'erreur dans la console + toast
