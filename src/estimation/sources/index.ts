interface SourceSchema<T> {
  value: T
  url: URL
  description: string
  isStale: boolean
}

export interface Source<T> {
  readonly value: T
  readonly url: URL
  readonly description: string
  isValid(): boolean
  toJson(): SourceSchema<T>
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
    return new Date() < this.validUntil
  }

  get value(): T {
    if (!this.isValid()) {
      console.warn(`Stale source ${this}`)
    }

    return this._value
  }

  toJson(): SourceSchema<T> {
    return {
      value: this._value,
      url: this.url,
      description: this.description,
      isStale: !this.isValid(),
    }
  }
}
