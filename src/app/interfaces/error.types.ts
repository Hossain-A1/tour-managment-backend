export interface TErorSources {
  path: string;
  message: string;
}

export interface TGenericErrorResponse {
  statusCode: number;
  message: string;
  errorSources?: TErorSources[];
}