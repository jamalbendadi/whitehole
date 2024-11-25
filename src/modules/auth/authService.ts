import { createToastParams } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { UUID } from 'crypto';
import { headers } from 'next/headers';

export async function signInWithPassword(email: string, password: string) {
    const supabase = await createClient();
    return await supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(username: string, email: string, password: string) {
    const requestHeaders = await headers();
    const host = requestHeaders.get('host');
    const protocol = requestHeaders.get('x-forwarded-proto') || 'http';
    const redirectUrl = `${protocol}://${host}/auth?${createToastParams('default', 'Your account is now verified!')}`;
  
    const supabase = await createClient();
    return await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectUrl, data: {username: username} },
    });
}

export async function createProfile(id: string, username: string) {
    const supabase = await createClient();
    return await supabase.from('profiles')
        .insert({
            id: id,
            username: username,
            avatar_url: '',
            website: ''
        })
}

export async function verifyOtp(email: string, token: string, type: 'email' | 'recovery') {
    const supabase = await createClient();
    return await supabase.auth.verifyOtp({ email, token, type });
}

export async function resetPassword(email: string) {
    const requestHeaders = await headers();
    const host = requestHeaders.get('host');
    const protocol = requestHeaders.get('x-forwarded-proto') || 'http';
    const redirectTo = `${protocol}://${host}/auth/forgot-password/callback`;
  
    const supabase = await createClient();
    return await supabase.auth.resetPasswordForEmail(email, { redirectTo });
}

export async function updatePassword(password: string) {
    const supabase = await createClient();
    return await supabase.auth.updateUser({ password });
}

export async function resendVerificationEmail(email: string) {
    const requestHeaders = await headers();
    const host = requestHeaders.get('host');
    const protocol = requestHeaders.get('x-forwarded-proto') || 'http';
    const redirectUrl = `${protocol}://${host}/auth?${createToastParams('default', 'Verification email sent.')}`;
  
    const supabase = await createClient();
    return await supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: redirectUrl },
    });
}

export async function getUsernameExists(username: string){
    const supabase = await createClient();
    return await supabase.from('profiles')
            .select('username')
            .ilike('username', username)
            .limit(1)
            ;
            
}
