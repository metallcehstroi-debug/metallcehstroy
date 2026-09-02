import { useState, useEffect } from 'react';
import { BAKED_CUSTOM_ITEMS } from '../data/bakedOverrides';

const KEY = 'mcs_custom_portfolio_v1';
const EVENT = 'mcs_custom_portfolio_changed';

export interface CustomPortfolioItem {
  id: string;
  title: string;
  category: 'canopy' | 'fence' | 'gate' | 'hangar' | 'gazebo';
  categoryLabel: string;
  date: string;
  image: string;
  material: string;
  location?: string;
  duration?: string;
  description: string;
}

export function loadCustomItems(): CustomPortfolioItem[] {
  // Запечённые в код объекты переживают обновления сайта
  const baked = (Array.isArray(BAKED_CUSTOM_ITEMS) ? BAKED_CUSTOM_ITEMS : []) as CustomPortfolioItem[];
  let local: CustomPortfolioItem[] = [];
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) local = parsed;
  } catch {
    /* ignore */
  }
  const seen = new Set<string>();
  const merged: CustomPortfolioItem[] = [];
  for (const it of [...baked, ...local]) {
    if (it && it.id && !seen.has(it.id)) {
      seen.add(it.id);
      merged.push(it);
    }
  }
  return merged;
}

export function saveCustomItems(items: CustomPortfolioItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* ignore quota */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function addCustomItem(item: Omit<CustomPortfolioItem, 'id'>) {
  const items = loadCustomItems();
  const newItem: CustomPortfolioItem = {
    ...item,
    id: `custom-${Date.now()}`,
  };
  saveCustomItems([newItem, ...items]);
  return newItem;
}

export function deleteCustomItem(id: string) {
  saveCustomItems(loadCustomItems().filter((i) => i.id !== id));
}

/** Хук со списком пользовательских объектов (реактивен) */
export function useCustomItems(): CustomPortfolioItem[] {
  const [items, setItems] = useState<CustomPortfolioItem[]>(() => loadCustomItems());

  useEffect(() => {
    const handler = () => setItems(loadCustomItems());
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, []);

  return items;
}
