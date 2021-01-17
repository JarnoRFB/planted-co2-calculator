export interface SourceSchema<T> {
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

  constructor(value: T, url: string, description: string, validUntil: Date) {
    this._value = value
    this.url = new URL(url)
    this.description = description
    this.validUntil = validUntil
  }

  isValid(): boolean {
    return new Date() < this.validUntil
  }

  get value(): T {
    if (!this.isValid()) {
      console.warn(`Stale source ${JSON.stringify(this)}`)
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

export class Estimate<A> {
  readonly value: A
  readonly sources: Source<any>[]

  constructor(value: A, sources: Source<any>[]) {
    this.value = value
    this.sources = sources
  }

  static of<A>(source: Source<A>) {
    return new Estimate<A>(source.value, [source])
  }

  map<B>(f: (a: A) => B): Estimate<B> {
    const newValue = f(this.value)
    return new Estimate(newValue, this.sources)
  }

  map2<B, C>(estimate1: Estimate<B>, fabc: (a: A, b: B) => C): Estimate<C> {
    const newValue = fabc(this.value, estimate1.value)
    return new Estimate(newValue, this.sources.concat(estimate1.sources))
  }

  isValid(): boolean {
    return this.sources.every(x => x.isValid())
  }

  exportSources(): SourceSchema<any>[] {
    return this.sources.map(x => x.toJson())
  }

  static combine<A, B, C>(a: Estimate<A>, b: Estimate<B>, f: (a: A, b: B) => C): Estimate<C> {
    return a.map2(b, f)
  }
}
