import { motion } from 'framer-motion';
import { useState } from 'react';

const JOURNAL_ENTRIES = [
  {
    id: 'journey-1',
    date: 'Current',
    title: 'Why I Design Systems, Not Just Pretty Things',
    excerpt: 'I realized somewhere along the way that beautiful design without human understanding is just decoration. Systems thinking saved me from that trap.',
    fullThought: 'The turning point came when I watched a perfectly designed interface confuse the people who needed it most. I had optimized for elegance, not for the humans using it. That\'s when I understood: design is philosophy. It\'s a statement about what I believe humans deserve. Beautiful systems think about people first, aesthetics second. Every constraint I build into a system is a belief about human potential and agency.',
    theme: 'understanding'
  },
  {
    id: 'journey-2',
    date: 'Recent',
    title: 'On Building Communities, Not Audiences',
    excerpt: 'The difference between an audience and a community is intention. One consumes; the other participates.',
    fullThought: 'I spent years building toward an audience. Then I realized the work that moves me isn\'t broadcast—it\'s intimate. Playspace taught me this. When you gather people with shared intention, something different happens. You\'re not presenting to them; you\'re thinking together. The vulnerability required to think alongside others, to say "I don\'t know, let\'s figure it out together," is more powerful than any polished presentation.',
    theme: 'community'
  },
  {
    id: 'journey-3',
    date: 'Ongoing',
    title: 'The Courage It Takes to Show Your Work Imperfectly',
    excerpt: 'Publishing process, not just polish, is an act of faith.',
    fullThought: 'Every time I share work in progress, I\'m choosing vulnerability over the safety of silence. What if people judge the sketches? What if my thinking evolves and I "look wrong"? But here\'s what I learned: that fear is exactly why we need to share. Other people are struggling with the same questions. Seeing someone else\'s thinking process, their failures, their iterations—that\'s what gives permission to think. That\'s what builds community.',
    theme: 'vulnerability'
  },
  {
    id: 'journey-4',
    date: 'Experiment',
    title: 'Embodied Practice: Why I Started Making Pottery Seriously',
    excerpt: 'Some things can only be learned by getting your hands dirty.',
    fullThought: 'Pottery taught me what theory could never: that mastery is embodied. You can read everything about clay, but until your hands know the resistance, the moisture level, the exact moment it\'s ready—you don\'t understand it. I realized this applies to design, to systems thinking, to everything. The people I respect most aren\'t the best at explaining their thinking; they\'re the ones who\'ve *lived* it. Now I design differently because my hands understand things my mind couldn\'t articulate before.',
    theme: 'embodiment'
  },
  {
    id: 'journey-5',
    date: 'Unfolding',
    title: 'What I Still Don\'t Understand (And Why That Matters)',
    excerpt: 'The questions I can\'t answer yet are more interesting than the ones I can.',
    fullThought: 'I\'m genuinely unsure about many things. How do we build systems that grow with people instead of constraining them? How do we create technology that increases agency rather than centralizing it? How do we think about ethics in design without moralizing? These aren\'t problems to solve and mark complete. They\'re living questions that evolve as I learn more. Showing people these unresolved tensions is more valuable than presenting finished answers.',
    theme: 'questioning'
  }
];

const THEME_COLORS: Record<string, string> = {
  understanding: '#4A9EFF',
  community: '#2ECC71',
  vulnerability: '#E74C3C',
  embodiment: '#F39C12',
  questioning: '#9B59B6'
};

export function PersonalJourney() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section className="relative min-h-screen py-32 px-8 md:px-16">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#F5F5F5] mb-6">
            The Journey
          </h2>
          <p className="text-lg md:text-xl text-[#E8E8E8] max-w-2xl mx-auto leading-relaxed">
            Thoughts on learning, community, vulnerability, and what it means to design systems that serve human dignity. These are the questions shaping my work.
          </p>
        </motion.div>

        <div className="space-y-8">
          {JOURNAL_ENTRIES.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
              className="cursor-pointer"
            >
              <div
                className="relative overflow-hidden rounded-lg border border-white/10 hover:border-white/20 transition-colors p-8"
                style={{
                  background: 'linear-gradient(135deg, rgba(42,42,42,0.8) 0%, rgba(26,26,26,0.9) 100%)',
                }}
              >
                <motion.div
                  className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${THEME_COLORS[entry.theme]}15 0%, transparent 60%)`
                  }}
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div
                        className="inline-block text-xs uppercase tracking-widest font-medium px-3 py-1 rounded-full mb-2"
                        style={{
                          backgroundColor: `${THEME_COLORS[entry.theme]}20`,
                          color: THEME_COLORS[entry.theme]
                        }}
                      >
                        {entry.theme}
                      </div>
                      <h3 className="text-2xl font-light text-[#F5F5F5] mb-2">
                        {entry.title}
                      </h3>
                      <p className="text-[#E8E8E8] text-sm leading-relaxed">
                        {entry.excerpt}
                      </p>
                    </div>

                    <motion.svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      animate={{ rotate: expandedId === entry.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-[#4A4A4A] flex-shrink-0 mt-1"
                    >
                      <path
                        d="M4 7.5L10 12.5L16 7.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  </div>

                  <span className="text-xs text-[#4A4A4A]">
                    {entry.date}
                  </span>

                  <motion.div
                    initial={false}
                    animate={{
                      height: expandedId === entry.id ? 'auto' : 0,
                      opacity: expandedId === entry.id ? 1 : 0
                    }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden mt-6 border-t border-white/10 pt-6"
                  >
                    <p className="text-[#E8E8E8] leading-relaxed text-lg">
                      {entry.fullThought}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 bg-white/5 border border-white/10 rounded-lg p-8 md:p-12 text-center"
        >
          <p className="text-[#E8E8E8] text-lg leading-relaxed mb-6">
            This page isn't about having all the answers. It's about thinking out loud, sharing what I'm learning, and inviting you into the questions that shape my work.
          </p>
          <p className="text-[#4A4A4A]">
            The best insights come from thinking together.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
