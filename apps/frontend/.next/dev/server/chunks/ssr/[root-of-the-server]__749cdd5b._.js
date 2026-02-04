module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/data/mock.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// BrickData Mock-Daten
// Architektur: Datenstrukturen sind so angelegt, dass ein Backend später leicht integrierbar ist.
// API-Layer würde hier eingefügt werden (z.B. fetch('/api/listings'), etc.)
__turbopack_context__.s([
    "getKPIs",
    ()=>getKPIs,
    "getListingsPerDayData",
    ()=>getListingsPerDayData,
    "getPriceMovementData",
    ()=>getPriceMovementData,
    "mockAlerts",
    ()=>mockAlerts,
    "mockListings",
    ()=>mockListings,
    "mockPings",
    ()=>mockPings,
    "mockWatchlists",
    ()=>mockWatchlists
]);
function getPriceMovementData(range) {
    const days = range === "7T" ? 7 : range === "30T" ? 30 : 365;
    const base = 4500;
    const data = [];
    const now = new Date();
    for(let i = days; i >= 0; i--){
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const variance = Math.sin(i / 3) * 200 + Math.random() * 100;
        data.push({
            date: d.toISOString().split("T")[0],
            pricePerSqm: Math.round(base + variance + (days - i) * 2)
        });
    }
    return data;
}
function getListingsPerDayData() {
    const data = [];
    const now = new Date();
    for(let i = 13; i >= 0; i--){
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        data.push({
            date: d.toISOString().split("T")[0],
            count: Math.floor(3 + Math.random() * 12)
        });
    }
    return data;
}
// Initiale Mock-Daten
const twoDaysAgo = new Date();
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const threeDaysAgo = new Date();
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
const weekAgo = new Date();
weekAgo.setDate(weekAgo.getDate() - 7);
const mockListings = [
    {
        id: "l1",
        title: "Moderne 3-Zimmer Wohnung mit Balkon",
        address: "Hauptstraße 42",
        city: "München",
        zip: "80331",
        price: 485000,
        sqm: 78,
        rooms: 3,
        type: "wohnung",
        source: "immoscout",
        createdAt: weekAgo.toISOString(),
        updatedAt: new Date().toISOString(),
        status: "watching",
        energyClass: "B",
        yearBuilt: 2015,
        priceHistory: [
            {
                date: weekAgo.toISOString().split("T")[0],
                price: 499000
            },
            {
                date: threeDaysAgo.toISOString().split("T")[0],
                price: 485000
            }
        ],
        signals: [
            {
                type: "created",
                date: weekAgo.toISOString()
            },
            {
                type: "price_drop",
                date: threeDaysAgo.toISOString(),
                oldPrice: 499000,
                newPrice: 485000
            }
        ]
    },
    {
        id: "l2",
        title: "Einfamilienhaus mit Garten",
        address: "Parkweg 12",
        city: "Hamburg",
        zip: "20149",
        price: 620000,
        sqm: 145,
        rooms: 5,
        type: "haus",
        source: "immowelt",
        createdAt: twoDaysAgo.toISOString(),
        updatedAt: twoDaysAgo.toISOString(),
        status: "new",
        energyClass: "C",
        yearBuilt: 1998,
        priceHistory: [
            {
                date: twoDaysAgo.toISOString().split("T")[0],
                price: 620000
            }
        ],
        signals: [
            {
                type: "created",
                date: twoDaysAgo.toISOString()
            }
        ]
    },
    {
        id: "l3",
        title: "2-Zimmer Altbau mit Stuck",
        address: "Friedrichstraße 88",
        city: "Berlin",
        zip: "10117",
        price: 320000,
        sqm: 52,
        rooms: 2,
        type: "wohnung",
        source: "kleinanzeigen",
        createdAt: threeDaysAgo.toISOString(),
        updatedAt: new Date().toISOString(),
        status: "new",
        energyClass: "D",
        yearBuilt: 1905,
        priceHistory: [
            {
                date: threeDaysAgo.toISOString().split("T")[0],
                price: 340000
            },
            {
                date: new Date().toISOString().split("T")[0],
                price: 320000
            }
        ],
        signals: [
            {
                type: "created",
                date: threeDaysAgo.toISOString()
            },
            {
                type: "price_drop",
                date: new Date().toISOString(),
                oldPrice: 340000,
                newPrice: 320000
            }
        ]
    },
    {
        id: "l4",
        title: "Penthouse mit Dachterrasse",
        address: "Schwanthalerstraße 100",
        city: "München",
        zip: "80336",
        price: 890000,
        sqm: 120,
        rooms: 4,
        type: "wohnung",
        source: "immoscout",
        createdAt: weekAgo.toISOString(),
        updatedAt: weekAgo.toISOString(),
        status: "missed",
        energyClass: "A",
        yearBuilt: 2020,
        priceHistory: [
            {
                date: weekAgo.toISOString().split("T")[0],
                price: 890000
            }
        ],
        signals: [
            {
                type: "created",
                date: weekAgo.toISOString()
            }
        ]
    },
    {
        id: "l5",
        title: "Grundstück für Eigenheim",
        address: "Gartenstraße 5",
        city: "Leipzig",
        zip: "04103",
        price: 185000,
        sqm: 450,
        rooms: 0,
        type: "grundstueck",
        source: "immowelt",
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        updatedAt: new Date().toISOString(),
        status: "watching",
        priceHistory: [
            {
                date: new Date(Date.now() - 86400000 * 5).toISOString().split("T")[0],
                price: 195000
            },
            {
                date: new Date().toISOString().split("T")[0],
                price: 185000
            }
        ],
        signals: [
            {
                type: "created",
                date: new Date(Date.now() - 86400000 * 5).toISOString()
            },
            {
                type: "price_drop",
                date: new Date().toISOString(),
                oldPrice: 195000,
                newPrice: 185000
            }
        ]
    }
];
const mockAlerts = [
    {
        id: "a1",
        name: "München 3-Zimmer unter 500k",
        region: {
            type: "stadt",
            value: "München"
        },
        type: "wohnung",
        maxBidPrice: 500000,
        minSqm: 60,
        minRooms: 3,
        triggers: [
            "new_listing",
            "price_drop"
        ],
        frequency: "instant",
        channel: "in_app",
        enabled: true,
        lastTriggeredAt: threeDaysAgo.toISOString(),
        createdAt: weekAgo.toISOString()
    },
    {
        id: "a2",
        name: "Berlin Friedrichshain",
        region: {
            type: "plz",
            value: "10243"
        },
        type: "wohnung",
        maxBidPrice: 350000,
        minSqm: 45,
        triggers: [
            "new_listing"
        ],
        frequency: "daily_digest",
        channel: "email",
        enabled: true,
        lastTriggeredAt: threeDaysAgo.toISOString(),
        createdAt: weekAgo.toISOString()
    }
];
const mockPings = [
    {
        id: "p1",
        alertId: "a1",
        listingId: "l1",
        createdAt: threeDaysAgo.toISOString(),
        kind: "price_drop",
        message: "Preissenkung: Moderne 3-Zimmer Wohnung – jetzt unter Max-Bietpreis",
        price: 485000,
        maxBidPrice: 500000,
        delta: -15000,
        matchLevel: "match"
    },
    {
        id: "p2",
        alertId: "a1",
        listingId: "l3",
        createdAt: new Date().toISOString(),
        kind: "price_drop",
        message: "Preissenkung: 2-Zimmer Altbau Berlin – knapp unter Budget",
        price: 320000,
        maxBidPrice: 350000,
        delta: -30000,
        matchLevel: "match"
    },
    {
        id: "p3",
        alertId: "a1",
        listingId: "l2",
        createdAt: twoDaysAgo.toISOString(),
        kind: "new",
        message: "Neues Inserat: Einfamilienhaus Hamburg – über Budget",
        price: 620000,
        maxBidPrice: 500000,
        delta: 120000,
        matchLevel: "over"
    }
];
const mockWatchlists = [
    {
        id: "w1",
        name: "München Favoriten",
        listingIds: [
            "l1",
            "l4"
        ],
        createdAt: weekAgo.toISOString()
    },
    {
        id: "w2",
        name: "Günstige Angebote",
        listingIds: [
            "l3",
            "l5"
        ],
        createdAt: threeDaysAgo.toISOString()
    }
];
function getKPIs(listings = mockListings, watchlists = mockWatchlists) {
    const last24h = new Date(Date.now() - 86400000);
    const last7d = new Date(Date.now() - 86400000 * 7);
    const newListings24h = listings.filter((l)=>new Date(l.createdAt) >= last24h).length;
    const priceChanges7d = listings.filter((l)=>l.signals.some((s)=>s.type === "price_drop" && new Date(s.date) >= last7d)).length;
    const withSqm = listings.filter((l)=>l.sqm > 0);
    const avgPricePerSqm = withSqm.length > 0 ? withSqm.reduce((a, l)=>a + l.price / l.sqm, 0) / withSqm.length : 0;
    const activeWatchlists = watchlists.length;
    return {
        newListings24h,
        priceChanges7d,
        avgPricePerSqm: Math.round(avgPricePerSqm),
        activeWatchlists
    };
}
}),
"[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/context/AppContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppProvider",
    ()=>AppProvider,
    "useApp",
    ()=>useApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$data$2f$mock$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/data/mock.ts [app-ssr] (ecmascript)");
