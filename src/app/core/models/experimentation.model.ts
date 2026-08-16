export interface Experimentation {
  id?: number;
  datasetId: number;
  datasetNom?: string;
  modeleId: number;
  modeleNom?: string;
  accuracy: number;
  f1Score: number;
  dureeEntrainement: number;
  dateExecution: string;
}
