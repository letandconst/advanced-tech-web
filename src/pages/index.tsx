'use client';

import React from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, IconButton, Tooltip, Avatar, useTheme, useMediaQuery } from '@mui/material';
import { MoreHoriz as MoreHorizIcon, Visibility as VisibilityIcon, ArrowUpward as ArrowUpwardIcon, ArrowDownward as ArrowDownwardIcon, DirectionsCar as CarIcon, Person as PersonIcon, Build as BuildIcon } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

// Create sample data for work requests
interface WorkRequest {
	id: number;
	customer: string;
	car: string;
	plateNumber: string;
	workRequested: string;
	assignedMechanic: string;
	status: 'Pending' | 'In Progress' | 'Completed';
	totalCost: number;
}

const workRequests: WorkRequest[] = [
	{
		id: 1,
		customer: 'John Smith',
		car: 'Toyota Camry',
		plateNumber: 'ABC-123',
		workRequested: 'Oil Change & Filter Replacement',
		assignedMechanic: 'Mike Johnson',
		status: 'Completed',
		totalCost: 89.99,
	},
	{
		id: 2,
		customer: 'Sarah Williams',
		car: 'Honda Civic',
		plateNumber: 'XYZ-789',
		workRequested: 'Brake Pad Replacement',
		assignedMechanic: 'Robert Chen',
		status: 'In Progress',
		totalCost: 249.5,
	},
	{
		id: 3,
		customer: 'Michael Brown',
		car: 'Ford F-150',
		plateNumber: 'DEF-456',
		workRequested: 'Engine Diagnostic',
		assignedMechanic: 'Unassigned',
		status: 'Pending',
		totalCost: 120.0,
	},
	{
		id: 4,
		customer: 'Emily Johnson',
		car: 'Nissan Altima',
		plateNumber: 'GHI-789',
		workRequested: 'Transmission Fluid Change',
		assignedMechanic: 'James Wilson',
		status: 'In Progress',
		totalCost: 179.95,
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

// Helper function to get status chip color
const getStatusColor = (status: string) => {
	switch (status) {
		case 'Pending':
			return 'warning';
		case 'In Progress':
			return 'info';
		case 'Completed':
			return 'success';
		default:
			return 'default';
	}
};

// Clock component
function Clock() {
	const [time, setTime] = React.useState(new Date());

	React.useEffect(() => {
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
	icon: React.ReactNode;
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
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

	const handleViewDetail = (id: number) => {
		console.log(`View details for request ID: ${id}`);
		// In a real application, this would navigate to a detail page
	};

	// Mock user data
	const userName = 'John';

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
									Welcome, {userName}!
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
					<Paper
						elevation={2}
						sx={{ p: 3, borderRadius: 2 }}
					>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
							<Typography
								variant='h6'
								fontWeight='bold'
							>
								Recent Work Requests
							</Typography>
							<Button
								variant='contained'
								endIcon={<MoreHorizIcon />}
								color='primary'
								size='small'
								sx={{ borderRadius: 2 }}
							>
								View All
							</Button>
						</Box>
						<TableContainer
							sx={{
								maxHeight: 400,
								'&::-webkit-scrollbar': {
									width: '8px',
									height: '8px',
								},
								'&::-webkit-scrollbar-thumb': {
									backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
									borderRadius: '4px',
								},
								'&::-webkit-scrollbar-track': {
									backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
								},
							}}
						>
							<Table
								stickyHeader
								aria-label='work requests table'
							>
								<TableHead>
									<TableRow>
										<TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
										{!isSmall && <TableCell sx={{ fontWeight: 'bold' }}>Car / Plate</TableCell>}
										<TableCell sx={{ fontWeight: 'bold' }}>Work Requested</TableCell>
										{!isMobile && <TableCell sx={{ fontWeight: 'bold' }}>Mechanic</TableCell>}
										<TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
										<TableCell
											align='right'
											sx={{ fontWeight: 'bold' }}
										>
											Total
										</TableCell>
										<TableCell
											align='center'
											sx={{ fontWeight: 'bold' }}
										>
											Action
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{workRequests.map((request) => (
										<TableRow
											key={request.id}
											sx={{
												'&:hover': {
													backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
												},
												transition: 'background-color 0.2s',
											}}
										>
											<TableCell>{request.customer}</TableCell>
											{!isSmall && (
												<TableCell>
													<Typography variant='body2'>{request.car}</Typography>
													<Typography
														variant='caption'
														display='block'
														color='text.secondary'
													>
														{request.plateNumber}
													</Typography>
												</TableCell>
											)}
											<TableCell>
												<Tooltip
													title={request.workRequested}
													arrow
												>
													<Typography
														variant='body2'
														sx={{
															maxWidth: { xs: '120px', sm: '200px', md: '300px' },
															overflow: 'hidden',
															textOverflow: 'ellipsis',
															whiteSpace: 'nowrap',
														}}
													>
														{request.workRequested}
													</Typography>
												</Tooltip>
											</TableCell>
											{!isMobile && <TableCell>{request.assignedMechanic}</TableCell>}
											<TableCell>
												<Chip
													label={request.status}
													// eslint-disable-next-line @typescript-eslint/no-explicit-any
													color={getStatusColor(request.status) as any}
													size='small'
													sx={{ fontWeight: 'medium', borderRadius: '4px' }}
												/>
											</TableCell>
											<TableCell align='right'>&#8369; {request.totalCost.toFixed(2)}</TableCell>
											<TableCell align='center'>
												<Tooltip
													title='View Details'
													arrow
												>
													<IconButton
														color='primary'
														size='small'
														onClick={() => handleViewDetail(request.id)}
														sx={{
															transition: 'transform 0.2s',
															'&:hover': { transform: 'scale(1.1)' },
														}}
													>
														<VisibilityIcon />
													</IconButton>
												</Tooltip>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
}
