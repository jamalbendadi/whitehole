'use client'

import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"

function decideToastNameTitle(toastName: string){
    if(toastName==='error') return 'Something went wrong';
    if(toastName==='default') return 'Info';
    return toastName;
}

export default function AppToaster() {
    const { toast } = useToast()
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const toastName = decodeURIComponent(searchParams.get('toast[name]') ?? '');
    const toastDescription = decodeURIComponent(searchParams.get('toast[description]') ?? '');
    console.log(searchParams)
    console.log(pathname, toastName, toastDescription);
    
    useEffect(() => {
        if (!toastName) {
            return;
        }
        toast({
            title: decideToastNameTitle(toastName),
            description: toastDescription,
            variant: toastName === 'error' ? 'destructive' : 'default'
        })
        setTimeout(()=> {
            const newParams = clearToastSearchparams(searchParams);
            const url = `${pathname}?${newParams}`
            router.replace(url);
        }, 10)
        }, [toastDescription, toastName])
    return (
        <Toaster />
    )
}

function clearToastSearchparams(oldSearchParams: URLSearchParams): URLSearchParams{
    const newParams = new URLSearchParams(oldSearchParams)
    newParams.delete('toast[name]')
    newParams.delete('toast[description]')
    return newParams;
}