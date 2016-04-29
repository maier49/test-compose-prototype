import { gridFactory, Row, Grid, ColumnDef, GridOptions, GridFactory } from './grid';
import Store from './Store';
import paginationMixin from './paginationMixin';
import editorMixin from './editorMixin';
import decoratorMixin from './decoratorMixin';
import selectionMixin, { Selection } from './selectionMixin';
import cellSelectionMixin from './cellSelectionMixin';
import compose from 'dojo-compose/compose';
import { before } from 'dojo-compose/aspect';

const columns = [
	{
		name: 'First Name',
		field: 'first',
	},
	{ name: 'Last Name', field: 'last' }
];

// The store specifies the type of item, and the grid will
// infer the type.
const store: Store<{ first: string, last: string }> = {
	data: []
};

// Implement various factories with different mixins
const selectionGridFactory = gridFactory.mixin(selectionMixin);
const paginatedGridFactory = gridFactory.mixin(paginationMixin);
const editorFactory = gridFactory.mixin(editorMixin);
const paginatedEditorDecoratorGridFactory = gridFactory
	.mixin(paginationMixin)
	.mixin(editorMixin)
	.mixin(decoratorMixin);
const cellSelectionFactory = gridFactory.mixin(cellSelectionMixin);

// Switch data declarations to see compilation failure because the type of data
// doesn't match the type the grid inferred from the store argument.
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


// Initialize a basic grid with the ability to select rows programatically
const basicGrid = selectionGridFactory({
	domNode: document.body.querySelector('#grid'),
	columns: columns,
	store: store});
basicGrid.render(data);
// This selects the first row, setting the background color
basicGrid.select(0);

// Initialize a grid with pagination
const paginatedGrid = paginatedGridFactory({
	rowsPerPage: 1,
	pageNumber: 1,
	domNode: document.body.querySelector('#paginated'),
	columns: columns
});
paginatedGrid.render(data);

// Initialize a grid that allows the first name field to be edited
const editorGrid = editorFactory({
	editableFields: [ 'first' ],
	columns: columns,
	domNode: document.body.querySelector('#editor')
});
editorGrid.render(data);

// Initialize a grid with multiple additional pieces of functionality mixed in
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

// Initialize a grid that allows individual cells to be selected
const cellSelectionGrid = cellSelectionFactory({domNode: document.body.querySelector('#cellSelection'), columns: columns});
cellSelectionGrid.render(data);
const row: Row = {
	element: cellSelectionGrid.domNode.querySelector('.row')
};
// This selects the first cell and changes the background color
cellSelectionGrid.select(0);
// This line now, correctly, doesn't compile
//cellSelectionGrid.select(row);


