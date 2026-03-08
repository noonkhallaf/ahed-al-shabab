import { useState } from "react";
import { motion } from "framer-motion";

const options = ["ممتاز", "جيد", "يحتاج تطوير"];

export default function PollSection() {
  const [votes, setVotes] = useState<Record<string, number>>({ "ممتاز": 42, "جيد": 28, "يحتاج تطوير": 10 });
  const [voted, setVoted] = useState(false);

  const total = Object.values(votes).reduce((a, b) => a + b, 0);

  const handleVote = (option: string) => {
    if (voted) return;
    setVotes((prev) => ({ ...prev, [option]: prev[option] + 1 }));
    setVoted(true);
  };

  return (
    <section className="py-20 bg-muted/50">
      <div className="container max-w-xl">
        <motion.div
          className="glass-card rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading font-bold text-2xl text-foreground text-center mb-6">
            ما رأيك في برنامج قائمة عهد الشباب؟
          </h2>

          <div className="flex flex-col gap-4">
            {options.map((opt) => {
              const pct = total > 0 ? Math.round((votes[opt] / (total + (voted ? 0 : 0))) * 100) : 0;
              return (
                <button
                  key={opt}
                  onClick={() => handleVote(opt)}
                  disabled={voted}
                  className="relative w-full text-right p-4 rounded-lg border border-border hover:border-secondary transition-colors overflow-hidden disabled:cursor-default"
                >
                  {voted && (
                    <div
                      className="absolute inset-y-0 right-0 bg-secondary/20 transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  )}
                  <div className="relative flex justify-between items-center">
                    <span className="font-medium text-foreground">{opt}</span>
                    {voted && (
                      <span className="text-sm font-bold text-secondary">{pct}%</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {voted && (
            <p className="text-center text-muted-foreground text-sm mt-4">
              شكرًا لمشاركتك! إجمالي الأصوات: {total}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
