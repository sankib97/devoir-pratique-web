import { DatasetFormat } from './dataset-format.enum';

export interface Dataset {
  id?: number;
  nom: string;
  description?: string;
  source?: string;
  nombreObservations: number;
  format: DatasetFormat;
  dateAjout: string;
  nombreExperimentations?: number;
}
