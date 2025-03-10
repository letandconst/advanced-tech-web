import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Chip, Grid, Box, Card, CardContent, Divider, Table, TableContainer, TableHead, TableCell, TableRow, TableBody, useTheme } from '@mui/material';
import { Print, Notes, CalendarToday } from '@mui/icons-material';
import { JobOrder } from '@/types/jobOrder'; // Adjust path accordingly

interface JobOrderDialogProps {
	viewOrder: JobOrder | null;
	handleClose: () => void;
	handlePrint: (order: JobOrder) => void;
}

const JobOrderDialog = ({ viewOrder, handleClose, handlePrint }: JobOrderDialogProps) => {
	const theme = useTheme();

	if (!viewOrder) return null;

	return (
		<Dialog
			open={Boolean(viewOrder)}
			onClose={handleClose}
			maxWidth='md'
			fullWidth
		>
			<DialogTitle>
				<Box
					display='flex'
					justifyContent='space-between'
					alignItems='center'
				>
					<Typography variant='h6'>Job Order Details</Typography>
					<Chip
						label={viewOrder.status}
						color='primary'
						size='small'
					/>
				</Box>
			</DialogTitle>
			<DialogContent dividers>
				<Grid
					container
					spacing={2}
				>
					<Grid
						item
						xs={12}
						sm={6}
					>
						<Card variant='outlined'>
							<CardContent>
								<Typography
									variant='subtitle1'
									fontWeight='bold'
								>
									Customer Info
								</Typography>
								<Typography variant='body2'>
									<strong>Name:</strong> {viewOrder.customer}
								</Typography>
								<Typography variant='body2'>
									<strong>Phone:</strong> {viewOrder.phone}
								</Typography>
								<Typography variant='body2'>
									<strong>Address:</strong> {viewOrder.address}
								</Typography>
							</CardContent>
						</Card>
					</Grid>

					<Grid
						item
						xs={12}
						sm={6}
					>
						<Card variant='outlined'>
							<CardContent>
								<Typography
									variant='subtitle1'
									fontWeight='bold'
								>
									Vehicle Info
								</Typography>
								<Typography variant='body2'>
									<strong>Make:</strong> {viewOrder.make}
								</Typography>
								<Typography variant='body2'>
									<strong>Plate:</strong> {viewOrder.plate}
								</Typography>
								<Typography variant='body2'>
									<strong>Mechanic:</strong> {viewOrder.mechanic}
								</Typography>
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

				<Divider sx={{ my: 2 }} />

				<Typography
					variant='h6'
					color='primary'
				>
					<strong>Total:</strong> ₱{viewOrder.total.toLocaleString()}
				</Typography>
			</DialogContent>
			<DialogActions>
				<Button
					variant='outlined'
					startIcon={<Print />}
					onClick={() => handlePrint(viewOrder)}
				>
					Print
				</Button>
				<Button
					variant='contained'
					onClick={handleClose}
				>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default JobOrderDialog;
