'use client';

import type React from 'react';

import { useState } from 'react';
import {
	TextField,
	Button,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	InputAdornment,
	Box,
	Chip,
	IconButton,
	Grid,
	Divider,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	Tabs,
	Tab,
	Card,
	CardContent,
	useTheme,
	alpha,
} from '@mui/material';
import { Add, Search, FilterList, Close, CheckCircle, HourglassEmpty, Build } from '@mui/icons-material';

import JobOrderDialog from '@/components/Modal/ViewJobOrder';
import DataTable from '@/components/DataTable/DataTable';
import { JobOrder } from '@/types/jobOrder';
import { Column } from '@/types/table';
import { useJobOrderModal } from '@/hooks/useJobOrderModal';

// Table Columns
const columns: Column<JobOrder>[] = [
	{ id: 'id', label: 'ID' },
	{
		id: 'customer',
		label: 'Customer',
		render: (row) => (
			<Box>
				<Typography
					variant='body2'
					fontWeight='medium'
				>
					{row.customer}
				</Typography>
				<Typography
					variant='caption'
					color='text.secondary'
				>
					{row.phone}
				</Typography>
			</Box>
		),
	},
	{
		id: 'make',
		label: 'Vehicle',
		render: (row) => (
			<Box>
				<Typography variant='body2'>{row.make}</Typography>
				<Typography
					variant='caption'
					color='text.secondary'
				>
					{row.plate}
				</Typography>
			</Box>
		),
	},
	{ id: 'mechanic', label: 'Mechanic' },
	{
		id: 'status',
		label: 'Status',
		render: (row) => (
			<Chip
				label={row.status}
				color={row.status === 'Pending' ? 'warning' : row.status === 'In Progress' ? 'primary' : 'success'}
				size='small'
			/>
		),
	},
	{ id: 'date', label: 'Date' },
	{
		id: 'total',
		label: 'Total',
		render: (row) => <Typography fontWeight='medium'>₱{row.total.toLocaleString()}</Typography>,
	},
];

// Sample mechanics data
const mechanics = ['Mike Santos', 'John Smith', 'Maria Garcia', 'Robert Chen', 'James Wilson'];

// Sample status options
const statusOptions = ['Pending', 'In Progress', 'Completed'];

