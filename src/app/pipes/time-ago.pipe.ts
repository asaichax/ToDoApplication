import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe that transforms a date into a relative time string
 */
@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {
  /**
   * Transform a date into a relative time string
   * @param value The date to transform
   * @returns A string like "2 hours ago" or "Just now"
   */
  transform(value: Date): string {
    if (!value) return '';

    const seconds = Math.floor((new Date().getTime() - new Date(value).getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
      }
    }
    
    return 'Just now';
  }
} 