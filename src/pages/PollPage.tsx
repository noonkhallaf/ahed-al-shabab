import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface PollOption { id: string; option_text: string; votes: number; }
interface Poll { id: string; question: string; options: PollOption[]; }

function PollCard({ poll }: { poll: Poll }) {
  const [options, setOptions] = useState(poll.options);
  const [voted, setVoted] = useState(false);
  const total = options.reduce((s, o) => s + o.votes, 0);

  const handleVote = async (optionId: string) => {
    if (voted) return;
    const opt = options.find(o => o.id === optionId);
    if (!opt) return;
    setOptions(prev => prev.map(o => o.id === optionId ? { ...o, votes: o.votes + 1 } : o));
    setVoted(true);
    await supabase.from('poll_options').update({ votes: opt.votes + 1 }).eq('id', optionId);
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="font-heading font-bold text-lg text-foreground mb-4">{poll.question}</h3>
      <div className="flex flex-col gap-3">
        {options.map((opt) => {
          const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
          return (
            <button key={opt.id} onClick={() => handleVote(opt.id)} disabled={voted} className="relative w-full text-right p-3 rounded-lg border border-border hover:border-secondary transition-colors overflow-hidden disabled:cursor-default">
              {voted && <div className="absolute inset-y-0 right-0 bg-secondary/20 transition-all duration-700" style={{ width: `${pct}%` }} />}
              <div className="relative flex justify-between items-center">
                <span className="font-medium text-foreground">{opt.option_text}</span>
                {voted && <span className="text-sm font-bold text-secondary">{pct}%</span>}
              </div>
            </button>
          );
        })}
      </div>
      {voted && <p className="text-muted-foreground text-xs mt-3 text-center">إجمالي الأصوات: {total + 1}</p>}
    </div>
  );
}

export default function PollPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: pollsData } = await supabase.from('polls').select('*').eq('is_active', true);
      if (!pollsData) { setLoading(false); return; }
      const { data: optionsData } = await supabase.from('poll_options').select('*');
      const mapped = (pollsData as any[]).map(p => ({
        ...p,
        options: ((optionsData as any[]) || []).filter(o => o.poll_id === p.id),
      }));
      setPolls(mapped);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="pt-24 pb-20 bg-background min-h-screen">
      <div className="container max-w-2xl">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-foreground">استطلاع الرأي</h1>
          <div className="w-20 h-1 bg-secondary mx-auto mt-4 rounded-full" />
          <p className="text-muted-foreground mt-4">شاركنا رأيك لنبني معًا مستقبلاً أفضل</p>
        </motion.div>
        {loading ? (
          <div className="text-center text-muted-foreground py-12">جارٍ التحميل...</div>
        ) : (
          <div className="space-y-6">
            {polls.map((poll, i) => (
              <motion.div key={poll.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <PollCard poll={poll} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
