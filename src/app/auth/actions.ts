'use server'

import { revalidatePath } from 'next/cache'
import { redirect} from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { AuthError, EmailOtpType } from '@supabase/supabase-js'
import { cookies, headers } from 'next/headers'
import { createSearchParams } from '@/lib/utils'

type Login = {
  email: string,
  password: string
}
type Verification = {
  token: string
  type: EmailOtpType
}
export async function login({email, password}: Login) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({email, password})
  if (error) {
    return await loginError(error, email)
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup({name, email, password, confirmPassword}: {name: string, confirmPassword: string} & Login) {
  const supabase = await createClient()
  const requestHeaders = await headers();
  const urlParams = createSearchParams('toast', {name: 'default', description: 'Congratulations, your account is now verified!'})
  const { error } = await supabase.auth.signUp({email, password,
    options:{
      emailRedirectTo: `http://${requestHeaders.get('host')}?${urlParams}`
    }
  });

  if (error) {
    const urlParams = createSearchParams('toast', {name: 'error', description: error.message})
    return redirect(`/auth/?${urlParams}`);
  }

  (await cookies()).set('verification-email', email, {
    httpOnly: true,
    maxAge: 60*5
  });
  redirect('/auth/verify/email');
}

export async function verifyCode({token, type}: Verification){
  const email = ((await cookies()).get('verification-email'))?.value
  if(!email){
    const urlParams = createSearchParams('toast', {name: 'error', description: 'Email cookie expired, try again by logging in.'})
    return redirect(`/auth?${urlParams}`)
  }
  
  const supabase = await createClient()
  const { error } = await supabase.auth.verifyOtp({
    email: email,
    token: token,
    type: type,
  })

  if(error){
    const urlParams = createSearchParams('toast', {name: 'error', description: error.message});
    redirect(`/?${urlParams}`);
  }

  const urlParams = createSearchParams('toast', {name: 'default', description: 'Congratulations, your account is verified.'})
  redirect(`/?${urlParams}`);
}

export async function forgotPasswordAction(){

}

export async function resendCode(){
  const email = ((await cookies()).get('verification-email'))?.value
  let urlParams = createSearchParams('toast', {name: 'default', description: 'Congratulations, your account is verified.'})
  if(!email){
    console.log('redirect: email not exist')
    urlParams = createSearchParams('toast', {name: 'error', description: 'Email cookie expired, try again by logging in.'})
    return redirect(`/auth?${urlParams}`)
  }

  const requestHeaders = await headers();
  const supabase = await createClient()
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
    options:{
      emailRedirectTo: `http://${requestHeaders.get('host')}?${urlParams}`
    }
  })

  if(error){
    urlParams = createSearchParams('toast', {name: 'error', description: error.message})
    return redirect(`/auth/verify/email?${urlParams}`);
  }

  urlParams = createSearchParams('toast', {name: 'default', description: 'Code has been resent!'})
  return redirect(`/auth/verify/email?${urlParams}`);
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
    const urlParams = createSearchParams('toast', {name: 'error', description: 'Wrong password or user does not exist, please sign up first.'})
    return redirect(`/auth?${urlParams}` )
  }
  const urlParams = createSearchParams('toast', {name: 'error', description: `Something went wrong, contact support. [${error.message}]`})
  return redirect(`/auth?${urlParams}`)
}

