import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/context/ThemeContext";
import { User, Bell, Database, Sun, Moon } from "lucide-react";

export function Settings() {
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState({
    name: "Max Mustermann",
    email: "max@example.com",
  });
  const [notifications, setNotifications] = useState({
    emailDigest: true,
    inApp: true,
    push: false,
  });
  const [dataSources, setDataSources] = useState({
    immoscout: true,
    kleinanzeigen: true,
    immowelt: true,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Einstellungen</h1>
        <p className="text-muted-foreground mt-1">
          Profil, Benachrichtigungen und Datenquellen
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profil (Mock)
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Benutzerdaten werden lokal gespeichert.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, email: e.target.value }))
                }
              />
            </div>
            <Button disabled>Speichern</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Benachrichtigungen
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Wie möchtest du über neue Pings informiert werden?
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>E-Mail Digest</Label>
                <p className="text-sm text-muted-foreground">
                  Tägliche Zusammenfassung per E-Mail
                </p>
              </div>
              <Switch
                checked={notifications.emailDigest}
                onCheckedChange={(c) =>
                  setNotifications((n) => ({ ...n, emailDigest: !!c }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>In-App Benachrichtigungen</Label>
                <p className="text-sm text-muted-foreground">
                  Sofortige Pings in der App
                </p>
              </div>
              <Switch
                checked={notifications.inApp}
                onCheckedChange={(c) =>
                  setNotifications((n) => ({ ...n, inApp: !!c }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Push-Benachrichtigungen</Label>
                <p className="text-sm text-muted-foreground">
                  Push auf Gerät (Mock)
                </p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(c) =>
                  setNotifications((n) => ({ ...n, push: !!c }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              Darstellung
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Theme für die Oberfläche wählen.
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                onClick={() => setTheme("light")}
              >
                <Sun className="h-4 w-4 mr-2" />
                Hell
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                onClick={() => setTheme("dark")}
              >
                <Moon className="h-4 w-4 mr-2" />
                Dunkel
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Datenquellen
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Quellen für Immobilien-Daten aktivieren (nur UI, Mock).
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label>Immoscout24</Label>
              <Switch
                checked={dataSources.immoscout}
                onCheckedChange={(c) =>
                  setDataSources((d) => ({ ...d, immoscout: !!c }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label>Kleinanzeigen</Label>
              <Switch
                checked={dataSources.kleinanzeigen}
                onCheckedChange={(c) =>
                  setDataSources((d) => ({ ...d, kleinanzeigen: !!c }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label>Immowelt</Label>
              <Switch
                checked={dataSources.immowelt}
                onCheckedChange={(c) =>
                  setDataSources((d) => ({ ...d, immowelt: !!c }))
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
