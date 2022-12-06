import { ConfigurationGetOptions } from './types/configuration.type';
import { ConfigurationDocument } from './schemas/configuration.schema';
import {
  CacheStore,
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { isNaN, isNull, isUndefined } from 'lodash';
import { CacheBuilder } from 'src/common';

@Injectable()
export class ConfigurationService {
  constructor(
    @InjectModel(ConfigurationDocument.name)
    private readonly configurationModel: Model<ConfigurationDocument>,

    @Inject(CACHE_MANAGER)
    private readonly cacheMemoryStore: CacheStore,
  ) {}

  /**
   * Lưu một giá trị vào database
   * @param key
   * @param data
   */
  async set<T = any>(key: string, data): Promise<T> {
    const { value } = await this.configurationModel.findOneAndUpdate<{
      value: T;
    }>({ key }, { $set: { value: data } }, { new: true, upsert: true });

    if (isUndefined(value) || isNaN(value) || isNull(value)) {
      throw new NotFoundException('Configuration not found');
    }

    return value;
  }

  /**
   * Lấy một giá trị vào database
   * Nếu cờ cache bằng true sẽ lấy từ RAM và làm mới theo TTL
   * @param key
   * @param options
   */
  async get<T = any>(
    key: string,
    options?: ConfigurationGetOptions<T>,
  ): Promise<T> {
    const { cache, ttl, defaultValue } = options || {};
    const builder = new CacheBuilder();

    //- Khởi tạo func lấy dữ liệu nếu không có trong cache
    const callback = async () => {
      const { value } =
        (await this.configurationModel.findOne<{ value: T }>({ key })) || {};

      return value || defaultValue;
    };

    //- Nếu không cache thì lấy luôn từ database
    if (!cache) return await callback();

    //- Lấy từ trong cache (Nếu chưa có TTL thì đặt mặc định bằng 1)
    const value = await builder
      .store(this.cacheMemoryStore)
      .from(key)
      .callback(callback)
      .ttl(ttl || 1) //> Mặc định là cache 1 giây
      .build<T>();

    return value || defaultValue;
  }

  /**
   * Xóa dữ liêu trong database
   * @param key
   */
  async del(key: string) {
    return this.configurationModel.deleteOne({ key });
  }
}
