'use server'

import { revalidatePath } from 'next/cache'
import { permanentRedirect, redirect, RedirectType } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { AuthError, EmailOtpType } from '@supabase/supabase-js'
import { cookies } from 'next/headers'


type Login = {
  email: string,
  password: string
}
type Verification = {
  email: string
  token: string
  type: EmailOtpType
}
export async function login({email, password}: Login) {
  const supabase = await createClient()

  // if locked: redirect to locked/account
  const { error } = await supabase.auth.signInWithPassword({email, password})
  if (error) {
    return await loginError(error, email)
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup({name, email, password, confirmPassword}: {name: string, confirmPassword: string} & Login) {
  const supabase = await createClient()
  // check if user exists
  // if yes but unverified: to auth/verify/email with toast
  // if yes: redirect to login with toast
  const { error } = await supabase.auth.signUp({email, password});
  if (error) {
    return redirect(`/auth/?toast[name]=error&toast[description]=${error.message}}`);
  }
  (await cookies()).set('verification-email', email, {
    httpOnly: true,
    maxAge: 60*5
  });
  redirect('/auth/verify/email');
}

export async function verifyCode({email, token, type}: Verification){
  // check what type of code verifcation (through request, or supabase getUser() or through form (unsecure))
  const supabase = await createClient()
  const { error } = await supabase.auth.verifyOtp({
    email: email,
    token: token,
    type: 'email',
    /*options: {
      redirectTo: '/?toast[name]=verified'
    }*/
  })

  if(error){
    console.error('error verifying otp');
    console.log(error.code, error.cause, error.message);
    // Given code may have expired
    const urlParams = createSearchParams('toast', {name: 'error', description: error.message});
    redirect(`/?${urlParams}`);
  }

  const urlParams = createSearchParams('toast', {name: 'default', description: 'Congratulations, your account is verified.'})
  redirect(`/?${urlParams}`);
}

export async function forgotPasswordAction(){

}

export async function resendCode(){
  console.log('resending');
  const email = ((await cookies()).get('verification-email'))?.value
  if(!email){
    console.log('redirect: email not exist')
    const urlParams = createSearchParams('toast', {name: 'error', description: 'Email cookie expired, try again by logging in.'})
    return redirect(`/auth?${urlParams}`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
  })

  if(error){
    const urlParams = createSearchParams('toast', {name: 'error', description: error.message})
    return redirect(`/auth/verify/email?${urlParams}`);
  }
  const urlParams = createSearchParams('toast', {name: 'default', description: 'Code has been resent!'})
  return redirect(`/auth/verify/email?${urlParams}`);
}

function createSearchParams( type: 'toast' | 'default' = 'default', object: Record<string, any>): URLSearchParams {
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

async function loginError(error: AuthError, email: string){
  console.log(error.message);
  
  (await cookies()).set('verification-email', email, {
    httpOnly: true,
    maxAge: 60*5
  });
  if(error.message === 'Email not confirmed'){
    const urlParams = createSearchParams('toast', {name: 'default', description: error.message})
    return redirect(`/auth/verify/email?${urlParams}`);
  }
  if(error.message === 'Invalid login credentials'){ // NOTE: if account is banned, supabase returns this message
    const urlParams = createSearchParams('toast', {name: 'error', description: 'Login not found, please sign up.'})
    return redirect(`/auth?${urlParams}` )
  }
  const urlParams = createSearchParams('toast', {name: 'error', description: `Something went wrong, contact support. [${error.message}]`})
  return redirect(`/auth?${urlParams}`)
}

