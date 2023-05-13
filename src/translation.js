const translationMap = new Map([
   ['store', 'Магазин'],
   ['wallpaper_base', 'Основа обоев'],
   ['wallpaper_covering', 'Покрытие обоев'],
   ['wallpaper_description', 'Описание обоев'],
])

export const t = key => translationMap.get(key) ?? key
