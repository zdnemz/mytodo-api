import type { Response as ExpressResponse } from 'express';

export const status = {
  200: 'OK',
  201: 'Created',
  204: 'No Content',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
};

class Response {
  protected success: boolean;
  protected code: keyof typeof status;
  protected message: string;
  protected data?: unknown | object | null;

  constructor(
    code: keyof typeof status,
    message?: string | null,
    data?: unknown | object
  ) {
    this.success = code >= 200 && code < 300;
    this.code = code;
    this.message = message || status[code];
    if (data) {
      this.data = data;
    }
  }
}

function response(
  res: ExpressResponse,
  {
    code,
    message,
    data,
    error,
  }: {
    code: keyof typeof status;
    message?: string | null;
    data?: unknown | object | null;
    error?: string | string[] | null;
  }
) {
  return res
    .status(code)
    .json(
      new Response(
        code,
        message,
        error ? { issues: error instanceof Array ? error : [error] } : data
      )
    );
}

export default response;
