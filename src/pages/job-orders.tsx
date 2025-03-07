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
	Tooltip,
	useTheme,
	alpha,
} from '@mui/material';
import { Add, Print, Search, Visibility, Edit, Delete, FilterList, Close, CheckCircle, HourglassEmpty, Build, CalendarToday, Person, DirectionsCar, Phone, LocationOn, Notes, Abc } from '@mui/icons-material';

// Define interfaces for data structure
interface WorkRequested {
	title: string;
	amount: number;
}

interface OilsAndFuels {
	qty: number;
	name: string;
	amount: number;
}

interface Parts {
	qty: number;
	name: string;
	amount: number;
}

interface JobOrder {
	id: string;
	customer: string;
	address: string;
	make: string;
	plate: string;
	phone: string;
	mechanic: string;
	status: 'Pending' | 'In Progress' | 'Completed';
	remarks: string;
	date: string;
	workRequested: WorkRequested[];
	oilsAndFuels: OilsAndFuels[];
	parts: Parts[];
	laborTotal: number;
	partsTotal: number;
	oilTotal: number;
	total: number;
}

// Sample mechanics data
const mechanics = ['Mike Santos', 'John Smith', 'Maria Garcia', 'Robert Chen', 'James Wilson'];

// Sample status options
const statusOptions = ['Pending', 'In Progress', 'Completed'];

