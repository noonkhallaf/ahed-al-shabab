import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

export default function PollSection() {
  const [options, setOptions] = useState<{ id: string; option_text: string; votes: number }[]>([]);
  const [question, setQuestion] = useState('');
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: polls } = await supabase.from('polls').select('*').eq('is_active', true).limit(1);
      if (!polls?.length) return;
      setQuestion((polls[0] as any).question);
      const { data: opts } = await supabase.from('poll_options').select('*').eq('poll_id', (polls[0] as any).id);
      setOptions((opts as any[]) || []);
    })();
  }, []);

  const total = options.reduce((s, o) => s + o.votes, 0);

  const handleVote = async (optionId: string) => {
    if (voted) return;
    const opt = options.find(o => o.id === optionId);
    if (!opt) return;
    setOptions(prev => prev.map(o => o.id === optionId ? { ...o, votes: o.votes + 1 } : o));
    setVoted(true);
    await supabase.from('poll_options').update({ votes: opt.votes + 1 }).eq('id', optionId);
  };

  if (!question) return null;

  return (
    <section className="py-20 bg-muted/50">
      <div className="container max-w-xl">
        <motion.div className="glass-card rounded-2xl p-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-heading font-bold text-2xl text-foreground text-center mb-6">{question}</h2>
          <div className="flex flex-col gap-4">
            {options.map((opt) => {
              const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
              return (
                <button key={opt.id} onClick={() => handleVote(opt.id)} disabled={voted} className="relative w-full text-right p-4 rounded-lg border border-border hover:border-secondary transition-colors overflow-hidden disabled:cursor-default">
                  {voted && <div className="absolute inset-y-0 right-0 bg-secondary/20 transition-all duration-700" style={{ width: `${pct}%` }} />}
                  <div className="relative flex justify-between items-center">
                    <span className="font-medium text-foreground">{opt.option_text}</span>
                    {voted && <span className="text-sm font-bold text-secondary">{pct}%</span>}
                  </div>
                </button>
              );
            })}
          </div>
          {voted && <p className="text-center text-muted-foreground text-sm mt-4">شكرًا لمشاركتك! إجمالي الأصوات: {total}</p>}
        </motion.div>
      </div>
    </section>
  );
}
