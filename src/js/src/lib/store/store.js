import { BehaviorSubject, filter, map, firstValueFrom } from "rxjs";

export class Store {
  #state = new BehaviorSubject(null);
  state$ = this.#state.pipe(filter((state) => !!state));

  setState(newState) {
    console.log("Store.setState()", {
      current: this.#state.value,
      new: newState,
    });
    const updatedState =
      typeof newState === "function" ? newState.call(null, newState) : newState;
    this.#state.next(updatedState);
  }

  patchState(newState) {
    this.setState({
      ...this.#state.value,
      ...newState,
    });
  }

  select(selector) {
    if (typeof selector === "string") {
      selector = (_) => _[selector];
    }
    return this.state$.pipe(map(selector));
  }

  once(selector = (_) => _) {
    const mapFn = typeof selector === "string" ? (_) => _[selector] : selector;
    return firstValueFrom(this.state$.pipe(map(mapFn)));
  }
}
