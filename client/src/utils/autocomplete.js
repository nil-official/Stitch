const LOCAL_PATH = 'autocomplete';
const EXPIRY_DAYS = 7;

function now() {
    return Date.now();
}

export const setAutocompleteCache = (query, results) => {
    let cache = {};
    try {
        cache = JSON.parse(window.localStorage.getItem(LOCAL_PATH)) || {};
    } catch {
        cache = {};
    }
    cache[query] = {
        results,
        timestamp: now()
    };
    window.localStorage.setItem(LOCAL_PATH, JSON.stringify(cache));
};

export const getAutocompleteCache = (query) => {
    let cache = {};
    try {
        cache = JSON.parse(window.localStorage.getItem(LOCAL_PATH)) || {};
    } catch {
        cache = {};
    }
    const entry = cache[query];
    if (!entry) return null;
    const expiry = EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    const expired = now() - entry.timestamp > expiry;
    if (expired) {
        delete cache[query];
        window.localStorage.setItem(LOCAL_PATH, JSON.stringify(cache));
        return null;
    }
    return entry.results;
};

export const clearAutocompleteCache = () => {
    window.localStorage.removeItem(LOCAL_PATH);
};

export const removeAutocompleteCacheForQuery = (query) => {
    let cache = {};
    try {
        cache = JSON.parse(window.localStorage.getItem(LOCAL_PATH)) || {};
    } catch {
        cache = {};
    }
    if (cache[query]) {
        delete cache[query];
        window.localStorage.setItem(LOCAL_PATH, JSON.stringify(cache));
    }
};