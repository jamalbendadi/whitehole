import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import VerifyCodeForm from '@/app/auth/_forms/VerifyCodeForm';
import { resendCode, verifyCode } from '@/app/auth/actions';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createSearchParams } from '@/lib/utils';

export default async function VerifyCodePage({ params, }: { params: Promise<{ slug: string }> }) {
    const email = (await cookies()).get('verification-email')?.value;
    if (!email) {
        const urlParams = createSearchParams('toast', {name: 'error', description: 'Not authorized or cookie has expired'})
        return redirect(`/auth?${urlParams}`) // toast expired 
    }
    const type = (await params).slug === "email" ? "email" : "password"
    const isEmailVerification = type === "email";
    console.log()
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">{isEmailVerification ? "Verify Your Email" : "Verify Password Reset"}</CardTitle>
                    <CardDescription>
                        Enter the verification code sent to {email} to proceed.<br />
                        <sub>This link expires in 5 minutes.</sub>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isEmailVerification &&
                        <VerifyCodeForm type={type} onValidSubmit={verifyCode} />
                    }
                    <div className="mt-4 text-center text-sm">
                        Didn&apos;t receive a code?{" "}
                        <Button variant="link" className="underline" onClick={resendCode}>
                            Resend Code
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
