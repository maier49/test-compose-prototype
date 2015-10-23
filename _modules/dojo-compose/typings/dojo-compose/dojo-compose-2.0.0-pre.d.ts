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
	export interface GenericClass<T> {
	    new (...args: any[]): T;
	    prototype: T;
	}
	export interface ComposeInitializationFunction<O> {
	    (options?: O): void;
	}
	export interface ComposeClass<O, T> {
	    extend<U>(extension: U): ComposeClass<O, T & U>;
	}
	export interface Compose {
	    extend<O, A, B>(base: ComposeClass<O, A>, extension: B): ComposeClass<O, A & B>;
	}
	export interface ComposeClass<O, T> {
	    mixin<P, U>(mixin: GenericClass<U>): ComposeClass<O, T & U>;
	    mixin<P, U>(mixin: ComposeClass<P, U>): ComposeClass<O & P, T & U>;
	}
	export interface Compose {
	    mixin<O, A, B>(base: ComposeClass<O, A>, mixin: GenericClass<B>): ComposeClass<O, A & B>;
	    mixin<O, P, A, B>(base: ComposeClass<O, A>, mixin: ComposeClass<P, B>): ComposeClass<O & P, A & B>;
	}
	export interface OverlayFunction<T> {
	    (proto: T): void;
	}
	export interface ComposeClass<O, T> {
	    overlay(overlayFunction: OverlayFunction<T>): ComposeClass<O, T>;
	}
	export interface Compose {
	    overlay<O, A>(base: ComposeClass<O, A>, overlayFunction: OverlayFunction<A>): ComposeClass<O, A>;
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
	export interface GenericFunction<T> {
	    (...args: any[]): T;
	}
	export interface ComposeClass<O, T> {
	    from(base: GenericClass<any>, method: string): ComposeClass<O, T>;
	    from(base: ComposeClass<any, any>, method: string): ComposeClass<O, T>;
	    before(method: string, advice: BeforeAdvice): ComposeClass<O, T>;
	    after<P>(method: string, advice: AfterAdvice<P>): ComposeClass<O, T>;
	    around<P>(method: string, advice: AroundAdvice<P>): ComposeClass<O, T>;
	    aspect(advice: AspectAdvice): ComposeClass<O, T>;
	}
	export interface Compose {
	    from<T extends Function>(base: GenericClass<any>, method: string): T;
	    from<T extends Function>(base: ComposeClass<any, any>, method: string): T;
	    before<T>(base: GenericClass<any>, method: string, advice: BeforeAdvice): GenericFunction<T>;
	    before<T>(base: ComposeClass<any, any>, method: string, advice: BeforeAdvice): GenericFunction<T>;
	    before<T>(method: GenericFunction<T>, advice: BeforeAdvice): GenericFunction<T>;
	    after<T>(base: GenericClass<any>, method: string, advice: AfterAdvice<T>): GenericFunction<T>;
	    after<T>(base: ComposeClass<any, any>, method: string, advice: AfterAdvice<T>): GenericFunction<T>;
	    after<T>(method: GenericFunction<T>, advice: AfterAdvice<T>): GenericFunction<T>;
	    around<T>(base: GenericClass<any>, method: string, advice: AroundAdvice<T>): GenericFunction<T>;
	    around<T>(base: ComposeClass<any, any>, method: string, advice: AroundAdvice<T>): GenericFunction<T>;
	    around<T>(method: GenericFunction<T>, advice: AroundAdvice<T>): GenericFunction<T>;
	    aspect<O, A>(base: ComposeClass<O, A>, advice: AspectAdvice): ComposeClass<O, A>;
	}
	export interface ComposeClass<O, T> {
	    new (options?: O): T;
	    prototype: T;
	}
	export interface Compose {
	    <O, A>(base: GenericClass<A>, initFunction?: ComposeInitializationFunction<O>): ComposeClass<O, A>;
	    <O, A, P>(base: ComposeClass<O, A>, initFunction?: ComposeInitializationFunction<P>): ComposeClass<O & P, A>;
	    <O, A>(base: A, initFunction?: ComposeInitializationFunction<O>): ComposeClass<O, A>;
	    create<O, A>(base: GenericClass<A>, initFunction?: ComposeInitializationFunction<O>): ComposeClass<O, A>;
	    create<O, A, P>(base: ComposeClass<O, A>, initFunction?: ComposeInitializationFunction<P>): ComposeClass<O & P, A>;
	    create<O, A>(base: A, initFunction?: ComposeInitializationFunction<O>): ComposeClass<O, A>;
	} const compose: Compose;
	export default compose;

}
