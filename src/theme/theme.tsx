'use client';

import type React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
	mode: ThemeMode;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
	mode: 'light',
	toggleTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [mode, setMode] = useState<ThemeMode>('light');

	useEffect(() => {
		const savedMode = localStorage.getItem('theme-mode') as ThemeMode | null;
		if (savedMode) {
			setMode(savedMode);
		} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			setMode('dark');
		}
	}, []);

	const toggleTheme = () => {
		setMode((prevMode) => {
			const newMode = prevMode === 'light' ? 'dark' : 'light';
			localStorage.setItem('theme-mode', newMode);
			return newMode;
		});
	};

	const theme = createTheme({
		typography: {
			fontFamily: "'Nunito Sans', sans-serif",
		},
		palette: {
			mode,
			...(mode === 'light'
				? {
						primary: {
							main: '#1976d2',
						},
						secondary: {
							main: '#9c27b0',
						},
						background: {
							default: '#f5f5f5',
							paper: '#ffffff',
						},
				  }
				: {
						primary: {
							main: '#90caf9',
						},
						secondary: {
							main: '#ce93d8',
						},
						background: {
							default: '#121212',
							paper: '#1e1e1e',
						},
				  }),
		},
	});

	return (
		<ThemeContext.Provider value={{ mode, toggleTheme }}>
			<MuiThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</MuiThemeProvider>
		</ThemeContext.Provider>
	);
}
