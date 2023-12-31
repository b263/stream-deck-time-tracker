import { BehaviorSubject, filter, map, firstValueFrom } from "rxjs";

export class Store<T> {
  #state = new BehaviorSubject<T | null>(null);
  state$ = this.#state.pipe(filter((state) => !!state));

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

  once<K extends keyof T>(key: K) {
    return firstValueFrom(
      this.state$.pipe(
        filter((state) => !!state),
        map((state) => state![key])
      )
    );
  }
}
