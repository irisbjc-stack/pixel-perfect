// Mock data for the healthcare robotics platform
// These will be replaced with real API calls later

export interface User {
  id: string;
  name: string;
  role: "admin" | "operator" | "clinician" | "guest";
  email: string;
  avatar?: string;
}

export interface Robot {
  id: string;
  name: string;
  status: "idle" | "en_route" | "charging" | "error" | "offline";
  battery: number;
  floor: number;
  pose: { x: number; y: number; theta: number };
  localizationConfidence: number;
  currentTaskId?: string;
  lastSeen: Date;
}

export interface Task {
  id: string;
  requesterId: string;
  fromZone: string;
  toZone: string;
  priority: "low" | "normal" | "high" | "critical";
  payload: "medication" | "sample" | "equipment" | "supplies";
  status: "queued" | "assigned" | "in_progress" | "completed" | "cancelled";
  assignedRobotId?: string;
  createdAt: Date;
  completedAt?: Date;
  notes?: string;
  eta?: number;
}

export interface Alert {
  id: string;
  robotId: string;
  severity: "info" | "warning" | "critical";
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

export interface Zone {
  id: string;
  type: "pharmacy" | "ward" | "icu" | "lab" | "corridor" | "elevator" | "dock";
  name: string;
  floor: number;
  polygon: number[][];
  accessRules: string[];
  restricted: boolean;
}

export interface Model {
  id: string;
  type: "SLAM" | "NLP";
  version: string;
  metrics: Record<string, number>;
  deployedAt: Date;
  coverage: number;
}

export const mockUsers: User[] = [
  { id: "u_admin", name: "Alice Admin", role: "admin", email: "alice@hospital.test" },
  { id: "u_operator", name: "Omar Operator", role: "operator", email: "omar@hospital.test" },
  { id: "u_clinician", name: "Nina Clinician", role: "clinician", email: "nina@hospital.test" },
];

export const mockRobots: Robot[] = [
  {
    id: "robot_R07",
    name: "R-07",
    status: "en_route",
    battery: 72,
    floor: 2,
    pose: { x: 12.3, y: 45.9, theta: 1.57 },
    localizationConfidence: 0.95,
    currentTaskId: "task_001",
    lastSeen: new Date(),
  },
  {
    id: "robot_R08",
    name: "R-08",
    status: "idle",
    battery: 98,
    floor: 1,
    pose: { x: 5.2, y: 20.1, theta: 0.2 },
    localizationConfidence: 0.99,
    lastSeen: new Date(),
  },
  {
    id: "robot_R09",
    name: "R-09",
    status: "charging",
    battery: 34,
    floor: 1,
    pose: { x: 2.0, y: 5.0, theta: 0 },
    localizationConfidence: 0.97,
    lastSeen: new Date(),
  },
  {
    id: "robot_R10",
    name: "R-10",
    status: "idle",
    battery: 85,
    floor: 3,
    pose: { x: 30.5, y: 15.2, theta: 3.14 },
    localizationConfidence: 0.92,
    lastSeen: new Date(),
  },
];

export const mockTasks: Task[] = [
  {
    id: "task_001",
    requesterId: "u_clinician",
    fromZone: "Pharmacy",
    toZone: "Ward 5B",
    priority: "high",
    payload: "medication",
    status: "in_progress",
    assignedRobotId: "robot_R07",
    createdAt: new Date(Date.now() - 1800000),
    eta: 8,
    notes: "Urgent insulin delivery",
  },
  {
    id: "task_002",
    requesterId: "u_clinician",
    fromZone: "Lab",
    toZone: "Ward 3A",
    priority: "normal",
    payload: "sample",
    status: "queued",
    createdAt: new Date(Date.now() - 900000),
  },
  {
    id: "task_003",
    requesterId: "u_operator",
    fromZone: "Storage",
    toZone: "ICU",
    priority: "critical",
    payload: "equipment",
    status: "queued",
    createdAt: new Date(Date.now() - 300000),
    notes: "Emergency ventilator parts",
  },
];

export const mockAlerts: Alert[] = [
  {
    id: "alert_101",
    robotId: "robot_R07",
    severity: "warning",
    message: "Low localization confidence in Corridor B",
    timestamp: new Date(Date.now() - 300000),
    acknowledged: false,
  },
  {
    id: "alert_102",
    robotId: "robot_R09",
    severity: "info",
    message: "Charging cycle complete in 15 minutes",
    timestamp: new Date(Date.now() - 600000),
    acknowledged: true,
  },
];

export const mockZones: Zone[] = [
  { id: "zone_pharmacy", type: "pharmacy", name: "Main Pharmacy", floor: 1, polygon: [[10, 10], [50, 10], [50, 40], [10, 40]], accessRules: ["clinician", "operator", "admin"], restricted: false },
  { id: "zone_ward5b", type: "ward", name: "Ward 5B", floor: 2, polygon: [[60, 20], [100, 20], [100, 60], [60, 60]], accessRules: ["clinician", "operator", "admin"], restricted: false },
  { id: "zone_icu", type: "icu", name: "ICU", floor: 2, polygon: [[10, 60], [50, 60], [50, 90], [10, 90]], accessRules: ["admin"], restricted: true },
  { id: "zone_lab", type: "lab", name: "Laboratory", floor: 1, polygon: [[60, 60], [100, 60], [100, 90], [60, 90]], accessRules: ["clinician", "operator", "admin"], restricted: false },
  { id: "zone_dock", type: "dock", name: "Charging Dock", floor: 1, polygon: [[0, 0], [10, 0], [10, 10], [0, 10]], accessRules: ["operator", "admin"], restricted: false },
];

export const mockModels: Model[] = [
  { id: "slam_v1", type: "SLAM", version: "1.0.0", metrics: { localizationConfidence: 0.96 }, deployedAt: new Date(Date.now() - 86400000 * 30), coverage: 100 },
  { id: "nlp_v2", type: "NLP", version: "2.0.0", metrics: { intentAccuracy: 0.93 }, deployedAt: new Date(Date.now() - 86400000 * 7), coverage: 75 },
];

// Demo credentials
export const demoCredentials = {
  admin: { email: "alice@hospital.test", password: "AdminDemo123!" },
  operator: { email: "omar@hospital.test", password: "OperatorDemo123!" },
  clinician: { email: "nina@hospital.test", password: "ClinicianDemo123!" },
};
