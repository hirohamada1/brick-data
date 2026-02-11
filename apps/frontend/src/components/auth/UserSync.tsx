"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

export function UserSync() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const pathname = usePathname();
    const syncedRef = useRef(false);

    useEffect(() => {
        if (isLoaded && user && !syncedRef.current) {
            // Prevent double syncing in React strict mode or quick re-renders
            syncedRef.current = true;

            const payload = {
                clerk_id: user.id || "",
                email: user.primaryEmailAddress?.emailAddress || "",
                first_name: user.firstName || "",
                last_name: user.lastName || "",
            };

            console.log("Syncing user to backend...", payload);

            fetch("http://localhost:3001/api/sync-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })
                .then((res) => {
                    if (!res.ok) {
                        console.error("Failed to sync user", res.statusText);
                        syncedRef.current = false; // Retry later? Or just log error
                    } else {
                        console.log("User synced successfully");
                    }
                })
                .catch((err) => {
                    console.error("Sync failed", err);
                    syncedRef.current = false;
                });
        }
    }, [isLoaded, user]);

    // Redirect to dashboard if logged in and on landing page
    useEffect(() => {
        if (isLoaded && user && pathname === "/") {
            router.push("/dashboard");
        }
    }, [isLoaded, user, pathname, router]);

    return null;
}
