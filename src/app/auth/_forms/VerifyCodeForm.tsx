'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

type FormProps = {
    type: "email" | "recovery";
    onValidSubmit: ({token, type}: VerifyCodeFormSchema) => void;
};

const formSchemaVerify = z.object({
    token: z.string().min(6, { message: 'Verification code must be at least 6 characters' }),
    type: z.enum(['email','recovery']).default('email')
});

type VerifyCodeFormSchema = z.infer<typeof formSchemaVerify>
export default function VerifyCodeForm({ type, onValidSubmit }: FormProps) {
    const form = useForm<VerifyCodeFormSchema>({
        resolver: zodResolver(formSchemaVerify),
        defaultValues: {
            token: "",
        },
    });

    function onSubmit(values: VerifyCodeFormSchema) {
        onValidSubmit({...values, type: isEmailVerification ? 'email' : 'recovery'});
    }

    const isEmailVerification = type === "email";

    return (

        <Form {...form}>
            <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-2">
                    <FormField control={form.control} name='token'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Verification Code</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField control={form.control} name='type'
                            render={({field})=>(
                                <input name={field.name} value={type} hidden readOnly/>
                            )}
                    />
                </div>
                <Button type="submit" className="w-full">
                    {isEmailVerification ? "Verify Email" : "Verify Password Reset"}
                </Button>
            </form>
        </Form>

    );
};
