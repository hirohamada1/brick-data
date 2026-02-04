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
]);

//# sourceMappingURL=Coding_Projects_immos_immo-scan_apps_frontend_src_5fe53f6d._.js.map