import { ComposeFactory } from 'dojo-compose/compose';
export interface Row {
	element?: Element,
	data?: {}
}

export interface Store<I> {
	data: I[];
}

export interface Cell {
	element?: Element,
	row?: Row,
	column: {}
}

export interface ColumnDef<T> {
	name: string,
	field: string,
	renderCell?: (item: T) => Element
}

export class Grid<T> {
	domNode: Element;
	gridNode: Element;
	columns: ColumnDef<T>[];

	render(data: T[]): void {
		let child: Node;
		while ((child = this.gridNode.firstChild)) {
			this.gridNode.removeChild(child);
		}

		this.gridNode.appendChild(this.renderHeader());
		data.forEach(function (item: T) {
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

	renderRow(item: T) {
		let row = document.createElement('tr');
		this.columns.forEach(function (column: { name: string, field: string }) {
			let td = document.createElement('td');
			td.textContent = (<any> item)[column.field];
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

function gridInit<T>(grid: Grid<T>, options: {
	[ index: string ]: any,
	columns?: ColumnDef<T>[],
	store?: Store<T>
}) {
	grid.domNode = options[ 'domNode' ] || document.createElement('div');
	const table = document.createElement('table');
	grid.domNode.appendChild(table);
	grid.gridNode = table;
	grid.columns = options.columns || [];
}

export const grid = {
	base: Grid,
	initializer: gridInit
};
