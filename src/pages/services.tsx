'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Box, Button, Typography, FormControl, InputLabel, Select, MenuItem, Grid, type SelectChangeEvent, TextField, Collapse, InputAdornment } from '@mui/material';
import { Add, Search, FilterList, Close } from '@mui/icons-material';
import DataTable from '@/components/DataTable/DataTable';
import ServiceModal from '@/components/Modal/services/ServiceModal';
import type { Column, Service } from '@/types/table';

// Sample categories for the filter
const categories = ['Engine Repair', 'Transmission', 'Brakes', 'Electrical', 'Oil & Fluids', 'Tires & Wheels', 'AC & Heating', 'Detailing'];

// Sample initial data
const initialServices: Service[] = [
	{
		id: '1',
		title: 'Oil Change',
		description: 'Complete oil change with premium synthetic oil',
		category: 'Oil & Fluids',
		amount: 49.99,
	},
	{
		id: '2',
		title: 'Brake Pad Replacement',
		description: 'Replace front and rear brake pads',
		category: 'Brakes',
		amount: 199.99,
	},
	{
		id: '3',
		title: 'Engine Tune-Up',
		description: 'Comprehensive engine tune-up and diagnostics',
		category: 'Engine Repair',
		amount: 299.99,
	},
	{
		id: '4',
		title: 'Transmission Fluid Change',
		description: 'Complete transmission fluid flush and replacement',
		category: 'Transmission',
		amount: 149.99,
	},
	{
		id: '5',
		title: 'Wheel Alignment',
		description: 'Four-wheel alignment and balancing',
		category: 'Tires & Wheels',
		amount: 89.99,
	},
];

