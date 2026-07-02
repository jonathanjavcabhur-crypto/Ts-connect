import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { MockUser } from '../types';

interface CompatibilityRadarProps {
  user: MockUser;
}

export const CompatibilityRadar: React.FC<CompatibilityRadarProps> = ({ user }) => {
  // Calculate scores based on user attributes
  const data = [
    { subject: 'Interests', A: Math.min(100, user.interests.length * 15) },
    { subject: 'Tags', A: Math.min(100, (user.badges?.length || 0) * 20) },
    { subject: 'Activity', A: user.online ? 95 : 50 },
    { subject: 'Location', A: Math.max(10, 100 - user.distance * 5) },
    { subject: 'Values', A: Math.min(100, user.lookingFor.length * 25) },
  ];

  const totalScore = Math.round(data.reduce((acc, curr) => acc + curr.A, 0) / data.length);

  return (
    <div className="w-full h-64 p-4 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center">
      <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">
        Compatibility Score
      </h3>
      <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400 mb-2">
        {totalScore}%
      </div>
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#3f3f46" strokeWidth={0.5} />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Compatibility"
              dataKey="A"
              stroke="#ff00de" // Neon Pink
              strokeWidth={2}
              fill="#ff00de"
              fillOpacity={0.2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
