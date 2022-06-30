import { Readable } from 'stream';
import { SitemapStream, streamToPromise } from 'sitemap';
import ProductModel from '@models/products';
import NewsModel from '@models/news';
import dayjs from 'dayjs';

class SitemapAction {
  public async create () {
    const products = await ProductModel.scope([
      { method: ['byStatus', ProductModel.STATUS_ENUM.ACTIVE] },
    ]).findAll({ attributes: ['id'] });

    const news = await NewsModel.scope([
      { method: ['byStatus', NewsModel.STATUS_ENUM.ACTIVE] },
    ]).findAll({ attributes: ['id'] });

    const productLinks = products.map((record) => {
      return {
        url: `/san-pham/${record.id}`, changefreq: 'daily', priority: 0.3, lastmod: dayjs().format('YYYY-MM-DD'),
      };
    });
    const newsLinks = news.map((record) => {
      return {
        url: `/tin-tuc/${record.id}`, changefreq: 'daily', priority: 0.3, lastmod: dayjs().format('YYYY-MM-DD'),
      };
    });
    const links = productLinks.concat(newsLinks);
    const stream = new SitemapStream({ hostname: process.env.CLIENT_HOST, lastmodDateOnly: true });
    return streamToPromise(Readable.from(links).pipe(stream)).then((data: any) =>
      data.toString(),
    );
  }
}

export default new SitemapAction();
