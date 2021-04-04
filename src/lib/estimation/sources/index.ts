export interface Description {
  title: string
  body?: string
}

export interface PublicationMetadata {
  author: string
  year: number
}

export interface LocalizedDescription {
  en: Description
  de: Description
}

export interface SourceSchema<T> {
  value: T
  url: URL
  description: LocalizedDescription
  valid: boolean
  publicationMetadata?: PublicationMetadata
}

export interface Source<T> {
  readonly value: T
  readonly url: URL
  readonly description: LocalizedDescription
  isValid(): boolean
  toJson(): SourceSchema<T>
}

export class ValidUntilSource<T> implements Source<T> {
  _value: T
  url: URL
  description: LocalizedDescription
  validUntil: Date
  publicationMetadata?: PublicationMetadata

  constructor(
    value: T,
    url: string,
    description: LocalizedDescription,
    validUntil: Date,
    publicationMetaData?,
  ) {
    this._value = value
    this.url = new URL(url)
    this.description = description
    this.validUntil = validUntil
    this.publicationMetadata = publicationMetaData
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
      valid: this.isValid(),
      publicationMetadata: this.publicationMetadata,
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

  static combine<T, A, B>(
    ea: Estimate<A>,
    eb: Estimate<B>,
  ): <T>(f: (a: A, b: B) => T) => Estimate<T>
  static combine<T, A, B, C>(
    ea: Estimate<A>,
    eb: Estimate<B>,
    ec: Estimate<C>,
  ): <T>(f: (a: A, b: B, c: C) => T) => Estimate<T>
  static combine<T, A, B, C, D>(
    ea: Estimate<A>,
    eb: Estimate<B>,
    ec: Estimate<C>,
    ed: Estimate<D>,
  ): <T>(f: (a: A, b: B, c: C, d: D) => T) => Estimate<T>

  static combine<T, A, B, C, D, E>(
    ea: Estimate<A>,
    eb: Estimate<B>,
    ec: Estimate<C>,
    ed: Estimate<D>,
    ee: Estimate<E>,
  ): <T>(f: (a: A, b: B, c: C, d: D, e: E) => T) => Estimate<T>

  static combine<T, A, B, C, D, E, F>(
    ea: Estimate<A>,
    eb: Estimate<B>,
    ec: Estimate<C>,
    ed: Estimate<D>,
    ee: Estimate<E>,
    ef: Estimate<F>,
  ): <T>(f: (a: A, b: B, c: C, d: D, e: E, f: F) => T) => Estimate<T>

  static combine<T>(...estimates: Estimate<any>[]): (f: (...xs: any[]) => T) => Estimate<T> {
    return f =>
      new Estimate(f(...estimates.map(e => e.value)), estimates.map(e => e.sources).flat())
  }
}
