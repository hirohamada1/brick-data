import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Hier wird definiert, welche Routes public sind. D.h. nicht geschützt.
const isPublicRoute = createRouteMatcher([
    "/",
    "/start(.*)",
    "/sign-up(.*)",
    "/impressum(.*)",
    "/datenschutz(.*)",
    "/kontakt(.*)",
    "/api/lead(.*)",
]);

// Hier wird die Middleware definiert. D.h. die Middleware wird aufgerufen, wenn eine Route aufgerufen wird.
export default clerkMiddleware(async (auth, req) => {
    const path = req.nextUrl.pathname;
    const pub = isPublicRoute(req);

    console.log("MIDDLEWARE HIT:", path, "isPublic?", pub);

    //
    if (!pub) {
        //Wenn eine Route nicht öffentlich ist wird hier geschaut ob Clerk schon die Berechtigungen geprüft hat.
        await auth.protect();
    }
});

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};