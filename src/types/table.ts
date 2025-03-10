import { JSX } from 'react';

export interface Column<T> {
	id: keyof T;
	label: string;
	render?: (row: T) => JSX.Element | string;
}

export interface Actions<T> {
	view?: (row: T) => void;
	edit?: (row: T) => void;
	delete?: (row: T) => void;
}

export interface DataTableProps<T> {
	columns: Column<T>[];
	rows: T[];
	actions?: Actions<T>;
}

export interface Service {
	id: string;
	title: string;
	description: string;
	category: string;
	amount: number;
}
