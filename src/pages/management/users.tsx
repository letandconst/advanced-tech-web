'use client';

import { FormEvent, useState } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, OutlinedInput, FormHelperText, Stack, IconButton } from '@mui/material';
import { Add, Visibility, VisibilityOff } from '@mui/icons-material';
import { auth, db } from '@/services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';

interface User {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	status: 'active' | 'inactive';
	contactNumber?: string;
}

interface UserFormData {
	firstName: string;
	lastName: string;
	contactNumber: string;
	email: string;
	password: string;
}

export default function UserManagement() {
	const [open, setOpen] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState<UserFormData>({
		firstName: '',
		lastName: '',
		contactNumber: '',
		email: '',
		password: '',
	});
	const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});

	const handleOpen = () => setOpen(true);
	const handleClose = () => {
		setOpen(false);
		setFormData({
			firstName: '',
			lastName: '',
			contactNumber: '',
			email: '',
			password: '',
		});
		setErrors({});
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));

		// Clear error when user types
		if (errors[name as keyof UserFormData]) {
			setErrors((prev) => ({ ...prev, [name]: '' }));
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword((prev) => !prev);
	};

	const validateForm = (): boolean => {
		const newErrors: Partial<Record<keyof UserFormData, string>> = {};

		if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
		if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

		if (!formData.email.trim()) newErrors.email = 'Email is required';
		else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
		if (!formData.password.trim()) newErrors.password = 'Temporary password is required';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (validateForm()) {
			const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
			const user = userCredential.user;

			await set(ref(db, `users/${user.uid}`), {
				firstName: formData.firstName,
				lastName: formData.lastName,
				email: formData.email,
				avatar: null,
				createdAt: new Date().toISOString(),
			});

			handleClose();
		}
	};

	return (
		<Box sx={{ mt: 4, mb: 4 }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
				<Typography
					variant='h4'
					component='h1'
				>
					User Management
				</Typography>
				<Button
					variant='contained'
					color='primary'
					startIcon={<Add />}
					onClick={handleOpen}
				>
					Add New User
				</Button>
			</Box>

			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>First Name</TableCell>
							<TableCell>Last Name</TableCell>
							<TableCell>Email Address</TableCell>
							<TableCell>Status</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{/* {users.map((user) => (
							<TableRow key={user.id}>
								<TableCell>{user.firstName}</TableCell>
								<TableCell>{user.lastName}</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>{getStatusChip(user.status)}</TableCell>
							</TableRow>
						))} */}
					</TableBody>
				</Table>
			</TableContainer>

			<Dialog
				open={open}
				onClose={handleClose}
				maxWidth='sm'
				fullWidth
			>
				<DialogTitle>Add New User</DialogTitle>
				<DialogContent>
					<Box
						component='form'
						noValidate
						sx={{ mt: 2 }}
					>
						<Stack
							direction='row'
							spacing={2}
							sx={{ mb: 3 }}
						>
							<FormControl
								fullWidth
								error={!!errors.firstName}
							>
								<InputLabel htmlFor='firstName'>First Name *</InputLabel>
								<OutlinedInput
									id='firstName'
									name='firstName'
									label='First Name *'
									value={formData.firstName}
									onChange={handleChange}
								/>
								{errors.firstName && <FormHelperText>{errors.firstName}</FormHelperText>}
							</FormControl>

							<FormControl
								fullWidth
								error={!!errors.lastName}
							>
								<InputLabel htmlFor='lastName'>Last Name *</InputLabel>
								<OutlinedInput
									id='lastName'
									name='lastName'
									label='Last Name *'
									value={formData.lastName}
									onChange={handleChange}
								/>
								{errors.lastName && <FormHelperText>{errors.lastName}</FormHelperText>}
							</FormControl>
						</Stack>

						<FormControl
							fullWidth
							error={!!errors.contactNumber}
							sx={{ mb: 3 }}
						>
							<InputLabel htmlFor='contactNumber'>Contact Number *</InputLabel>
							<OutlinedInput
								id='contactNumber'
								name='contactNumber'
								label='Contact Number *'
								value={formData.contactNumber}
								onChange={handleChange}
							/>
							{errors.contactNumber && <FormHelperText>{errors.contactNumber}</FormHelperText>}
						</FormControl>

						<FormControl
							fullWidth
							error={!!errors.email}
							sx={{ mb: 3 }}
						>
							<InputLabel htmlFor='email'>Email Address *</InputLabel>
							<OutlinedInput
								id='email'
								name='email'
								label='Email Address *'
								value={formData.email}
								onChange={handleChange}
							/>
							{errors.email && <FormHelperText>{errors.email}</FormHelperText>}
						</FormControl>

						<FormControl
							fullWidth
							error={!!errors.password}
							sx={{ mb: 3 }}
						>
							<InputLabel htmlFor='password'>Temporary Password *</InputLabel>
							<OutlinedInput
								id='password'
								name='password'
								type={showPassword ? 'text' : 'password'}
								label='Temporary Password *'
								value={formData.password}
								onChange={handleChange}
								endAdornment={
									<IconButton
										aria-label='toggle password visibility'
										onClick={togglePasswordVisibility}
										edge='end'
									>
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								}
							/>
							{errors.password && <FormHelperText>{errors.password}</FormHelperText>}
						</FormControl>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button
						onClick={handleSubmit}
						variant='contained'
					>
						Add User
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}
