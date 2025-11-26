import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface Connection {
  from: string;
  to: string;
  label: string;
  strength: 'strong' | 'medium' | 'weak';
}

const CONNECTIONS: Connection[] = [
  { from: 'Systems Thinking', to: 'Brand Evolution', label: 'Maps interconnections', strength: 'strong' },
  { from: 'Systems Thinking', to: 'Customer Journey', label: 'Identifies leverage points', strength: 'strong' },
  { from: 'Systems Thinking', to: 'Design System', label: 'Emergence & feedback loops', strength: 'strong' },
  { from: 'Embodied Design', to: 'Pottery Practice', label: 'Learning by doing', strength: 'strong' },
  { from: 'Embodied Design', to: 'Brand Evolution', label: 'Iterative prototyping', strength: 'medium' },
  { from: 'Craft Consciousness', to: 'Design System', label: 'Quality in every detail', strength: 'strong' },
  { from: 'Community Weaving', to: 'Customer Journey', label: 'Co-design process', strength: 'medium' },
  { from: 'Contextual Listening', to: 'Brand Evolution', label: 'Understanding real needs', strength: 'strong' },
  { from: 'Emergence Cultivation', to: 'Design System', label: 'Patterns emerge from use', strength: 'strong' },
  { from: 'Brand Evolution', to: 'Customer Journey', label: 'Unified experience', strength: 'medium' },
  { from: 'Customer Journey', to: 'Design System', label: 'Consistency across touchpoints', strength: 'medium' },
];

const NODES = [
  'Systems Thinking',
  'Embodied Design',
  'Community Weaving',
  'Craft Consciousness',
  'Contextual Listening',
  'Emergence Cultivation',
  'Brand Evolution',
  'Customer Journey',
  'Design System',
];

export function InteractiveConnections() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Simple force-directed layout
  const getNodePositions = () => {
    const positions: Record<string, { x: number; y: number }> = {};
    const angleStep = (Math.PI * 2) / NODES.length;
    const radius = 150;
    const centerX = 300;
    const centerY = 300;

    NODES.forEach((node, i) => {
      positions[node] = {
        x: centerX + radius * Math.cos(i * angleStep),
        y: centerY + radius * Math.sin(i * angleStep)
      };
    });

    return positions;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const positions = getNodePositions();

    // Clear canvas
    ctx.fillStyle = 'rgba(26, 26, 26, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    CONNECTIONS.forEach(conn => {
      const from = positions[conn.from];
      const to = positions[conn.to];

      if (!from || !to) return;

      const isActive = !selectedNode || selectedNode === conn.from || selectedNode === conn.to;
      
      ctx.strokeStyle = isActive 
        ? conn.strength === 'strong' ? 'rgba(155, 89, 182, 0.6)' : 'rgba(155, 89, 182, 0.3)'
        : 'rgba(155, 89, 182, 0.1)';
      
      ctx.lineWidth = conn.strength === 'strong' ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    });

    // Draw nodes
    NODES.forEach(node => {
      const pos = positions[node];
      const isActive = !selectedNode || selectedNode === node;
      const isConnected = !selectedNode || CONNECTIONS.some(c => 
        (c.from === selectedNode && c.to === node) || 
        (c.to === selectedNode && c.from === node)
      );

      ctx.fillStyle = isActive && isConnected 
        ? 'rgba(155, 89, 182, 1)' 
        : isActive 
          ? 'rgba(155, 89, 182, 0.8)'
          : 'rgba(155, 89, 182, 0.2)';

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 12, 0, Math.PI * 2);
      ctx.fill();

      // Draw label
      ctx.fillStyle = isActive && isConnected ? 'rgba(245, 245, 245, 1)' : 'rgba(232, 232, 232, 0.8)';
      ctx.font = '11px Inter';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Wrap text
      const words = node.split(' ');
      words.forEach((word, i) => {
        ctx.fillText(word, pos.x, pos.y + 30 + (i * 12));
      });
    });
  }, [selectedNode]);

  return (
    <section className="relative min-h-screen py-32 px-8 md:px-16 flex items-center">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#F5F5F5] mb-6">
            Connections Map
          </h2>
          <p className="text-lg md:text-xl text-[#E8E8E8] max-w-2xl mx-auto leading-relaxed">
            How practices, principles, and projects interconnect. Select a concept to explore its relationships.
          </p>
        </motion.div>

        <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={600}
            height={600}
            className="w-full"
            onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
          />
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
          {NODES.map(node => (
            <motion.button
              key={node}
              onClick={() => setSelectedNode(selectedNode === node ? null : node)}
              whileHover={{ scale: 1.05 }}
              className={`px-4 py-3 rounded text-sm font-light transition-all ${
                selectedNode === node
                  ? 'bg-[#9B59B6] text-[#F5F5F5] border border-[#9B59B6]'
                  : 'bg-transparent text-[#E8E8E8] border border-white/20 hover:border-white/40'
              }`}
            >
              {node}
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 bg-white/5 border border-white/10 rounded-lg p-8 text-center"
        >
          <p className="text-[#E8E8E8] text-lg">
            No idea stands alone. Each concept informs and is informed by others. The strongest insights emerge at these intersections.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
