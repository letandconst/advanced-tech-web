'use client';

import type React from 'react';

import { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Container, CircularProgress, Link, Alert, InputAdornment, IconButton } from '@mui/material';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { Visibility, VisibilityOff, DirectionsCar } from '@mui/icons-material';
interface LoginFormData {
	email: string;
	password: string;
}

export default function LoginPage() {
	const [formData, setFormData] = useState<LoginFormData>({
		email: '',
		password: '',
	});
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [resetSent, setResetSent] = useState<boolean>(false);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [resetEmail, setResetEmail] = useState<string>('');
	const [showResetForm, setShowResetForm] = useState<boolean>(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			await signInWithEmailAndPassword(auth, formData.email, formData.password);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			console.log('err', err.code);
			setError(err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' ? 'Invalid email or password' : 'An error occurred during login. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const handleForgotPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			await sendPasswordResetEmail(auth, resetEmail);
			setResetSent(true);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			setError(err.code === 'auth/user-not-found' ? 'Invalid email address' : 'Failed to send reset email. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container
			maxWidth='sm'
			sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}
		>
			<Paper
				elevation={3}
				sx={{
					p: 4,
					width: '100%',
					borderRadius: 2,
					boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
				}}
			>
				<Box sx={{ textAlign: 'center', mb: 3 }}>
					<Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
						<DirectionsCar sx={{ fontSize: 48, color: '#1976d2' }} />
					</Box>
					<Typography
						variant='h4'
						component='h1'
						fontWeight='bold'
						color='primary'
					>
						ADVANCEDTECH CAR <br />
						SERVICE CENTER CO.
					</Typography>
					<Typography
						variant='subtitle1'
						color='text.secondary'
					>
						formerly ANTE MOTOR
					</Typography>
				</Box>

				{error && (
					<Alert
						severity='error'
						sx={{ mb: 3 }}
					>
						{error}
					</Alert>
				)}

				{!showResetForm ? (
					<Box
						component='form'
						onSubmit={handleLogin}
						noValidate
					>
						<TextField
							margin='normal'
							required
							fullWidth
							id='email'
							label='Email Address'
							name='email'
							autoComplete='email'
							autoFocus
							value={formData.email}
							onChange={handleChange}
							sx={{ mb: 2 }}
						/>
						<TextField
							margin='normal'
							required
							fullWidth
							name='password'
							label='Password'
							type={showPassword ? 'text' : 'password'}
							id='password'
							autoComplete='current-password'
							value={formData.password}
							onChange={handleChange}
							InputProps={{
								endAdornment: (
									<InputAdornment position='end'>
										<IconButton
											aria-label='toggle password visibility'
											onClick={() => setShowPassword(!showPassword)}
											edge='end'
										>
											{showPassword ? <VisibilityOff fontSize='small' /> : <Visibility fontSize='small' />}
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
						<Box sx={{ mt: 3, mb: 2 }}>
							<Button
								type='submit'
								fullWidth
								variant='contained'
								size='large'
								disabled={loading}
								sx={{
									py: 1.5,
									textTransform: 'none',
									fontWeight: 'bold',
									borderRadius: 2,
								}}
							>
								{loading ? <CircularProgress size={24} /> : 'Sign In'}
							</Button>
						</Box>
						<Box sx={{ textAlign: 'center' }}>
							<Link
								href='#'
								variant='body2'
								onClick={(e) => {
									e.preventDefault();
									setShowResetForm(true);
									setResetEmail(formData.email);
								}}
								sx={{ cursor: 'pointer' }}
							>
								Forgot password?
							</Link>
						</Box>
					</Box>
				) : (
					<Box
						component='form'
						onSubmit={handleForgotPassword}
						noValidate
					>
						{resetSent ? (
							<Alert
								severity='success'
								sx={{ mb: 3 }}
							>
								Password reset email sent! Check your inbox.
							</Alert>
						) : (
							<>
								<Typography
									variant='body1'
									sx={{ mb: 2 }}
								>
									Enter your email address and we&apos;ll send you a link to reset your password.
								</Typography>
								<TextField
									margin='normal'
									required
									fullWidth
									id='reset-email'
									label='Email Address'
									name='email'
									autoComplete='email'
									value={resetEmail}
									onChange={(e) => setResetEmail(e.target.value)}
									sx={{ mb: 2 }}
								/>
								<Box sx={{ mt: 3, mb: 2 }}>
									<Button
										type='submit'
										fullWidth
										variant='contained'
										size='large'
										disabled={loading}
										sx={{
											py: 1.5,
											textTransform: 'none',
											fontWeight: 'bold',
											borderRadius: 2,
										}}
									>
										{loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
									</Button>
								</Box>
							</>
						)}
						<Box sx={{ textAlign: 'center' }}>
							<Link
								href='#'
								variant='body2'
								onClick={(e) => {
									e.preventDefault();
									setShowResetForm(false);
									setResetSent(false);
									setError(null);
								}}
								sx={{ cursor: 'pointer' }}
							>
								Back to login
							</Link>
						</Box>
					</Box>
				)}
			</Paper>
		</Container>
	);
}
