import { motion } from "framer-motion";
import { Map, Cpu, Bell, LineChart, Users, Zap } from "lucide-react";

const features = [
  {
    icon: <Map className="w-6 h-6" />,
    title: "Interactive Floor Maps",
    description: "SVG-based floorplan viewer with real-time robot tracking, path visualization, and semantic zone management.",
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: "AI-Powered Navigation",
    description: "SLAM localization with adaptive path planning. Automatic obstacle detection and route optimization.",
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: "Smart Alerts",
    description: "Real-time notifications for deliveries, faults, and system events with escalation workflows.",
  },
  {
    icon: <LineChart className="w-6 h-6" />,
    title: "Analytics Dashboard",
    description: "Comprehensive metrics including delivery times, fleet utilization, and ML model performance.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Role-Based Access",
    description: "Tailored interfaces for clinicians, operators, and administrators with granular permissions.",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Instant Integration",
    description: "Ready-to-connect API hooks for FHIR, EHR systems, and hospital infrastructure.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container relative px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">Powerful Features</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage a fleet of autonomous medical delivery robots
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className="group glass rounded-xl p-6 hover:border-primary/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
