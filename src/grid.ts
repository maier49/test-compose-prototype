export interface Row {
	element?: Element,
	data?: {}
}

export interface Cell {
	element?: Element,
	row?: Row,
	column: {}
}

export class Grid {
	domNode: Element;
	gridNode: Element;
	columns: { name: string, field: string }[];

	render(data: { [ index: string ]: string }[]): void {
		let child: Node;
		while ((child = this.gridNode.firstChild)) {
			this.gridNode.removeChild(child);
		}

		this.gridNode.appendChild(this.renderHeader());
		data.forEach(function (item: { [index: string ]: string }) {
			this.gridNode.appendChild(this.renderRow(item));
		}, this);
	}

	renderHeader() {
		const header = document.createElement('thead');
		this.columns.forEach(function (column: { name: string, field: string }) {
			let th = document.createElement('th');
			th.textContent = column.name;
			header.appendChild(th);
		});

		return header;
	}

	renderRow(item: { [ index: string ]: string }) {
		let row = document.createElement('tr');
		this.columns.forEach(function (column: { name: string, field: string }) {
			let td = document.createElement('td');
			td.textContent = item[ column.field ];
			td.classList.add('field-' + column.field);
			row.appendChild(td);
		});

		row.classList.add('row');

		return row;
	}

	row(target: { id?: string } | string | number): Row {
		if (typeof target === 'string') {
			return this.domNode.querySelector('#' + target);
		} else if (typeof target === 'number') {
			return this.domNode.querySelectorAll('.row')[target];
		}
	}
}

function gridInit(options: { [ index: string ]: any }) {
	this.domNode = options[ 'domNode' ] || document.createElement('div');
	const table = document.createElement('table');
	this.domNode.appendChild(table);
	this.gridNode = table;
	this.columns = options['columns'] || {};
}

export const grid = {
	base: Grid,
	initializer: gridInit
};
