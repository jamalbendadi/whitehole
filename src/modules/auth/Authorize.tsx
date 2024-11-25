import { createSearchParams } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation";

export async function Authorize() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if(!user){
        const toastParams = createSearchParams('toast', {name: 'error', description: 'You are not authorized to access this page.'})
        redirect(`/auth?${toastParams}`)
    }

    return null
}

export async function AuthorizeAnonymousOnly(){
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if(user){
        const toastParams = createSearchParams('toast', {name: 'error', description: 'You are already logged in.'})
        redirect(`/?${toastParams}`)
    }

    return null
}
