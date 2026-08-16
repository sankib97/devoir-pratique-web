export interface ErrorResponse {
  code: number;
  message: string;
  horodatage: string;
  details?: { [champ: string]: string };
}
