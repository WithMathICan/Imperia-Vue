const translationMap = new Map([
   ['store', 'Магазин'],
   ['wallpaper_base', 'Основа обоев'],
   ['wallpaper_covering', 'Покрытие обоев'],
   ['product_type', 'Тип товара'],
   ['wallpaper_description', 'Описание обоев'],
   ['expires', 'Время окончания валидности'],
   ['manufacturer', 'Производитель'],
   ['title', 'Название'],
   ['alias', 'Идентификатор'],
   ['product_type_id', 'Тип товара']
])

export const t = key => translationMap.get(key) ?? key
