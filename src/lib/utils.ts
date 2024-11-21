import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function createSearchParams( type: 'toast' | 'default' = 'default', object: Record<string, any>): URLSearchParams {
  const searchParams = new URLSearchParams();
  
  if (type === 'toast') {
    Object.keys(object).forEach((k) => {
      searchParams.set(`toast[${k}]`, object[k]?.toString() ?? '');
    });
    return searchParams;
  }

  Object.keys(object).forEach((k) => {
    searchParams.set(k, object[k]?.toString() ?? '');
  });
  return searchParams;
}
