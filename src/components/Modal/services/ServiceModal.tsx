'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem, Grid, InputAdornment, Typography } from '@mui/material';
import type { Service } from '@/types/table';

interface ServiceModalProps {
	open: boolean;
	onClose: () => void;
	onSave: (service: Service) => void;
	service: Service | null;
	categories: string[];
}

const ServiceModal = ({ open, onClose, onSave, service, categories }: ServiceModalProps) => {
	const [formData, setFormData] = useState<Omit<Service, 'id'> & { id?: string }>({
		title: '',
		description: '',
		category: '',
		amount: 0,
	});
	const [errors, setErrors] = useState({
		title: false,
		description: false,
		category: false,
		amount: false,
	});

	useEffect(() => {
		if (service) {
			setFormData({ ...service });
		} else {
			setFormData({
				title: '',
				description: '',
				category: '',
				amount: 0,
			});
		}
		setErrors({
			title: false,
			description: false,
			category: false,
			amount: false,
		});
	}, [service, open]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
		const { name, value } = e.target;
		if (name) {
			setFormData({
				...formData,
				[name]: name === 'amount' ? Number.parseFloat(value as string) || 0 : value,
			});

			// Clear error when field is edited
			if (errors[name as keyof typeof errors]) {
				setErrors({
					...errors,
					[name]: false,
				});
			}
		}
	};

	const validateForm = (): boolean => {
		const newErrors = {
			title: !formData.title,
			description: !formData.description,
			category: !formData.category,
			amount: formData.amount <= 0,
		};

		setErrors(newErrors);
		return !Object.values(newErrors).some((error) => error);
	};

	const handleSubmit = () => {
		if (validateForm()) {
			// Ensure id is included if editing an existing service
			const serviceToSave: Service = {
				id: formData.id || service?.id || '',
				title: formData.title,
				description: formData.description,
				category: formData.category,
				amount: formData.amount,
			};
			onSave(serviceToSave);
		}
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullWidth
			maxWidth='md'
		>
			<DialogTitle>
				<Typography
					variant='h5'
					component='div'
					fontWeight='bold'
					color='primary'
				>
					{service ? 'Edit Service' : 'Add New Service'}
				</Typography>
			</DialogTitle>
			<DialogContent dividers>
				<Grid
					container
					spacing={2}
				>
					<Grid
						item
						xs={12}
					>
						<TextField
							name='title'
							label='Service Title'
							fullWidth
							value={formData.title}
							onChange={handleChange}
							error={errors.title}
							helperText={errors.title ? 'Title is required' : ''}
							variant='outlined'
							margin='normal'
						/>
					</Grid>
					<Grid
						item
						xs={12}
					>
						<TextField
							name='description'
							label='Description'
							fullWidth
							multiline
							rows={3}
							value={formData.description}
							onChange={handleChange}
							error={errors.description}
							helperText={errors.description ? 'Description is required' : ''}
							variant='outlined'
							margin='normal'
						/>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
					>
						<FormControl
							fullWidth
							margin='normal'
							error={errors.category}
						>
							<InputLabel id='category-label'>Category</InputLabel>
							<Select
								labelId='category-label'
								name='category'
								value={formData.category}
								onChange={handleChange}
								label='Category'
							>
								{categories.map((category) => (
									<MenuItem
										key={category}
										value={category}
									>
										{category}
									</MenuItem>
								))}
							</Select>
							{errors.category && (
								<Typography
									variant='caption'
									color='error'
									sx={{ mt: 0.5, ml: 1.5 }}
								>
									Category is required
								</Typography>
							)}
						</FormControl>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
					>
						<TextField
							name='amount'
							label='Price'
							type='number'
							fullWidth
							value={formData.amount}
							onChange={handleChange}
							error={errors.amount}
							helperText={errors.amount ? 'Price must be greater than 0' : ''}
							InputProps={{
								startAdornment: <InputAdornment position='start'>₱</InputAdornment>,
							}}
							variant='outlined'
							margin='normal'
						/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions sx={{ px: 3, py: 2 }}>
				<Button
					onClick={onClose}
					variant='outlined'
					color='inherit'
				>
					Cancel
				</Button>
				<Button
					onClick={handleSubmit}
					variant='contained'
					color='primary'
				>
					{service ? 'Update Service' : 'Add Service'}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ServiceModal;