const JobOrdersPage = () => {
	const theme = useTheme();

	const { viewOrder, handleViewOpen, handleViewClose, handlePrint } = useJobOrderModal();

	// Sample job orders data
	const [jobOrders, setJobOrders] = useState<JobOrder[]>([
		{
			id: 'JO-2024-001',
			customer: 'John Doe',
			address: '123 Main St, Batangas',
			make: 'Toyota Camry',
			plate: 'XYZ-1234',
			phone: '09123456789',
			mechanic: 'Mike Santos',
			status: 'Pending',
			remarks: 'Waiting for parts',
			date: '2024-03-06',
			workRequested: [
				{ title: 'Oil Change', amount: 500 },
				{ title: 'Brake Pad Replacement', amount: 1500 },
			],
			oilsAndFuels: [{ qty: 1, name: 'Engine Oil', amount: 500 }],
			parts: [{ qty: 2, name: 'Brake Pads', amount: 1500 }],
			laborTotal: 1000,
			partsTotal: 1500,
			oilTotal: 500,
			total: 3000,
		},
		{
			id: 'JO-2024-002',
			customer: 'Sarah Williams',
			address: '456 Oak Ave, Batangas',
			make: 'Honda Civic',
			plate: 'ABC-5678',
			phone: '09187654321',
			mechanic: 'John Smith',
			status: 'In Progress',
			remarks: 'Replacing transmission',
			date: '2024-03-07',
			workRequested: [
				{ title: 'Transmission Repair', amount: 3500 },
				{ title: 'Fluid Change', amount: 800 },
			],
			oilsAndFuels: [
				{ qty: 1, name: 'Transmission Fluid', amount: 800 },
				{ qty: 1, name: 'Engine Oil', amount: 500 },
			],
			parts: [{ qty: 1, name: 'Transmission Kit', amount: 2500 }],
			laborTotal: 1500,
			partsTotal: 2500,
			oilTotal: 1300,
			total: 5300,
		},
		{
			id: 'JO-2024-003',
			customer: 'Michael Brown',
			address: '789 Pine St, Batangas',
			make: 'Ford F-150',
			plate: 'DEF-9012',
			phone: '09234567890',
			mechanic: 'Maria Garcia',
			status: 'Completed',
			remarks: 'All work completed',
			date: '2024-03-05',
			workRequested: [
				{ title: 'Brake System Overhaul', amount: 2500 },
				{ title: 'Wheel Alignment', amount: 800 },
			],
			oilsAndFuels: [{ qty: 1, name: 'Brake Fluid', amount: 300 }],
			parts: [
				{ qty: 4, name: 'Brake Pads', amount: 2000 },
				{ qty: 2, name: 'Brake Rotors', amount: 1500 },
			],
			laborTotal: 1800,
			partsTotal: 3500,
			oilTotal: 300,
			total: 5600,
		},
	]);

	// State for search and filters
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState('All');
	const [mechanicFilter, setMechanicFilter] = useState('All');
	const [showFilters, setShowFilters] = useState(false);

	// State for dialogs
	const [newOrderOpen, setNewOrderOpen] = useState(false);

	const [editOrder, setEditOrder] = useState<JobOrder | null>(null);
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

	// State for new job order form
	const [newOrder, setNewOrder] = useState<Partial<JobOrder>>({
		customer: '',
		address: '',
		make: '',
		plate: '',
		phone: '',
		mechanic: '',
		status: 'Pending',
		remarks: '',
		date: new Date().toISOString().split('T')[0],
		workRequested: [{ title: '', amount: 0 }],
		oilsAndFuels: [{ qty: 0, name: '', amount: 0 }],
		parts: [{ qty: 0, name: '', amount: 0 }],
		laborTotal: 0,
		partsTotal: 0,
		oilTotal: 0,
		total: 0,
	});

	// State for form tabs
	const [activeTab, setActiveTab] = useState(0);

	// Filter job orders based on search and filters
	const filteredOrders = jobOrders.filter((order) => {
		const matchesSearch = order.customer.toLowerCase().includes(search.toLowerCase()) || order.id.toLowerCase().includes(search.toLowerCase()) || order.plate.toLowerCase().includes(search.toLowerCase());

		const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
		const matchesMechanic = mechanicFilter === 'All' || order.mechanic === mechanicFilter;

		return matchesSearch && matchesStatus && matchesMechanic;
	});

	// Handle opening the new job order dialog
	const handleNewOrderOpen = () => {
		setNewOrder({
			customer: '',
			address: '',
			make: '',
			plate: '',
			phone: '',
			mechanic: '',
			status: 'Pending',
			remarks: '',
			date: new Date().toISOString().split('T')[0],
			workRequested: [{ title: '', amount: 0 }],
			oilsAndFuels: [{ qty: 0, name: '', amount: 0 }],
			parts: [{ qty: 0, name: '', amount: 0 }],
			laborTotal: 0,
			partsTotal: 0,
			oilTotal: 0,
			total: 0,
		});
		setActiveTab(0);
		setNewOrderOpen(true);
	};

	// Handle closing the new job order dialog
	const handleNewOrderClose = () => {
		setNewOrderOpen(false);
	};

	// Handle opening the edit job order dialog
	const handleEditOpen = (order: JobOrder) => {
		setEditOrder({ ...order });
		setActiveTab(0);
	};

	// Handle closing the edit job order dialog
	const handleEditClose = () => {
		setEditOrder(null);
	};

	// Handle opening the delete confirmation dialog
	const handleDeleteConfirmOpen = (id: string) => {
		setOrderToDelete(id);
		setDeleteConfirmOpen(true);
	};

	// Handle closing the delete confirmation dialog
	const handleDeleteConfirmClose = () => {
		setOrderToDelete(null);
		setDeleteConfirmOpen(false);
	};

	// Handle deleting a job order
	const handleDeleteOrder = () => {
		if (orderToDelete) {
			setJobOrders(jobOrders.filter((order) => order.id !== orderToDelete));
			handleDeleteConfirmClose();
		}
	};

	// Handle changing the active tab in the form
	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setActiveTab(newValue);
	};

	// Handle input change for the new job order form
	const handleInputChange = (field: string, value: string | number) => {
		setNewOrder({
			...newOrder,
			[field]: value,
		});
	};

	// Handle input change for the edit job order form
	const handleEditInputChange = (field: string, value: string | number) => {
		if (editOrder) {
			setEditOrder({
				...editOrder,
				[field]: value,
			});
		}
	};

	// Handle adding a new work requested item
	const handleAddWorkRequested = (isEdit = false) => {
		if (isEdit && editOrder) {
			setEditOrder({
				...editOrder,
				workRequested: [...editOrder.workRequested, { title: '', amount: 0 }],
			});
		} else {
			setNewOrder({
				...newOrder,
				workRequested: [...(newOrder.workRequested || []), { title: '', amount: 0 }],
			});
		}
	};

	// Handle adding a new oils and fuels item
	const handleAddOilsAndFuels = (isEdit = false) => {
		if (isEdit && editOrder) {
			setEditOrder({
				...editOrder,
				oilsAndFuels: [...editOrder.oilsAndFuels, { qty: 0, name: '', amount: 0 }],
			});
		} else {
			setNewOrder({
				...newOrder,
				oilsAndFuels: [...(newOrder.oilsAndFuels || []), { qty: 0, name: '', amount: 0 }],
			});
		}
	};

	// Handle adding a new parts item
	const handleAddParts = (isEdit = false) => {
		if (isEdit && editOrder) {
			setEditOrder({
				...editOrder,
				parts: [...editOrder.parts, { qty: 0, name: '', amount: 0 }],
			});
		} else {
			setNewOrder({
				...newOrder,
				parts: [...(newOrder.parts || []), { qty: 0, name: '', amount: 0 }],
			});
		}
	};

	// Handle removing a work requested item
	const handleRemoveWorkRequested = (index: number, isEdit = false) => {
		if (isEdit && editOrder) {
			const updatedItems = [...editOrder.workRequested];
			updatedItems.splice(index, 1);
			setEditOrder({
				...editOrder,
				workRequested: updatedItems,
			});
		} else {
			const updatedItems = [...(newOrder.workRequested || [])];
			updatedItems.splice(index, 1);
			setNewOrder({
				...newOrder,
				workRequested: updatedItems,
			});
		}
	};

	// Handle removing an oils and fuels item
	const handleRemoveOilsAndFuels = (index: number, isEdit = false) => {
		if (isEdit && editOrder) {
			const updatedItems = [...editOrder.oilsAndFuels];
			updatedItems.splice(index, 1);
			setEditOrder({
				...editOrder,
				oilsAndFuels: updatedItems,
			});
		} else {
			const updatedItems = [...(newOrder.oilsAndFuels || [])];
			updatedItems.splice(index, 1);
			setNewOrder({
				...newOrder,
				oilsAndFuels: updatedItems,
			});
		}
	};

	// Handle removing a parts item
	const handleRemoveParts = (index: number, isEdit = false) => {
		if (isEdit && editOrder) {
			const updatedItems = [...editOrder.parts];
			updatedItems.splice(index, 1);
			setEditOrder({
				...editOrder,
				parts: updatedItems,
			});
		} else {
			const updatedItems = [...(newOrder.parts || [])];
			updatedItems.splice(index, 1);
			setNewOrder({
				...newOrder,
				parts: updatedItems,
			});
		}
	};

	// Handle work requested item change
	const handleWorkRequestedChange = (index: number, field: string, value: string | number, isEdit = false) => {
		if (isEdit && editOrder) {
			const updatedItems = [...editOrder.workRequested];
			updatedItems[index] = {
				...updatedItems[index],
				[field]: field === 'amount' ? Number(value) : value,
			};
			setEditOrder({
				...editOrder,
				workRequested: updatedItems,
			});
		} else {
			const updatedItems = [...(newOrder.workRequested || [])];
			updatedItems[index] = {
				...updatedItems[index],
				[field]: field === 'amount' ? Number(value) : value,
			};
			setNewOrder({
				...newOrder,
				workRequested: updatedItems,
			});
		}
	};

	// Handle oils and fuels item change
	const handleOilsAndFuelsChange = (index: number, field: string, value: string | number, isEdit = false) => {
		if (isEdit && editOrder) {
			const updatedItems = [...editOrder.oilsAndFuels];
			updatedItems[index] = {
				...updatedItems[index],
				[field]: ['qty', 'amount'].includes(field) ? Number(value) : value,
			};
			setEditOrder({
				...editOrder,
				oilsAndFuels: updatedItems,
			});
		} else {
			const updatedItems = [...(newOrder.oilsAndFuels || [])];
			updatedItems[index] = {
				...updatedItems[index],
				[field]: ['qty', 'amount'].includes(field) ? Number(value) : value,
			};
			setNewOrder({
				...newOrder,
				oilsAndFuels: updatedItems,
			});
		}
	};

	// Handle parts item change
	const handlePartsChange = (index: number, field: string, value: string | number, isEdit = false) => {
		if (isEdit && editOrder) {
			const updatedItems = [...editOrder.parts];
			updatedItems[index] = {
				...updatedItems[index],
				[field]: ['qty', 'amount'].includes(field) ? Number(value) : value,
			};
			setEditOrder({
				...editOrder,
				parts: updatedItems,
			});
		} else {
			const updatedItems = [...(newOrder.parts || [])];
			updatedItems[index] = {
				...updatedItems[index],
				[field]: ['qty', 'amount'].includes(field) ? Number(value) : value,
			};
			setNewOrder({
				...newOrder,
				parts: updatedItems,
			});
		}
	};

	// Calculate totals for the new job order
	const calculateTotals = (isEdit = false) => {
		if (isEdit && editOrder) {
			const workRequestedTotal = editOrder.workRequested.reduce((sum, item) => sum + (item.amount || 0), 0);
			const oilsAndFuelsTotal = editOrder.oilsAndFuels.reduce((sum, item) => sum + (item.amount || 0), 0);
			const partsTotal = editOrder.parts.reduce((sum, item) => sum + (item.amount || 0), 0);

			setEditOrder({
				...editOrder,
				laborTotal: workRequestedTotal,
				oilTotal: oilsAndFuelsTotal,
				partsTotal: partsTotal,
				total: workRequestedTotal + oilsAndFuelsTotal + partsTotal,
			});
		} else {
			const workRequestedTotal = (newOrder.workRequested || []).reduce((sum, item) => sum + (item.amount || 0), 0);
			const oilsAndFuelsTotal = (newOrder.oilsAndFuels || []).reduce((sum, item) => sum + (item.amount || 0), 0);
			const partsTotal = (newOrder.parts || []).reduce((sum, item) => sum + (item.amount || 0), 0);

			setNewOrder({
				...newOrder,
				laborTotal: workRequestedTotal,
				oilTotal: oilsAndFuelsTotal,
				partsTotal: partsTotal,
				total: workRequestedTotal + oilsAndFuelsTotal + partsTotal,
			});
		}
	};

	// Handle saving a new job order
	const handleSaveNewOrder = () => {
		calculateTotals();

		// Generate a new ID
		const newId = `JO-2024-${String(jobOrders.length + 1).padStart(3, '0')}`;

		const newJobOrder: JobOrder = {
			id: newId,
			customer: newOrder.customer || '',
			address: newOrder.address || '',
			make: newOrder.make || '',
			plate: newOrder.plate || '',
			phone: newOrder.phone || '',
			mechanic: newOrder.mechanic || '',
			status: (newOrder.status as 'Pending' | 'In Progress' | 'Completed') || 'Pending',
			remarks: newOrder.remarks || '',
			date: newOrder.date || new Date().toISOString().split('T')[0],
			workRequested: newOrder.workRequested || [],
			oilsAndFuels: newOrder.oilsAndFuels || [],
			parts: newOrder.parts || [],
			laborTotal: newOrder.laborTotal || 0,
			partsTotal: newOrder.partsTotal || 0,
			oilTotal: newOrder.oilTotal || 0,
			total: newOrder.total || 0,
		};

		setJobOrders([...jobOrders, newJobOrder]);
		handleNewOrderClose();
	};

	// Handle saving an edited job order
	const handleSaveEditOrder = () => {
		if (editOrder) {
			calculateTotals(true);

			const updatedOrders = jobOrders.map((order) => (order.id === editOrder.id ? editOrder : order));

			setJobOrders(updatedOrders);
			handleEditClose();
		}
	};

	const actions = {
		view: handleViewOpen,
		edit: handleEditOpen,
		delete: handleDeleteConfirmOpen,
	};

	return (
		<Box sx={{ p: { xs: 2, md: 3 } }}>
			<Box sx={{ mb: 4 }}>
				<Typography
					variant='h5'
					fontWeight='bold'
					gutterBottom
				>
					Job Orders Management
				</Typography>
				<Typography
					variant='body2'
					color='text.secondary'
				>
					Create, view, and manage all job orders for your service center
				</Typography>
			</Box>
			{/* Search and Filters */}
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
							label='Search by customer, ID, or plate number'
							fullWidth
							value={search}
							onChange={(e) => setSearch(e.target.value)}
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
							onClick={handleNewOrderOpen}
							size='medium'
							fullWidth
							sx={{ height: '40px' }}
						>
							New Job Order
						</Button>
					</Grid>
				</Grid>

				{/* Filter options */}
				{showFilters && (
					<Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 1 }}>
						<Grid
							container
							spacing={2}
						>
							<Grid
								item
								xs={12}
								sm={6}
							>
								<FormControl
									fullWidth
									size='small'
								>
									<InputLabel>Status</InputLabel>
									<Select
										value={statusFilter}
										label='Status'
										onChange={(e) => setStatusFilter(e.target.value)}
									>
										<MenuItem value='All'>All Statuses</MenuItem>
										{statusOptions.map((status) => (
											<MenuItem
												key={status}
												value={status}
											>
												{status}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
							<Grid
								item
								xs={12}
								sm={6}
							>
								<FormControl
									fullWidth
									size='small'
								>
									<InputLabel>Mechanic</InputLabel>
									<Select
										value={mechanicFilter}
										label='Mechanic'
										onChange={(e) => setMechanicFilter(e.target.value)}
									>
										<MenuItem value='All'>All Mechanics</MenuItem>
										{mechanics.map((mechanic) => (
											<MenuItem
												key={mechanic}
												value={mechanic}
											>
												{mechanic}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
						</Grid>
					</Box>
				)}
			</Box>
			{/* Job Orders Table */}
			<DataTable<JobOrder>
				columns={columns}
				rows={filteredOrders}
				actions={actions}
			/>

			<JobOrderDialog
				viewOrder={viewOrder}
				handleClose={handleViewClose}
				handlePrint={handlePrint}
			/>

			<Dialog
				open={newOrderOpen}
				onClose={handleNewOrderClose}
				maxWidth='md'
				fullWidth
			>
				<DialogTitle>
					<Typography variant='h6'>Create New Job Order</Typography>
				</DialogTitle>
				<DialogContent dividers>
					<Tabs
						value={activeTab}
						onChange={handleTabChange}
						sx={{ mb: 3 }}
					>
						<Tab label='Customer Info' />
						<Tab label='Work & Parts' />
						<Tab label='Summary' />
					</Tabs>

					{/* Customer Info Tab */}
					{activeTab === 0 && (
						<Grid
							container
							spacing={2}
						>
							<Grid
								item
								xs={12}
								sm={6}
							>
								<TextField
									label='Customer Name'
									fullWidth
									value={newOrder.customer}
									onChange={(e) => handleInputChange('customer', e.target.value)}
									required
									margin='normal'
								/>
							</Grid>
							<Grid
								item
								xs={12}
								sm={6}
							>
								<TextField
									label='Phone Number'
									fullWidth
									value={newOrder.phone}
									onChange={(e) => handleInputChange('phone', e.target.value)}
									required
									margin='normal'
								/>
							</Grid>
							<Grid
								item
								xs={12}
							>
								<TextField
									label='Address'
									fullWidth
									value={newOrder.address}
									onChange={(e) => handleInputChange('address', e.target.value)}
									margin='normal'
								/>
							</Grid>
							<Grid
								item
								xs={12}
								sm={6}
							>
								<TextField
									label='Vehicle Make/Model'
									fullWidth
									value={newOrder.make}
									onChange={(e) => handleInputChange('make', e.target.value)}
									required
									margin='normal'
								/>
							</Grid>
							<Grid
								item
								xs={12}
								sm={6}
							>
								<TextField
									label='Plate Number'
									fullWidth
									value={newOrder.plate}
									onChange={(e) => handleInputChange('plate', e.target.value)}
									required
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
								>
									<InputLabel>Mechanic</InputLabel>
									<Select
										value={newOrder.mechanic}
										label='Mechanic'
										onChange={(e) => handleInputChange('mechanic', e.target.value)}
									>
										{mechanics.map((mechanic) => (
											<MenuItem
												key={mechanic}
												value={mechanic}
											>
												{mechanic}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
							<Grid
								item
								xs={12}
								sm={6}
							>
								<FormControl
									fullWidth
									margin='normal'
								>
									<InputLabel>Status</InputLabel>
									<Select
										value={newOrder.status}
										label='Status'
										onChange={(e) => handleInputChange('status', e.target.value)}
									>
										{statusOptions.map((status) => (
											<MenuItem
												key={status}
												value={status}
											>
												{status}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
							<Grid
								item
								xs={12}
							>
								<TextField
									label='Remarks'
									fullWidth
									multiline
									rows={2}
									value={newOrder.remarks}
									onChange={(e) => handleInputChange('remarks', e.target.value)}
									margin='normal'
								/>
							</Grid>
							<Grid
								item
								xs={12}
								sm={6}
							>
								<TextField
									label='Date'
									type='date'
									fullWidth
									value={newOrder.date}
									onChange={(e) => handleInputChange('date', e.target.value)}
									margin='normal'
									InputLabelProps={{ shrink: true }}
								/>
							</Grid>
						</Grid>
					)}

					{/* Work & Parts Tab */}
					{activeTab === 1 && (
						<Grid
							container
							spacing={3}
						>
							<Grid
								item
								xs={12}
							>
								<Typography
									variant='subtitle1'
									fontWeight='bold'
									gutterBottom
								>
									Work Requested
								</Typography>
								{newOrder.workRequested?.map((item, index) => (
									<Box
										key={index}
										sx={{ display: 'flex', mb: 2, gap: 1 }}
									>
										<TextField
											label='Description'
											value={item.title}
											onChange={(e) => handleWorkRequestedChange(index, 'title', e.target.value)}
											sx={{ flexGrow: 1 }}
										/>
										<TextField
											label='Amount'
											type='number'
											value={item.amount}
											onChange={(e) => handleWorkRequestedChange(index, 'amount', e.target.value)}
											InputProps={{
												startAdornment: <InputAdornment position='start'>₱</InputAdornment>,
											}}
											sx={{ width: '150px' }}
										/>
										<IconButton
											color='error'
											onClick={() => handleRemoveWorkRequested(index)}
											sx={{ mt: 1 }}
										>
											<Close />
										</IconButton>
									</Box>
								))}
								<Button
									variant='outlined'
									startIcon={<Add />}
									onClick={() => handleAddWorkRequested()}
									size='small'
									sx={{ mt: 1 }}
								>
									Add Work Item
								</Button>
							</Grid>

							<Grid
								item
								xs={12}
							>
								<Divider sx={{ my: 2 }} />
								<Typography
									variant='subtitle1'
									fontWeight='bold'
									gutterBottom
								>
									Oils & Fuels
								</Typography>
								{newOrder.oilsAndFuels?.map((item, index) => (
									<Box
										key={index}
										sx={{ display: 'flex', mb: 2, gap: 1 }}
									>
										<TextField
											label='Qty'
											type='number'
											value={item.qty}
											onChange={(e) => handleOilsAndFuelsChange(index, 'qty', e.target.value)}
											sx={{ width: '80px' }}
										/>
										<TextField
											label='Description'
											value={item.name}
											onChange={(e) => handleOilsAndFuelsChange(index, 'name', e.target.value)}
											sx={{ flexGrow: 1 }}
										/>
										<TextField
											label='Amount'
											type='number'
											value={item.amount}
											onChange={(e) => handleOilsAndFuelsChange(index, 'amount', e.target.value)}
											InputProps={{
												startAdornment: <InputAdornment position='start'>₱</InputAdornment>,
											}}
											sx={{ width: '150px' }}
										/>
										<IconButton
											color='error'
											onClick={() => handleRemoveOilsAndFuels(index)}
											sx={{ mt: 1 }}
										>
											<Close />
										</IconButton>
									</Box>
								))}
								<Button
									variant='outlined'
									startIcon={<Add />}
									onClick={() => handleAddOilsAndFuels()}
									size='small'
									sx={{ mt: 1 }}
								>
									Add Oil/Fuel Item
								</Button>
							</Grid>

							<Grid
								item
								xs={12}
							>
								<Divider sx={{ my: 2 }} />
								<Typography
									variant='subtitle1'
									fontWeight='bold'
									gutterBottom
								>
									Parts
								</Typography>
								{newOrder.parts?.map((item, index) => (
									<Box
										key={index}
										sx={{ display: 'flex', mb: 2, gap: 1 }}
									>
										<TextField
											label='Qty'
											type='number'
											value={item.qty}
											onChange={(e) => handlePartsChange(index, 'qty', e.target.value)}
											sx={{ width: '80px' }}
										/>
										<TextField
											label='Description'
											value={item.name}
											onChange={(e) => handlePartsChange(index, 'name', e.target.value)}
											sx={{ flexGrow: 1 }}
										/>
										<TextField
											label='Amount'
											type='number'
											value={item.amount}
											onChange={(e) => handlePartsChange(index, 'amount', e.target.value)}
											InputProps={{
												startAdornment: <InputAdornment position='start'>₱</InputAdornment>,
											}}
											sx={{ width: '150px' }}
										/>
										<IconButton
											color='error'
											onClick={() => handleRemoveParts(index)}
											sx={{ mt: 1 }}
										>
											<Close />
										</IconButton>
									</Box>
								))}
								<Button
									variant='outlined'
									startIcon={<Add />}
									onClick={() => handleAddParts()}
									size='small'
									sx={{ mt: 1 }}
								>
									Add Part Item
								</Button>
							</Grid>
						</Grid>
					)}

					{/* Summary Tab */}
					{activeTab === 2 && (
						<Grid
							container
							spacing={2}
						>
							<Grid
								item
								xs={12}
							>
								<Card
									variant='outlined'
									sx={{ mb: 3 }}
								>
									<CardContent>
										<Typography
											variant='subtitle1'
											fontWeight='bold'
											gutterBottom
										>
											Customer Information
										</Typography>
										<Grid
											container
											spacing={2}
										>
											<Grid
												item
												xs={12}
												sm={6}
											>
												<Typography
													variant='body2'
													gutterBottom
												>
													<strong>Customer:</strong> {newOrder.customer}
												</Typography>
												<Typography
													variant='body2'
													gutterBottom
												>
													<strong>Phone:</strong> {newOrder.phone}
												</Typography>
												<Typography
													variant='body2'
													gutterBottom
												>
													<strong>Address:</strong> {newOrder.address}
												</Typography>
											</Grid>
											<Grid
												item
												xs={12}
												sm={6}
											>
												<Typography
													variant='body2'
													gutterBottom
												>
													<strong>Vehicle:</strong> {newOrder.make}
												</Typography>
												<Typography
													variant='body2'
													gutterBottom
												>
													<strong>Plate:</strong> {newOrder.plate}
												</Typography>
												<Typography
													variant='body2'
													gutterBottom
												>
													<strong>Mechanic:</strong> {newOrder.mechanic}
												</Typography>
											</Grid>
										</Grid>
									</CardContent>
								</Card>
							</Grid>

							<Grid
								item
								xs={12}
							>
								<Button
									variant='contained'
									color='primary'
									onClick={() => calculateTotals()}
									fullWidth
									sx={{ mb: 2 }}
								>
									Calculate Totals
								</Button>
							</Grid>

							<Grid
								item
								xs={12}
								sm={6}
							>
								<Card
									variant='outlined'
									sx={{ height: '100%' }}
								>
									<CardContent>
										<Typography
											variant='subtitle1'
											fontWeight='bold'
											gutterBottom
										>
											Work Summary
										</Typography>
										<TableContainer>
											<Table size='small'>
												<TableHead>
													<TableRow>
														<TableCell>Description</TableCell>
														<TableCell align='right'>Amount</TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{newOrder.workRequested?.map((item, index) => (
														<TableRow key={index}>
															<TableCell>{item.title}</TableCell>
															<TableCell align='right'>₱{item.amount.toLocaleString()}</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</TableContainer>
									</CardContent>
								</Card>
							</Grid>

							<Grid
								item
								xs={12}
								sm={6}
							>
								<Card
									variant='outlined'
									sx={{ height: '100%' }}
								>
									<CardContent>
										<Typography
											variant='subtitle1'
											fontWeight='bold'
											gutterBottom
										>
											Parts & Materials Summary
										</Typography>
										<TableContainer>
											<Table size='small'>
												<TableHead>
													<TableRow>
														<TableCell>Qty</TableCell>
														<TableCell>Description</TableCell>
														<TableCell align='right'>Amount</TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{newOrder.parts?.map((item, index) => (
														<TableRow key={index}>
															<TableCell>{item.qty}</TableCell>
															<TableCell>{item.name}</TableCell>
															<TableCell align='right'>₱{item.amount.toLocaleString()}</TableCell>
														</TableRow>
													))}
													{newOrder.oilsAndFuels?.map((item, index) => (
														<TableRow key={`oil-${index}`}>
															<TableCell>{item.qty}</TableCell>
															<TableCell>{item.name}</TableCell>
															<TableCell align='right'>₱{item.amount.toLocaleString()}</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</TableContainer>
									</CardContent>
								</Card>
							</Grid>

							<Grid
								item
								xs={12}
							>
								<Card
									variant='outlined'
									sx={{ mt: 2 }}
								>
									<CardContent>
										<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
											<Typography variant='body1'>Labor Total:</Typography>
											<Typography variant='body1'>₱{newOrder.laborTotal?.toLocaleString()}</Typography>
										</Box>
										<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
											<Typography variant='body1'>Parts Total:</Typography>
											<Typography variant='body1'>₱{newOrder.partsTotal?.toLocaleString()}</Typography>
										</Box>
										<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
											<Typography variant='body1'>Oils & Fuels Total:</Typography>
											<Typography variant='body1'>₱{newOrder.oilTotal?.toLocaleString()}</Typography>
										</Box>
										<Divider sx={{ my: 2 }} />
										<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
											<Typography
												variant='h6'
												fontWeight='bold'
											>
												Grand Total:
											</Typography>
											<Typography
												variant='h6'
												fontWeight='bold'
												color='primary'
											>
												₱{newOrder.total?.toLocaleString()}
											</Typography>
										</Box>
									</CardContent>
								</Card>
							</Grid>
						</Grid>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleNewOrderClose}>Cancel</Button>
					{activeTab > 0 && <Button onClick={() => setActiveTab(activeTab - 1)}>Back</Button>}
					{activeTab < 2 ? (
						<Button
							variant='contained'
							onClick={() => setActiveTab(activeTab + 1)}
						>
							Next
						</Button>
					) : (
						<Button
							variant='contained'
							color='primary'
							onClick={handleSaveNewOrder}
						>
							Save Job Order
						</Button>
					)}
				</DialogActions>
			</Dialog>
			<Dialog
				open={Boolean(editOrder)}
				onClose={handleEditClose}
				maxWidth='md'
				fullWidth
			>
				<DialogTitle>
					<Typography variant='h6'>Edit Job Order</Typography>
				</DialogTitle>
				<DialogContent dividers>
					<Tabs
						value={activeTab}
						onChange={handleTabChange}
						sx={{ mb: 3 }}
					>
						<Tab label='Customer Info' />
						<Tab label='Work & Parts' />
						<Tab label='Summary' />
					</Tabs>

					{/* Customer Info Tab */}
					{activeTab === 0 && editOrder && (
						<Grid
							container
							spacing={2}
						>
							<Grid
								item
								xs={12}
								sm={6}
							>
								<TextField
									label='Customer Name'
									fullWidth
									value={editOrder.customer}
									onChange={(e) => handleEditInputChange('customer', e.target.value)}
									required
									margin='normal'
								/>
							</Grid>
							<Grid
								item
								xs={12}
								sm={6}
							>
								<TextField
									label='Phone Number'
									fullWidth
									value={editOrder.phone}
									onChange={(e) => handleEditInputChange('phone', e.target.value)}
									required
									margin='normal'
								/>
							</Grid>
							<Grid
								item
								xs={12}
							>
								<TextField
									label='Address'
									fullWidth
									value={editOrder.address}
									onChange={(e) => handleEditInputChange('address', e.target.value)}
									margin='normal'
								/>
							</Grid>
							<Grid
								item
								xs={12}
								sm={6}
							>
								<TextField
									label='Vehicle Make/Model'
									fullWidth
									value={editOrder.make}
									onChange={(e) => handleEditInputChange('make', e.target.value)}
									required
									margin='normal'
								/>
							</Grid>
							<Grid
								item
								xs={12}
								sm={6}
							>
								<TextField
									label='Plate Number'
									fullWidth
									value={editOrder.plate}
									onChange={(e) => handleEditInputChange('plate', e.target.value)}
									required
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
								>
									<InputLabel>Mechanic</InputLabel>
									<Select
										value={editOrder.mechanic}
										label='Mechanic'
										onChange={(e) => handleEditInputChange('mechanic', e.target.value)}
									>
										{mechanics.map((mechanic) => (
											<MenuItem
												key={mechanic}
												value={mechanic}
											>
												{mechanic}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
							<Grid
								item
								xs={12}
								sm={6}
							>
								<FormControl
									fullWidth
									margin='normal'
								>
									<InputLabel>Status</InputLabel>
									<Select
										value={editOrder.status}
										label='Status'
										onChange={(e) => handleEditInputChange('status', e.target.value)}
									>
										{statusOptions.map((status) => (
											<MenuItem
												key={status}
												value={status}
											>
												{status}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
							<Grid
								item
								xs={12}
							>
								<TextField
									label='Remarks'
									fullWidth
									multiline
									rows={2}
									value={editOrder.remarks}
									onChange={(e) => handleEditInputChange('remarks', e.target.value)}
									margin='normal'
								/>
							</Grid>
							<Grid
								item
								xs={12}
								sm={6}
							>
								<TextField
									label='Date'
									type='date'
									fullWidth
									value={editOrder.date}
									onChange={(e) => handleEditInputChange('date', e.target.value)}
									margin='normal'
									InputLabelProps={{ shrink: true }}
								/>
							</Grid>
						</Grid>
					)}

					{/* Work & Parts Tab */}
					{activeTab === 1 && editOrder && (
						<Grid
							container
							spacing={3}
						>
							<Grid
								item
								xs={12}
							>
								<Typography
									variant='subtitle1'
									fontWeight='bold'
									gutterBottom
								>
									Work Requested
								</Typography>
								{editOrder.workRequested?.map((item, index) => (
									<Box
										key={index}
										sx={{ display: 'flex', mb: 2, gap: 1 }}
									>
										<TextField
											label='Description'
											value={item.title}
											onChange={(e) => handleWorkRequestedChange(index, 'title', e.target.value, true)}
											sx={{ flexGrow: 1 }}
										/>
										<TextField
											label='Amount'
											type='number'
											value={item.amount}
											onChange={(e) => handleWorkRequestedChange(index, 'amount', e.target.value, true)}
											InputProps={{
												startAdornment: <InputAdornment position='start'>₱</InputAdornment>,
											}}
											sx={{ width: '150px' }}
										/>
										<IconButton
											color='error'
											onClick={() => handleRemoveWorkRequested(index, true)}
											sx={{ mt: 1 }}
										>
											<Close />
										</IconButton>
									</Box>
								))}
								<Button
									variant='outlined'
									startIcon={<Add />}
									onClick={() => handleAddWorkRequested(true)}
									size='small'
									sx={{ mt: 1 }}
								>
									Add Work Item
								</Button>
							</Grid>

							<Grid
								item
								xs={12}
							>
								<Divider sx={{ my: 2 }} />
								<Typography
									variant='subtitle1'
									fontWeight='bold'
									gutterBottom
								>
									Oils & Fuels
								</Typography>
								{editOrder.oilsAndFuels?.map((item, index) => (
									<Box
										key={index}
										sx={{ display: 'flex', mb: 2, gap: 1 }}
									>
										<TextField
											label='Qty'
											type='number'
											value={item.qty}
											onChange={(e) => handleOilsAndFuelsChange(index, 'qty', e.target.value, true)}
											sx={{ width: '80px' }}
										/>
										<TextField
											label='Description'
											value={item.name}
											onChange={(e) => handleOilsAndFuelsChange(index, 'name', e.target.value, true)}
											sx={{ flexGrow: 1 }}
										/>
										<TextField
											label='Amount'
											type='number'
											value={item.amount}
											onChange={(e) => handleOilsAndFuelsChange(index, 'amount', e.target.value, true)}
											InputProps={{
												startAdornment: <InputAdornment position='start'>₱</InputAdornment>,
											}}
											sx={{ width: '150px' }}
										/>
										<IconButton
											color='error'
											onClick={() => handleRemoveOilsAndFuels(index, true)}
											sx={{ mt: 1 }}
										>
											<Close />
										</IconButton>
									</Box>
								))}
								<Button
									variant='outlined'
									startIcon={<Add />}
									onClick={() => handleAddOilsAndFuels(true)}
									size='small'
									sx={{ mt: 1 }}
								>
									Add Oil/Fuel Item
								</Button>
							</Grid>

							<Grid
								item
								xs={12}
							>
								<Divider sx={{ my: 2 }} />
								<Typography
									variant='subtitle1'
									fontWeight='bold'
									gutterBottom
								>
									Parts
								</Typography>
								{editOrder.parts?.map((item, index) => (
									<Box
										key={index}
										sx={{ display: 'flex', mb: 2, gap: 1 }}
									>
										<TextField
											label='Qty'
											type='number'
											value={item.qty}
											onChange={(e) => handlePartsChange(index, 'qty', e.target.value, true)}
											sx={{ width: '80px' }}
										/>
										<TextField
											label='Description'
											value={item.name}
											onChange={(e) => handlePartsChange(index, 'name', e.target.value, true)}
											sx={{ flexGrow: 1 }}
										/>
										<TextField
											label='Amount'
											type='number'
											value={item.amount}
											onChange={(e) => handlePartsChange(index, 'amount', e.target.value, true)}
											InputProps={{
												startAdornment: <InputAdornment position='start'>₱</InputAdornment>,
											}}
											sx={{ width: '150px' }}
										/>
										<IconButton
											color='error'
											onClick={() => handleRemoveParts(index, true)}
											sx={{ mt: 1 }}
										>
											<Close />
										</IconButton>
									</Box>
								))}
								<Button
									variant='outlined'
									startIcon={<Add />}
									onClick={() => handleAddParts(true)}
									size='small'
									sx={{ mt: 1 }}
								>
									Add Part Item
								</Button>
							</Grid>
						</Grid>
					)}

					{/* Summary Tab */}
					{activeTab === 2 && editOrder && (
						<Grid
							container
							spacing={2}
						>
							<Grid
								item
								xs={12}
							>
								<Card
									variant='outlined'
									sx={{ mb: 3 }}
								>
									<CardContent>
										<Typography
											variant='subtitle1'
											fontWeight='bold'
											gutterBottom
										>
											Customer Information
										</Typography>

										<Grid
											container
											spacing={2}
										>
											<Grid
												item
												xs={12}
												sm={6}
											>
												<Typography
													variant='body2'
													gutterBottom
												>
													<strong>Customer:</strong> {editOrder.customer}
												</Typography>
												<Typography
													variant='body2'
													gutterBottom
												>
													<strong>Phone:</strong> {editOrder.phone}
												</Typography>
												<Typography
													variant='body2'
													gutterBottom
												>
													<strong>Address:</strong> {editOrder.address}
												</Typography>
											</Grid>
											<Grid
												item
												xs={12}
												sm={6}
											>
												<Typography
													variant='body2'
													gutterBottom
												>
													<strong>Vehicle:</strong> {editOrder.make}
												</Typography>
												<Typography
													variant='body2'
													gutterBottom
												>
													<strong>Plate:</strong> {editOrder.plate}
												</Typography>
												<Typography
													variant='body2'
													gutterBottom
												>
													<strong>Mechanic:</strong> {editOrder.mechanic}
												</Typography>
											</Grid>
										</Grid>
									</CardContent>
								</Card>
							</Grid>

							<Grid
								item
								xs={12}
							>
								<Button
									variant='contained'
									color='primary'
									onClick={() => calculateTotals(true)}
									fullWidth
									sx={{ mb: 2 }}
								>
									Calculate Totals
								</Button>
							</Grid>

							<Grid
								item
								xs={12}
								sm={6}
							>
								<Card
									variant='outlined'
									sx={{ height: '100%' }}
								>
									<CardContent>
										<Typography
											variant='subtitle1'
											fontWeight='bold'
											gutterBottom
										>
											Work Summary
										</Typography>
										<TableContainer>
											<Table size='small'>
												<TableHead>
													<TableRow>
														<TableCell>Description</TableCell>
														<TableCell align='right'>Amount</TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{editOrder.workRequested?.map((item, index) => (
														<TableRow key={index}>
															<TableCell>{item.title}</TableCell>
															<TableCell align='right'>₱{item.amount.toLocaleString()}</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</TableContainer>
									</CardContent>
								</Card>
							</Grid>

							<Grid
								item
								xs={12}
								sm={6}
							>
								<Card
									variant='outlined'
									sx={{ height: '100%' }}
								>
									<CardContent>
										<Typography
											variant='subtitle1'
											fontWeight='bold'
											gutterBottom
										>
											Parts & Materials Summary
										</Typography>
										<TableContainer>
											<Table size='small'>
												<TableHead>
													<TableRow>
														<TableCell>Qty</TableCell>
														<TableCell>Description</TableCell>
														<TableCell align='right'>Amount</TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{editOrder.parts?.map((item, index) => (
														<TableRow key={index}>
															<TableCell>{item.qty}</TableCell>
															<TableCell>{item.name}</TableCell>
															<TableCell align='right'>₱{item.amount.toLocaleString()}</TableCell>
														</TableRow>
													))}
													{editOrder.oilsAndFuels?.map((item, index) => (
														<TableRow key={`oil-${index}`}>
															<TableCell>{item.qty}</TableCell>
															<TableCell>{item.name}</TableCell>
															<TableCell align='right'>₱{item.amount.toLocaleString()}</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</TableContainer>
									</CardContent>
								</Card>
							</Grid>

							<Grid
								item
								xs={12}
							>
								<Card
									variant='outlined'
									sx={{ mt: 2 }}
								>
									<CardContent>
										<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
											<Typography variant='body1'>Labor Total:</Typography>
											<Typography variant='body1'>₱{editOrder.laborTotal?.toLocaleString()}</Typography>
										</Box>
										<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
											<Typography variant='body1'>Parts Total:</Typography>
											<Typography variant='body1'>₱{editOrder.partsTotal?.toLocaleString()}</Typography>
										</Box>
										<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
											<Typography variant='body1'>Oils & Fuels Total:</Typography>
											<Typography variant='body1'>₱{editOrder.oilTotal?.toLocaleString()}</Typography>
										</Box>
										<Divider sx={{ my: 2 }} />
										<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
											<Typography
												variant='h6'
												fontWeight='bold'
											>
												Grand Total:
											</Typography>
											<Typography
												variant='h6'
												fontWeight='bold'
												color='primary'
											>
												₱{editOrder.total?.toLocaleString()}
											</Typography>
										</Box>
									</CardContent>
								</Card>
							</Grid>
						</Grid>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleEditClose}>Cancel</Button>
					{activeTab > 0 && <Button onClick={() => setActiveTab(activeTab - 1)}>Back</Button>}
					{activeTab < 2 ? (
						<Button
							variant='contained'
							onClick={() => setActiveTab(activeTab + 1)}
						>
							Next
						</Button>
					) : (
						<Button
							variant='contained'
							color='primary'
							onClick={handleSaveEditOrder}
						>
							Save Changes
						</Button>
					)}
				</DialogActions>
			</Dialog>

			<Dialog
				open={deleteConfirmOpen}
				onClose={handleDeleteConfirmClose}
			>
				<DialogTitle>Confirm Delete</DialogTitle>
				<DialogContent>
					<Typography>Are you sure you want to delete this job order? This action cannot be undone.</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDeleteConfirmClose}>Cancel</Button>
					<Button
						variant='contained'
						color='error'
						onClick={handleDeleteOrder}
					>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default JobOrdersPage;
