import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from '@/app/auth/_forms/LoginForm';
import { login } from './actions';
import Link from 'next/link';

export default function LoginPage() {

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm onValidSubmit={login} />
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?&nbsp;
                        <Link href="/auth/register" className="underline">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
};