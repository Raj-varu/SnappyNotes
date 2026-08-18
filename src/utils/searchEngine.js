import Fuse from 'fuse.js';

const FUSE_OPTIONS = {
  includeScore: true,
  threshold: 0.38, // Balance between typo tolerance and high precision
  ignoreLocation: true,
  minMatchCharLength: 1,
  keys: [
    { name: 'command', weight: 0.4 },
    { name: 'title', weight: 0.35 },
    { name: 'category', weight: 0.15 },
    { name: 'tags', weight: 0.15 },
    { name: 'description', weight: 0.1 },
    { name: 'plainText', weight: 0.08 }
  ]
};

/**
 * Filter and search snippets with slash-command awareness and fuzzy typo tolerance
 * @param {Array} snippets 
 * @param {string} query 
 * @param {string} category 
 * @param {boolean} onlyPinned 
 * @returns {Array}
 */
export function filterAndSearchSnippets(snippets, query = '', category = 'All', onlyPinned = false) {
  if (!Array.isArray(snippets)) return [];

  let pool = [...snippets];

  // Filter by category
  if (category && category !== 'All') {
    pool = pool.filter(s => s.category?.toLowerCase() === category.toLowerCase());
  }

  // Filter by pinned state if active
  if (onlyPinned) {
    pool = pool.filter(s => s.pinned);
  }

  const cleanQuery = query.trim();

  // If no search query, return list sorted by pinned first, then updated date
  if (!cleanQuery) {
    return pool.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
    });
  }

  // Direct Slash Command Search check (e.g. user typed "/denial" or "denial")
  const slashMatch = cleanQuery.startsWith('/') ? cleanQuery.toLowerCase() : `/${cleanQuery.toLowerCase()}`;
  
  const directMatches = [];
  const otherItems = [];

  for (const item of pool) {
    const itemCmd = (item.command || '').toLowerCase();
    if (itemCmd === slashMatch || itemCmd === cleanQuery.toLowerCase()) {
      directMatches.push({ item, score: 0 }); // perfect match
    } else if (itemCmd && (itemCmd.startsWith(slashMatch) || itemCmd.startsWith(cleanQuery.toLowerCase()))) {
      directMatches.push({ item, score: 0.05 });
    } else {
      otherItems.push(item);
    }
  }

  // If we have direct command matches and query starts with '/', return those directly
  if (cleanQuery.startsWith('/') && directMatches.length > 0) {
    return directMatches.map(m => m.item);
  }

  // Perform Fuzzy Search using Fuse.js on the remaining / entire pool
  const fuse = new Fuse(pool, FUSE_OPTIONS);
  const fuzzyResults = fuse.search(cleanQuery);

  // Combine direct matches (at top) with fuzzy results, deduplicating
  const seenIds = new Set();
  const finalResults = [];

  for (const match of directMatches) {
    if (!seenIds.has(match.item.id)) {
      seenIds.add(match.item.id);
      finalResults.push(match.item);
    }
  }

  for (const result of fuzzyResults) {
    if (!seenIds.has(result.item.id)) {
      seenIds.add(result.item.id);
      finalResults.push(result.item);
    }
  }

  return finalResults;
}

/**
 * Extract unique categories from snippets list
 * @param {Array} snippets 
 * @returns {string[]}
 */
export function getUniqueCategories(snippets) {
  if (!Array.isArray(snippets)) return ['All'];
  const categories = new Set(['All']);
  snippets.forEach(s => {
    if (s.category && s.category.trim()) {
      categories.add(s.category.trim());
    }
  });
  return Array.from(categories);
}
