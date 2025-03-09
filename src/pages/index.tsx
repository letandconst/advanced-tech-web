'use client';

import { useState, useEffect, ReactNode } from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent, Chip, Avatar, useTheme } from '@mui/material';
import { ArrowUpward as ArrowUpwardIcon, ArrowDownward as ArrowDownwardIcon, DirectionsCar as CarIcon, Person as PersonIcon, Build as BuildIcon } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { useUser } from '@/context/UserContext';

import JobOrderDialog from '@/components/Modal/ViewJobOrder';
import DataTable from '@/components/DataTable/DataTable';
import { JobOrder } from '@/types/jobOrder';
import { useJobOrderModal } from '@/hooks/useJobOrderModal';

const jobOrders: JobOrder[] = [
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
];

// Sample data for charts
const monthlyServiceData = [
	{ name: 'Jan', services: 65, revenue: 4200 },
	{ name: 'Feb', services: 59, revenue: 3800 },
	{ name: 'Mar', services: 80, revenue: 5100 },
	{ name: 'Apr', services: 81, revenue: 5300 },
	{ name: 'May', services: 56, revenue: 3600 },
	{ name: 'Jun', services: 55, revenue: 3500 },
	{ name: 'Jul', services: 40, revenue: 2800 },
];

// Clock component
function Clock() {
	const [time, setTime] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => {
			setTime(new Date());
		}, 1000);

		return () => {
			clearInterval(timer);
		};
	}, []);

	const formatDate = (date: Date) => {
		const options: Intl.DateTimeFormatOptions = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		};
		return date.toLocaleDateString(undefined, options);
	};

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString(undefined, {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		});
	};

	return (
		<Box sx={{ textAlign: 'right' }}>
			<Typography
				variant='h4'
				fontWeight='bold'
				color='text.primary'
			>
				{formatTime(time)}
			</Typography>
			<Typography
				variant='body1'
				color='text.secondary'
			>
				{formatDate(time)}
			</Typography>
		</Box>
	);
}

// KPI Card Component
interface KpiCardProps {
	title: string;
	value: string | number;
	change: string;
	isPositive: boolean;
	color: string;
	icon: ReactNode;
}

const KpiCard = ({ title, value, change, isPositive, color, icon }: KpiCardProps) => {
	const theme = useTheme();

	return (
		<Card
			sx={{
				height: '100%',
				borderRadius: 2,
				boxShadow: 3,
				bgcolor: 'background.paper',
				transition: 'transform 0.3s, box-shadow 0.3s',
				'&:hover': {
					transform: 'translateY(-4px)',
					boxShadow: 6,
				},
			}}
		>
			<CardContent
				sx={{
					p: 3,
					borderLeft: `6px solid ${color}`,
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
				}}
			>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
					<Typography
						variant='subtitle1'
						color='text.secondary'
						fontWeight='medium'
					>
						{title}
					</Typography>
					<Avatar
						sx={{
							bgcolor: theme.palette.mode === 'dark' ? `${color}30` : `${color}20`,
							color: color,
						}}
					>
						{icon}
					</Avatar>
				</Box>

				<Typography
					variant='h3'
					component='div'
					fontWeight='bold'
					color={color}
					sx={{ mb: 1 }}
				>
					{value}
				</Typography>

				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					{isPositive ? <ArrowUpwardIcon sx={{ color: theme.palette.success.main, fontSize: 16, mr: 0.5 }} /> : <ArrowDownwardIcon sx={{ color: theme.palette.error.main, fontSize: 16, mr: 0.5 }} />}
					<Typography
						variant='body2'
						color={isPositive ? theme.palette.success.main : theme.palette.error.main}
					>
						{change}
					</Typography>
				</Box>
			</CardContent>
		</Card>
	);
};

