Plateforme de gestion de datasets et de modèles ML — Frontend

Interface web permettant de consulter et de gérer les datasets, les modèles de Machine Learning et les expérimentations, en consommant l'API REST du backend Spring Boot.

Devoir pratique — Master 1 Intelligence Artificielle, Développement Full-Stack, année universitaire 2026/2027.

## Technologies
Angular 17 
PrimeNG 17
PrimeIcons et PrimeFlex
Reactive Forms
RxJS et HttpClient
Prérequis
Node.js 18 ou supérieur et npm
Le backend Spring Boot doit être démarré sur le port 8080


##Installation
1. Installer les dépendances

Depuis le dossier du projet :
npm install

2. Vérifier l'URL de l'API

Le fichier src/environments/environment.ts définit l'adresse du backend :

typescript
apiBaseUrl: 'http://localhost:8080/api'


3. Lancer l'application

npm start

L'application démarre sur http://localhost:4200

Le backend doit être lancé au préalable, sinon les tableaux s'affichent vides avec une notification d'erreur.

Build de production

npm run build

Les fichiers statiques sont générés dans dist/dataset_angular/.

Structure du projet
src/app/
├── core/
│   ├── models/       Interfaces TypeScript et énumérations
│   ├── services/     Un service HttpClient par entité
│   └── utils/        Extraction des messages d'erreur renvoyés par l'API
├── features/
│   ├── datasets/         Vue Datasets
│   ├── modeles/          Vue Modèles ML
│   └── experimentations/ Vue Expérimentations
├── app.component.ts  Barre de navigation, notifications et dialogue de confirmation
├── app.routes.ts     Définition des routes
└── app.config.ts     Fournisseurs de l'application
Fonctionnalités

Chaque vue propose :

un tableau PrimeNG avec pagination, tri par colonne et recherche globale
un formulaire réactif dans une boîte de dialogue pour la création et la modification
une validation côté client avec affichage des erreurs sous les champs concernés
une confirmation avant suppression
des notifications de succès et d'erreur, reprenant les messages de validation renvoyés par le backend

La vue Expérimentations charge la liste des datasets et des modèles existants pour alimenter les listes déroulantes d'association.


Auteur

SANKARA Ibrahim

Master 1 Intelligence Artificielle — Développement Web