import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponse } from '../models/error-response.model';

export function extractErrorMessage(err: HttpErrorResponse): string {
  const body = err.error as ErrorResponse | undefined;
  if (body?.message) {
    if (body.details) {
      const detailMsgs = Object.values(body.details).join(' | ');
      return `${body.message} (${detailMsgs})`;
    }
    return body.message;
  }
  return `Erreur inattendue (HTTP ${err.status})`;
}
