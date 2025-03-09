import { Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, IconButton, Typography, Box, alpha, useTheme } from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import { DataTableProps } from '@/types/table';

const DataTable = <T,>({ columns, rows, actions }: DataTableProps<T>) => {
	const theme = useTheme();

	return (
		<Card
			elevation={2}
			sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}
		>
			<TableContainer sx={{ maxHeight: 600 }}>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							{columns.map((col) => (
								<TableCell
									key={String(col.id)}
									sx={{ fontWeight: 'bold', bgcolor: alpha(theme.palette.primary.main, 0.1) }}
								>
									{col.label}
								</TableCell>
							))}
							{actions && <TableCell sx={{ fontWeight: 'bold', bgcolor: alpha(theme.palette.primary.main, 0.1) }}>Actions</TableCell>}
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.length > 0 ? (
							rows.map((row, rowIndex) => (
								<TableRow
									key={rowIndex}
									sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) }, transition: 'background-color 0.2s' }}
								>
									{columns.map((col) => (
										<TableCell key={String(col.id)}>{col.render ? col.render(row) : String(row[col.id])}</TableCell>
									))}
									{actions && (
										<TableCell>
											<Box sx={{ display: 'flex' }}>
												{actions.view && (
													<Tooltip title='View Details'>
														<IconButton
															size='small'
															color='primary'
															onClick={() => actions.view?.(row)}
															sx={{ mr: 1 }}
														>
															<Visibility fontSize='small' />
														</IconButton>
													</Tooltip>
												)}
												{actions.edit && (
													<Tooltip title='Edit'>
														<IconButton
															size='small'
															color='secondary'
															onClick={() => actions.edit?.(row)}
															sx={{ mr: 1 }}
														>
															<Edit fontSize='small' />
														</IconButton>
													</Tooltip>
												)}
												{actions.delete && (
													<Tooltip title='Delete'>
														<IconButton
															size='small'
															color='error'
															onClick={() => actions.delete?.(row)}
														>
															<Delete fontSize='small' />
														</IconButton>
													</Tooltip>
												)}
											</Box>
										</TableCell>
									)}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length + (actions ? 1 : 0)}
									align='center'
									sx={{ py: 3 }}
								>
									<Typography
										variant='body1'
										color='text.secondary'
									>
										No records found
									</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Card>
	);
};

export default DataTable;
