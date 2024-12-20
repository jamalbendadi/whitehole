import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ForgotPasswordForm from '@/app/auth/_forms/ForgotPasswordForm';
import { forgotPasswordAction } from '../actions';
import Link from 'next/link';


export default function ForgotPassword() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Forgot Password</CardTitle>
                    <CardDescription>
                        Enter your email address to receive a password reset link.
                        If the email does not exists in our database an email will not be sent.<br/>
                        <sub>Note: Check your spam</sub>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ForgotPasswordForm onValidSubmit={forgotPasswordAction}/>
                    <div className="mt-4 text-center text-sm">
                        Remembered your password?&nbsp;
                        <Link href="/auth" className="underline">
                            Log in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
