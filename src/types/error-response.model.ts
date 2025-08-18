export interface ErrorResponse {
  statusCode: number;    // Código HTTP
  message: string;       // Mensaje legible para el usuario
  error: string;         // Tipo de error
  timestamp: string;     // Timestamp ISO
  path: string;          // URL del endpoint
  method: string;        // Método HTTP
  details?: any;         // Información adicional (opcional)
}

