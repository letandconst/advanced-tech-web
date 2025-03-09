export interface WorkRequested {
	title: string;
	amount: number;
}

export interface OilsAndFuels {
	qty: number;
	name: string;
	amount: number;
}

export interface Parts {
	qty: number;
	name: string;
	amount: number;
}

export interface JobOrder {
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
