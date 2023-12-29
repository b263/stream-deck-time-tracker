import { BehaviorSubject, filter, map, firstValueFrom } from "rxjs";

export type StateMutator<T> = (state: T) => T;

export class Store<T> {
  #state = new BehaviorSubject<T | null>(null);
  state$ = this.#state.pipe(filter((state) => !!state));

  setState(newState: T | StateMutator<T>) {
    console.log("Store.setState()", {
      current: this.#state.value,
      new: newState,
    });
    let updatedState;
    if (typeof newState === "function") {
      updatedState = (newState as StateMutator<T>)(this.#state.value!);
    } else {
      updatedState = newState;
    }
    this.#state.next(updatedState!);
  }

  patchState(newState: Partial<T>) {
    this.setState({
      ...this.#state.value,
      ...newState,
    } as T);
  }

  select(selector: keyof T | ((state: any) => any)) {
    if (typeof selector === "string") {
      selector = (_) => _[selector];
    }
    return this.state$.pipe(map(selector as (state: any) => any));
  }

  once(key: keyof T) {
    return firstValueFrom(
      this.state$.pipe(
        filter((state) => !!state),
        map((state) => state?.[key])
      )
    );
  }
}
