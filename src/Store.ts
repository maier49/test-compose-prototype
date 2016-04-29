/**
 * A dummy store interface to demonstrate the ability to share a generic item type between the store and the grid.
 */
interface Store<I> {
	data: I[];
}
export default Store;

