'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

type FormProps = {
    onValidSubmit: (values: ResetPasswordFormSchema) => void
}

// Schema definition for the reset password form
const formSchemaResetPassword = z.object({
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
    confirmPassword: z.string().min(6, { message: 'Confirm Password must be at least 6 characters long' }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type ResetPasswordFormSchema = z.infer<typeof formSchemaResetPassword>;

export default function ResetPasswordForm({ onValidSubmit }: FormProps) {

    const form = useForm<ResetPasswordFormSchema>({
        resolver: zodResolver(formSchemaResetPassword),
        defaultValues: {
            password: "",
            confirmPassword: ""
        },
    });

    function onSubmit(values: ResetPasswordFormSchema) {
        onValidSubmit(values);
    }

    return (
        <Form {...form}>
            <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-2">
                    <FormField control={form.control} name='password'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid gap-2">
                    <FormField control={form.control} name='confirmPassword'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit" className="w-full">
                    Reset Password
                </Button>
            </form>
        </Form>
    )
};
