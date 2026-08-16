export enum DatasetFormat {
  CSV = 'CSV',
  JSON = 'JSON',
  IMAGES = 'IMAGES',
  TEXTE = 'TEXTE',
  PARQUET = 'PARQUET',
  AUTRE = 'AUTRE'
}

export const DATASET_FORMAT_OPTIONS = Object.values(DatasetFormat).map(v => ({ label: v, value: v }));
