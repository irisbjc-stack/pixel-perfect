import { motion } from "framer-motion";
import { useAppStore } from "@/stores/appStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Clock, 
  Bot, 
  AlertTriangle, 
  Plus, 
  Play, 
  Pause,
  TrendingUp,
  Battery,
  MapPin
} from "lucide-react";
import { Link } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const { robots, tasks, alerts, isSimulationRunning, startSimulation, stopSimulation } = useAppStore();

  const activeRobots = robots.filter(r => r.status === "en_route" || r.status === "idle").length;
  const completedToday = tasks.filter(t => t.status === "completed").length;
  const inProgressTasks = tasks.filter(t => t.status === "in_progress").length;
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged).length;

  const stats = [
    { 
      label: "Deliveries Today", 
      value: completedToday, 
      icon: Package, 
      color: "text-primary",
      bgColor: "bg-primary/10" 
    },
    { 
      label: "Avg. ETA", 
      value: "4.2 min", 
      icon: Clock, 
      color: "text-accent",
      bgColor: "bg-accent/10" 
    },
    { 
      label: "Active Robots", 
      value: `${activeRobots}/${robots.length}`, 
      icon: Bot, 
      color: "text-success",
      bgColor: "bg-success/10" 
    },
    { 
      label: "Active Alerts", 
      value: unacknowledgedAlerts, 
      icon: AlertTriangle, 
      color: unacknowledgedAlerts > 0 ? "text-warning" : "text-muted-foreground",
      bgColor: unacknowledgedAlerts > 0 ? "bg-warning/10" : "bg-muted" 
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Fleet overview and quick actions</p>
        </div>
        <div className="flex gap-2">
          <Link to="/app/tasks">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
          </Link>
          <Button
            variant={isSimulationRunning ? "destructive" : "success"}
            onClick={isSimulationRunning ? stopSimulation : startSimulation}
          >
            {isSimulationRunning ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Stop Sim
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Sim
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <Card className="bg-card border-border hover:border-primary/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Fleet Status */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible" className="lg:col-span-2">
          <Card className="bg-card border-border h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground">Fleet Status</CardTitle>
              <Link to="/app/fleet">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {robots.map((robot) => (
                  <div
                    key={robot.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        robot.status === "en_route" ? "bg-accent/20 text-accent" :
                        robot.status === "idle" ? "bg-success/20 text-success" :
                        robot.status === "charging" ? "bg-warning/20 text-warning" :
                        "bg-destructive/20 text-destructive"
                      }`}>
                        <Bot className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{robot.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {robot.status.replace("_", " ")} • Floor {robot.floor}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Battery className={`w-4 h-4 ${
                          robot.battery > 50 ? "text-success" :
                          robot.battery > 20 ? "text-warning" : "text-destructive"
                        }`} />
                        <span className="text-sm font-mono text-foreground">{robot.battery}%</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-mono">
                          ({robot.pose.x.toFixed(1)}, {robot.pose.y.toFixed(1)})
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Tasks */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
          <Card className="bg-card border-border h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground">Active Tasks</CardTitle>
              <Link to="/app/tasks">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tasks.filter(t => t.status !== "completed" && t.status !== "cancelled").slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        task.priority === "critical" ? "bg-destructive/20 text-destructive" :
                        task.priority === "high" ? "bg-warning/20 text-warning" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {task.priority}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {task.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {task.fromZone} → {task.toZone}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">{task.payload}</p>
                  </div>
                ))}
                {tasks.filter(t => t.status !== "completed" && t.status !== "cancelled").length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No active tasks</p>
                    <Link to="/app/tasks">
                      <Button variant="link" size="sm">Create a task</Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
