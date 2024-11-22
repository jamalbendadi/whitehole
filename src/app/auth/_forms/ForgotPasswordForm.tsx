'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

type FormProps = {
    onValidSubmit: (values: ForgotPasswordFormSchema) => void
}
const formSchemaForgotPassword = z.object({
    email: z.string().email({ message: 'Please enter a valid email address' }),
    captchaToken: z.string()
});
type ForgotPasswordFormSchema = z.infer<typeof formSchemaForgotPassword>

export default function ForgotPasswordForm({ onValidSubmit }: FormProps) {
    const form = useForm<ForgotPasswordFormSchema>({
        resolver: zodResolver(formSchemaForgotPassword),
        defaultValues: {
            email: '',
            captchaToken: 'xxxxxx'
        },
    });

    function onSubmit(values: ForgotPasswordFormSchema) {
        console.log("Password Reset Requested for:", values);
        onValidSubmit(values)
    }

    return (
        <Form {...form}>
            <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-2">
                    <FormField control={form.control} name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField control={form.control} name='captchaToken'
                        render={({ field }) => (
                            <FormItem>
                                <input {...field} value={'xxxxxx'} hidden readOnly/>
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit" className="w-full">
                    Send Reset Link
                </Button>
            </form>
        </Form>
    );
};
