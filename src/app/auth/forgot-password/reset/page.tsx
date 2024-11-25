import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ResetPasswordForm from '@/app/auth/_forms/ResetPasswordForm';
import { resetPasswordAction } from '@/app/auth/actions';
import Link from 'next/link';
import { Authorize } from '@/modules/auth/Authorize';

export default function ResetPassword() {
    return (
        <>
            <Authorize/>
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Card className="mx-auto max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Reset Password</CardTitle>
                        <CardDescription>
                            Enter your new password below. Make sure to choose a strong password that you haven't used before.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResetPasswordForm onValidSubmit={resetPasswordAction} />
                        <div className="mt-4 text-center text-sm">
                            Remembered your password?&nbsp;
                            <Link href="/auth" className="underline">
                                Log in
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};
