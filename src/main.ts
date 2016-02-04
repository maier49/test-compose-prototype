import { gridFactory, Row, Grid, Store, ColumnDef, GridOptions, GridFactory } from './grid';
import { pagination } from './pagination';
import { editor } from './editor';
import { decorator } from './decorator';
import selection, { Selection } from './selection';
import { cellSelection } from './cellSelection';
import compose from 'dojo-compose/compose';
import { before } from 'dojo-compose/aspect';

const columns = [
	{
		name: 'First Name',
		field: 'first',
		renderCell: function(item: { first: string, last: string }) {
			return <Element> null;
		}
	},
	{ name: 'Last Name', field: 'last' }
];

const store: Store<{ first: string, last: string }> = {
	data: []
};

const selectionGridFactory = gridFactory.mixin({ base: selection });
const paginatedGridFactory = gridFactory.mixin(pagination);
const editorFactory = gridFactory.mixin(editor);
const paginatedEditorDecoratorGridFactory = gridFactory
	.mixin(pagination)
	.mixin(editor)
	.mixin(decorator);
const cellSelectionFactory = gridFactory.extend(cellSelection);

// Switch data declarations to see compilation failure because the type of data
// doesn't match the type of the grid inferred from the store argument.
const data = [
	{ first: 'Bob', last: 'The Builder' },
	{ first: 'Homer', last: 'Simpson' },
	{ first: 'Tom', last: 'Hanks' }
];

//const data = [
//	{ first: 'Bob'},
//	{ first: 'Homer'},
//	{ first: 'Tom'},
//];

const basicGrid = selectionGridFactory({
	domNode: document.body.querySelector('#grid'),
	columns: columns,
	store: store});
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


