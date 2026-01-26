import { LoginForm } from '@/features/auth/components/login-form';

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-950">
            <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-800/20" />
            <div className="relative z-10">
                <LoginForm />
            </div>
        </div>
    );
}
