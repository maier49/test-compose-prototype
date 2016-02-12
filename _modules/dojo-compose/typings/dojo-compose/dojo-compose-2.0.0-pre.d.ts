declare module 'dojo-compose/aspect' {
	export interface AdvisingFunction extends Function {
	    next: AdvisingFunction;
	    previous: AdvisingFunction;
	}
	export interface DispatchAdvice<T> {
	    before?: BeforeAdvice[];
	    after?: AfterAdvice<T>[];
	    joinPoint: Function;
	}
	export interface BeforeAdvice {
	    (...args: any[]): any[] | void;
	}
	export interface AfterAdvice<T> {
	    (result: T, ...args: any[]): T;
	}
	export interface AroundAdvice<T> {
	    (origFn: GenericFunction<T>): (...args: any[]) => T;
	}
	export enum AdviceType {
	    Before = 0,
	    After = 1,
	    Around = 2,
	}
	export interface GenericFunction<T> {
	    (...args: any[]): T;
	}
	export function before<T>(joinPoint: GenericFunction<T>, advice: BeforeAdvice): GenericFunction<T>;
	export function after<T>(joinPoint: GenericFunction<T>, advice: AfterAdvice<T>): GenericFunction<T>;
	export function around<T>(joinPoint: GenericFunction<T>, advice: AroundAdvice<T>): GenericFunction<T>;

}
declare module 'dojo-compose/compose' {
	import { BeforeAdvice, AfterAdvice, AroundAdvice } from 'dojo-compose/aspect';
	/**
	 * A custom type guard that determines if the value is a ComposeFactory
	 * @param   value The target to check
	 * @returns       Return true if it is a ComposeFactory, otherwise false
	 */
	export function isComposeFactory(value: any): value is ComposeFactory<any, any>;
	export interface GenericClass<T> {
	    new (...args: any[]): T;
	    prototype: T;
	}
	export interface ComposeInitializationFunction<O, T> {
	    (instance: T, options?: O): void;
	}
	export interface ComposeFactory<K, A> {
	    extend<U>(extension: U): ComposeFactory<K, A & U>;
	}
	export interface Compose {
	    extend<O, A, B>(base: ComposeFactory<O, A>, extension: B): ComposeFactory<O, A & B>;
	}
	export interface OverlayFunction<T> {
	    (proto: T): void;
	}
	export interface ComposeFactory<K, A> {
	    overlay(overlayFunction: OverlayFunction<A>): ComposeFactory<K, A>;
	}
	export interface Compose {
	    overlay<O, A>(base: ComposeFactory<O, A>, overlayFunction: OverlayFunction<A>): ComposeFactory<O, A>;
	}
	export interface AspectAdvice {
	    before?: {
	        [method: string]: BeforeAdvice;
	    };
	    after?: {
	        [method: string]: AfterAdvice<any>;
	    };
	    around?: {
	        [method: string]: AroundAdvice<any>;
	    };
	}
	export interface ComposeMixin<O, P, T> {
	    base?: GenericClass<P> | P | ComposeFactory<T, P>;
	    initializer?: ComposeInitializationFunction<O, P>;
	    aspectAdvice?: AspectAdvice;
	}
	export interface ComposeFactory<K, A> {
	    mixin<L, B, T>(mixin: ComposeMixin<T, B, L>): ComposeFactory<K & L, A & B>;
	    mixin<L, M, B, C, T, U>(mixin: ComposeMixin<T, B, L>, secondMixin: ComposeMixin<U, C, M>): ComposeFactory<K & L & M, A & B & C>;
	    mixin<L, M, N, B, C, D, T, U, V>(mixin: ComposeMixin<T, B, L>, secondMixin: ComposeMixin<U, C, M>, thirdMixin: ComposeMixin<V, D, N>): ComposeFactory<K & L & M & N, A & B & C & D>;
	    mixin<L, M, N, O, B, C, D, E, T, U, V, W>(mixin: ComposeMixin<T, B, L>, secondMixin: ComposeMixin<U, C, M>, thirdMixin: ComposeMixin<V, D, N>, fourthMixin: ComposeMixin<W, E, O>): ComposeFactory<K & L & M & N & O, A & B & C & D & E>;
	    mixin<L, M, N, O, P, B, C, D, E, F, T, U, V, W, X>(mixin: ComposeMixin<T, B, L>, secondMixin: ComposeMixin<U, C, M>, thirdMixin: ComposeMixin<V, D, N>, fourthMixin: ComposeMixin<W, E, O>, fifthMixin: ComposeMixin<X, F, P>): ComposeFactory<K & L & M & N & O & P, A & B & C & D & E & F>;
	    mixin<L, M, N, O, P, Q, B, C, D, E, F, G, T, U, V, W, X, Y>(mixin: ComposeMixin<T, B, L>, secondMixin: ComposeMixin<U, C, M>, thirdMixin: ComposeMixin<V, D, N>, fourthMixin: ComposeMixin<W, E, O>, fifthMixin: ComposeMixin<X, F, P>, sixthMixin: ComposeMixin<Y, G, Q>): ComposeFactory<K & L & M & N & O & P & Q, A & B & C & D & E & F & G>;
	    mixin<L, M, N, O, P, Q, R, B, C, D, E, F, G, H, T, U, V, W, X, Y, Z>(mixin: ComposeMixin<T, B, L>, secondMixin: ComposeMixin<U, C, M>, thirdMixin: ComposeMixin<V, D, N>, fourthMixin: ComposeMixin<W, E, O>, fifthMixin: ComposeMixin<X, F, P>, sixthMixin: ComposeMixin<Y, G, Q>, seventhMixin: ComposeMixin<Z, H, R>): ComposeFactory<K & L & M & N & O & P & Q & R, A & B & C & D & E & F & G & H>;
	}
	export interface Compose {
	    mixin<K, L, A, B, T>(base: ComposeFactory<K, A>, mixin: ComposeMixin<T, B, L>): ComposeFactory<K & L, A & B>;
	    mixin<K, L, M, A, B, C, T, U>(base: ComposeFactory<K, A>, mixin: ComposeMixin<T, B, L>, secondMixin: ComposeMixin<U, C, M>): ComposeFactory<K & L & M, A & B & C>;
	    mixin<K, L, M, N, A, B, C, D, T, U, V>(base: ComposeFactory<K, A>, mixin: ComposeMixin<T, B, L>, secondMixin: ComposeMixin<U, C, M>, thirdMixin: ComposeMixin<V, D, N>): ComposeFactory<K & L & M & N, A & B & C & D>;
	    mixin<K, L, M, N, O, A, B, C, D, E, T, U, V, W>(base: ComposeFactory<K, A>, mixin: ComposeMixin<T, B, L>, secondMixin: ComposeMixin<U, C, M>, thirdMixin: ComposeMixin<V, D, N>, fourthMixin: ComposeMixin<W, E, O>): ComposeFactory<K & L & M & N & O, A & B & C & D & E>;
	    mixin<K, L, M, N, O, P, A, B, C, D, E, F, T, U, V, W, X>(base: ComposeFactory<K, A>, mixin: ComposeMixin<T, B, L>, secondMixin: ComposeMixin<U, C, M>, thirdMixin: ComposeMixin<V, D, N>, fourthMixin: ComposeMixin<W, E, O>, fifthMixin: ComposeMixin<X, F, P>): ComposeFactory<K & L & M & N & O & P, A & B & C & D & E & F>;
	    mixin<K, L, M, N, O, P, Q, A, B, C, D, E, F, G, T, U, V, W, X, Y>(base: ComposeFactory<K, A>, mixin: ComposeMixin<T, B, L>, secondMixin: ComposeMixin<U, C, M>, thirdMixin: ComposeMixin<V, D, N>, fourthMixin: ComposeMixin<W, E, O>, fifthMixin: ComposeMixin<X, F, P>, sixthMixin: ComposeMixin<Y, G, Q>): ComposeFactory<K & L & M & N & O & P & Q, A & B & C & D & E & F & G>;
	    mixin<K, L, M, N, O, P, Q, R, A, B, C, D, E, F, G, H, T, U, V, W, X, Y, Z>(base: ComposeFactory<K, A>, mixin: ComposeMixin<T, B, L>, secondMixin: ComposeMixin<U, C, M>, thirdMixin: ComposeMixin<V, D, N>, fourthMixin: ComposeMixin<W, E, O>, fifthMixin: ComposeMixin<X, F, P>, sixthMixin: ComposeMixin<Y, G, Q>, seventhMixin: ComposeMixin<Z, H, R>): ComposeFactory<K & L & M & N & O & P & Q & R, A & B & C & D & E & F & G & H>;
	}
	export interface GenericFunction<T> {
	    (...args: any[]): T;
	}
	export interface ComposeFactory<K, A> {
	    from(base: GenericClass<any>, method: string): ComposeFactory<K, A>;
	    from(base: ComposeFactory<any, any>, method: string): ComposeFactory<K, A>;
	    before(method: string, advice: BeforeAdvice): ComposeFactory<K, A>;
	    after<P>(method: string, advice: AfterAdvice<P>): ComposeFactory<K, A>;
	    around<P>(method: string, advice: AroundAdvice<P>): ComposeFactory<K, A>;
	    aspect(advice: AspectAdvice): ComposeFactory<K, A>;
	}
	export interface Compose {
	    from<T extends Function>(base: GenericClass<any>, method: string): T;
	    from<T extends Function>(base: ComposeFactory<any, any>, method: string): T;
	    before<T>(base: GenericClass<any>, method: string, advice: BeforeAdvice): GenericFunction<T>;
	    before<T>(base: ComposeFactory<any, any>, method: string, advice: BeforeAdvice): GenericFunction<T>;
	    before<T>(method: GenericFunction<T>, advice: BeforeAdvice): GenericFunction<T>;
	    after<T>(base: GenericClass<any>, method: string, advice: AfterAdvice<T>): GenericFunction<T>;
	    after<T>(base: ComposeFactory<any, any>, method: string, advice: AfterAdvice<T>): GenericFunction<T>;
	    after<T>(method: GenericFunction<T>, advice: AfterAdvice<T>): GenericFunction<T>;
	    around<T>(base: GenericClass<any>, method: string, advice: AroundAdvice<T>): GenericFunction<T>;
	    around<T>(base: ComposeFactory<any, any>, method: string, advice: AroundAdvice<T>): GenericFunction<T>;
	    around<T>(method: GenericFunction<T>, advice: AroundAdvice<T>): GenericFunction<T>;
	    aspect<O, A>(base: ComposeFactory<O, A>, advice: AspectAdvice): ComposeFactory<O, A>;
	}
	export interface ComposeFactory<K, A> {
	    (options?: K): A;
	    prototype: A;
	}
	export interface Compose {
	    <O, A>(base: GenericClass<A>, initFunction?: ComposeInitializationFunction<O, A>): ComposeFactory<O, A>;
	    <O, A, P>(base: ComposeFactory<O, A>, initFunction?: ComposeInitializationFunction<P, A>): ComposeFactory<O & P, A>;
	    <O, A>(base: A, initFunction?: ComposeInitializationFunction<O, A>): ComposeFactory<O, A>;
	    create<O, A>(base: GenericClass<A>, initFunction?: ComposeInitializationFunction<O, A>): ComposeFactory<O, A>;
	    create<O, A, P>(base: ComposeFactory<O, A>, initFunction?: ComposeInitializationFunction<P, A>): ComposeFactory<O & P, A>;
	    create<O, A>(base: A, initFunction?: ComposeInitializationFunction<O, A>): ComposeFactory<O, A>;
	} const compose: Compose;
	export default compose;

}
