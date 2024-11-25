'use server';

import { signInWithPassword, signUpWithEmail, verifyOtp, resetPassword, updatePassword, resendVerificationEmail, createProfile, getUsernameExists } from '@/modules/auth/authService';
import { createToastParams, handleAuthError } from '@/lib/auth';
import { headers, cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function login({ email, password }: { email: string; password: string }) {
  const { error } = await signInWithPassword(email, password);

  if (error) {
    const redirectUri = await handleAuthError(error, email);
    return redirect(redirectUri);
  }

  const toastParams = createToastParams('default', `Welcome!`);
  revalidatePath('/', 'layout')
  redirect(`/?${toastParams}`);
}

export async function signup({ username, email, password, confirmPassword }: { username: string; email: string; password: string; confirmPassword: string }) {
  if (password !== confirmPassword) {
    const toastParams = createToastParams('error', 'Passwords do not match.');
    return redirect(`/auth/forgot-password/reset?${toastParams}`);
  }

  const usernameExists = await getUsernameExists(username);
  if (usernameExists.error) {
    const toastParams = createToastParams('error', 'Could not validate username.');
    return redirect(`/auth/register?${toastParams}`);
  }

  if (usernameExists.data.length > 0) {
    const toastParams = createToastParams('default', 'Username already exists, choose another one.');
    return redirect(`/auth/register?${toastParams}`);
  }

  const res = await signUpWithEmail(username, email, password);
  if (res.error || !res.data.user) {
    const toastParams = createToastParams('error', res.error?.message ?? 'Could not create profile');
    return redirect(`/auth?${toastParams}`);
  }

  (await cookies()).set('verification-email', email, { httpOnly: true, maxAge: 60 * 5 });
  redirect('/auth/verify/email');
}

export async function verifyCode({ token, type }: { token: string; type: 'email' | 'recovery' }) {
  const email = (await cookies()).get('verification-email')?.value;

  if (!email) {
    const toastParams = createToastParams('error', 'Email cookie expired, try again by logging in.');
    return redirect(`/auth?${toastParams}`);
  }

  const { data, error } = await verifyOtp(email, token, type);
  if (error || !data.user) {
    const toastParams = createToastParams('error', error?.message ?? 'User does not exist, was there a sign up?');
    redirect(`/auth?${toastParams}`);
  }

  if (type === 'email') {
    const res = await createProfile(data.user.id, data.user.user_metadata.username as string);
    if (res.error) {
      const toastParams = createToastParams('error', res.error.message);
      return redirect(`/auth/verify/email?${toastParams}`);
    }
  }

  const toastParams = createToastParams('default', type === 'recovery' ? 'Valid code entered.' : 'Account verified!');
  redirect(type === 'recovery' ? `/auth/forgot-password/reset?${toastParams}` : `/?${toastParams}`);
}

export async function forgotPasswordAction({ email }: { email: string }) {

  const { error } = await resetPassword(email);

  if (error) {
    const toastParams = createToastParams('error', error.message);
    return redirect(`/auth/forgot-password?${toastParams}`);
  }

  (await cookies()).set('verification-email', email, { httpOnly: true, maxAge: 60 * 5 });
  const toastParams = createToastParams('default', 'A link has been sent to your email (if found).');
  redirect(`/auth/verify/recovery?${toastParams}`);
}

export async function resetPasswordAction({ password, confirmPassword }: { password: string; confirmPassword: string }) {
  if (password !== confirmPassword) {
    const toastParams = createToastParams('error', 'Passwords do not match.');
    return redirect(`/auth/forgot-password/reset?${toastParams}`);
  }
  const { error } = await updatePassword(password);

  if (error) {
    const toastParams = createToastParams('error', 'Password reset failed. Please try again.');
    return redirect(`/?${toastParams}`);
  }

  const toastParams = createToastParams('default', 'Your password has been successfully reset.');
  redirect(`/?${toastParams}`);
}

export async function resendCode() {
  const email = (await cookies()).get('verification-email')?.value;

  if (!email) {
    const toastParams = createToastParams('error', 'Email cookie expired, try again by logging in.');
    return redirect(`/auth?${toastParams}`);
  }

  const { error } = await resendVerificationEmail(email);
  if (error) {
    const toastParams = createToastParams('error', error.message);
    return redirect(`/auth/verify/email?${toastParams}`);
  }

  const toastParams = createToastParams('default', 'Code has been resent!');
  redirect(`/auth/verify/email?${toastParams}`);
}
