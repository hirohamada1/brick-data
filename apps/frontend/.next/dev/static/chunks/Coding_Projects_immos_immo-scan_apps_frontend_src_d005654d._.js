(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn,
    "formatCurrency",
    ()=>formatCurrency,
    "formatDate",
    ()=>formatDate,
    "formatDateTime",
    ()=>formatDateTime,
    "formatRelativeTime",
    ()=>formatRelativeTime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function formatCurrency(value) {
    return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0
    }).format(value);
}
function formatDate(date) {
    return new Intl.DateTimeFormat("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    }).format(new Date(date));
}
function formatDateTime(date) {
    return new Intl.DateTimeFormat("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(date));
}
function formatRelativeTime(date) {
    const now = new Date();
    const d = new Date(date);
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return "gerade eben";
    if (diffMins < 60) return `vor ${diffMins} Min.`;
    if (diffHours < 24) return `vor ${diffHours} Std.`;
    if (diffDays < 7) return `vor ${diffDays} Tagen`;
    return formatDate(date);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
    variants: {
        variant: {
            default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
            secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
            destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
            outline: "text-foreground",
            success: "border-transparent bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
            warning: "border-transparent bg-amber-500/20 text-amber-600 dark:text-amber-400"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
function Badge({ className, variant, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/badge.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
_c = Badge;
;
var _c;
__turbopack_context__.k.register(_c, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
            destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
            outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
            secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-xl px-3 text-xs",
            lg: "h-11 rounded-2xl px-8",
            icon: "h-10 w-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, variant, size, asChild = false, ...props }, ref)=>{
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/button.tsx",
        lineNumber: 46,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Button;
Button.displayName = "Button";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Button$React.forwardRef");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/table.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Table",
    ()=>Table,
    "TableBody",
    ()=>TableBody,
    "TableCaption",
    ()=>TableCaption,
    "TableCell",
    ()=>TableCell,
    "TableFooter",
    ()=>TableFooter,
    "TableHead",
    ()=>TableHead,
    "TableHeader",
    ()=>TableHeader,
    "TableRow",
    ()=>TableRow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Table = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full overflow-auto",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
            ref: ref,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full caption-bottom text-sm", className),
            ...props
        }, void 0, false, {
            fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/table.tsx",
            lineNumber: 9,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/table.tsx",
        lineNumber: 8,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Table;
Table.displayName = "Table";
const TableHeader = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("[&_tr]:border-b", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/table.tsx",
        lineNumber: 22,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = TableHeader;
TableHeader.displayName = "TableHeader";
const TableBody = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("[&_tr:last-child]:border-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/table.tsx",
        lineNumber: 30,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = TableBody;
TableBody.displayName = "TableBody";
const TableFooter = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tfoot", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/table.tsx",
        lineNumber: 38,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c7 = TableFooter;
TableFooter.displayName = "TableFooter";
const TableRow = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c8 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/table.tsx",
        lineNumber: 50,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c9 = TableRow;
TableRow.displayName = "TableRow";
const TableHead = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/table.tsx",
        lineNumber: 65,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c11 = TableHead;
TableHead.displayName = "TableHead";
const TableCell = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c12 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-4 align-middle [&:has([role=checkbox])]:pr-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/table.tsx",
        lineNumber: 80,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c13 = TableCell;
TableCell.displayName = "TableCell";
const TableCaption = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c14 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("caption", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mt-4 text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/table.tsx",
        lineNumber: 92,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c15 = TableCaption;
TableCaption.displayName = "TableCaption";
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13, _c14, _c15;
__turbopack_context__.k.register(_c, "Table$React.forwardRef");
__turbopack_context__.k.register(_c1, "Table");
__turbopack_context__.k.register(_c2, "TableHeader$React.forwardRef");
__turbopack_context__.k.register(_c3, "TableHeader");
__turbopack_context__.k.register(_c4, "TableBody$React.forwardRef");
__turbopack_context__.k.register(_c5, "TableBody");
__turbopack_context__.k.register(_c6, "TableFooter$React.forwardRef");
__turbopack_context__.k.register(_c7, "TableFooter");
__turbopack_context__.k.register(_c8, "TableRow$React.forwardRef");
__turbopack_context__.k.register(_c9, "TableRow");
__turbopack_context__.k.register(_c10, "TableHead$React.forwardRef");
__turbopack_context__.k.register(_c11, "TableHead");
__turbopack_context__.k.register(_c12, "TableCell$React.forwardRef");
__turbopack_context__.k.register(_c13, "TableCell");
__turbopack_context__.k.register(_c14, "TableCaption$React.forwardRef");
__turbopack_context__.k.register(_c15, "TableCaption");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Dialog",
    ()=>Dialog,
    "DialogClose",
    ()=>DialogClose,
    "DialogContent",
    ()=>DialogContent,
    "DialogDescription",
    ()=>DialogDescription,
    "DialogFooter",
    ()=>DialogFooter,
    "DialogHeader",
    ()=>DialogHeader,
    "DialogOverlay",
    ()=>DialogOverlay,
    "DialogPortal",
    ()=>DialogPortal,
    "DialogTitle",
    ()=>DialogTitle,
    "DialogTrigger",
    ()=>DialogTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/@radix-ui/react-dialog/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
const Dialog = __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
const DialogTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"];
const DialogPortal = __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"];
const DialogClose = __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"];
const DialogOverlay = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed inset-0 z-50 bg-black/80", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/dialog.tsx",
        lineNumber: 15,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c = DialogOverlay;
DialogOverlay.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"].displayName;
const DialogContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c1 = ({ className, children, showClose = true, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogPortal, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogOverlay, {}, void 0, false, {
                fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/dialog.tsx",
                lineNumber: 33,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                ref: ref,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-background p-6 shadow-xl duration-200 sm:rounded-2xl", className),
                ...props,
                children: [
                    children,
                    showClose && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
                        className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/dialog.tsx",
                                lineNumber: 45,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "sr-only",
                                children: "Schließen"
                            }, void 0, false, {
                                fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/dialog.tsx",
                                lineNumber: 46,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/dialog.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/dialog.tsx",
                lineNumber: 34,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/dialog.tsx",
        lineNumber: 32,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c2 = DialogContent;
DialogContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
const DialogHeader = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-1.5 text-center sm:text-left", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/dialog.tsx",
        lineNumber: 58,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c3 = DialogHeader;
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/dialog.tsx",
        lineNumber: 72,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c4 = DialogFooter;
DialogFooter.displayName = "DialogFooter";
const DialogTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c5 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-lg font-semibold leading-none tracking-tight", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/dialog.tsx",
        lineNumber: 86,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c6 = DialogTitle;
DialogTitle.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"].displayName;
const DialogDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c7 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/dialog.tsx",
        lineNumber: 98,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c8 = DialogDescription;
DialogDescription.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8;
__turbopack_context__.k.register(_c, "DialogOverlay");
__turbopack_context__.k.register(_c1, "DialogContent$React.forwardRef");
__turbopack_context__.k.register(_c2, "DialogContent");
__turbopack_context__.k.register(_c3, "DialogHeader");
__turbopack_context__.k.register(_c4, "DialogFooter");
__turbopack_context__.k.register(_c5, "DialogTitle$React.forwardRef");
__turbopack_context__.k.register(_c6, "DialogTitle");
__turbopack_context__.k.register(_c7, "DialogDescription$React.forwardRef");
__turbopack_context__.k.register(_c8, "DialogDescription");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Input = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, type, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-10 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/input.tsx",
        lineNumber: 10,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Input;
Input.displayName = "Input";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Input$React.forwardRef");
__turbopack_context__.k.register(_c1, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/label.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Label",
    ()=>Label
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/@radix-ui/react-label/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
const labelVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
const Label = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(labelVariants(), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/label.tsx",
        lineNumber: 15,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Label;
Label.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Label$React.forwardRef");
__turbopack_context__.k.register(_c1, "Label");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/checkbox.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Checkbox",
    ()=>Checkbox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/@radix-ui/react-checkbox/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
const Checkbox = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Indicator"], {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center justify-center text-current"),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                className: "h-3 w-3"
            }, void 0, false, {
                fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/checkbox.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/checkbox.tsx",
            lineNumber: 18,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/checkbox.tsx",
        lineNumber: 10,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Checkbox;
Checkbox.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Checkbox$React.forwardRef");
__turbopack_context__.k.register(_c1, "Checkbox");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createWatchlist",
    ()=>createWatchlist,
    "getLatestRun",
    ()=>getLatestRun,
    "getListings",
    ()=>getListings,
    "getManualInputs",
    ()=>getManualInputs,
    "getWatchlistListings",
    ()=>getWatchlistListings,
    "triggerWatchlistRun",
    ()=>triggerWatchlistRun,
    "upsertManualInputs",
    ()=>upsertManualInputs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
function getDefaultBaseUrl() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_BASE_URL ?? "";
}
function buildUrl(path, baseUrl) {
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }
    const prefix = baseUrl ?? getDefaultBaseUrl();
    return `${prefix}${path}`;
}
async function request(path, init = {}) {
    const { baseUrl, headers, ...rest } = init;
    const res = await fetch(buildUrl(path, baseUrl), {
        headers: {
            "Content-Type": "application/json",
            ...headers ?? {}
        },
        ...rest
    });
    const text = await res.text();
    if (!res.ok) {
        throw new Error(text || `Request failed with ${res.status}`);
    }
    if (!text) return null;
    return JSON.parse(text);
}
async function createWatchlist(payload) {
    return request("/api/watchlists", {
        method: "POST",
        body: JSON.stringify(payload)
    });
}
async function triggerWatchlistRun(watchlistId, mode = "full_refresh") {
    return request(`/api/watchlists/${watchlistId}/runs`, {
        method: "POST",
        body: JSON.stringify({
            mode
        })
    });
}
async function getLatestRun(watchlistId) {
    return request(`/api/watchlists/${watchlistId}/runs/latest`);
}
async function getWatchlistListings(watchlistId) {
    return request(`/api/watchlists/${watchlistId}/listings`);
}
async function getListings() {
    return request("/api/listings");
}
async function getManualInputs(listingId) {
    return request(`/api/listings/${listingId}/manual-inputs`);
}
async function upsertManualInputs(listingId, payload) {
    return request(`/api/listings/${listingId}/manual-inputs`, {
        method: "PUT",
        body: JSON.stringify(payload)
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ManualInputsSheet",
    ()=>ManualInputsSheet
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/checkbox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
const emptyState = {
    hausgeld_monthly_eur: "",
    expected_rent_cold_monthly_eur: "",
    vacancy_rate: "",
    maintenance_reserve_monthly_eur: "",
    is_estimated: true
};
function numberFromInput(value) {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const normalized = trimmed.replace(",", ".").replace("%", "");
    const n = Number(normalized);
    if (Number.isNaN(n)) return null;
    return n;
}
function vacancyFromInput(value) {
    const base = numberFromInput(value);
    if (base === null) return null;
    if (base > 1 && base <= 100) return base / 100;
    return base;
}
function formatSqm(value) {
    if (value === null || value === undefined) return "-";
    return `${value.toLocaleString("de-DE")} m²`;
}
function ManualInputsSheet({ listing, open, onOpenChange, onSaved }) {
    _s();
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(emptyState);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const title = listing?.title || "Ohne Titel";
    const loadListingInputs = async (listingId)=>{
        setLoading(true);
        setError(null);
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getManualInputs"])(listingId);
            if (!data) {
                setForm(emptyState);
                return;
            }
            setForm({
                hausgeld_monthly_eur: data.hausgeld_monthly_eur?.toString() ?? "",
                expected_rent_cold_monthly_eur: data.expected_rent_cold_monthly_eur?.toString() ?? "",
                vacancy_rate: data.vacancy_rate?.toString() ?? "",
                maintenance_reserve_monthly_eur: data.maintenance_reserve_monthly_eur?.toString() ?? "",
                is_estimated: data.is_estimated ?? true
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load manual inputs.");
        } finally{
            setLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ManualInputsSheet.useEffect": ()=>{
            if (!open || !listing) return;
            setErrors({});
            loadListingInputs(listing.id);
        }
    }["ManualInputsSheet.useEffect"], [
        open,
        listing?.id
    ]);
    const handleChange = (key, value)=>{
        setForm((prev)=>({
                ...prev,
                [key]: value
            }));
    };
    const validate = ()=>{
        const nextErrors = {};
        const hausgeld = numberFromInput(form.hausgeld_monthly_eur);
        const expectedRent = numberFromInput(form.expected_rent_cold_monthly_eur);
        const reserve = numberFromInput(form.maintenance_reserve_monthly_eur);
        const vacancy = vacancyFromInput(form.vacancy_rate);
        if (form.hausgeld_monthly_eur.trim() !== "" && (hausgeld === null || hausgeld < 0)) {
            nextErrors.hausgeld_monthly_eur = "Hausgeld muss eine nicht-negative Zahl sein.";
        }
        if (form.expected_rent_cold_monthly_eur.trim() !== "" && expectedRent === null) {
            nextErrors.expected_rent_cold_monthly_eur = "Bitte eine Zahl eingeben.";
        } else if (expectedRent !== null && expectedRent < 0) {
            nextErrors.expected_rent_cold_monthly_eur = "Erwartete Kaltmiete darf nicht negativ sein.";
        }
        if (form.maintenance_reserve_monthly_eur.trim() !== "" && reserve === null) {
            nextErrors.maintenance_reserve_monthly_eur = "Bitte eine Zahl eingeben.";
        } else if (reserve !== null && reserve < 0) {
            nextErrors.maintenance_reserve_monthly_eur = "Ruecklage darf nicht negativ sein.";
        }
        if (form.vacancy_rate.trim() !== "" && vacancy === null) {
            nextErrors.vacancy_rate = "Bitte eine Zahl eingeben.";
        } else if (vacancy !== null && (vacancy < 0 || vacancy > 1)) {
            nextErrors.vacancy_rate = "Leerstandsquote muss zwischen 0 und 1 liegen.";
        }
        return {
            nextErrors,
            parsed: {
                hausgeld,
                expectedRent,
                reserve,
                vacancy
            }
        };
    };
    const canSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ManualInputsSheet.useMemo[canSave]": ()=>!saving && !loading
    }["ManualInputsSheet.useMemo[canSave]"], [
        saving,
        loading
    ]);
    const handleSave = async ()=>{
        if (!listing) return;
        const { nextErrors, parsed } = validate();
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;
        const payload = {
            hausgeld_monthly_eur: parsed.hausgeld,
            expected_rent_cold_monthly_eur: parsed.expectedRent,
            vacancy_rate: parsed.vacancy,
            maintenance_reserve_monthly_eur: parsed.reserve,
            is_estimated: form.is_estimated
        };
        setSaving(true);
        setError(null);
        try {
            const saved = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["upsertManualInputs"])(listing.id, payload);
            onSaved(saved);
            onOpenChange(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save manual inputs.");
        } finally{
            setSaving(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
        open: open,
        onOpenChange: onOpenChange,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
            className: "sm:max-w-[560px]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                        children: "Manual Inputs"
                    }, void 0, false, {
                        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
                        lineNumber: 198,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
                    lineNumber: 197,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm font-medium text-foreground",
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
                                    lineNumber: 202,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs text-muted-foreground",
                                    children: [
                                        listing?.price_eur ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(listing.price_eur) : "-",
                                        " ·",
                                        " ",
                                        formatSqm(listing?.living_space_sqm),
                                        " · ",
                                        listing?.rooms ?? "-",
                                        " Zimmer"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
                                    lineNumber: 203,
                                    columnNumber: 13
                                }, this),
                                listing?.url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: listing.url,
                                    target: "_blank",
                                    rel: "noreferrer",
                                    className: "text-sm text-muted-foreground underline-offset-4 hover:underline",
                                    children: "Listing oeffnen"
                                }, void 0, false, {
                                    fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
                                    lineNumber: 208,
                                    columnNumber: 15
                                }, this) : null
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
                            lineNumber: 201,
                            columnNumber: 11
                        }, this),
                        loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm text-muted-foreground",
                            children: "Lade Daten..."
                        }, void 0, false, {
                            fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
                            lineNumber: 220,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            htmlFor: "hausgeld_monthly_eur",
                                            children: "Hausgeld monatlich (EUR)"
                                        }, void 0, false, {
                                            fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
                                            lineNumber: 224,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            id: "hausgeld_monthly_eur",
                                            inputMode: "decimal",
                                            value: form.hausgeld_monthly_eur,
                                            onChange: (e)=>handleChange("hausgeld_monthly_eur", e.target.value),
                                            placeholder: "Optional"
                                        }, void 0, false, {
                                            fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
                                            lineNumber: 225,
                                            columnNumber: 17
                                        }, this),
                                        errors.hausgeld_monthly_eur ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-destructive",
                                            children: errors.hausgeld_monthly_eur
                                        }, void 0, false, {
                                            fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
                                            lineNumber: 233,
                                            columnNumber: 19
                                        }, this) : null
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
                                    lineNumber: 223,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            htmlFor: "expected_rent_cold_monthly_eur",
                                            children: "Erwartete Kaltmiete monatlich (EUR)"
                                        }, void 0, false, {
                                            fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
                                            lineNumber: 238,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            id: "expected_rent_cold_monthly_eur",
                                            inputMode: "decimal",
                                            value: form.expected_rent_cold_monthly_eur,
                                            onChange: (e)=>handleChange("expected_rent_cold_monthly_eur", e.target.value),
                                            placeholder: "Optional"
                                        }, void 0, false, {
                                            fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
                                            lineNumber: 241,
                                            columnNumber: 17
                                        }, this),
                                        errors.expected_rent_cold_monthly_eur ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-destructive",
                                            children: errors.expected_rent_cold_monthly_eur
                                        }, void 0, false, {
                                            fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
                                            lineNumber: 251,
                                            columnNumber: 19
                                        }, this) : null
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
                                    lineNumber: 237,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            htmlFor: "vacancy_rate",
                                            children: "Leerstandsquote (0-1 oder %)"
                                        }, void 0, false, {
                                            fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
                                            lineNumber: 258,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            id: "vacancy_rate",
                                            inputMode: "decimal",
                                            value: form.vacancy_rate,
                                            onChange: (e)=>handleChange("vacancy_rate", e.target.value),
                                            placeholder: "z.B. 0.05 oder 5%"
                                        }, void 0, false, {
                                            fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
                                            lineNumber: 259,
                                            columnNumber: 17
                                        }, this),
                                        errors.vacancy_rate ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-destructive",
                                            children: errors.vacancy_rate
                                        }, void 0, false, {
                                            fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
                                            lineNumber: 267,
                                            columnNumber: 19
                                        }, this) : null
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
                                    lineNumber: 257,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            htmlFor: "maintenance_reserve_monthly_eur",
                                            children: "Instandhaltungsruecklage monatlich (EUR)"
                                        }, void 0, false, {
                                            fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
                                            lineNumber: 272,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            id: "maintenance_reserve_monthly_eur",
                                            inputMode: "decimal",
                                            value: form.maintenance_reserve_monthly_eur,
                                            onChange: (e)=>handleChange("maintenance_reserve_monthly_eur", e.target.value),
                                            placeholder: "Optional"
                                        }, void 0, false, {
                                            fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
                                            lineNumber: 275,
                                            columnNumber: 17
                                        }, this),
                                        errors.maintenance_reserve_monthly_eur ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-destructive",
                                            children: errors.maintenance_reserve_monthly_eur
                                        }, void 0, false, {
                                            fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
                                            lineNumber: 285,
                                            columnNumber: 19
                                        }, this) : null
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
                                    lineNumber: 271,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                                            id: "is_estimated",
                                            checked: form.is_estimated,
                                            onCheckedChange: (value)=>handleChange("is_estimated", value === true)
                                        }, void 0, false, {
                                            fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
                                            lineNumber: 292,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            htmlFor: "is_estimated",
                                            children: "Geschaetzte Werte"
                                        }, void 0, false, {
                                            fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
                                            lineNumber: 297,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
                                    lineNumber: 291,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
                            lineNumber: 222,
                            columnNumber: 13
                        }, this),
                        error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm text-destructive",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
                            lineNumber: 302,
                            columnNumber: 20
                        }, this) : null
                    ]
                }, void 0, true, {
                    fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
                    lineNumber: 200,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-end gap-2 pt-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "secondary",
                            onClick: ()=>onOpenChange(false),
                            children: "Abbrechen"
                        }, void 0, false, {
                            fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
                            lineNumber: 305,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: handleSave,
                            disabled: !canSave,
                            children: saving ? "Speichern..." : "Speichern"
                        }, void 0, false, {
                            fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
                            lineNumber: 308,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
                    lineNumber: 304,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
            lineNumber: 196,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx",
        lineNumber: 195,
        columnNumber: 5
    }, this);
}
_s(ManualInputsSheet, "A4Ly8Mx36ifcZfHHA2H6jA3OI9c=");
_c = ManualInputsSheet;
var _c;
__turbopack_context__.k.register(_c, "ManualInputsSheet");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ListingsTable",
    ()=>ListingsTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ui/table.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ManualInputsSheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ManualInputsSheet.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function formatSqm(value) {
    if (value === null || value === undefined) return "-";
    return `${value.toLocaleString("de-DE")} m²`;
}
function formatLocation(listing) {
    const cityLine = [
        listing.postcode,
        listing.city
    ].filter(Boolean).join(" ");
    const full = [
        cityLine,
        listing.quarter
    ].filter(Boolean).join(" · ");
    return full || "-";
}
function ListingsTable({ listings, loading, error, onReload, onListingUpdated }) {
    _s();
    const [selected, setSelected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const rows = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ListingsTable.useMemo[rows]": ()=>listings
    }["ListingsTable.useMemo[rows]"], [
        listings
    ]);
    const handleOpen = (listing)=>{
        setSelected(listing);
        setOpen(true);
    };
    const handleSaved = (saved)=>{
        if (!selected) return;
        onListingUpdated({
            ...selected,
            has_manual_inputs: saved !== null
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm text-muted-foreground",
                        children: loading ? "Lade Listings..." : `${rows.length} Listings`
                    }, void 0, false, {
                        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "outline",
                        size: "sm",
                        onClick: onReload,
                        disabled: loading,
                        children: "Neu laden"
                    }, void 0, false, {
                        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-border",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Table"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHeader"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                        children: "Titel"
                                    }, void 0, false, {
                                        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
                                        lineNumber: 77,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                        children: "Preis"
                                    }, void 0, false, {
                                        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
                                        lineNumber: 78,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                        children: "Qm"
                                    }, void 0, false, {
                                        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
                                        lineNumber: 79,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                        children: "Zimmer"
                                    }, void 0, false, {
                                        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
                                        lineNumber: 80,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                        children: "Ort"
                                    }, void 0, false, {
                                        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
                                        lineNumber: 81,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                        children: "Manual"
                                    }, void 0, false, {
                                        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
                                        lineNumber: 82,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                        className: "text-right",
                                        children: "Aktion"
                                    }, void 0, false, {
                                        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
                                        lineNumber: 83,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
                                lineNumber: 76,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
                            lineNumber: 75,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableBody"], {
                            children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                    colSpan: 7,
                                    className: "text-muted-foreground",
                                    children: "Lade Daten..."
                                }, void 0, false, {
                                    fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
                                    lineNumber: 89,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
                                lineNumber: 88,
                                columnNumber: 15
                            }, this) : error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                    colSpan: 7,
                                    className: "text-destructive",
                                    children: error
                                }, void 0, false, {
                                    fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
                                    lineNumber: 95,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
                                lineNumber: 94,
                                columnNumber: 15
                            }, this) : rows.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                    colSpan: 7,
                                    className: "text-muted-foreground",
                                    children: "Keine Listings gefunden."
                                }, void 0, false, {
                                    fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
                                    lineNumber: 101,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
                                lineNumber: 100,
                                columnNumber: 15
                            }, this) : rows.map((listing)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            className: "font-medium",
                                            children: listing.title || "Ohne Titel"
                                        }, void 0, false, {
                                            fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
                                            lineNumber: 108,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            children: listing.price_eur === null || listing.price_eur === undefined ? "-" : (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(listing.price_eur)
                                        }, void 0, false, {
                                            fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
                                            lineNumber: 111,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            children: formatSqm(listing.living_space_sqm)
                                        }, void 0, false, {
                                            fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
                                            lineNumber: 116,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            children: listing.rooms ?? "-"
                                        }, void 0, false, {
                                            fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
                                            lineNumber: 117,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            children: formatLocation(listing)
                                        }, void 0, false, {
                                            fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
                                            lineNumber: 118,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            children: listing.has_manual_inputs ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                variant: "success",
                                                children: "Manual ✓"
                                            }, void 0, false, {
                                                fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
                                                lineNumber: 121,
                                                columnNumber: 23
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                variant: "secondary",
                                                children: "Offen"
                                            }, void 0, false, {
                                                fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
                                                lineNumber: 123,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
                                            lineNumber: 119,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            className: "text-right",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "outline",
                                                size: "sm",
                                                onClick: ()=>handleOpen(listing),
                                                children: "Edit"
                                            }, void 0, false, {
                                                fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
                                                lineNumber: 127,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
                                            lineNumber: 126,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, listing.id, true, {
                                    fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
                                    lineNumber: 107,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
                            lineNumber: 86,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
                    lineNumber: 74,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
                lineNumber: 73,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ManualInputsSheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ManualInputsSheet"], {
                listing: selected,
                open: open,
                onOpenChange: setOpen,
                onSaved: handleSaved
            }, void 0, false, {
                fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, this);
}
_s(ListingsTable, "el55su5n6gUFFwfaHokEpnTQJaU=");
_c = ListingsTable;
var _c;
__turbopack_context__.k.register(_c, "ListingsTable");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/app/listings/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ListingsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ListingsTable$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/components/ListingsTable.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/lib/api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function ListingsPage() {
    _s();
    const [listings, setListings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const loadListings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ListingsPage.useCallback[loadListings]": async ()=>{
            setLoading(true);
            setError(null);
            try {
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getListings"])();
                setListings(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load listings.");
            } finally{
                setLoading(false);
            }
        }
    }["ListingsPage.useCallback[loadListings]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ListingsPage.useEffect": ()=>{
            loadListings();
        }
    }["ListingsPage.useEffect"], [
        loadListings
    ]);
    const handleListingUpdated = (updated)=>{
        setListings((prev)=>prev.map((item)=>item.id === updated.id ? {
                    ...item,
                    ...updated
                } : item));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6 p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-semibold tracking-tight",
                        children: "Manual Inputs"
                    }, void 0, false, {
                        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/app/listings/page.tsx",
                        lineNumber: 39,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-muted-foreground",
                        children: "Listings laden und manuelle Kennzahlen pflegen."
                    }, void 0, false, {
                        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/app/listings/page.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/app/listings/page.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Coding_Projects$2f$immos$2f$immo$2d$scan$2f$apps$2f$frontend$2f$src$2f$components$2f$ListingsTable$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ListingsTable"], {
                listings: listings,
                loading: loading,
                error: error,
                onReload: loadListings,
                onListingUpdated: handleListingUpdated
            }, void 0, false, {
                fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/app/listings/page.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Coding_Projects/immos/immo-scan/apps/frontend/src/app/listings/page.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
_s(ListingsPage, "LzpHmTWkgjoxRyv8Mm/88zuGHjY=");
_c = ListingsPage;
var _c;
__turbopack_context__.k.register(_c, "ListingsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Coding_Projects_immos_immo-scan_apps_frontend_src_d005654d._.js.map