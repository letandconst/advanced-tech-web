import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@/theme/theme';
import type { AppProps } from 'next/app';
import { Nunito_Sans } from 'next/font/google';

import Layout from '@/components/Layout/Layout';

const nunitoSans = Nunito_Sans({ subsets: ['latin'], variable: '--font-nunito-sans' });

export default function App({ Component, pageProps }: AppProps) {
	return (
		<main className={`${nunitoSans.variable} font-sans`}>
			<ThemeProvider>
				<CssBaseline />
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</ThemeProvider>
		</main>
	);
}
