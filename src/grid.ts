import compose, {
	ComposeFactory,
	ComposeMixinable,
	ComposeMixinDescriptor,
	ComposeInitializationFunction,
	GenericClass
} from 'dojo-compose/compose';
import Store from './Store';

export interface Row {
	element: Element,
	data?: {}
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

export interface GridOptions<T> {
	[ index: string ]: any,
	columns?: ColumnDef<T>[],
	store?: Store<T>
}

/**
 * The BaseGridFactory and GridFactory methods provide the ability to add mixins to and extend the base Grid factory
 * without losing the ability to use generics.
 */
export interface BaseGridFactory<O> {
	<P>(options?: GridOptions<P>): Grid<P>;
	mixin<U, P>(mixin: ComposeMixinable<U, P>): GridFactory<U, O & P>;
	mixin<U, P>(mixin: ComposeMixinDescriptor<Grid<any>, O, U, P>): GridFactory<U, O & P>;
}

export interface GridFactory<T, O> extends ComposeFactory<T, O> {
	<P>(options?: GridOptions<P>): Grid<P> & T;
	mixin<U, P>(mixin: ComposeMixinable<U, P>): GridFactory<T & U, O & P>;
	mixin<U, P>(mixin: ComposeMixinDescriptor<T, O, U, P>): GridFactory<T & U, O & P>;
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
			return { element: this.domNode.querySelector('#' + target) };
		} else if (typeof target === 'number') {
			return { element: this.domNode.querySelectorAll('.row')[target] };
		}
	}
}

function gridInit<T>(grid: Grid<T>, options: GridOptions<T>) {
	grid.domNode = options[ 'domNode' ] || document.createElement('div');
	const table = document.createElement('table');
	grid.domNode.appendChild(table);
	grid.gridNode = table;
	grid.columns = options.columns || [];
}

export const gridFactory: BaseGridFactory<GridOptions<any>> = compose(Grid, gridInit);
