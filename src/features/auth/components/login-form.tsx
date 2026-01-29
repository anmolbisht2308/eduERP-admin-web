'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/motion';
import { useState } from 'react';
import { Loader2, GraduationCap } from 'lucide-react';
import { setCookie } from 'cookies-next';

const formSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export function LoginForm() {
    const router = useRouter();
    const { login } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', values);
            const { token, data } = response.data;
            const { user } = data;

            // Update Store
            login(user, token);

            // Set Cookie for API middleware interactio details
            setCookie('token', token, { maxAge: 60 * 60 * 24 }); // 1 day

            toast.success('Welcome back, ' + user.name);

            // Redirect based on role
            if (user.role === 'super_admin') {
                router.push('/super-admin');
            } else {
                router.push('/dashboard');
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-md p-8 space-y-8 bg-card rounded-2xl shadow-2xl border border-border/50 backdrop-blur-sm relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500" />

            <div className="text-center space-y-2">
                <div className="bg-primary/10 w-fit p-3 rounded-xl mx-auto mb-4">
                    <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">EduERP</h1>
                <p className="text-sm text-muted-foreground">Log in to manage your institution</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="admin@school.com" className="h-11 bg-input/50 focus:bg-background transition-colors" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center justify-between">
                                    <FormLabel>Password</FormLabel>
                                    <span className="text-xs text-primary cursor-pointer hover:underline">Forgot?</span>
                                </div>
                                <FormControl>
                                    <Input type="password" placeholder="••••••••" className="h-11 bg-input/50 focus:bg-background transition-colors" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full h-11 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all" disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Log In to Dashboard'}
                    </Button>
                </form>
            </Form>

            <div className="text-center text-xs text-muted-foreground mt-4">
                By logging in, you agree to our <span className="underline hover:text-primary cursor-pointer">Terms</span> and <span className="underline hover:text-primary cursor-pointer">Privacy Policy</span>.
            </div>
        </motion.div>
    );
}
