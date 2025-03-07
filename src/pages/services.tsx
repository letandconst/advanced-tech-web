'use client';
import { useState } from 'react';
import { Box, Typography, Paper, Button, Chip, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Card, CardContent, Divider, useTheme, Stack, useMediaQuery, Fab } from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Info as InfoIcon, Build as BuildIcon, DirectionsCar as DirectionsCarIcon, ElectricCar as ElectricCarIcon, AcUnit as AcUnitIcon, Settings as SettingsIcon } from '@mui/icons-material';

// Define service interface
interface Service {
	id: number;
	name: string;
	description: string;
	category: string;
	price: number | null;
	isPromoted: boolean;
}

// Sample service data
const services: Service[] = [
	{
		id: 1,
		name: 'Oil Change',
		description: 'Complete oil and filter change with synthetic oil',
		category: 'Maintenance',
		price: 49.99,
		isPromoted: true,
	},
	{
		id: 2,
		name: 'Brake Pad Replacement',
		description: 'Front or rear brake pad replacement with inspection',
		category: 'Repair',
		price: 199.99,
		isPromoted: true,
	},
	{
		id: 3,
		name: 'Tire Rotation',
		description: 'Rotation of all tires to ensure even wear',
		category: 'Maintenance',
		price: 29.99,
		isPromoted: false,
	},
	{
		id: 4,
		name: 'Engine Diagnostic',
		description: 'Computer diagnostic to identify engine issues',
		category: 'Diagnostic',
		price: 89.99,
		isPromoted: false,
	},
	{
		id: 5,
		name: 'AC System Recharge',
		description: 'Recharge air conditioning system with refrigerant',
		category: 'Climate Control',
		price: 129.99,
		isPromoted: false,
	},
	{
		id: 6,
		name: 'Transmission Fluid Change',
		description: 'Complete transmission fluid flush and replacement',
		category: 'Maintenance',
		price: 149.99,
		isPromoted: false,
	},
	{
		id: 7,
		name: 'Wheel Alignment',
		description: 'Four-wheel alignment to factory specifications',
		category: 'Maintenance',
		price: 89.99,
		isPromoted: true,
	},
	{
		id: 8,
		name: 'Battery Replacement',
		description: 'Remove and replace vehicle battery',
		category: 'Electrical',
		price: 159.99,
		isPromoted: false,
	},
	{
		id: 9,
		name: 'Headlight Replacement',
		description: 'Replace one or both headlight assemblies',
		category: 'Electrical',
		price: 69.99,
		isPromoted: false,
	},
	{
		id: 10,
		name: 'Full Vehicle Inspection',
		description: 'Comprehensive multi-point vehicle inspection',
		category: 'Diagnostic',
		price: 99.99,
		isPromoted: true,
	},
	{
		id: 11,
		name: 'Spark Plug Replacement',
		description: 'Remove and replace spark plugs',
		category: 'Maintenance',
		price: 129.99,
		isPromoted: false,
	},
	{
		id: 12,
		name: 'Fuel System Cleaning',
		description: 'Clean fuel injectors and system',
		category: 'Maintenance',
		price: 119.99,
		isPromoted: false,
	},
	{
		id: 13,
		name: 'Radiator Flush',
		description: 'Flush and replace coolant in radiator',
		category: 'Maintenance',
		price: 99.99,
		isPromoted: false,
	},
	{
		id: 14,
		name: 'Suspension Inspection',
		description: 'Inspect shocks, struts, and suspension components',
		category: 'Diagnostic',
		price: 79.99,
		isPromoted: false,
	},
	{
		id: 15,
		name: 'Timing Belt Replacement',
		description: 'Replace timing belt and related components',
		category: 'Repair',
		price: 499.99,
		isPromoted: false,
	},
];

// Get category counts
const getCategoryCounts = (services: Service[]) => {
	const counts: Record<string, number> = {};
	services.forEach((service) => {
		counts[service.category] = (counts[service.category] || 0) + 1;
	});
	return counts;
};

