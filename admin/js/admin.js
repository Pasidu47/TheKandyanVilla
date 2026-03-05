/**
 * The Kandyan Villa — Admin Panel Core
 * Improved for local file (file://) compatibility.
 */

const ADMIN_USERNAME = 'admin';
const DB_KEYS = {
    rooms: 'kv_rooms',
    bookings: 'kv_bookings',
    activity: 'kv_activity',
    settings: 'kv_settings',
    images: 'kv_images',
    pw_hash: 'kv_admin_pw_hash',
    session: 'kv_admin_session_v2' // Changed key to force refresh
};

// Fallback session duration: 4 hours
const SESSION_EXPIRE_MS = 4 * 60 * 60 * 1000;

/* ─────────────────────────────────────────────
   AUTHENTICATION & SESSION
   ───────────────────────────────────────────── */

// Simple robust hash for local use
function getSimpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return 'kv_' + Math.abs(hash).toString(16);
}

function createSession() {
    try {
        const session = {
            loggedIn: true,
            username: ADMIN_USERNAME,
            expires: Date.now() + SESSION_EXPIRE_MS
        };
        localStorage.setItem(DB_KEYS.session, JSON.stringify(session));
        console.log("Session created successfully");
    } catch (e) {
        console.error("Failed to create session in localStorage:", e);
    }
}

function getSession() {
    try {
        const raw = localStorage.getItem(DB_KEYS.session);
        if (!raw) return null;
        const session = JSON.parse(raw);
        if (Date.now() > session.expires) {
            localStorage.removeItem(DB_KEYS.session);
            return null;
        }
        return session;
    } catch (e) {
        console.error("Failed to read session from localStorage:", e);
        return null;
    }
}

function destroySession() {
    try {
        localStorage.removeItem(DB_KEYS.session);
    } catch (e) { }
}

function requireAuth() {
    const session = getSession();
    if (!session || !session.loggedIn) {
        console.log("No valid session found, redirecting to login...");
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

/* ─────────────────────────────────────────────
   DATABASE (localStorage)
   ───────────────────────────────────────────── */
const DEFAULT_ROOMS = [
    { id: 'double', name: 'Deluxe Double Room', type: 'Mountain View', pricePerNight: 25193, maxGuests: 2, beds: '1 Double Bed', size: '33 m²', status: 'active' },
    { id: 'twin', name: 'Deluxe Twin Room', type: 'Garden/Pool/Mountain View', pricePerNight: 27750, maxGuests: 2, beds: '2 Single Beds', size: '33 m²', status: 'active' },
    { id: 'triple', name: 'Deluxe Triple Room', type: 'Family Friendly', pricePerNight: 30368, maxGuests: 3, beds: '1 Double + 1 Single', size: '33 m²', status: 'active' },
    { id: 'villa', name: 'Three Bedrooms Villa', type: 'Premium Villa', pricePerNight: 75067, maxGuests: 6, beds: '3 Bedrooms', size: '93 m²', status: 'active' }
];

const DEFAULT_IMAGES = {
    hero_home: 'images/b_main.jpg',
    room_double: 'https://cf.bstatic.com/xdata/images/hotel/max1280x900/320694510.jpg?k=84945ed31c57ff19772a0047ecc83523a9ac694a9cb0737d815a4df9fb1839f5&o=',
    room_twin: 'https://cf.bstatic.com/xdata/images/hotel/max1280x900/320694523.jpg?k=2935aa0783019ba68744a012ce8b79e388053aab180c6c1026d975eda6f4918d&o=',
    room_triple: 'images/b_bedroom2.jpg',
    room_villa: 'images/villa-1.jpg',
    about_hero: 'images/b_exterior.jpg',
    about_interior: 'images/b_interior.jpg',
    contact_hero: 'images/b_contact.jpg'
};

function dbGet(key, fallback = null) {
    try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : fallback;
    } catch (e) {
        console.warn("dbGet failed for key:", key, e);
        return fallback;
    }
}

function dbSet(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error("dbSet failed for key:", key, e);
    }
}

/* ─────────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────────── */
function formatPrice(num) {
    return 'LKR ' + Number(num).toLocaleString('en-LK');
}

function timeAgo(isoString) {
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

function logActivity(action, detail) {
    const log = dbGet(DB_KEYS.activity, []);
    log.unshift({
        action,
        detail,
        timestamp: new Date().toISOString(),
        user: ADMIN_USERNAME
    });
    dbSet(DB_KEYS.activity, log.slice(0, 50));
}

/* Initialize window object before anything else */
window.KVAdmin = {
    getSimpleHash, createSession, getSession, destroySession, requireAuth,
    getRooms: () => {
        const saved = dbGet(DB_KEYS.rooms, DEFAULT_ROOMS);
        // MERGE: Ensure any new default rooms (like 'twin') are added to existing local storage
        const merged = [...saved];
        DEFAULT_ROOMS.forEach(def => {
            if (!merged.find(r => r.id === def.id)) merged.push(def);
        });
        return merged;
    },
    saveRooms: (rooms) => dbSet(DB_KEYS.rooms, rooms),
    getSettings: () => dbGet(DB_KEYS.settings, { hotelName: 'The Kandyan Villa' }),
    saveSettings: (s) => dbSet(DB_KEYS.settings, s),
    getImages: () => dbGet(DB_KEYS.images, DEFAULT_IMAGES),
    saveImages: (imgs) => dbSet(DB_KEYS.images, imgs),
    getActivity: () => dbGet(DB_KEYS.activity, []),
    logActivity, dbSet, formatPrice, timeAgo, DB_KEYS
};
console.log("KVAdmin Engine Loaded");
