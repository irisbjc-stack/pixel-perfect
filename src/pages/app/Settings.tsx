import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/stores/appStore";
import { Wifi, WifiOff, Gauge, Sliders, Download, Code } from "lucide-react";

export default function Settings() {
  const { networkStatus, setNetworkStatus, simulationSpeed, setSimulationSpeed } = useAppStore();

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Configure simulation and integration settings</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Network Simulation */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="w-5 h-5 text-primary" />
              Network Simulation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Simulate different network conditions to test system resilience.
            </p>
            <div className="space-y-3">
              {[
                { value: "online", label: "Online", description: "Normal operation" },
                { value: "degraded", label: "Degraded", description: "High latency, packet loss" },
                { value: "offline", label: "Offline", description: "No connection" },
              ].map((option) => (
                <div
                  key={option.value}
                  onClick={() => setNetworkStatus(option.value as any)}
                  className={`p-3 rounded-lg cursor-pointer border transition-colors ${
                    networkStatus === option.value
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      option.value === "online" ? "bg-success" :
                      option.value === "degraded" ? "bg-warning" : "bg-destructive"
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Simulation Speed */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-primary" />
              Simulation Speed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Adjust the speed of robot movement and task progression.
            </p>
            <div className="space-y-3">
              {[
                { value: 0.5, label: "0.5x", description: "Slow motion" },
                { value: 1, label: "1x", description: "Real-time" },
                { value: 2, label: "2x", description: "Fast" },
                { value: 5, label: "5x", description: "Very fast" },
              ].map((option) => (
                <div
                  key={option.value}
                  onClick={() => setSimulationSpeed(option.value)}
                  className={`p-3 rounded-lg cursor-pointer border transition-colors ${
                    simulationSpeed === option.value
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Developer Tools */}
        <Card className="bg-card border-border md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              Developer Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Tools for development and debugging. These actions are for demo purposes.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => localStorage.clear()}>
                Clear Local Storage
              </Button>
              <Button variant="outline" onClick={() => console.log(useAppStore.getState())}>
                Dump State to Console
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Logs (CSV)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
