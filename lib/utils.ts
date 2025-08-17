import { type ClassValue, clsx } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function getOutcomeColor(outcome: string): string {
  const colors = {
    'qualified': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'not-qualified': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'follow-up': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'closed-won': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    'closed-lost': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  };
  return colors[outcome as keyof typeof colors] || 'bg-gray-100 text-gray-800';
}
