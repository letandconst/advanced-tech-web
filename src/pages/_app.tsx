import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@/theme/theme';
import Layout from '@/components/Layout/Layout';
import { UserProvider } from '@/context/UserContext';
import { AppProps } from 'next/app';
import Loader from '@/components/Loader/Loader';

export default function App({ Component, pageProps }: AppProps) {
	const router = useRouter();

	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setIsAuthenticated(!!user);

			const publicRoutes = ['/login', '/forgot-password'];
			if (!user && !publicRoutes.includes(router.pathname)) {
				router.replace('/login');
			} else if (user && publicRoutes.includes(router.pathname)) {
				router.replace('/');
			}
		});

		return () => unsubscribe();
	}, [router]);

	const authRoutes = ['/login', '/forgot-password'];
	const isAuthPage = authRoutes.includes(router.pathname);

	return (
		<ThemeProvider>
			<CssBaseline />
			<UserProvider>
				{isAuthPage ? (
					<Component {...pageProps} />
				) : isAuthenticated ? (
					<Layout>
						<Component {...pageProps} />
					</Layout>
				) : (
					<Loader
						open={true}
						message='Loading...'
					/>
				)}
			</UserProvider>
		</ThemeProvider>
	);
}
