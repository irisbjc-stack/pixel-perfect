import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Robot, Task, Alert, mockUsers, mockRobots, mockTasks, mockAlerts } from "@/lib/mockData";

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;

  // Robots
  robots: Robot[];
  updateRobot: (id: string, updates: Partial<Robot>) => void;
  
  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "status">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  
  // Alerts
  alerts: Alert[];
  acknowledgeAlert: (id: string) => void;
  addAlert: (alert: Omit<Alert, "id" | "timestamp">) => void;

  // Simulation
  isSimulationRunning: boolean;
  simulationSpeed: number;
  startSimulation: () => void;
  stopSimulation: () => void;
  setSimulationSpeed: (speed: number) => void;
  
  // Network simulation
  networkStatus: "online" | "offline" | "degraded";
  setNetworkStatus: (status: "online" | "offline" | "degraded") => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth state
      currentUser: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const user = mockUsers.find(u => u.email === email);
        if (user) {
          // In a real app, we'd validate the password with the backend
          set({ currentUser: user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      
      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },

      // Robots
      robots: mockRobots,
      updateRobot: (id, updates) => {
        set(state => ({
          robots: state.robots.map(r => 
            r.id === id ? { ...r, ...updates, lastSeen: new Date() } : r
          ),
        }));
      },

      // Tasks
      tasks: mockTasks,
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: `task_${Date.now()}`,
          status: "queued",
          createdAt: new Date(),
        };
        set(state => ({ tasks: [newTask, ...state.tasks] }));
      },
      updateTask: (id, updates) => {
        set(state => ({
          tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t),
        }));
      },

      // Alerts
      alerts: mockAlerts,
      acknowledgeAlert: (id) => {
        set(state => ({
          alerts: state.alerts.map(a => 
            a.id === id ? { ...a, acknowledged: true } : a
          ),
        }));
      },
      addAlert: (alertData) => {
        const newAlert: Alert = {
          ...alertData,
          id: `alert_${Date.now()}`,
          timestamp: new Date(),
        };
        set(state => ({ alerts: [newAlert, ...state.alerts] }));
      },

      // Simulation
      isSimulationRunning: false,
      simulationSpeed: 1,
      startSimulation: () => set({ isSimulationRunning: true }),
      stopSimulation: () => set({ isSimulationRunning: false }),
      setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),

      // Network
      networkStatus: "online",
      setNetworkStatus: (status) => set({ networkStatus: status }),
    }),
    {
      name: "medibot-storage",
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        tasks: state.tasks,
        alerts: state.alerts,
      }),
    }
  )
);
