import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RegisterForm from '@/app/auth/_forms/RegisterForm';
import { signup } from '@/app/auth/actions';


export default function Register() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Register</CardTitle>
                    <CardDescription>
                        Enter your details below to create a new account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RegisterForm onValidSubmit={signup}/>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <a href="/login" className="underline">
                            Log in
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

