export interface Source<T> {
  readonly value: T
  readonly url: URL
  readonly description: string
  isValid(): boolean
}

export class ValidUntilSource<T> implements Source<T> {
  _value: T
  url: URL
  description: string
  validUntil: Date

  constructor(value: T, url: URL, description: string, validUntil: Date) {
    this._value = value
    this.url = url
    this.description = description
    this.validUntil = validUntil
  }

  isValid(): boolean {
    return new Date() > this.validUntil
  }

  get value(): T {
    if (!this.isValid()) {
      console.warn(`Stale source ${this}`)
    }

    return this._value
  }
}
