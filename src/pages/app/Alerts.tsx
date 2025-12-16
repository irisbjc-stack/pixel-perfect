import { motion } from "framer-motion";
import { useAppStore } from "@/stores/appStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, Info, CheckCircle, X } from "lucide-react";

export default function Alerts() {
  const { alerts, acknowledgeAlert } = useAppStore();

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case "critical": return { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30" };
      case "warning": return { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", border: "border-warning/30" };
      default: return { icon: Info, color: "text-accent", bg: "bg-accent/10", border: "border-accent/30" };
    }
  };

  const sortedAlerts = [...alerts].sort((a, b) => {
    if (a.acknowledged !== b.acknowledged) return a.acknowledged ? 1 : -1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alerts & Faults</h1>
          <p className="text-muted-foreground">Monitor system alerts and robot faults</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-sm">
          <Bell className="w-4 h-4" />
          <span>{alerts.filter(a => !a.acknowledged).length} Unread</span>
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {sortedAlerts.map((alert, index) => {
          const config = getSeverityConfig(alert.severity);
          const Icon = config.icon;
          
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`bg-card border ${alert.acknowledged ? "border-border opacity-60" : config.border} transition-all`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${config.bg} ${config.color}`}>
                          {alert.severity}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {alert.robotId.replace("robot_", "Robot ")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-foreground">{alert.message}</p>
                    </div>
                    {!alert.acknowledged && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="shrink-0"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Acknowledge
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {alerts.length === 0 && (
          <div className="text-center py-16">
            <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-semibold text-foreground mb-2">No alerts</h3>
            <p className="text-muted-foreground">All systems are operating normally</p>
          </div>
        )}
      </div>
    </div>
  );
}
