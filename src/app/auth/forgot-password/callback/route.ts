import { createSearchParams } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
export async function GET(req: NextRequest) {
    const requestHeaders = await headers();
    const supabase = await createClient()
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code') as string
    console.log(requestHeaders)
    if (!code) {
        const urlParams = createSearchParams('toast', {name:'error', description: 'Invalid link.'})
        redirect(`/?${urlParams}`)
    }
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if(error){
        const urlParams = createSearchParams('toast', {name:'error', description: 'Could not determine user. Are you using the same browser?'})
        redirect(`/?${urlParams}`)
    }

    return redirect('/auth/forgot-password/reset')
}