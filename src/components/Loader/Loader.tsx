import { Backdrop, CircularProgress, Typography, Box, useTheme } from '@mui/material';

export default function Loader({ open, message = 'Loading...' }: { open: boolean; message?: string }) {
	const theme = useTheme();

	return (
		<Backdrop
			sx={{
				color: '#fff',
				zIndex: theme.zIndex.drawer + 1,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				width: '100vw',
				height: '100vh',
				backgroundColor: 'rgba(0,0,0,0.7)',
			}}
			open={open}
		>
			<CircularProgress
				color='inherit'
				size={60}
				thickness={4}
			/>

			<Box mt={2}>
				<Typography variant='h6'>{message}</Typography>
			</Box>
		</Backdrop>
	);
}
