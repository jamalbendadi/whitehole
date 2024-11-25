import { createSearchParams } from '@/lib/utils';
import { AuthError } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export function createToastParams(type: 'default' | 'error', description: string): URLSearchParams {
    return createSearchParams('toast', {
        name: type,
        description,
    });
}

/**
 * 
 * @param error 
 * @param email 
 * @returns redirectUri
 */
export async function handleAuthError(error: AuthError, email: string): Promise<string> {
    if (error.message === 'Email not confirmed') {
        (await cookies()).set('verification-email', email, { httpOnly: true, maxAge: 60 * 5 });
        return `/auth/verify/email?${createToastParams('default', error.message)}`;
    }
    if (error.message === 'Invalid login credentials') {
        return `/auth?${createToastParams('error', 'Wrong password or user does not exist, please sign up first.')}`;
    }
    return `/auth?${createToastParams('error', `Something went wrong, contact support. [${error.message}]`)}`;
}