export default function Dashboard() {
	const theme = useTheme();
	const { user } = useUser();

	const { viewOrder, handleViewOpen, handleViewClose, handlePrint } = useJobOrderModal();

	const actions = {
		view: handleViewOpen,
	};

	const columns = [
		{ id: 'id', label: 'ID' },
		{
			id: 'vehicle',
			label: 'Vehicle',
			render: (row: JobOrder) => `${row.make} - ${row.plate}`,
		},
		{
			id: 'workRequested',
			label: 'Work Requested',
			render: (row: JobOrder) => row.workRequested.map((item) => item.title).join(', '),
		},
		{
			id: 'status',
			label: 'Status',
			render: (row: JobOrder) => (
				<Chip
					label={row.status}
					color={row.status === 'Pending' ? 'warning' : row.status === 'In Progress' ? 'primary' : 'success'}
					size='small'
				/>
			),
		},
		{ id: 'mechanic', label: 'Mechanic' },
	];

	return (
		<Box sx={{ p: { xs: 2, md: 3 } }}>
			<Grid
				container
				spacing={3}
			>
				{/* Welcome Message and Date/Time */}
				<Grid
					item
					xs={12}
				>
					<Paper
						elevation={2}
						sx={{
							p: 3,
							borderRadius: 2,
							bgcolor: 'background.paper',
						}}
					>
						<Grid
							container
							alignItems='center'
							justifyContent='space-between'
						>
							<Grid
								item
								xs={12}
								md={6}
							>
								<Typography
									variant='h4'
									component='div'
									fontWeight='bold'
									gutterBottom
								>
									Hi, {user && user?.firstName}!
								</Typography>
								<Typography variant='body1'>Here&apos;s what&apos;s happening in your service center today.</Typography>
							</Grid>
							<Grid
								item
								xs={12}
								md={6}
								sx={{ mt: { xs: 2, md: 0 } }}
							>
								<Clock />
							</Grid>
						</Grid>
					</Paper>
				</Grid>

				{/* KPI Cards */}
				<Grid
					item
					xs={12}
				>
					<Grid
						container
						spacing={3}
					>
						<Grid
							item
							xs={12}
							sm={6}
							md={4}
						>
							<KpiCard
								title='Sales This Week'
								value='&#8369; 4,250'
								change='5% higher than last week'
								isPositive={true}
								color={theme.palette.success.main}
								icon={<BuildIcon />}
							/>
						</Grid>
						<Grid
							item
							xs={12}
							sm={6}
							md={4}
						>
							<KpiCard
								title='Active Work Requests'
								value='12'
								change='20% more than last week'
								isPositive={true}
								color={theme.palette.primary.main}
								icon={<CarIcon />}
							/>
						</Grid>
						<Grid
							item
							xs={12}
							sm={6}
							md={4}
						>
							<KpiCard
								title='Available Mechanics'
								value='5'
								change='1 less than last week'
								isPositive={false}
								color={theme.palette.secondary.main}
								icon={<PersonIcon />}
							/>
						</Grid>
					</Grid>
				</Grid>

				{/* Monthly Services Chart */}
				<Grid
					item
					xs={12}
				>
					<Paper
						elevation={2}
						sx={{ p: 3, borderRadius: 2 }}
					>
						<Typography
							variant='h6'
							gutterBottom
							fontWeight='bold'
						>
							Monthly Services & Revenue
						</Typography>
						<Box sx={{ height: 400, mt: 2 }}>
							<ResponsiveContainer
								width='100%'
								height='100%'
							>
								<BarChart
									data={monthlyServiceData}
									margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
								>
									<CartesianGrid
										strokeDasharray='3 3'
										stroke={theme.palette.divider}
									/>
									<XAxis
										dataKey='name'
										tick={{ fill: theme.palette.text.primary }}
										tickMargin={10}
									/>
									<YAxis
										yAxisId='left'
										tick={{ fill: theme.palette.text.primary }}
										tickMargin={10}
									/>
									<YAxis
										yAxisId='right'
										orientation='right'
										tick={{ fill: theme.palette.text.primary }}
										tickMargin={10}
									/>
									<RechartsTooltip
										cursor={{ fill: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
										contentStyle={{
											backgroundColor: theme.palette.background.paper,
											borderColor: theme.palette.divider,
											borderRadius: '8px',
											boxShadow: theme.shadows[3],
											padding: '10px',
										}}
									/>
									<Legend wrapperStyle={{ paddingTop: '20px' }} />
									<Bar
										dataKey='services'
										name='Services Completed'
										fill={theme.palette.primary.main}
										yAxisId='left'
										radius={[4, 4, 0, 0]}
									/>
									<Bar
										dataKey='revenue'
										name='Revenue (&#8369;)'
										fill={theme.palette.secondary.main}
										yAxisId='right'
										radius={[4, 4, 0, 0]}
									/>
								</BarChart>
							</ResponsiveContainer>
						</Box>
					</Paper>
				</Grid>

				{/* Recent Work Requests Table */}
				<Grid
					item
					xs={12}
				>
					<Typography
						variant='h6'
						fontWeight='bold'
						sx={{ mb: 3 }}
					>
						Recent Job Orders
					</Typography>

					<DataTable<JobOrder>
						columns={columns}
						rows={jobOrders}
						actions={actions}
					/>

					<JobOrderDialog
						viewOrder={viewOrder}
						handleClose={handleViewClose}
						handlePrint={handlePrint}
					/>
				</Grid>
			</Grid>
		</Box>
	);
}
