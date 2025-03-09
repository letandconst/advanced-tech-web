import { useState } from 'react';
import { JobOrder } from '@/types/jobOrder'; // Adjust this path to your JobOrder type

export const useJobOrderModal = () => {
	const [viewOrder, setViewOrder] = useState<JobOrder | null>(null);

	const handleViewOpen = (order: JobOrder) => {
		setViewOrder(order);
	};

	const handleViewClose = () => {
		setViewOrder(null);
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

	return { viewOrder, handleViewOpen, handleViewClose, handlePrint };
};