;
;
;
const AppContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AppProvider({ children }) {
    const [listings, setListings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$data$2f$mock$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mockListings"]);
    const [alerts, setAlerts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$data$2f$mock$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mockAlerts"]);
    const [pings, setPings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$data$2f$mock$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mockPings"]);
    const [watchlists, setWatchlists] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$data$2f$mock$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mockWatchlists"]);
    const addListing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((listing)=>{
        setListings((prev)=>[
                ...prev,
                listing
            ]);
    }, []);
    const updateListing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id, updates)=>{
        setListings((prev)=>prev.map((l)=>l.id === id ? {
                    ...l,
                    ...updates
                } : l));
    }, []);
    const addAlert = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((alert)=>{
        setAlerts((prev)=>[
                ...prev,
                alert
            ]);
    }, []);
    const updateAlert = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id, updates)=>{
        setAlerts((prev)=>prev.map((a)=>a.id === id ? {
                    ...a,
                    ...updates
                } : a));
    }, []);
    const addPing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((ping)=>{
        setPings((prev)=>[
                ping,
                ...prev
            ]);
    }, []);
    const dismissPing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>{
        setPings((prev)=>prev.map((p)=>p.id === id ? {
                    ...p,
                    dismissed: true
                } : p));
    }, []);
    const addWatchlist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((watchlist)=>{
        setWatchlists((prev)=>[
                ...prev,
                watchlist
            ]);
    }, []);
    const addListingToWatchlist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((watchlistId, listingId)=>{
        setWatchlists((prev)=>prev.map((w)=>w.id === watchlistId ? {
                    ...w,
                    listingIds: [
                        ...w.listingIds,
                        listingId
                    ]
                } : w));
    }, []);
    const removeListingFromWatchlist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((watchlistId, listingId)=>{
        setWatchlists((prev)=>prev.map((w)=>w.id === watchlistId ? {
                    ...w,
                    listingIds: w.listingIds.filter((id)=>id !== listingId)
                } : w));
    }, []);
    const simulateNewListing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const cities = [
            "München",
            "Berlin",
            "Hamburg",
            "Köln",
            "Frankfurt"
        ];
        const sources = [
            "immoscout",
            "kleinanzeigen",
            "immowelt"
        ];
        const types = [
            "wohnung",
            "haus"
        ];
        const city = cities[Math.floor(Math.random() * cities.length)];
        const price = Math.floor(250000 + Math.random() * 400000);
        const sqm = Math.floor(50 + Math.random() * 100);
        const rooms = Math.floor(2 + Math.random() * 3);
        const now = new Date().toISOString();
        const newListing = {
            id: `l${Date.now()}`,
            title: `Neue ${types[Math.floor(Math.random() * types.length)] === "wohnung" ? "Wohnung" : "Immobilie"} in ${city}`,
            address: `Teststraße ${Math.floor(Math.random() * 100)}`,
            city,
            zip: String(80000 + Math.floor(Math.random() * 9999)),
            price,
            sqm,
            rooms,
            type: types[Math.floor(Math.random() * types.length)],
            source: sources[Math.floor(Math.random() * sources.length)],
            createdAt: now,
            updatedAt: now,
            status: "new",
            priceHistory: [
                {
                    date: now.split("T")[0],
                    price
                }
            ],
            signals: [
                {
                    type: "created",
                    date: now
                }
            ]
        };
        const alert = alerts.find((a)=>a.enabled && a.type === (newListing.type === "wohnung" ? "wohnung" : "alle"));
        const maxBidPrice = alert?.maxBidPrice ?? 500000;
        const delta = price - maxBidPrice;
        let matchLevel = "over";
        if (delta <= 0) matchLevel = "match";
        else if (delta <= maxBidPrice * 0.05) matchLevel = "near";
        const newPing = {
            id: `p${Date.now()}`,
            alertId: alert?.id ?? "a1",
            listingId: newListing.id,
            createdAt: now,
            kind: "new",
            message: `Neues Inserat: ${newListing.title}`,
            price,
            maxBidPrice,
            delta,
            matchLevel
        };
        addListing(newListing);
        addPing(newPing);
    }, [
        alerts,
        addListing,
        addPing
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AppContext.Provider, {
        value: {
            listings,
            alerts,
            pings,
            watchlists,
            addListing,
            updateListing,
            addAlert,
            updateAlert,
            addPing,
            dismissPing,
            addWatchlist,
            addListingToWatchlist,
            removeListingFromWatchlist,
            simulateNewListing
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/context/AppContext.tsx",
        lineNumber: 166,
        columnNumber: 5
    }, this);
}
function useApp() {
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AppContext);
    if (!ctx) throw new Error("useApp must be used within AppProvider");
    return ctx;
}
}),
"[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/context/ThemeContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider,
    "useTheme",
    ()=>useTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
;
const ThemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function ThemeProvider({ children }) {
    const [theme, setThemeState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("light");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const stored = undefined;
        const prefersDark = undefined;
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (typeof document === "undefined") return;
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(theme);
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, [
        theme
    ]);
    const setTheme = (t)=>setThemeState(t);
    const toggleTheme = ()=>setThemeState((prev)=>prev === "light" ? "dark" : "light");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
        value: {
            theme,
            setTheme,
            toggleTheme
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/context/ThemeContext.tsx",
        lineNumber: 47,
        columnNumber: 5
    }, this);
}
function useTheme() {
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
    return ctx;
}
}),
"[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/app/providers.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/context/AppContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$context$2f$ThemeContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/context/ThemeContext.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
function Providers({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$context$2f$ThemeContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThemeProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppProvider"], {
            children: children
        }, void 0, false, {
            fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/app/providers.tsx",
            lineNumber: 10,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/app/providers.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__749cdd5b._.js.map