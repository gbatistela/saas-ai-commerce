/**
 * Nombres de colas BullMQ compartidos entre módulos.
 * `process-message`: encolado por los webhooks de canal (Conversations),
 *   consumido por el worker del AI Engine (próximo módulo).
 * `send-message`: encolado al enviar una respuesta (IA o manual del agente),
 *   consumido por el worker de envío por canal (Notifications, a construir).
 */
export const PROCESS_MESSAGE_QUEUE = 'process-message';
export const SEND_MESSAGE_QUEUE = 'send-message';
