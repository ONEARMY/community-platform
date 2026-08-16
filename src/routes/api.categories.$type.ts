import { HTTPException } from 'hono/http-exception';
import type { ContentType, DBCategory } from 'oa-shared';
import { Category } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { data } from 'react-router';
import { isProductionEnvironment } from 'src/config/config';
import { logger } from 'src/logger';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { categoriesCache as cache } from 'src/services/categoryService.server';
import { validationError } from 'src/utils/httpException';

const filterByType = (categories: Category[], type: ContentType) => {
  return categories.filter((category) => category.type === type);
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const type = params.type as ContentType;
  const { client, headers } = createSupabaseServerClient(request);

  try {
    if (!type) {
      throw validationError('type is required');
    }

    const cachedCategories = await cache.get('categories');

    if (
      cachedCategories &&
      Array.isArray(cachedCategories) &&
      cachedCategories.length &&
      isProductionEnvironment()
    ) {
      const categoriesForType = filterByType(cachedCategories, type);
      return data(categoriesForType, { headers, status: 200 });
    }

    const categoriesResult = await client
      .from('categories')
      .select('id,name,created_at,type,image_url,description');

    const categories = categoriesResult.data?.map((category) =>
      Category.fromDB(category as DBCategory),
    );

    if (categories && categories.length > 0) {
      cache.set('categories', categories, 3600000);
    }

    const categoriesForType = categories ? filterByType(categories, type) : [];

    return data(categoriesForType, { headers, status: 200 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    logger.error('Error loading categories:', error);
    return data({ error: 'Error loading categories', status: 500 }, { status: 500 });
  }
}
