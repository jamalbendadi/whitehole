import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ForgotPasswordForm from '@/app/auth/_forms/ForgotPasswordForm';
import { forgotPasswordAction } from '../actions';


export default function ForgotPassword() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Forgot Password</CardTitle>
                    <CardDescription>
                        Enter your email address to receive a password reset link.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ForgotPasswordForm onValidSubmit={forgotPasswordAction}/>
                    <div className="mt-4 text-center text-sm">
                        Remembered your password?{" "}
                        <a href="/login" className="underline">
                            Log in
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