// Get category icon
const getCategoryIcon = (category: string) => {
	switch (category) {
		case 'Maintenance':
			return <BuildIcon />;
		case 'Repair':
			return <SettingsIcon />;
		case 'Diagnostic':
			return <InfoIcon />;
		case 'Climate Control':
			return <AcUnitIcon />;
		case 'Electrical':
			return <ElectricCarIcon />;
		default:
			return <DirectionsCarIcon />;
	}
};

export default function ServicesPage() {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const [selectedService, setSelectedService] = useState<Service | null>(null);
	const [openDialog, setOpenDialog] = useState(false);

	// Handle dialog open/close
	const handleOpenDialog = (service: Service) => {
		setSelectedService(service);
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	// Define columns for the data grid
	const columns: GridColDef[] = [
		{
			field: 'name',
			headerName: 'Service Name',
			flex: 1,
			minWidth: 220,
			renderCell: (params: GridRenderCellParams<Service>) => (
				<Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
					<Box sx={{ display: 'flex', flexDirection: 'column' }}>
						<Typography
							variant='body1'
							fontWeight='medium'
						>
							{params.value}
						</Typography>
						<Typography
							variant='caption'
							color='text.secondary'
						>
							{params.row.description.length > 60 ? `${params.row.description.substring(0, 60)}...` : params.row.description}
						</Typography>
					</Box>
				</Box>
			),
		},
		{
			field: 'category',
			headerName: 'Category',
			width: 160,
			renderCell: (params: GridRenderCellParams<Service>) => (
				<Chip
					icon={getCategoryIcon(params.value as string)}
					label={params.value}
					size='small'
					variant='outlined'
					sx={{
						borderColor: theme.palette.primary.main,
						'& .MuiChip-icon': {
							color: theme.palette.primary.main,
						},
					}}
				/>
			),
		},
		{
			field: 'price',
			headerName: 'Price',
			width: 120,
			valueFormatter: (params) => {
				if (params.value == null) return '';
				return `${Number(params.value).toFixed(2)}`;
			},
			renderCell: (params: GridRenderCellParams<Service>) => {
				if (params.row.price == null) return <Typography variant='body2'>N/A</Typography>;
				return (
					<Typography
						variant='body1'
						fontWeight='medium'
					>
						&#8369; {params.row.price.toFixed(2)}
					</Typography>
				);
			},
		},
		{
			field: 'actions',
			headerName: 'Actions',
			width: 140,
			renderCell: (params: GridRenderCellParams<Service>) => (
				<Stack
					direction='row'
					spacing={1}
				>
					<Tooltip title='View Details'>
						<IconButton
							size='small'
							onClick={() => handleOpenDialog(params.row)}
							color='primary'
						>
							<InfoIcon fontSize='small' />
						</IconButton>
					</Tooltip>
					<Tooltip title='Edit'>
						<IconButton
							size='small'
							color='primary'
						>
							<EditIcon fontSize='small' />
						</IconButton>
					</Tooltip>
					<Tooltip title='Delete'>
						<IconButton
							size='small'
							color='error'
						>
							<DeleteIcon fontSize='small' />
						</IconButton>
					</Tooltip>
				</Stack>
			),
		},
	];

	// Get category counts for the summary
	const categoryCounts = getCategoryCounts(services);

	return (
		<Box>
			{/* Page Header */}
			<Stack
				direction={{ xs: 'column', sm: 'row' }}
				spacing={2}
				justifyContent='space-between'
				alignItems='center'
				mb={4}
			>
				<Box>
					<Typography
						variant='h4'
						fontWeight='bold'
						gutterBottom
					>
						Services Management
					</Typography>
					<Typography
						variant='body1'
						color='text.secondary'
					>
						Manage and view all services offered by your service center
					</Typography>
				</Box>
				<Button
					variant='contained'
					startIcon={<AddIcon />}
					size='large'
					sx={{ py: 1.5, px: 3, borderRadius: 2 }}
				>
					Add New Service
				</Button>
			</Stack>

			{/* Service Categories Card */}
			<Card sx={{ mb: 4 }}>
				<CardContent>
					<Stack
						direction='row'
						justifyContent='space-between'
						alignItems='center'
						mb={2}
					>
						<Typography
							variant='h6'
							fontWeight='medium'
						>
							Service Categories
						</Typography>
						<Chip
							label={`${services.length} Total Services`}
							color='primary'
						/>
					</Stack>
					<Divider sx={{ my: 2 }} />
					<Stack
						direction='row'
						flexWrap='wrap'
						gap={2}
					>
						{Object.entries(categoryCounts).map(([category, count]) => (
							<Paper
								key={category}
								variant='outlined'
								sx={{
									p: 2,
									display: 'flex',
									alignItems: 'center',
									borderRadius: 2,
									borderColor: 'divider',
									transition: 'all 0.2s',
									'&:hover': {
										borderColor: 'primary.main',
										boxShadow: 1,
									},
								}}
							>
								<Box sx={{ mr: 2, p: 1, borderRadius: 1, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{getCategoryIcon(category)}</Box>
								<Box>
									<Typography
										variant='body2'
										color='text.secondary'
									>
										{category}
									</Typography>
									<Typography
										variant='h6'
										fontWeight='medium'
									>
										{count}
									</Typography>
								</Box>
							</Paper>
						))}
					</Stack>
				</CardContent>
			</Card>

			{/* Services Data Table */}
			<Paper sx={{ height: { xs: 500, md: 600 }, borderRadius: 2, overflow: 'hidden' }}>
				<DataGrid
					rows={services}
					columns={columns}
					initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
					pageSizeOptions={[5, 10, 25, 50]}
					checkboxSelection
					disableRowSelectionOnClick
					slots={{ toolbar: GridToolbar }}
					slotProps={{ toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 500 } } }}
					sx={{
						border: 'none',
						'& .MuiDataGrid-cell': { borderColor: 'divider' },
						'& .MuiDataGrid-columnHeaders': {
							backgroundColor: 'action.hover',
							borderBottom: 'none',
						},
						'& .MuiDataGrid-toolbarContainer': { padding: 2, backgroundColor: 'background.paper' },
						'& .MuiDataGrid-row:hover': { backgroundColor: 'action.hover' },
					}}
				/>
			</Paper>

			{/* Mobile FAB Button */}
			{isMobile && (
				<Fab
					color='primary'
					aria-label='add'
					sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}
				>
					<AddIcon />
				</Fab>
			)}

			{/* Service Detail Dialog */}
			{selectedService && (
				<Dialog
					open={openDialog}
					onClose={handleCloseDialog}
					maxWidth='md'
					fullWidth
					fullScreen={isMobile}
				>
					<DialogTitle>
						<Stack
							direction='row'
							alignItems='center'
							spacing={1}
						>
							{getCategoryIcon(selectedService.category)}
							<Typography variant='h6'>{selectedService.name}</Typography>
							<Chip
								label={selectedService.category}
								color='primary'
								size='small'
								variant='outlined'
							/>
						</Stack>
					</DialogTitle>
					<DialogContent dividers>
						<Stack spacing={3}>
							<Box>
								<Typography
									variant='subtitle1'
									fontWeight='bold'
									gutterBottom
								>
									Description
								</Typography>
								<Typography variant='body2'>{selectedService.description}</Typography>
							</Box>
							<Box>
								<Typography
									variant='subtitle1'
									fontWeight='bold'
									gutterBottom
								>
									What&apos;s Included
								</Typography>
								<Typography variant='body2'>
									• Complete service performed by certified mechanics
									<br />• All necessary parts and materials
									<br />• Quality assurance inspection
									<br />• 90-day warranty on all work performed
								</Typography>
							</Box>
							<Box>
								<Typography
									variant='subtitle1'
									fontWeight='bold'
									gutterBottom
								>
									Additional Information
								</Typography>
								<Typography variant='body2'>This service is recommended every {selectedService.category === 'Maintenance' ? '6 months or 5,000 miles' : 'as needed'}.</Typography>
							</Box>
						</Stack>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleCloseDialog}>Close</Button>
						<Button
							variant='outlined'
							startIcon={<EditIcon />}
						>
							Edit Service
						</Button>
					</DialogActions>
				</Dialog>
			)}
		</Box>
	);
}
