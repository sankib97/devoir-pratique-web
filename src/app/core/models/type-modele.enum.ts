export enum TypeModele {
  CLASSIFICATION = 'CLASSIFICATION',
  REGRESSION = 'REGRESSION',
  CLUSTERING = 'CLUSTERING',
  DEEP_LEARNING = 'DEEP_LEARNING',
  AUTRE = 'AUTRE'
}

export const TYPE_MODELE_OPTIONS = Object.values(TypeModele).map(v => ({ label: v, value: v }));
