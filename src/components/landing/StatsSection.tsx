import { motion } from "framer-motion";

const stats = [
  { value: "99.7%", label: "Delivery Success Rate" },
  { value: "4.2min", label: "Average Delivery Time" },
  { value: "24/7", label: "Autonomous Operation" },
  { value: "50+", label: "Zones Supported" },
];

export function StatsSection() {
  return (
    <section className="py-16 border-y border-border/50">
      <div className="container px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