const JobOrdersPage = () => {
	const theme = useTheme();

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
	const [viewOrder, setViewOrder] = useState<JobOrder | null>(null);
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

	// Handle opening the view job order dialog
	const handleViewOpen = (order: JobOrder) => {
		setViewOrder(order);
	};

	// Handle closing the view job order dialog
	const handleViewClose = () => {
		setViewOrder(null);
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

	// Handle printing a job order
	const handlePrint = (order: JobOrder): void => {
		if (!order) return;

		const formatCurrency = (value: number): string => {
			return new Intl.NumberFormat('en-US').format(value);
		};

		const calculateTotal = (items: { amount: number }[]): number => items.reduce((sum, item) => sum + (item.amount || 0), 0);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const generateTableRows = (items: any[], maxRows: number, columns: string[], totalLabel: string): string => {
			const rows: string[] = items.map(
				(item) => `
       <tr>
      ${columns.map((col) => `<td>${col === 'amount' ? formatCurrency(item[col]) : item[col] || ''}</td>`).join('')}
    </tr>
    `
			);

			// Add empty rows for consistent layout
			while (rows.length < maxRows - 1) {
				rows.push(`<tr>${columns.map(() => `<td>&nbsp;</td>`).join('')}</tr>`);
			}

			// Add total row
			const total = calculateTotal(items);
			rows.push(`
      <tr>
        <td colspan="${columns.length - 1}" class="label">${totalLabel}</td>
        <td>${formatCurrency(total)}</td>
      </tr>
    `);

			return rows.join('');
		};

		const printContent = `
      <html>
      <head>
        <title>Job Order</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .print-container { max-width: 700px; margin: auto; border: 1px solid #000; padding: 20px; }
          h2, .center { text-align: center; margin:4px 0; }
          .details-container { display: flex; justify-content: space-between; margin: 20px 0; gap:24px; }
          .details-container .label {width:60%;}
          .details { margin: 8px 0; display:flex; align-items:center; }
          .label { font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid black; padding: 5px; text-align: left; }
          .underline { display: inline-block; width: 100%; border-bottom: 1px solid black;  }

          /* Two-column layout */
          .tables-container {
            display: flex;
            justify-content: space-between;
          }
          .left-column, .right-column {
            width: 48%;
          }
          .charges {
            margin-top: 20px;
            border-top: 2px solid black;
            padding-top: 10px;
          }

         
          .charges p {
            display:flex;
            margin:8px 0;
          }

          .charges .label{
            width:50%;
            }
        </style>
      </head>
      <body>
        <div class="print-container">
          <h2>ADVANCEDTECH CAR SERVICE CENTER CO.</h2>
          <p class="center">formerly ANTE MOTOR SHOP</p>
          <p class="center">National Hi-way, Balagtas Batangas City</p>
          <p class="center">Tel. No: 123-4567 | Cell No. 09123456789 / 099912345678</p>
          
          <div class="details-container">
            <div style="width:60%;">
              <p class="details"><span class="label">Customer's Name:</span> <span class="underline">${order.customer}</span></p>
              <p class="details"><span class="label">Address:</span> <span class="underline">${order.address}</span></p>
              <p class="details"><span class="label">Make:</span> <span class="underline">${order.make}</span></p>
              <p class="details"><span class="label">Plate No:</span> <span class="underline">${order.plate}</span></p>
              <p class="details"><span class="label">Tel. No.:</span> <span class="underline">${order.phone}</span></p>
            </div>
            <div style="width:40%;">
              <p class="details"><span class="label">Date:</span> <span class="underline">${order.date}</span></p>
              <p class="details"><span class="label">Mechanic:</span> <span class="underline">${order.mechanic}</span></p>
            </div>
          </div>

          <div class="tables-container">
            <!-- Left Column -->
            <div class="left-column">
              <table>
                <tr>
                  <th>Work Requested</th>
                  <th>Amount</th>
                </tr>
                ${generateTableRows(order.workRequested, 10, ['title', 'amount'], 'Total')}
              </table>

              <div class="charges">
                <h3 style="text-align:left;">Charges</h3>
                <p><span class="label">LABOR:</span> <span class="underline">${formatCurrency(order.laborTotal)}</span></p>
                <p><span class="label">PARTS:</span> <span class="underline">${formatCurrency(order.partsTotal)}</span></p>
                <p><span class="label">GAS & OIL:</span> <span class="underline">${formatCurrency(order.oilTotal)}</span></p>
                <p><span class="label">TOTAL:</span> <span class="underline">${formatCurrency(order.total)}</span></p>
              </div>
            </div>

            <!-- Right Column -->
            <div class="right-column">
              <table>
                <tr>
                  <th>Qty</th>
                  <th>Oils & Fuels</th>
                  <th>Amount</th>
                </tr>
              ${generateTableRows(order.oilsAndFuels, 5, ['qty', 'name', 'amount'], 'Total')}
              </table>

              <table>
                <tr>
                  <th>Qty</th>
                  <th>Parts</th>
                  <th>Amount</th>
                </tr>
                ${generateTableRows(order.parts, 10, ['qty', 'name', 'amount'], 'Total')}
              </table>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
		const newWindow = window.open('', '_blank');
		if (newWindow) {
			newWindow.document.write(printContent);
			newWindow.document.close();
			newWindow.print();
		}
	};

	// Get status chip color
	const getStatusChipColor = (status: string) => {
		switch (status) {
			case 'Pending':
				return 'warning';
			case 'In Progress':
				return 'info';
			case 'Completed':
				return 'success';
			default:
				return 'warning';
		}
	};

	// Get status icon
	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'Pending':
				return <HourglassEmpty fontSize='small' />;
			case 'In Progress':
				return <Build fontSize='small' />;
			case 'Completed':
				return <CheckCircle fontSize='small' />;
			default:
				return <span />;
		}
	};

	return (
		<Box sx={{ p: { xs: 2, md: 3 }, maxWidth: '1200px', mx: 'auto' }}>
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
			<Card
				elevation={2}
				sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}
			>
				<TableContainer sx={{ maxHeight: 600 }}>
					<Table stickyHeader>
						<TableHead>
							<TableRow>
								<TableCell sx={{ fontWeight: 'bold', bgcolor: alpha(theme.palette.primary.main, 0.1) }}>ID</TableCell>
								<TableCell sx={{ fontWeight: 'bold', bgcolor: alpha(theme.palette.primary.main, 0.1) }}>Customer</TableCell>
								<TableCell sx={{ fontWeight: 'bold', bgcolor: alpha(theme.palette.primary.main, 0.1) }}>Vehicle</TableCell>
								<TableCell sx={{ fontWeight: 'bold', bgcolor: alpha(theme.palette.primary.main, 0.1) }}>Mechanic</TableCell>
								<TableCell sx={{ fontWeight: 'bold', bgcolor: alpha(theme.palette.primary.main, 0.1) }}>Status</TableCell>
								<TableCell sx={{ fontWeight: 'bold', bgcolor: alpha(theme.palette.primary.main, 0.1) }}>Date</TableCell>
								<TableCell sx={{ fontWeight: 'bold', bgcolor: alpha(theme.palette.primary.main, 0.1) }}>Total</TableCell>
								<TableCell sx={{ fontWeight: 'bold', bgcolor: alpha(theme.palette.primary.main, 0.1) }}>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{filteredOrders.length > 0 ? (
								filteredOrders.map((order) => (
									<TableRow
										key={order.id}
										sx={{
											'&:hover': {
												bgcolor: alpha(theme.palette.primary.main, 0.05),
											},
											transition: 'background-color 0.2s',
										}}
									>
										<TableCell>{order.id}</TableCell>
										<TableCell>
											<Box sx={{ display: 'flex', alignItems: 'center' }}>
												<Person sx={{ mr: 1, color: theme.palette.primary.main, opacity: 0.7 }} />
												<Box>
													<Typography
														variant='body2'
														fontWeight='medium'
													>
														{order.customer}
													</Typography>
													<Typography
														variant='caption'
														color='text.secondary'
													>
														{order.phone}
													</Typography>
												</Box>
											</Box>
										</TableCell>
										<TableCell>
											<Box sx={{ display: 'flex', alignItems: 'center' }}>
												<DirectionsCar sx={{ mr: 1, color: theme.palette.secondary.main, opacity: 0.7 }} />
												<Box>
													<Typography variant='body2'>{order.make}</Typography>
													<Typography
														variant='caption'
														color='text.secondary'
													>
														{order.plate}
													</Typography>
												</Box>
											</Box>
										</TableCell>
										<TableCell>{order.mechanic}</TableCell>
										<TableCell>
											<Chip
												icon={getStatusIcon(order.status)}
												label={order.status}
												color={getStatusChipColor(order.status)}
												size='small'
												sx={{ fontWeight: 'medium' }}
											/>
										</TableCell>
										<TableCell>
											<Box sx={{ display: 'flex', alignItems: 'center' }}>
												<CalendarToday sx={{ mr: 1, fontSize: 'small', color: 'text.secondary' }} />
												{order.date}
											</Box>
										</TableCell>
										<TableCell>
											<Typography fontWeight='medium'>₱{order.total.toLocaleString()}</Typography>
										</TableCell>
										<TableCell>
											<Box sx={{ display: 'flex' }}>
												<Tooltip title='View Details'>
													<IconButton
														size='small'
														color='primary'
														onClick={() => handleViewOpen(order)}
														sx={{ mr: 1 }}
													>
														<Visibility fontSize='small' />
													</IconButton>
												</Tooltip>
												<Tooltip title='Edit'>
													<IconButton
														size='small'
														color='secondary'
														onClick={() => handleEditOpen(order)}
														sx={{ mr: 1 }}
													>
														<Edit fontSize='small' />
													</IconButton>
												</Tooltip>
												<Tooltip title='Delete'>
													<IconButton
														size='small'
														color='error'
														onClick={() => handleDeleteConfirmOpen(order.id)}
													>
														<Delete fontSize='small' />
													</IconButton>
												</Tooltip>
											</Box>
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={8}
										align='center'
										sx={{ py: 3 }}
									>
										<Typography
											variant='body1'
											color='text.secondary'
										>
											No job orders found
										</Typography>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
			</Card>
			;
			<Dialog
				open={Boolean(viewOrder)}
				onClose={handleViewClose}
				maxWidth='md'
				fullWidth
			>
				<DialogTitle sx={{ pb: 1 }}>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<Typography variant='h6'>Job Order Details</Typography>
						{viewOrder && (
							<Chip
								icon={getStatusIcon(viewOrder.status)}
								label={viewOrder.status}
								// eslint-disable-next-line @typescript-eslint/no-explicit-any
								color={getStatusChipColor(viewOrder.status) as any}
								size='small'
							/>
						)}
					</Box>
				</DialogTitle>
				<DialogContent dividers>
					{viewOrder && (
						<Grid
							container
							spacing={3}
						>
							<Grid
								item
								xs={12}
							>
								<Card
									variant='outlined'
									sx={{ mb: 2 }}
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
												<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
													<Person sx={{ mr: 1, color: theme.palette.primary.main }} />
													<Typography variant='body2'>
														<strong>Name:</strong> {viewOrder.customer}
													</Typography>
												</Box>
												<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
													<Phone sx={{ mr: 1, color: theme.palette.primary.main }} />
													<Typography variant='body2'>
														<strong>Phone:</strong> {viewOrder.phone}
													</Typography>
												</Box>
												<Box sx={{ display: 'flex', alignItems: 'center' }}>
													<LocationOn sx={{ mr: 1, color: theme.palette.primary.main }} />
													<Typography variant='body2'>
														<strong>Address:</strong> {viewOrder.address}
													</Typography>
												</Box>
											</Grid>
											<Grid
												item
												xs={12}
												sm={6}
											>
												<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
													<DirectionsCar sx={{ mr: 1, color: theme.palette.secondary.main }} />
													<Typography variant='body2'>
														<strong>Vehicle:</strong> {viewOrder.make}
													</Typography>
												</Box>
												<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
													<Abc sx={{ mr: 1, color: theme.palette.secondary.main }} />
													<Typography variant='body2'>
														<strong>Plate Number:</strong> {viewOrder.plate}
													</Typography>
												</Box>
												<Box sx={{ display: 'flex', alignItems: 'center' }}>
													<Build sx={{ mr: 1, color: theme.palette.secondary.main }} />
													<Typography variant='body2'>
														<strong>Mechanic:</strong> {viewOrder.mechanic}
													</Typography>
												</Box>
											</Grid>
										</Grid>
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
											Work Requested
										</Typography>
										<TableContainer sx={{ maxHeight: 200 }}>
											<Table size='small'>
												<TableHead>
													<TableRow>
														<TableCell>Description</TableCell>
														<TableCell align='right'>Amount</TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{viewOrder.workRequested.map((item, index) => (
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
											Parts & Materials
										</Typography>
										<TableContainer sx={{ maxHeight: 200 }}>
											<Table size='small'>
												<TableHead>
													<TableRow>
														<TableCell>Qty</TableCell>
														<TableCell>Description</TableCell>
														<TableCell align='right'>Amount</TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{viewOrder.parts.map((item, index) => (
														<TableRow key={index}>
															<TableCell>{item.qty}</TableCell>
															<TableCell>{item.name}</TableCell>
															<TableCell align='right'>₱{item.amount.toLocaleString()}</TableCell>
														</TableRow>
													))}
													{viewOrder.oilsAndFuels.map((item, index) => (
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
								<Card variant='outlined'>
									<CardContent>
										<Grid
											container
											spacing={2}
										>
											<Grid
												item
												xs={12}
												sm={6}
											>
												<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
													<Notes sx={{ mr: 1, color: theme.palette.info.main }} />
													<Typography variant='body2'>
														<strong>Remarks:</strong> {viewOrder.remarks}
													</Typography>
												</Box>
												<Box sx={{ display: 'flex', alignItems: 'center' }}>
													<CalendarToday sx={{ mr: 1, color: theme.palette.info.main }} />
													<Typography variant='body2'>
														<strong>Date:</strong> {viewOrder.date}
													</Typography>
												</Box>
											</Grid>
											<Grid
												item
												xs={12}
												sm={6}
											>
												<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
													<Typography
														variant='body2'
														sx={{ mb: 1 }}
													>
														<strong>Labor:</strong> ₱{viewOrder.laborTotal.toLocaleString()}
													</Typography>
													<Typography
														variant='body2'
														sx={{ mb: 1 }}
													>
														<strong>Parts:</strong> ₱{viewOrder.partsTotal.toLocaleString()}
													</Typography>
													<Typography
														variant='body2'
														sx={{ mb: 1 }}
													>
														<strong>Oils & Fuels:</strong> ₱{viewOrder.oilTotal.toLocaleString()}
													</Typography>
													<Divider sx={{ width: '100%', my: 1 }} />
													<Typography
														variant='h6'
														color='primary'
														fontWeight='bold'
													>
														<strong>Total:</strong> ₱{viewOrder.total.toLocaleString()}
													</Typography>
												</Box>
											</Grid>
										</Grid>
									</CardContent>
								</Card>
							</Grid>
						</Grid>
					)}
				</DialogContent>
				<DialogActions>
					<Button
						variant='outlined'
						startIcon={<Print />}
						onClick={() => handlePrint(viewOrder as JobOrder)}
					>
						Print
					</Button>
					<Button
						variant='contained'
						onClick={handleViewClose}
					>
						Close
					</Button>
				</DialogActions>
			</Dialog>
			;
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
			;
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
