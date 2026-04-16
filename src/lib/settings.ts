import { prisma } from "@/lib/prisma";

export type SettingsCache = Record<string, string>;

let settingsCache: SettingsCache | null = null;
let cacheTime = 0;
const CACHE_TTL = 60 * 1000; // 1 minute

/**
 * Get all settings or settings by category from database
 * with caching to reduce database queries.
 */
export async function getSettings(category?: string): Promise<SettingsCache> {
  const now = Date.now();

  // Return cached settings if still fresh
  if (settingsCache && now - cacheTime < CACHE_TTL) {
    if (!category) return settingsCache;
    return Object.fromEntries(
      Object.entries(settingsCache).filter(([, value]) => {
        const setting = settingsByKey[value];
        return setting?.category === category;
      })
    );
  }

  try {
    const settings = await prisma.siteSetting.findMany();

    // Build cache
    const cache: SettingsCache = {};
    for (const setting of settings) {
      cache[setting.key] = setting.value;
    }

    // Build key->setting map for category filtering
    for (const setting of settings) {
      settingsByKey[setting.key] = setting;
    }

    settingsCache = cache;
    cacheTime = now;

    // Filter by category if requested
    if (!category) return cache;

    return Object.fromEntries(
      Object.entries(cache).filter(([key]) => {
        const setting = settingsByKey[key];
        return setting?.category === category;
      })
    );
  } catch (error) {
    console.error("Error fetching settings:", error);
    // Return empty object on error (pages will use fallback defaults)
    return {};
  }
}

/**
 * Helper to get a single setting value with fallback
 */
export async function getSetting(key: string, fallback: string = ""): Promise<string> {
  const settings = await getSettings();
  return settings[key] || fallback;
}

/**
 * Internal map for quick category lookup
 */
let settingsByKey: Record<string, any> = {};

/**
 * Clear the cache (useful after updates from admin panel)
 */
export function clearSettingsCache() {
  settingsCache = null;
  settingsByKey = {};
  cacheTime = 0;
}
