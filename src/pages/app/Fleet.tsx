import { motion } from "framer-motion";
import { useAppStore } from "@/stores/appStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Bot, 
  Battery, 
  MapPin, 
  Activity, 
  Pause, 
  Play, 
  Home,
  AlertTriangle,
  Wifi,
  WifiOff
} from "lucide-react";

export default function Fleet() {
  const { robots, updateRobot } = useAppStore();

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "en_route": return { color: "text-accent", bg: "bg-accent/20", label: "En Route" };
      case "idle": return { color: "text-success", bg: "bg-success/20", label: "Idle" };
      case "charging": return { color: "text-warning", bg: "bg-warning/20", label: "Charging" };
      case "error": return { color: "text-destructive", bg: "bg-destructive/20", label: "Error" };
      case "offline": return { color: "text-muted-foreground", bg: "bg-muted", label: "Offline" };
      default: return { color: "text-muted-foreground", bg: "bg-muted", label: status };
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return "text-success";
    if (level > 20) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Robot Fleet</h1>
          <p className="text-muted-foreground">Monitor and control your fleet of delivery robots</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 text-success text-sm">
            <Wifi className="w-4 h-4" />
            <span>{robots.filter(r => r.status !== "offline").length} Online</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-sm">
            <WifiOff className="w-4 h-4" />
            <span>{robots.filter(r => r.status === "offline").length} Offline</span>
          </div>
        </div>
      </div>

      {/* Fleet Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {robots.map((robot, index) => {
          const statusConfig = getStatusConfig(robot.status);
          return (
            <motion.div
              key={robot.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card border-border hover:border-primary/30 transition-all hover:shadow-lg group">
                <CardContent className="p-5">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl ${statusConfig.bg} flex items-center justify-center`}>
                        <Bot className={`w-6 h-6 ${statusConfig.color}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground">{robot.name}</h3>
                        <span className={`text-sm ${statusConfig.color}`}>{statusConfig.label}</span>
                      </div>
                    </div>
                    {robot.status === "error" && (
                      <AlertTriangle className="w-5 h-5 text-destructive animate-pulse" />
                    )}
                  </div>

                  {/* Stats */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Battery className={`w-4 h-4 ${getBatteryColor(robot.battery)}`} />
                        <span className="text-sm">Battery</span>
                      </div>
                      <span className={`font-mono font-semibold ${getBatteryColor(robot.battery)}`}>
                        {robot.battery}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          robot.battery > 50 ? "bg-success" :
                          robot.battery > 20 ? "bg-warning" : "bg-destructive"
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${robot.battery}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>Floor {robot.floor}</span>
                      </div>
                      <span className="font-mono text-foreground">
                        ({robot.pose.x.toFixed(1)}, {robot.pose.y.toFixed(1)})
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Activity className="w-4 h-4" />
                        <span>Confidence</span>
                      </div>
                      <span className={`font-mono ${
                        robot.localizationConfidence > 0.9 ? "text-success" :
                        robot.localizationConfidence > 0.7 ? "text-warning" : "text-destructive"
                      }`}>
                        {(robot.localizationConfidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {robot.status === "en_route" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => updateRobot(robot.id, { status: "idle" })}
                      >
                        <Pause className="w-4 h-4 mr-1" />
                        Pause
                      </Button>
                    ) : robot.status === "idle" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => updateRobot(robot.id, { status: "en_route" })}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Resume
                      </Button>
                    ) : null}
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => updateRobot(robot.id, { status: "charging" })}
                    >
                      <Home className="w-4 h-4 mr-1" />
                      Dock
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
