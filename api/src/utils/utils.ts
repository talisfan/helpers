import * as parser from 'cron-parser';
import moment from "moment";

export function detectDateFormat(dateStr: string): string {
    const formats = [
      "M/D/YYYY h:mm:ss A",  // Ex: 3/21/2025 5:17:08 PM
      "M/D/YYYY h:mm:ss",  // Ex: 3/21/2025 5:17:08 PM
      "DD/MM/YYYY HH:mm:ss",   // Ex: 21/03/2025 17:17:08
      "YYYY-MM-DDTHH:mm:ss", // Ex: 2025-03-21T17:17:08
      "YYYY/MM/DD HH:mm:ss", // Ex: 2025/03/21 17:17:08
      "YYYY-MM-DD HH:mm:ss"
    ];
  
    for (const format of formats) {
      if (moment(dateStr, format, true).isValid()) {
        return format;
      }
    }
  
    throw(`[DetectDateFormat]: Formato de data não mapeado. Valor recebido: ${dateStr}`);
}

/**
 * Verifica se uma data fornecida está dentro do intervalo de uma expressão cron.
 * @param {string} cronExpression - A expressão cron.
 * @param {Date} dateToTest - A data fornecida pelo usuário.
 * @returns {boolean} - True se a data estiver dentro do range do cron, false caso contrário.
 */
export function isDateInCronRange(cronExpression: string, dateToTest: Date) {
    try {
      const interval = parser.parseExpression(cronExpression);
  
      let nextExecution = interval.next().toDate();
      while (nextExecution <= dateToTest) {
        if (nextExecution.getTime() === dateToTest.getTime()) {
          return true; 
        }
        nextExecution = interval.next().toDate();
      }
  
      return false; 
    } catch (err) {
      console.error('Erro ao interpretar a expressão cron:', err.message);
      return false;
    }
  }