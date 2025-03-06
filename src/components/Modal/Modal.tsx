import React, { ReactNode } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface ModalProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	children: ReactNode;
	confirmText?: string;
	cancelText?: string;
}

export default function ModalComponent(props: ModalProps) {
	const { open, onClose, onConfirm, title, children, confirmText = 'Save', cancelText = 'Cancel' } = props;

	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullWidth
			maxWidth='sm'
		>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent dividers>{children}</DialogContent>
			<DialogActions>
				<Button
					onClick={onClose}
					color='secondary'
				>
					{cancelText}
				</Button>
				<Button
					onClick={onConfirm}
					color='primary'
					variant='contained'
				>
					{confirmText}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
