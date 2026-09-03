import React, { useState, useMemo } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Maximize2,
  X,
  Camera,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import { REAL_PORTFOLIO, PortfolioItem } from '../data/siteData';
import { EditableImage, EditableText } from '../editor/Editable';
import { useEditor } from '../editor/EditorContext';
import { useCustomItems, addCustomItem, deleteCustomItem } from '../editor/customItems';
import { PhotoAlbum, AlbumBadge } from '../components/PhotoAlbum';
import { optimizeImageFile } from '../editor/imageCompress';
import type { CustomPortfolioItem } from '../editor/customItems';

interface GalleryPageProps {
  onOpenOrder: (title?: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ onOpenOrder }) => {
  const { editMode, notify } = useEditor();
  const customItems = useCustomItems();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Форма добавления нового объекта (только в режиме редактора)
  const [addOpen, setAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Навесы');
  const [newMaterial, setNewMaterial] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDate, setNewDate] = useState(new Date().toLocaleDateString('ru-RU'));
  const [newDesc, setNewDesc] = useState('');
  const [resultImages, setResultImages] = useState<string[]>([]);
  const [processImages, setProcessImages] = useState<string[]>([]);
  const [photosBusy, setPhotosBusy] = useState(false);

  type GalleryItem = PortfolioItem & Partial<Pick<CustomPortfolioItem, 'resultImages' | 'processImages'>>;
  const allItems = useMemo(
    () => [...REAL_PORTFOLIO, ...customItems] as GalleryItem[],
    [customItems]
  );

  const handleImageFiles = async (
    e: React.ChangeEvent<HTMLInputElement>,
    kind: 'result' | 'process'
  ) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (!files.length) return;
    if (files.some((file) => file.size > 20 * 1024 * 1024)) {
      alert('Один из исходных файлов больше 20 МБ.');
      return;
    }
    setPhotosBusy(true);
    try {
      const optimized = await Promise.all(
        files.slice(0, 8).map((file) => optimizeImageFile(file, 1200, 0.8))
      );
      if (kind === 'result') setResultImages((current) => [...current, ...optimized].slice(0, 8));
      else setProcessImages((current) => [...current, ...optimized].slice(0, 8));
      notify(`${optimized.length} фото оптимизировано и добавлено`);
    } catch {
      notify('Не удалось обработать одно из фото');
    } finally {
      setPhotosBusy(false);
    }
  };

  const submitNewItem = () => {
    if (!newTitle.trim() || !resultImages.length) {
      alert('Укажите название и загрузите хотя бы одно фото результата.');
      return;
    }
    const categoryMap: Record<string, CustomPortfolioItem['category']> = {
      Заборы: 'fence', Ворота: 'gate', Ангары: 'hangar', Беседки: 'gazebo',
    };
    addCustomItem({
      title: newTitle.trim(),
      category: categoryMap[newCategory] ?? 'canopy',
      categoryLabel: newCategory,
      date: newDate,
      image: resultImages[0],
      resultImages,
      processImages,
      material: newMaterial.trim() || 'Металлокаркас, поликарбонат',
      location: newLocation.trim() || undefined,
      duration: '1–2 дня',
      description: newDesc.trim() || 'Новый объект производства «МеталлЦехСтрой».',
    });
    setAddOpen(false);
    setNewTitle('');
    setNewMaterial('');
    setNewLocation('');
    setNewDesc('');
    setResultImages([]);
    setProcessImages([]);
    notify('Объект добавлен в галерею');
  };
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'all', label: `Все объекты (${REAL_PORTFOLIO.length})` },
    { id: 'canopy', label: 'Навесы' },
    { id: 'fence', label: 'Заборы' },
    { id: 'gate', label: 'Ворота' },
    { id: 'hangar', label: 'Ангары' },
    { id: 'gazebo', label: 'Беседки / хозблоки' },
  ];

  const filtered = allItems.filter((item) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'gazebo') {
      return item.category === 'gazebo' || item.categoryLabel === 'Хозблоки' || item.categoryLabel === 'Террасы';
    }
    return item.category === activeCategory;
  });

  return (
    <div className="bg-white py-10 sm:py-16">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-10">
        
        {/* Breadcrumb & Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="text-xs font-semibold text-slate-500 mb-2">
            <span>Главная</span> <span className="mx-1">/</span> <span className="text-orange-600">Фотогалерея обновлений</span>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            <Camera className="w-3.5 h-3.5" />
            Раздел «Обновления»
          </div>
          <EditableText as="h1" id="gallery.h1" className="text-3xl sm:text-5xl font-black text-slate-900 font-heading tracking-tight block">
            Наши недавние работы в фотографиях
          </EditableText>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Полный раздел «Обновления» с сайта: все недавние работы по навесам, заборам, воротам, беседкам и ангарам — с реальными датами и фотографиями объектов.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => !editMode && setLightboxItem(item)}
              className={`white-card rounded-3xl overflow-hidden flex flex-col justify-between group relative ${
                editMode ? '' : 'cursor-pointer'
              }`}
            >
              {editMode && item.id.startsWith('custom-') && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Удалить этот объект из галереи?')) {
                      deleteCustomItem(item.id);
                      notify('Объект удалён');
                    }
                  }}
                  className="absolute top-2 right-2 z-30 w-8 h-8 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg cursor-pointer"
                  title="Удалить объект"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                <EditableImage
                  id={`gallery.${item.id}.image`}
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="bg-orange-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-lg shadow-xs">
                    {item.categoryLabel}
                  </span>
                  <span className="bg-white/90 text-slate-800 text-[11px] font-semibold px-2 py-0.5 rounded-lg backdrop-blur-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-orange-600" />
                    {item.date}
                  </span>
                </div>

                <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                  <span className="p-1.5 rounded-lg bg-black/40 text-white group-hover:bg-orange-600 transition-colors">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                  <AlbumBadge
                    portId={item.id}
                    album={item.resultImages ? { result: item.resultImages, process: item.processImages ?? [] } : undefined}
                  />
                </div>

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="text-sm sm:text-base font-bold font-heading line-clamp-2">
                    {item.title}
                  </h3>
                  {item.location && (
                    <div className="flex items-center gap-1 text-xs text-orange-300 mt-1">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">Материалы: </span>
                  <span>{item.material}</span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  {item.duration && (
                    <span className="inline-flex items-center gap-1 text-slate-500 font-medium shrink-0">
                      <Clock className="w-3.5 h-3.5 text-orange-600" />
                      {item.duration}
                    </span>
                  )}
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenOrder(`Хочу такой же: ${item.title} (${item.date})`);
                      }}
                      className="inline-flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-1.5 px-3 rounded-lg transition-colors cursor-pointer active:scale-95 text-[11px]"
                    >
                      Заказать такой
                    </button>
                    <span className="text-orange-600 font-bold group-hover:translate-x-0.5 transition-transform">
                      Подробнее →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Карточка добавления нового объекта (режим редактора) */}
          {editMode && (
            <button
              onClick={() => setAddOpen(true)}
              className="rounded-3xl border-2 border-dashed border-orange-300 hover:border-orange-500 bg-orange-50/40 hover:bg-orange-50 flex flex-col items-center justify-center gap-3 min-h-[280px] transition-all cursor-pointer group"
            >
              <span className="w-14 h-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                <Plus className="w-7 h-7" />
              </span>
              <span className="text-base font-bold text-slate-800">Добавить объект</span>
              <span className="text-xs text-slate-500 text-center px-6">
                Загрузите фото выполненной работы, укажите название и материалы
              </span>
            </button>
          )}
        </div>

      </div>

      {/* Фотоальбом объекта с процессом установки */}
      {lightboxItem && (
        <PhotoAlbum
          portId={lightboxItem.id}
          title={`${lightboxItem.title} · ${lightboxItem.date}`}
          mainImage={lightboxItem.image}
          album={lightboxItem.resultImages ? {
            result: lightboxItem.resultImages,
            process: lightboxItem.processImages ?? [],
          } : undefined}
          onClose={() => setLightboxItem(null)}
          onOrder={(t) => onOpenOrder(t)}
        />
      )}

      {/* Форма добавления нового объекта (редактор) */}
      {addOpen && (
        <div
          className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setAddOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-orange-600" /> Новый объект галереи
              </h3>
              <button onClick={() => setAddOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Загрузка фотографий результата и процесса */}
            {([
              ['result', 'Готовый результат *', resultImages, setResultImages],
              ['process', 'Процесс установки', processImages, setProcessImages],
            ] as const).map(([kind, label, images, setter]) => (
              <div key={kind}>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">{label}</label>
                  <span className="text-[10px] text-slate-400">{images.length}/8 фото</span>
                </div>
                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {images.map((src, index) => (
                      <div key={`${kind}-${index}`} className="relative aspect-square rounded-lg overflow-hidden bg-slate-100">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setter(images.filter((_, i) => i !== index))}
                          className="absolute top-1 right-1 w-6 h-6 bg-black/65 text-white rounded-full flex items-center justify-center"
                          aria-label="Удалить фото"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-xl py-4 transition-colors ${photosBusy ? 'border-slate-200 bg-slate-50 cursor-wait' : 'border-slate-300 hover:border-orange-500 cursor-pointer'}`}>
                  <Upload className="w-5 h-5 text-slate-400" />
                  <span className="text-xs text-slate-500">
                    {photosBusy ? 'Оптимизируем фото…' : images.length ? 'Добавить ещё фото' : 'Выбрать несколько фото'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={photosBusy || images.length >= 8}
                    onChange={(e) => handleImageFiles(e, kind)}
                    className="hidden"
                  />
                </label>
              </div>
            ))}
            <p className="text-[11px] text-slate-400 -mt-2">
              До 8 фото в каждом блоке. Большие файлы автоматически уменьшаются без заметной потери качества.
            </p>

            {/* Название */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Название *</label>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Например: Двухскатный навес 6×4 м"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 outline-none focus:border-orange-500"
              />
            </div>

            {/* Категория и дата */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Раздел</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 outline-none focus:border-orange-500"
                >
                  {['Навесы', 'Арочные', 'Двухскатные', 'Односкатные', 'Консольные', 'С фризом', 'Беседки', 'Заборы', 'Ворота', 'Ангары'].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Дата</label>
                <input
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Материалы и локация */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Материалы</label>
                <input
                  value={newMaterial}
                  onChange={(e) => setNewMaterial(e.target.value)}
                  placeholder="Поликарбонат 10 мм"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Локация</label>
                <input
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="МО, Истринский р-н"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Описание */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Описание</label>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                rows={2}
                placeholder="Кратко о выполненной работе"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 outline-none focus:border-orange-500 resize-none"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={submitNewItem}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
              >
                Добавить объект
              </button>
              <button
                onClick={() => setAddOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
