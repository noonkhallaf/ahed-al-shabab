import { useState } from "react";
import { motion } from "framer-motion";

interface Poll {
  question: string;
  options: string[];
}

const polls: Poll[] = [
  { question: "هل تؤيد برنامج قائمة عهد الشباب؟", options: ["نعم", "ربما", "لا"] },
  { question: "ما أهم محور يجب التركيز عليه؟", options: ["التعليم", "الشباب", "الرياضة", "الخدمات"] },
  { question: "هل تعتقد أن الشباب قادرون على إحداث تغيير؟", options: ["بالتأكيد", "نعم بشروط", "غير متأكد"] },
];

function PollCard({ poll }: { poll: Poll }) {
  const [votes, setVotes] = useState<Record<string, number>>(
    Object.fromEntries(poll.options.map((o) => [o, Math.floor(Math.random() * 30) + 5]))
  );
  const [voted, setVoted] = useState(false);
  const total = Object.values(votes).reduce((a, b) => a + b, 0);

  const handleVote = (option: string) => {
    if (voted) return;
    setVotes((prev) => ({ ...prev, [option]: prev[option] + 1 }));
    setVoted(true);
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="font-heading font-bold text-lg text-foreground mb-4">{poll.question}</h3>
      <div className="flex flex-col gap-3">
        {poll.options.map((opt) => {
          const pct = total > 0 ? Math.round((votes[opt] / total) * 100) : 0;
          return (
            <button
              key={opt}
              onClick={() => handleVote(opt)}
              disabled={voted}
              className="relative w-full text-right p-3 rounded-lg border border-border hover:border-secondary transition-colors overflow-hidden disabled:cursor-default"
            >
              {voted && (
                <div className="absolute inset-y-0 right-0 bg-secondary/20 transition-all duration-700" style={{ width: `${pct}%` }} />
              )}
              <div className="relative flex justify-between items-center">
                <span className="font-medium text-foreground">{opt}</span>
                {voted && <span className="text-sm font-bold text-secondary">{pct}%</span>}
              </div>
            </button>
          );
        })}
      </div>
      {voted && <p className="text-muted-foreground text-xs mt-3 text-center">إجمالي الأصوات: {total}</p>}
    </div>
  );
}

export default function PollPage() {
  return (
    <div className="pt-24 pb-20 bg-background min-h-screen">
      <div className="container max-w-2xl">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-foreground">استطلاع الرأي</h1>
          <div className="w-20 h-1 bg-secondary mx-auto mt-4 rounded-full" />
          <p className="text-muted-foreground mt-4">شاركنا رأيك لنبني معًا مستقبلاً أفضل</p>
        </motion.div>

        <div className="space-y-6">
          {polls.map((poll, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <PollCard poll={poll} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
