import { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/stores/appStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Search, Filter, Package, Clock, ArrowRight, MoreVertical } from "lucide-react";
import { mockZones } from "@/lib/mockData";

export default function Tasks() {
  const { tasks, addTask, updateTask, robots } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [newTask, setNewTask] = useState({
    fromZone: "",
    toZone: "",
    priority: "normal" as "low" | "normal" | "high" | "critical",
    payload: "medication" as "medication" | "sample" | "equipment" | "supplies",
    notes: "",
  });

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.fromZone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.toZone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateTask = () => {
    if (!newTask.fromZone || !newTask.toZone) {
      toast.error("Please select both pickup and delivery zones");
      return;
    }

    addTask({
      requesterId: "u_clinician",
      fromZone: newTask.fromZone,
      toZone: newTask.toZone,
      priority: newTask.priority,
      payload: newTask.payload,
      notes: newTask.notes,
    });

    toast.success("Task created — Robot will be assigned shortly");
    setIsCreateOpen(false);
    setNewTask({ fromZone: "", toZone: "", priority: "normal", payload: "medication", notes: "" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-success/20 text-success";
      case "in_progress": return "bg-accent/20 text-accent";
      case "queued": return "bg-muted text-muted-foreground";
      case "assigned": return "bg-primary/20 text-primary";
      default: return "bg-destructive/20 text-destructive";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-destructive text-destructive-foreground";
      case "high": return "bg-warning text-warning-foreground";
      case "normal": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const zones = Array.from(new Set(mockZones.map(z => z.name)));

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Task Manager</h1>
          <p className="text-muted-foreground">Create and manage delivery tasks</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Delivery Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From Zone</Label>
                  <Select value={newTask.fromZone} onValueChange={(v) => setNewTask({ ...newTask, fromZone: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {zones.map(zone => (
                        <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>To Zone</Label>
                  <Select value={newTask.toZone} onValueChange={(v) => setNewTask({ ...newTask, toZone: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {zones.map(zone => (
                        <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={newTask.priority} onValueChange={(v: any) => setNewTask({ ...newTask, priority: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Payload Type</Label>
                  <Select value={newTask.payload} onValueChange={(v: any) => setNewTask({ ...newTask, payload: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medication">Medication</SelectItem>
                      <SelectItem value="sample">Sample</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="supplies">Supplies</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes (optional)</Label>
                <Textarea
                  value={newTask.notes}
                  onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                  placeholder="Add delivery instructions..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateTask}>Create Task</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="queued">Queued</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Task List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-3"
      >
        {filteredTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-card border-border hover:border-primary/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-foreground">{task.fromZone}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold text-foreground">{task.toZone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="capitalize">{task.payload}</span>
                        {task.assignedRobotId && (
                          <>
                            <span>•</span>
                            <span>{robots.find(r => r.id === task.assignedRobotId)?.name}</span>
                          </>
                        )}
                        {task.eta && (
                          <>
                            <span>•</span>
                            <Clock className="w-3 h-3" />
                            <span>~{task.eta} min</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status.replace("_", " ")}
                    </span>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-semibold text-foreground mb-2">No tasks found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterStatus !== "all" 
                ? "Try adjusting your filters" 
                : "Create your first delivery task to get started"}
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
