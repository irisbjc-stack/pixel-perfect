import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/stores/appStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockZones } from "@/lib/mockData";
import { Layers, ZoomIn, ZoomOut, Maximize2, Bot, Battery, Play, Pause } from "lucide-react";

export default function MapViewer() {
  const { robots, isSimulationRunning, startSimulation, stopSimulation } = useAppStore();
  const [selectedFloor, setSelectedFloor] = useState("2");
  const [zoom, setZoom] = useState(1);
  const [showZones, setShowZones] = useState(true);
  const [showPaths, setShowPaths] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);

  const floorRobots = robots.filter(r => r.floor === parseInt(selectedFloor));
  const floorZones = mockZones.filter(z => z.floor === parseInt(selectedFloor));

  const getZoneColor = (type: string) => {
    switch (type) {
      case "pharmacy": return "fill-primary/20 stroke-primary";
      case "ward": return "fill-accent/20 stroke-accent";
      case "icu": return "fill-destructive/20 stroke-destructive";
      case "lab": return "fill-warning/20 stroke-warning";
      case "dock": return "fill-success/20 stroke-success";
      default: return "fill-secondary/20 stroke-secondary";
    }
  };

  const getRobotColor = (status: string) => {
    switch (status) {
      case "en_route": return "#22d3ee";
      case "idle": return "#22c55e";
      case "charging": return "#eab308";
      case "error": return "#ef4444";
      default: return "#6b7280";
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] lg:h-screen p-4 lg:p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Map Viewer</h1>
          <p className="text-muted-foreground">Real-time floor map with robot tracking</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select value={selectedFloor} onValueChange={setSelectedFloor}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select floor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Floor 1</SelectItem>
              <SelectItem value="2">Floor 2</SelectItem>
              <SelectItem value="3">Floor 3</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={showZones ? "default" : "outline"}
            size="sm"
            onClick={() => setShowZones(!showZones)}
          >
            <Layers className="w-4 h-4 mr-1" />
            Zones
          </Button>
          <Button
            variant={isSimulationRunning ? "destructive" : "success"}
            size="sm"
            onClick={isSimulationRunning ? stopSimulation : startSimulation}
          >
            {isSimulationRunning ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {isSimulationRunning ? "Stop" : "Simulate"}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 grid lg:grid-cols-4 gap-4 min-h-0">
        {/* Map */}
        <Card className="lg:col-span-3 bg-card border-border overflow-hidden flex flex-col">
          <CardContent className="flex-1 p-0 relative">
            {/* Zoom controls */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
              <Button variant="secondary" size="icon" onClick={() => setZoom(z => Math.min(z + 0.2, 2))}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="icon" onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="icon" onClick={() => setZoom(1)}>
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>

            {/* SVG Map */}
            <div className="w-full h-full overflow-auto bg-background/50 grid-pattern">
              <svg
                ref={svgRef}
                viewBox="0 0 120 100"
                className="w-full h-full min-h-[400px]"
                style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
              >
                {/* Grid */}
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.1" className="text-border" />
                  </pattern>
                </defs>
                <rect width="120" height="100" fill="url(#grid)" />

                {/* Zones */}
                {showZones && floorZones.map(zone => (
                  <g key={zone.id}>
                    <polygon
                      points={zone.polygon.map(p => p.join(",")).join(" ")}
                      className={`${getZoneColor(zone.type)} stroke-[0.5] transition-colors`}
                    />
                    <text
                      x={zone.polygon.reduce((sum, p) => sum + p[0], 0) / zone.polygon.length}
                      y={zone.polygon.reduce((sum, p) => sum + p[1], 0) / zone.polygon.length}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-foreground text-[3px] font-medium"
                    >
                      {zone.name}
                    </text>
                  </g>
                ))}

                {/* Robots */}
                {floorRobots.map(robot => (
                  <g key={robot.id}>
                    {/* Robot glow */}
                    <circle
                      cx={robot.pose.x}
                      cy={robot.pose.y}
                      r="3"
                      fill={getRobotColor(robot.status)}
                      opacity="0.3"
                      className="animate-pulse"
                    />
                    {/* Robot body */}
                    <circle
                      cx={robot.pose.x}
                      cy={robot.pose.y}
                      r="2"
                      fill={getRobotColor(robot.status)}
                      stroke="white"
                      strokeWidth="0.3"
                    />
                    {/* Direction indicator */}
                    <line
                      x1={robot.pose.x}
                      y1={robot.pose.y}
                      x2={robot.pose.x + Math.cos(robot.pose.theta) * 3}
                      y2={robot.pose.y + Math.sin(robot.pose.theta) * 3}
                      stroke="white"
                      strokeWidth="0.3"
                    />
                    {/* Label */}
                    <text
                      x={robot.pose.x}
                      y={robot.pose.y - 4}
                      textAnchor="middle"
                      className="fill-foreground text-[2.5px] font-bold"
                    >
                      {robot.name}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Legend */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Pharmacy", color: "bg-primary" },
                { label: "Ward", color: "bg-accent" },
                { label: "ICU", color: "bg-destructive" },
                { label: "Lab", color: "bg-warning" },
                { label: "Dock", color: "bg-success" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2 text-sm">
                  <div className={`w-3 h-3 rounded ${item.color}`} />
                  <span className="text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Robots on floor */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Robots on Floor {selectedFloor}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {floorRobots.length === 0 ? (
                <p className="text-sm text-muted-foreground">No robots on this floor</p>
              ) : (
                floorRobots.map(robot => (
                  <div key={robot.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4" style={{ color: getRobotColor(robot.status) }} />
                      <span className="text-sm font-medium text-foreground">{robot.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Battery className={`w-4 h-4 ${
                        robot.battery > 50 ? "text-success" :
                        robot.battery > 20 ? "text-warning" : "text-destructive"
                      }`} />
                      <span className="text-xs font-mono text-muted-foreground">{robot.battery}%</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