const ServicesPage = () => {
	const [services, setServices] = useState<Service[]>(initialServices);
	const [filteredServices, setFilteredServices] = useState<Service[]>(initialServices);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentService, setCurrentService] = useState<Service | null>(null);
	const [categoryFilter, setCategoryFilter] = useState<string>('');
	const [priceSort, setPriceSort] = useState<string>('');
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [showFilters, setShowFilters] = useState(false);

	// Columns configuration for the DataTable
	const columns: Column<Service>[] = [
		{ id: 'title', label: 'Service Title' },
		{ id: 'description', label: 'Description' },
		{
			id: 'category',
			label: 'Category',
			render: (row: Service) => (
				<Typography
					variant='body2'
					sx={{
						display: 'inline-block',
						bgcolor: 'primary.light',
						color: 'primary.contrastText',
						px: 1,
						py: 0.5,
						borderRadius: 1,
						fontSize: '0.75rem',
					}}
				>
					{row.category}
				</Typography>
			),
		},
		{
			id: 'amount',
			label: 'Price',
			render: (row: Service) => `$${row.amount.toFixed(2)}`,
		},
	];

	// Apply filters when category or price sort changes
	useEffect(() => {
		let result = [...services];

		// Apply search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			result = result.filter((service) => service.title.toLowerCase().includes(query) || service.description.toLowerCase().includes(query));
		}

		// Apply category filter
		if (categoryFilter) {
			result = result.filter((service) => service.category === categoryFilter);
		}

		// Apply price sorting
		if (priceSort === 'highToLow') {
			result = result.sort((a, b) => b.amount - a.amount);
		} else if (priceSort === 'lowToHigh') {
			result = result.sort((a, b) => a.amount - b.amount);
		}

		setFilteredServices(result);
	}, [services, categoryFilter, priceSort, searchQuery]);

	// Handle opening the modal for adding a new service
	const handleAddService = () => {
		setCurrentService(null);
		setIsModalOpen(true);
	};

	// Handle editing an existing service
	const handleEditService = (service: Service) => {
		setCurrentService(service);
		setIsModalOpen(true);
	};

	// Handle deleting a service
	const handleDeleteService = (service: Service) => {
		if (window.confirm(`Are you sure you want to delete "${service.title}"?`)) {
			setServices(services.filter((s) => s.id !== service.id));
		}
	};

	// Handle saving a service (new or edited)
	const handleSaveService = (service: Service) => {
		if (currentService) {
			// Update existing service
			setServices(services.map((s) => (s.id === service.id ? service : s)));
		} else {
			// Add new service with a unique ID
			setServices([...services, { ...service, id: 'a' }]);
		}
		setIsModalOpen(false);
	};

	// Handle category filter change
	const handleCategoryChange = (event: SelectChangeEvent<string>) => {
		const value = event.target.value;
		console.log('Category changed to:', value);
		setCategoryFilter(value);
	};

	// Handle price sort change
	const handlePriceSortChange = (event: SelectChangeEvent<string>) => {
		const value = event.target.value;
		console.log('Price sort changed to:', value);
		setPriceSort(value);
	};

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	};

	const resetFilters = () => {
		setCategoryFilter('');
		setPriceSort('');
	};

	return (
		<Box sx={{ p: { xs: 2, md: 3 } }}>
			<Box sx={{ mb: 4 }}>
				<Typography
					variant='h5'
					fontWeight='bold'
					gutterBottom
				>
					Services Management
				</Typography>
				<Typography
					variant='body2'
					color='text.secondary'
				>
					Create, view, and manage all services for your service center
				</Typography>
			</Box>

			<Box sx={{ mb: 3 }}>
				<Grid
					container
					spacing={2}
					alignItems='center'
				>
					<Grid
						item
						xs={12}
						md={6}
					>
						<TextField
							label='Search by title'
							fullWidth
							value={searchQuery}
							onChange={handleSearchChange}
							InputProps={{
								startAdornment: (
									<InputAdornment position='start'>
										<Search />
									</InputAdornment>
								),
							}}
							size='small'
						/>
					</Grid>
					<Grid
						item
						xs={6}
						md={3}
					>
						<Button
							variant='outlined'
							startIcon={<FilterList />}
							onClick={() => setShowFilters(!showFilters)}
							size='medium'
							fullWidth
							sx={{ height: '40px' }}
						>
							Filters {showFilters ? <Close sx={{ ml: 1, fontSize: 16 }} /> : null}
						</Button>
					</Grid>
					<Grid
						item
						xs={6}
						md={3}
					>
						<Button
							variant='contained'
							startIcon={<Add />}
							onClick={handleAddService}
							size='medium'
							fullWidth
							sx={{ height: '40px' }}
						>
							New Service
						</Button>
					</Grid>
				</Grid>

				{/* Filter dropdowns row - with smooth transition */}
				<Collapse
					in={showFilters}
					timeout={300}
				>
					<Box sx={{ mt: 2, position: 'relative', zIndex: 1 }}>
						<Grid
							container
							spacing={2}
							alignItems='center'
						>
							<Grid
								item
								xs={12}
								md={5}
							>
								<FormControl
									fullWidth
									size='small'
								>
									<InputLabel>Category</InputLabel>
									<Select
										value={categoryFilter}
										label='Category'
										onChange={handleCategoryChange}
									>
										<MenuItem
											value=''
											disabled
										>
											Select a Category
										</MenuItem>
										{categories.map((category) => (
											<MenuItem
												key={category}
												value={category}
											>
												{category}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
							<Grid
								item
								xs={12}
								md={5}
							>
								<FormControl
									fullWidth
									size='small'
								>
									<InputLabel>Price</InputLabel>
									<Select
										value={priceSort}
										label='Price'
										onChange={handlePriceSortChange}
									>
										<MenuItem value='highToLow'>Highest to Lowest</MenuItem>
										<MenuItem value='lowToHigh'>Lowest to Highest</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid
								item
								xs={12}
								md={2}
								sx={{ display: 'flex', justifyContent: 'flex-end' }}
							>
								<Button
									variant='outlined'
									color='error'
									onClick={resetFilters}
									sx={{
										borderRadius: 1,
										display: 'flex',
										alignItems: 'center',
										gap: 1,
										width: '100%',
									}}
								>
									<Close fontSize='small' />
									Reset
								</Button>
							</Grid>
						</Grid>
					</Box>
				</Collapse>
			</Box>

			{/* Services Table */}
			<DataTable
				columns={columns}
				rows={filteredServices}
				actions={{
					edit: handleEditService,
					delete: handleDeleteService,
				}}
			/>

			{/* Add/Edit Service Modal */}
			<ServiceModal
				open={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={handleSaveService}
				service={currentService}
				categories={categories}
			/>
		</Box>
	);
};

export default ServicesPage;
