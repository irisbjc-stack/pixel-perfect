import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Play, Bot, Pause, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";

interface SimRobot {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  status: "moving" | "idle" | "delivering";
}

export default function Demo() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [robot, setRobot] = useState<SimRobot>({ x: 20, y: 20, targetX: 80, targetY: 70, status: "moving" });

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setRobot(r => {
        const dx = r.targetX - r.x;
        const dy = r.targetY - r.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 2) {
          // Reached target, pick new random target
          return {
            ...r,
            targetX: Math.random() * 80 + 10,
            targetY: Math.random() * 60 + 10,
            status: Math.random() > 0.7 ? "delivering" : "moving"
          };
        }
        
        const speed = 0.5;
        return {
          ...r,
          x: r.x + (dx / dist) * speed,
          y: r.y + (dy / dist) * speed,
        };
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const reset = () => {
    setRobot({ x: 20, y: 20, targetX: 80, targetY: 70, status: "moving" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Interactive Demo
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Watch our autonomous robot navigate through a simulated hospital floor plan, 
              avoiding obstacles and delivering medical supplies.
            </p>
          </motion.div>

          {/* Demo Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-4 mb-6"
          >
            <svg viewBox="0 0 100 80" className="w-full h-auto rounded-xl bg-background/50">
              {/* Grid */}
              <defs>
                <pattern id="demoGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-border" />
                </pattern>
              </defs>
              <rect width="100" height="80" fill="url(#demoGrid)" />

              {/* Zones */}
              <rect x="5" y="5" width="20" height="15" rx="2" className="fill-primary/20 stroke-primary stroke-[0.3]" />
              <text x="15" y="13" textAnchor="middle" className="fill-foreground text-[3px]">Pharmacy</text>

              <rect x="75" y="55" width="20" height="20" rx="2" className="fill-accent/20 stroke-accent stroke-[0.3]" />
              <text x="85" y="66" textAnchor="middle" className="fill-foreground text-[3px]">Ward 5B</text>

              <rect x="40" y="30" width="20" height="20" rx="2" className="fill-destructive/20 stroke-destructive stroke-[0.3]" />
              <text x="50" y="41" textAnchor="middle" className="fill-foreground text-[3px]">ICU</text>

              {/* Path line */}
              <line 
                x1={robot.x} 
                y1={robot.y} 
                x2={robot.targetX} 
                y2={robot.targetY} 
                strokeDasharray="2,2" 
                className="stroke-primary/50 stroke-[0.3]"
              />

              {/* Robot */}
              <circle cx={robot.x} cy={robot.y} r="4" className="fill-primary/30 animate-pulse" />
              <circle cx={robot.x} cy={robot.y} r="2.5" fill="#22c55e" stroke="white" strokeWidth="0.3" />
              <text x={robot.x} y={robot.y - 5} textAnchor="middle" className="fill-foreground text-[2.5px] font-bold">R-07</text>
            </svg>
          </motion.div>

          {/* Controls */}
          <div className="flex justify-center gap-3 mb-8">
            <Button
              variant={isPlaying ? "outline" : "default"}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <p className="text-muted-foreground mb-4">
              Ready to explore the full platform?
            </p>
            <Link to="/login">
              <Button variant="hero" size="lg">
                <Bot className="w-5 h-5 mr-2" />
                Access Control Center
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
