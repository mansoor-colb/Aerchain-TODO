import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday, isPast, parseISO } from 'date-fns';

/**
 * Format a date for display
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return '';
  
  try {
    const date = parseISO(dateString);
    
    if (isToday(date)) {
      // return `Today at ${format(date, 'h:mm a')}`;
      return 'Today'
    }
    
    if (isTomorrow(date)) {
      // return `Tomorrow at ${format(date, 'h:mm a')}`;
      return 'Tomorrow'
    }
    
    if (isYesterday(date)) {
      // return `Yesterday at ${format(date, 'h:mm a')}`;
      return "Yesterday"
    }
    
    return format(date, 'MMM d, h:mm a');
  } catch {
    return dateString;
  }
}

/**
 * Format a date as relative time
 */
export function formatRelativeDate(dateString: string | null): string {
  if (!dateString) return '';
  
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return dateString;
  }
}

/**
 * Check if a date is overdue
 */
export function isOverdue(dateString: string | null): boolean {
  if (!dateString) return false;
  
  try {
    const date = parseISO(dateString);
    return isPast(date);
  } catch {
    return false;
  }
}

/**
 * Format date for input field (datetime-local)
 */
// export function formatForInput(dateString: string | null): string {
//   if (!dateString) return '';
  
//   try {
//     const date = parseISO(dateString);
//     return format(date, "yyyy-MM-dd'T'HH:mm");
//   } catch {
//     return '';
//   }
// }

// /**
//  * Parse input date to ISO string
//  */
// export function parseInputDate(value: string): string | null {
//   if (!value) return null;
  
//   try {
//     const date = new Date(value);
//     return date.toISOString();
//   } catch {
//     return null;
//   }
// }


// formatForInput → converts ISO to "yyyy-MM-ddTHH:mm"
export function formatForInput(date: string | null) {
  if (!date) return "";
  const d = new Date(date);
  // Fix timezone offset issue
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
  return local;
}

// parseInputDate → convert input "yyyy-MM-ddTHH:mm" to ISO
export function parseInputDate(value: string) {
  if (!value) return null;
  const local = new Date(value);
  return local.toISOString(); 
}

