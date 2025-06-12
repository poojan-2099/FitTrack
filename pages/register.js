import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Register from '../components/auth/Register';
import AuthLayout from '../components/auth/AuthLayout';

const RegisterPage = () => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);

    return (
        <AuthLayout>
            <Register />
        </AuthLayout>
    );
};

export default RegisterPage; 