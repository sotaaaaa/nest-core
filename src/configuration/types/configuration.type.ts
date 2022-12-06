export type ConfigurationGetOptions<T> = {
  cache?: boolean;
  ttl?: number;
  defaultValue?: T;
};
