import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/stores/appStore";
import { Play, Pause, RotateCcw, Zap, AlertTriangle, Clock } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const scenarios = [
  {
    id: "normal",
    name: "Normal Day",
    description: "Typical hospital operations with steady task flow",
    icon: Clock,
  },
  {
    id: "high_priority",
    name: "High Priority Spike",
    description: "Simulate surge of critical deliveries",
    icon: Zap,
  },
  {
    id: "fault_injection",
    name: "Fault Injection",
    description: "Inject random robot faults and obstacles",
    icon: AlertTriangle,
  },
];

export default function Simulation() {
  const { isSimulationRunning, startSimulation, stopSimulation, addAlert, addTask } = useAppStore();
  const [selectedScenario, setSelectedScenario] = useState("normal");

  const handleStartScenario = () => {
    startSimulation();
    toast.success(`Started "${scenarios.find(s => s.id === selectedScenario)?.name}" scenario`);
    
    // Inject some events based on scenario
    if (selectedScenario === "fault_injection") {
      setTimeout(() => {
        addAlert({
          robotId: "robot_R07",
          severity: "warning",
          message: "Wheel slip detected in Corridor C",
          acknowledged: false,
        });
      }, 2000);
    }

    if (selectedScenario === "high_priority") {
      addTask({
        requesterId: "u_clinician",
        fromZone: "Pharmacy",
        toZone: "ICU",
        priority: "critical",
        payload: "medication",
        notes: "Emergency cardiac medication",
      });
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Simulation Sandbox</h1>
          <p className="text-muted-foreground">Run scenarios to test system behavior</p>
        </div>
        <div className="flex items-center gap-2">
          {isSimulationRunning && (
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 text-success text-sm">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Running
            </span>
          )}
        </div>
      </div>

      {/* Scenario Selection */}
      <div className="grid md:grid-cols-3 gap-4">
        {scenarios.map((scenario) => (
          <Card
            key={scenario.id}
            onClick={() => setSelectedScenario(scenario.id)}
            className={`cursor-pointer transition-all ${
              selectedScenario === scenario.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  selectedScenario === scenario.id ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                }`}>
                  <scenario.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{scenario.name}</h3>
                  <p className="text-sm text-muted-foreground">{scenario.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Controls */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Simulation Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {isSimulationRunning ? (
              <Button variant="destructive" onClick={stopSimulation}>
                <Pause className="w-4 h-4 mr-2" />
                Stop Simulation
              </Button>
            ) : (
              <Button variant="success" onClick={handleStartScenario}>
                <Play className="w-4 h-4 mr-2" />
                Start Simulation
              </Button>
            )}
            <Button variant="outline" onClick={() => {
              stopSimulation();
              toast.info("Simulation reset");
            }}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
