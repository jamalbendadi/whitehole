import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import VerifyCodeForm from '@/app/auth/_forms/VerifyCodeForm';
import { resendCode, verifyCode } from '@/app/auth/actions';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createSearchParams } from '@/lib/utils';
import Link from 'next/link';

export default async function VerifyCodePage({ params, }: { params: Promise<{ slug: string }> }) {
    const email = (await cookies()).get('verification-email')?.value;
    if (!email) {
        const urlParams = createSearchParams('toast', { name: 'error', description: 'Not authorized or cookie has expired' })
        return redirect(`/auth?${urlParams}`) // toast expired 
    }
    const type = (await params).slug === 'email' ? 'email' : 'recovery'
    const isEmailVerification = type === 'email';

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
                    <VerifyCodeForm type={type} onValidSubmit={verifyCode} />

                    {isEmailVerification &&
                        <div className="mt-4 text-center text-sm">
                            Didn&apos;t receive a code?{" "}
                            <Button variant="link" className="underline" onClick={resendCode}>
                                Resend Code
                            </Button>
                        </div>
                    }
                    {!isEmailVerification &&
                        <div className="mt-4 text-center text-sm">
                            Didn&apos;t receive a code?{" "}
                            <Link href="/auth/forgot-password" className="underline">
                                Try again
                            </Link>
                        </div>
                    }
                </CardContent>
            </Card>
        </div>
    );
};
