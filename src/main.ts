import { grid, Row, Grid, Store, ColumnDef } from './grid';
import { pagination } from './pagination';
import { editor } from './editor';
import { decorator } from './decorator';
import selection, { Selection } from './selection';
import { cellSelection } from './cellSelection';
import compose from 'dojo-compose/compose';
import { before } from 'dojo-compose/aspect';

const columns: ColumnDef<{ first: string, last: string }>[] = [
	{
		name: 'First Name',
		field: 'first',
		renderCell: function(item: { first: string, last: string }) {
			return <Element> null;
		}
	},
	{ name: 'Last Name', field: 'last' }
];

interface GenericGridSelectionFactory {
	<T>(options: any): Grid<T>&Selection;
}

const gridFactory = compose(grid.base, grid.initializer);
const selectionGridFactory: GenericGridSelectionFactory = gridFactory.extend(selection);
const paginatedGridFactory = gridFactory.mixin(pagination);
const editorFactory = gridFactory.mixin(editor);
const paginatedEditorDecoratorGridFactory = gridFactory
	.mixin(pagination)
	.mixin(editor)
	.mixin(decorator);
const cellSelectionFactory = gridFactory.extend(cellSelection);

const data: {first: string, last: string }[] = [
	{ first: 'Bob', last: 'The Builder' },
	{ first: 'Homer', last: 'Simpson' },
	{ first: 'Tom', last: 'Hanks' }
];

const basicGrid = selectionGridFactory<{ first: string, last: string }>({domNode: document.body.querySelector('#grid'), columns: columns });
basicGrid.render(data);
basicGrid.select(0);

const paginatedGrid = paginatedGridFactory({
	rowsPerPage: 1,
	pageNumber: 1,
	domNode: document.body.querySelector('#paginated'),
	columns: columns
});
paginatedGrid.render(data);

const editorGrid = editorFactory({
	editableFields: [ 'first' ],
	columns: columns,
	domNode: document.body.querySelector('#editor')
});
editorGrid.render(data);

const mixedGrid = paginatedEditorDecoratorGridFactory({
	editableFields: [ 'first' ],
	columns: columns,
	domNode: document.body.querySelector('#combo'),
	rowsPerPage: 1,
	pageNumber: 1,
	fieldsToDecorate: [ 'last' ],
	color: 'red'
});
mixedGrid.render(data);

const cellSelectionGrid = cellSelectionFactory({domNode: document.body.querySelector('#cellSelection'), columns: columns});
cellSelectionGrid.render(data);
const row: Row = {
	element: cellSelectionGrid.domNode.querySelector('.row')
};
cellSelectionGrid.select(0);
// This line now, correctly, doesn't compile
//cellSelectionGrid.select(row);


