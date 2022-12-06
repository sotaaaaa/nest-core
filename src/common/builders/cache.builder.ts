import { CacheStore } from '@nestjs/common';

interface Builder {
  store(cache: CacheStore): void;
  from(key: string): void;
  callback<T = any>(func: () => Promise<T> | T): void;
  ttl?(ttl: number): void;
  build<T = any>(): Promise<T>;
}

export class CacheBuilder implements Builder {
  protected cacheStore: CacheStore;
  protected func: () => any;
  protected timeRefresh: any; //- Default bằng 3
  protected response: any;
  protected keyCache: string;

  constructor() {
    this.reset();
  }

  public store(cache: CacheStore): CacheBuilder {
    this.cacheStore = cache;

    return this;
  }

  public from(key: string): CacheBuilder {
    this.keyCache = key;
    return this;
  }

  public callback(func: () => any): CacheBuilder {
    if (typeof func != 'function') throw new Error('Callback not is function');
    this.func = func;
    return this;
  }

  public ttl(ttl: number): CacheBuilder {
    this.timeRefresh = ttl;
    return this;
  }

  public async build<T>(): Promise<T> {
    this.response = await this.cacheStore.get(this.keyCache);
    if (this.response) return this.response;
    const newData = (await this.func()) as T;

    await this.cacheStore.set(this.keyCache, newData, {
      ttl: this.timeRefresh,
    });
    return newData as T;
  }

  public reset() {
    this.cacheStore = null;
    this.func = null;
    this.timeRefresh = 3;
    this.response = null;
    this.keyCache = null;
  }
}
