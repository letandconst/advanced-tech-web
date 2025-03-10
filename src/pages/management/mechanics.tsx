import { useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton } from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';

interface Mechanic {
	id: number;
	name: string;
	image: string;
	address: string;
	phone: string;
	remarks: string;
}

const Mechanics = () => {
	const [mechanics, setMechanics] = useState<Mechanic[]>([]);
	const [open, setOpen] = useState(false);
	const [viewOpen, setViewOpen] = useState(false);
	const [editing, setEditing] = useState<Mechanic | null>(null);
	const [viewing, setViewing] = useState<Mechanic | null>(null);
	const [name, setName] = useState('');
	const [image, setImage] = useState('');
	const [address, setAddress] = useState('');
	const [phone, setPhone] = useState('');
	const [remarks, setRemarks] = useState('');

	const handleOpen = (mechanic?: Mechanic) => {
		if (mechanic) {
			setEditing(mechanic);
			setName(mechanic.name);
			setImage(mechanic.image);
			setAddress(mechanic.address);
			setPhone(mechanic.phone);
			setRemarks(mechanic.remarks);
		} else {
			setEditing(null);
			setName('');
			setImage('');
			setAddress('');
			setPhone('');
			setRemarks('');
		}
		setOpen(true);
	};

	const handleClose = () => setOpen(false);
	const handleViewClose = () => setViewOpen(false);

	const handleSave = () => {
		if (editing) {
			setMechanics((prev) => prev.map((m) => (m.id === editing.id ? { ...m, name, image, address, phone, remarks } : m)));
		} else {
			setMechanics((prev) => [...prev, { id: Date.now(), name, image, address, phone, remarks }]);
		}
		handleClose();
	};

	const handleDelete = (id: number) => {
		setMechanics((prev) => prev.filter((m) => m.id !== id));
	};

	const handleView = (mechanic: Mechanic) => {
		setViewing(mechanic);
		setViewOpen(true);
	};

	return (
		<Box>
			<Typography
				variant='h4'
				gutterBottom
			>
				Mechanics Management
			</Typography>
			<Button
				variant='contained'
				startIcon={<Add />}
				onClick={() => handleOpen()}
			>
				Add Mechanic
			</Button>
			<TableContainer
				component={Paper}
				sx={{ marginTop: 2 }}
			>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>Image</TableCell>
							<TableCell>Address</TableCell>
							<TableCell>Phone</TableCell>
							<TableCell>Remarks</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{mechanics.map((mechanic) => (
							<TableRow key={mechanic.id}>
								<TableCell>{mechanic.name}</TableCell>
								<TableCell>
									{/* <img
										src={mechanic.image}
										alt={mechanic.name}
										width={50}
										height={50}
									/> */}
								</TableCell>
								<TableCell>{mechanic.address}</TableCell>
								<TableCell>{mechanic.phone}</TableCell>
								<TableCell>{mechanic.remarks}</TableCell>
								<TableCell>
									<IconButton
										color='primary'
										onClick={() => handleView(mechanic)}
									>
										<Visibility />
									</IconButton>
									<IconButton
										color='primary'
										onClick={() => handleOpen(mechanic)}
									>
										<Edit />
									</IconButton>
									<IconButton
										color='error'
										onClick={() => handleDelete(mechanic.id)}
									>
										<Delete />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Dialog for Add/Edit Mechanic */}
			<Dialog
				open={open}
				onClose={handleClose}
				fullWidth
				maxWidth='sm'
			>
				<DialogTitle>{editing ? 'Edit Mechanic' : 'Add Mechanic'}</DialogTitle>
				<DialogContent>
					<TextField
						label='Name'
						fullWidth
						margin='normal'
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<TextField
						label='Image URL'
						fullWidth
						margin='normal'
						value={image}
						onChange={(e) => setImage(e.target.value)}
					/>
					<TextField
						label='Address'
						fullWidth
						margin='normal'
						value={address}
						onChange={(e) => setAddress(e.target.value)}
					/>
					<TextField
						label='Phone Number'
						fullWidth
						margin='normal'
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
					/>
					<TextField
						label='Remarks'
						fullWidth
						margin='normal'
						value={remarks}
						onChange={(e) => setRemarks(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={handleClose}
						color='secondary'
					>
						Cancel
					</Button>
					<Button
						onClick={handleSave}
						variant='contained'
					>
						{editing ? 'Update' : 'Save'}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Dialog for Viewing Mechanic Details */}
			<Dialog
				open={viewOpen}
				onClose={handleViewClose}
				fullWidth
				maxWidth='sm'
			>
				<DialogTitle>Mechanic Details</DialogTitle>
				<DialogContent>
					{viewing && (
						<>
							<Typography>Name: {viewing.name}</Typography>
							{/* <img
								src={viewing.image}
								alt={viewing.name}
								width={100}
								height={100}
							/> */}
							<Typography>Address: {viewing.address}</Typography>
							<Typography>Phone: {viewing.phone}</Typography>
							<Typography>Remarks: {viewing.remarks}</Typography>
						</>
					)}
				</DialogContent>
				<DialogActions>
					<Button
						onClick={handleViewClose}
						color='secondary'
					>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default Mechanics;
