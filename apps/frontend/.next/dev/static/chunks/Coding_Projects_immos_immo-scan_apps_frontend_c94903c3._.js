(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/data/mock.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/context/AppContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppProvider",
    ()=>AppProvider,
    "useApp",
    ()=>useApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$data$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/data/mock.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
const AppContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AppProvider({ children }) {
    _s();
    const [listings, setListings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$data$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockListings"]);
    const [alerts, setAlerts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$data$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockAlerts"]);
    const [pings, setPings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$data$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockPings"]);
    const [watchlists, setWatchlists] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$data$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockWatchlists"]);
    const addListing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[addListing]": (listing)=>{
            setListings({
                "AppProvider.useCallback[addListing]": (prev)=>[
                        ...prev,
                        listing
                    ]
            }["AppProvider.useCallback[addListing]"]);
        }
    }["AppProvider.useCallback[addListing]"], []);
    const updateListing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[updateListing]": (id, updates)=>{
            setListings({
                "AppProvider.useCallback[updateListing]": (prev)=>prev.map({
                        "AppProvider.useCallback[updateListing]": (l)=>l.id === id ? {
                                ...l,
                                ...updates
                            } : l
                    }["AppProvider.useCallback[updateListing]"])
            }["AppProvider.useCallback[updateListing]"]);
        }
    }["AppProvider.useCallback[updateListing]"], []);
    const addAlert = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[addAlert]": (alert)=>{
            setAlerts({
                "AppProvider.useCallback[addAlert]": (prev)=>[
                        ...prev,
                        alert
                    ]
            }["AppProvider.useCallback[addAlert]"]);
        }
    }["AppProvider.useCallback[addAlert]"], []);
    const updateAlert = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[updateAlert]": (id, updates)=>{
            setAlerts({
                "AppProvider.useCallback[updateAlert]": (prev)=>prev.map({
                        "AppProvider.useCallback[updateAlert]": (a)=>a.id === id ? {
                                ...a,
                                ...updates
                            } : a
                    }["AppProvider.useCallback[updateAlert]"])
            }["AppProvider.useCallback[updateAlert]"]);
        }
    }["AppProvider.useCallback[updateAlert]"], []);
    const addPing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[addPing]": (ping)=>{
            setPings({
                "AppProvider.useCallback[addPing]": (prev)=>[
                        ping,
                        ...prev
                    ]
            }["AppProvider.useCallback[addPing]"]);
        }
    }["AppProvider.useCallback[addPing]"], []);
    const dismissPing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[dismissPing]": (id)=>{
            setPings({
                "AppProvider.useCallback[dismissPing]": (prev)=>prev.map({
                        "AppProvider.useCallback[dismissPing]": (p)=>p.id === id ? {
                                ...p,
                                dismissed: true
                            } : p
                    }["AppProvider.useCallback[dismissPing]"])
            }["AppProvider.useCallback[dismissPing]"]);
        }
    }["AppProvider.useCallback[dismissPing]"], []);
    const addWatchlist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[addWatchlist]": (watchlist)=>{
            setWatchlists({
                "AppProvider.useCallback[addWatchlist]": (prev)=>[
                        ...prev,
                        watchlist
                    ]
            }["AppProvider.useCallback[addWatchlist]"]);
        }
    }["AppProvider.useCallback[addWatchlist]"], []);
    const addListingToWatchlist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[addListingToWatchlist]": (watchlistId, listingId)=>{
            setWatchlists({
                "AppProvider.useCallback[addListingToWatchlist]": (prev)=>prev.map({
                        "AppProvider.useCallback[addListingToWatchlist]": (w)=>w.id === watchlistId ? {
                                ...w,
                                listingIds: [
                                    ...w.listingIds,
                                    listingId
                                ]
                            } : w
                    }["AppProvider.useCallback[addListingToWatchlist]"])
            }["AppProvider.useCallback[addListingToWatchlist]"]);
        }
    }["AppProvider.useCallback[addListingToWatchlist]"], []);
    const removeListingFromWatchlist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[removeListingFromWatchlist]": (watchlistId, listingId)=>{
            setWatchlists({
                "AppProvider.useCallback[removeListingFromWatchlist]": (prev)=>prev.map({
                        "AppProvider.useCallback[removeListingFromWatchlist]": (w)=>w.id === watchlistId ? {
                                ...w,
                                listingIds: w.listingIds.filter({
                                    "AppProvider.useCallback[removeListingFromWatchlist]": (id)=>id !== listingId
                                }["AppProvider.useCallback[removeListingFromWatchlist]"])
                            } : w
                    }["AppProvider.useCallback[removeListingFromWatchlist]"])
            }["AppProvider.useCallback[removeListingFromWatchlist]"]);
        }
    }["AppProvider.useCallback[removeListingFromWatchlist]"], []);
    const simulateNewListing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[simulateNewListing]": ()=>{
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
            const alert = alerts.find({
                "AppProvider.useCallback[simulateNewListing].alert": (a)=>a.enabled && a.type === (newListing.type === "wohnung" ? "wohnung" : "alle")
            }["AppProvider.useCallback[simulateNewListing].alert"]);
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
        }
    }["AppProvider.useCallback[simulateNewListing]"], [
        alerts,
        addListing,
        addPing
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AppContext.Provider, {
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
_s(AppProvider, "O9+2UeyoRLXf2055QTmIA1SEWkc=");
_c = AppProvider;
function useApp() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AppContext);
    if (!ctx) throw new Error("useApp must be used within AppProvider");
    return ctx;
}
_s1(useApp, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "AppProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/context/ThemeContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider,
    "useTheme",
    ()=>useTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
const ThemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function ThemeProvider({ children }) {
    _s();
    const [theme, setThemeState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("light");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const stored = window.localStorage.getItem("brickdata-theme");
            if (stored === "light" || stored === "dark") {
                setThemeState(stored);
                return;
            }
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setThemeState(prefersDark ? "dark" : "light");
        }
    }["ThemeProvider.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            if (typeof document === "undefined") return;
            document.documentElement.classList.remove("light", "dark");
            document.documentElement.classList.add(theme);
            if ("TURBOPACK compile-time truthy", 1) {
                window.localStorage.setItem("brickdata-theme", theme);
            }
        }
    }["ThemeProvider.useEffect"], [
        theme
    ]);
    const setTheme = (t)=>setThemeState(t);
    const toggleTheme = ()=>setThemeState((prev)=>prev === "light" ? "dark" : "light");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
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
_s(ThemeProvider, "4qnaGxhbNgtHY1oJLugblNa43vo=");
_c = ThemeProvider;
function useTheme() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
    return ctx;
}
_s1(useTheme, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/app/providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/context/AppContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$context$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/context/ThemeContext.tsx [app-client] (ecmascript)");
"use client";
;
;
;
function Providers({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$context$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AppProvider"], {
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
_c = Providers;
var _c;
__turbopack_context__.k.register(_c, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
"[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/@vercel/analytics/dist/next/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Analytics",
    ()=>Analytics2
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
// src/nextjs/index.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// src/nextjs/utils.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/navigation.js [app-client] (ecmascript)");
"use client";
;
;
// package.json
var name = "@vercel/analytics";
var version = "1.3.1";
// src/queue.ts
var initQueue = ()=>{
    if (window.va) return;
    window.va = function a(...params) {
        (window.vaq = window.vaq || []).push(params);
    };
};
// src/utils.ts
function isBrowser() {
    return typeof window !== "undefined";
}
function detectEnvironment() {
    try {
        const env = ("TURBOPACK compile-time value", "development");
        if ("TURBOPACK compile-time truthy", 1) {
            return "development";
        }
    } catch (e) {}
    return "production";
}
function setMode(mode = "auto") {
    if (mode === "auto") {
        window.vam = detectEnvironment();
        return;
    }
    window.vam = mode;
}
function getMode() {
    const mode = isBrowser() ? window.vam : detectEnvironment();
    return mode || "production";
}
function isDevelopment() {
    return getMode() === "development";
}
function computeRoute(pathname, pathParams) {
    if (!pathname || !pathParams) {
        return pathname;
    }
    let result = pathname;
    try {
        const entries = Object.entries(pathParams);
        for (const [key, value] of entries){
            if (!Array.isArray(value)) {
                const matcher = turnValueToRegExp(value);
                if (matcher.test(result)) {
                    result = result.replace(matcher, `/[${key}]`);
                }
            }
        }
        for (const [key, value] of entries){
            if (Array.isArray(value)) {
                const matcher = turnValueToRegExp(value.join("/"));
                if (matcher.test(result)) {
                    result = result.replace(matcher, `/[...${key}]`);
                }
            }
        }
        return result;
    } catch (e) {
        return pathname;
    }
}
function turnValueToRegExp(value) {
    return new RegExp(`/${escapeRegExp(value)}(?=[/?#]|$)`);
}
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
// src/generic.ts
var DEV_SCRIPT_URL = "https://va.vercel-scripts.com/v1/script.debug.js";
var PROD_SCRIPT_URL = "/_vercel/insights/script.js";
function inject(props = {
    debug: true
}) {
    var _a;
    if (!isBrowser()) return;
    setMode(props.mode);
    initQueue();
    if (props.beforeSend) {
        (_a = window.va) == null ? void 0 : _a.call(window, "beforeSend", props.beforeSend);
    }
    const src = props.scriptSrc || (isDevelopment() ? DEV_SCRIPT_URL : PROD_SCRIPT_URL);
    if (document.head.querySelector(`script[src*="${src}"]`)) return;
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    script.dataset.sdkn = name + (props.framework ? `/${props.framework}` : "");
    script.dataset.sdkv = version;
    if (props.disableAutoTrack) {
        script.dataset.disableAutoTrack = "1";
    }
    if (props.endpoint) {
        script.dataset.endpoint = props.endpoint;
    }
    if (props.dsn) {
        script.dataset.dsn = props.dsn;
    }
    script.onerror = ()=>{
        const errorMessage = isDevelopment() ? "Please check if any ad blockers are enabled and try again." : "Be sure to enable Web Analytics for your project and deploy again. See https://vercel.com/docs/analytics/quickstart for more information.";
        console.log(`[Vercel Web Analytics] Failed to load script from ${src}. ${errorMessage}`);
    };
    if (isDevelopment() && props.debug === false) {
        script.dataset.debug = "false";
    }
    document.head.appendChild(script);
}
function pageview({ route, path }) {
    var _a;
    (_a = window.va) == null ? void 0 : _a.call(window, "pageview", {
        route,
        path
    });
}
// src/react.tsx
function Analytics(props) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Analytics.useEffect": ()=>{
            inject({
                framework: props.framework || "react",
                ...props.route !== void 0 && {
                    disableAutoTrack: true
                },
                ...props
            });
        }
    }["Analytics.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Analytics.useEffect": ()=>{
            if (props.route && props.path) {
                pageview({
                    route: props.route,
                    path: props.path
                });
            }
        }
    }["Analytics.useEffect"], [
        props.route,
        props.path
    ]);
    return null;
}
;
var useRoute = ()=>{
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const path = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const finalParams = {
        ...Object.fromEntries(searchParams.entries()),
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- can be empty in pages router
        ...params || {}
    };
    return {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- can be empty in pages router
        route: params ? computeRoute(path, finalParams) : null,
        path
    };
};
// src/nextjs/index.tsx
function AnalyticsComponent(props) {
    const { route, path } = useRoute();
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(Analytics, {
        path,
        route,
        ...props,
        framework: "next"
    });
}
function Analytics2(props) {
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: null
    }, /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(AnalyticsComponent, {
        ...props
    }));
}
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
]);

//# sourceMappingURL=Coding_Projects_immos_immo-scan_apps_frontend_c94903c3._.js.map