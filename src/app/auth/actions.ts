'use server'

import { revalidatePath } from 'next/cache'
import { permanentRedirect, redirect, RedirectType } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { AuthError, EmailOtpType } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'

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
  const { data, error } = await supabase.auth.verifyOtp({
    email: email,
    token: token,
    type: 'email',
    options: {
      redirectTo: '/?toast[name]=verified'
    }
  })
  console.log(data)
  if(error){
    console.error('error verify otp')
    console.log({...error})
    // Given code may have expired
    redirect(`/?toast[name]=error&toast[description]=${error.message}`)
  }

  redirect(`/?toast[name]=verified&[description]=Congratulations, your account is verified.`);
}

export async function forgotPasswordAction(){

}

async function loginError(error: AuthError, email: string){
  console.log(error.message);
  
  (await cookies()).set('verification-email', email, {
    httpOnly: true,
    maxAge: 60*5
  });
  if(error.message === 'Email not confirmed'){
    return redirect(`/auth/verify/email?toast[name]=default&toast[description]=${error.message}`);
  }
  if(error.message === 'Invalid login credentials'){
    return redirect(`/auth?toast[name]=default&toast[description]=Login not found, please sign up.` )
  }
  return permanentRedirect(`/auth?toast[name]=error&toast[description]=Something went wrong, contact support. [${error.message}]`)
}
