import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Login from '../components/auth/Login';
import AuthLayout from '../components/auth/AuthLayout';

const HomePage = () => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);

    return (
        <AuthLayout>
            <Login />
        </AuthLayout>
    );
};

export default HomePage;