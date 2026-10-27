import { Pipe, PipeTransform } from '@angular/core';

const units = ['B', 'KB', 'MB', 'GB'];

/** Formats a byte count for people, e.g. 48000000 → "45.8 MB". */
@Pipe({ name: 'fileSize' })
export class FileSizePipe implements PipeTransform {
  transform(bytes: number): string {
    let value = bytes;
    let unit = 0;
    while (value >= 1024 && unit < units.length - 1) {
      value /= 1024;
      unit++;
    }
    return unit === 0 ? `${value} B` : `${value.toFixed(1)} ${units[unit]}`;
  }
}
