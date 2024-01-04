import { BehaviorSubject, filter, map, firstValueFrom, Observable } from "rxjs";

export class Store<T> {
  #state = new BehaviorSubject<T | null>(null);
  state$ = this.#state.pipe(filter((state) => !!state)) as Observable<T>;

  constructor() {
    console.log("Store.constructor()");
  }

  setState(newState: T) {
    console.log("Store.setState()", {
      current: this.#state.value,
      new: newState,
    });
    this.#state.next(newState!);
  }

  patchState(newState: Partial<T>) {
    this.setState({
      ...this.#state.value,
      ...newState,
    } as T);
  }

  once<K extends keyof T>(key: K, fallback?: any) {
    const filterFn = fallback ? () => true : (state: T) => !!state;
    return firstValueFrom(
      this.state$.pipe(
        filter(filterFn),
        map((state) => state![key] ?? fallback)
      )
    );
  }
}
