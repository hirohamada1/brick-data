import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// Zwei Funktionen aus Clerk ziehen
// clerkMiddleware ist ein Wrapper für Next.js Middleware, der Clerk Auth in die Request-Pipeline einhängt.
// createRouteMatcher ist ein Helfer, um sehr bequem zu prüfen, ob eine URL zu einer Liste von Mustern passt (public routes).

console.log("MIDDLEWARE FILE LOADED");

//Funktion die true zurückgibt, wenn die URL zu einer Liste von Mustern passt (public routes).
const isPublicRoute = createRouteMatcher([
    "/start(.*)",
    "/impressum(.*)",
    "/datenschutz(.*)",
    "/kontakt(.*)",
    "/api/lead(.*)",
]);

//Wenn jemand z.B. Dashboard aufruft dann für next.js middleware.ts aus bevor die Seite gerendert wird 
//Clerk liest daraus die Auth Infos 
//Wenn Berechtigung da ist dann gehts weiter sonst zurück
export default clerkMiddleware(async (auth, req) => {
    console.log("MIDDLEWARE HIT:", req.nextUrl.pathname);

    if (!isPublicRoute(req)) {
        await auth.protect();
    }
});

// Sagt Nextjs auf welche Requests die Middleware angewendet werden soll, auf alles ausser png css js svg und so weiter
export const config = {
    matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",],
};