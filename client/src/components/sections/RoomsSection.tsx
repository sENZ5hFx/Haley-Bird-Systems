import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useRooms } from '@/lib/stores/useRooms';
import { useExperience } from '@/lib/stores/useExperience';

export function RoomsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rooms = useRooms(state => state.rooms);
  const currentRoom = useRooms(state => state.currentRoom);
  const visitedRooms = useRooms(state => state.visitedRooms);
  const setCurrentRoom = useRooms(state => state.setCurrentRoom);
  const visitRoom = useRooms(state => state.visitRoom);
  const { setCursorState } = useExperience();
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [100, 0]);

  const handleRoomClick = (roomId: string) => {
    setCurrentRoom(roomId);
    visitRoom(roomId);
  };

  const activeRoom = rooms.find(r => r.id === currentRoom);

  return (
    <motion.section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24 py-24"
      style={{ opacity, y }}
    >
      <div className="max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-[#4A4A4A] font-light">
            Explore the Space
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#F5F5F5] mt-4 leading-tight">
            Navigate Through<br />
            <span className="text-[#E8E8E8]">Conceptual Zones</span>
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room, index) => (
            <motion.button
              key={room.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`group relative text-left p-6 border transition-all duration-500 ${
                room.id === currentRoom
                  ? 'border-[#F5F5F5] bg-[#F5F5F5]/5'
                  : 'border-[#3A3A3A] hover:border-[#4A4A4A] bg-transparent hover:bg-[#2A2A2A]/30'
              }`}
              onClick={() => handleRoomClick(room.id)}
              onMouseEnter={() => setCursorState('pointer')}
              onMouseLeave={() => setCursorState('default')}
              disabled={!room.unlocked}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-3 h-3 rounded-full ${
                  room.id === currentRoom ? 'bg-[#F5F5F5]' : 'bg-[#4A4A4A]'
                } ${visitedRooms.includes(room.id) ? 'opacity-100' : 'opacity-50'}`} />
                {!visitedRooms.includes(room.id) && room.unlocked && (
                  <span className="text-[10px] tracking-wider uppercase text-[#4A4A4A]">
                    New
                  </span>
                )}
              </div>
              
              <h3 className={`text-lg font-light mb-2 transition-colors ${
                room.id === currentRoom ? 'text-[#F5F5F5]' : 'text-[#E8E8E8] group-hover:text-[#F5F5F5]'
              }`}>
                {room.name}
              </h3>
              
              <p className="text-sm font-light text-[#4A4A4A] leading-relaxed">
                {room.description}
              </p>
              
              <div className={`absolute bottom-0 left-0 h-[2px] bg-[#F5F5F5] transition-all duration-500 ${
                room.id === currentRoom ? 'w-full' : 'w-0 group-hover:w-1/3'
              }`} />
            </motion.button>
          ))}
        </div>
        
        {activeRoom && (
          <motion.div
            key={activeRoom.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-16 p-8 border border-[#3A3A3A] bg-[#1A1A1A]/80"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: activeRoom.color }} />
              <span className="text-xs tracking-[0.2em] uppercase text-[#4A4A4A]">
                Current Zone
              </span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-light text-[#F5F5F5] mb-4">
              {activeRoom.name}
            </h3>
            
            <p className="text-lg font-light text-[#E8E8E8] leading-relaxed max-w-2xl">
              {activeRoom.description}
            </p>
            
            <div className="flex items-center gap-6 mt-8 pt-6 border-t border-[#3A3A3A]">
              <div className="text-center">
                <span className="block text-2xl font-light text-[#F5F5F5]">
                  {visitedRooms.length}
                </span>
                <span className="text-xs tracking-wider uppercase text-[#4A4A4A]">
                  Explored
                </span>
              </div>
              <div className="w-[1px] h-8 bg-[#3A3A3A]" />
              <div className="text-center">
                <span className="block text-2xl font-light text-[#F5F5F5]">
                  {rooms.length}
                </span>
                <span className="text-xs tracking-wider uppercase text-[#4A4A4A]">
                  Total
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
