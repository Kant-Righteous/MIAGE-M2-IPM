import { ObservableSubject } from '../model/ObservableSubject.js'

class OrderSubmissionState {
  edit(context) {
    context.transitionTo(new EditingOrderState())
  }

  submit(context, draft, execute) {
    const result = execute(draft)
    context.transitionTo(result.valid
      ? new AcceptedOrderState(result)
      : new RejectedOrderState(result))
    return result
  }
}

class EditingOrderState extends OrderSubmissionState {
  edit() {}

  getSnapshot() {
    return { status: 'editing', result: null }
  }
}

class RejectedOrderState extends OrderSubmissionState {
  #result

  constructor(result) {
    super()
    this.#result = result
  }

  getSnapshot() {
    return { status: 'rejected', result: this.#result }
  }
}

class AcceptedOrderState extends OrderSubmissionState {
  #result

  constructor(result) {
    super()
    this.#result = result
  }

  submit() {
    return this.#result
  }

  getSnapshot() {
    return { status: 'accepted', result: this.#result }
  }
}

export class OrderSubmission {
  #state = new EditingOrderState()
  #subject = new ObservableSubject(this.#state.getSnapshot())

  getSnapshot = () => this.#subject.getSnapshot()

  subscribe = (observer) => this.#subject.subscribe(observer)

  transitionTo(state) {
    this.#state = state
    this.#subject.update(state.getSnapshot())
  }

  edit() {
    this.#state.edit(this)
  }

  submit(draft, execute) {
    return this.#state.submit(this, draft, execute)
  }
}
