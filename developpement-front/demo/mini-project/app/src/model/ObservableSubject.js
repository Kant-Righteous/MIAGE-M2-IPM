export class ObservableSubject {
  #snapshot
  #observers = new Set()

  constructor(snapshot) {
    this.#snapshot = snapshot
  }

  getSnapshot = () => this.#snapshot

  subscribe = (observer) => {
    this.#observers.add(observer)
    return () => this.#observers.delete(observer)
  }

  update(snapshot) {
    if (Object.is(this.#snapshot, snapshot)) return
    this.#snapshot = snapshot
    for (const observer of [...this.#observers]) {
      observer()
    }
  }
}
