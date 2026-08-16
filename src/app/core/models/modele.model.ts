import { TypeModele } from './type-modele.enum';

export interface ModeleML {
  id?: number;
  nom: string;
  type: TypeModele;
  algorithme: string;
  version: string;
  dateCreation: string;
  nombreExperimentations?: number;
}
