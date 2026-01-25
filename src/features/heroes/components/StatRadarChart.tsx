import React from 'react';

interface StatRadarChartProps {
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
    crit_rate: number;
    crit_dmg: number;
  };
  maxValues?: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
    crit_rate: number;
    crit_dmg: number;
  };
  color?: string;
  size?: number;
}

const StatRadarChart: React.FC<StatRadarChartProps> = ({ 
  stats, 
  maxValues = { hp: 1200, attack: 200, defense: 150, speed: 120, crit_rate: 30, crit_dmg: 200 },
  color = '#007AFF',
  size = 280
}) => {
  const statLabels = [
    { key: 'hp', label: 'HP', angle: 0 },
    { key: 'attack', label: 'ATK', angle: 60 },
    { key: 'defense', label: 'DEF', angle: 120 },
    { key: 'speed', label: 'SPD', angle: 180 },
    { key: 'crit_rate', label: 'CRIT%', angle: 240 },
    { key: 'crit_dmg', label: 'CDMG', angle: 300 }
  ];

  const center = size / 2;
  const radius = size / 2 - 40;
  const levels = 5;

  // Calculate normalized values (0-1)
  const normalizedStats = statLabels.map(({ key }) => {
    const value = stats[key as keyof typeof stats];
    const max = maxValues[key as keyof typeof maxValues];
    return Math.min(value / max, 1);
  });

  // Generate polygon points for stat values
  const points = normalizedStats.map((value, i) => {
    const angle = (statLabels[i].angle - 90) * (Math.PI / 180);
    const r = radius * value;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  // Generate web grid lines
  const webLines = Array.from({ length: levels }, (_, i) => {
    const levelRadius = radius * ((i + 1) / levels);
    const levelPoints = statLabels.map(({ angle }) => {
      const angleRad = (angle - 90) * (Math.PI / 180);
      const x = center + levelRadius * Math.cos(angleRad);
      const y = center + levelRadius * Math.sin(angleRad);
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <polygon
        key={i}
        points={levelPoints}
        fill="none"
        stroke="rgba(0, 0, 0, 0.1)"
        strokeWidth="1"
      />
    );
  });

  // Generate axis lines
  const axisLines = statLabels.map(({ angle }, i) => {
    const angleRad = (angle - 90) * (Math.PI / 180);
    const x = center + radius * Math.cos(angleRad);
    const y = center + radius * Math.sin(angleRad);
    
    return (
      <line
        key={i}
        x1={center}
        y1={center}
        x2={x}
        y2={y}
        stroke="rgba(0, 0, 0, 0.15)"
        strokeWidth="1"
      />
    );
  });

  // Generate labels
  const labels = statLabels.map(({ key, label, angle }, i) => {
    const angleRad = (angle - 90) * (Math.PI / 180);
    const labelRadius = radius + 25;
    const x = center + labelRadius * Math.cos(angleRad);
    const y = center + labelRadius * Math.sin(angleRad);
    const value = stats[key as keyof typeof stats];
    
    return (
      <g key={i}>
        <text
          x={x}
          y={y - 8}
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill="var(--ios-text-primary)"
        >
          {label}
        </text>
        <text
          x={x}
          y={y + 6}
          textAnchor="middle"
          fontSize="14"
          fontWeight="600"
          fill={color}
        >
          {value}
        </text>
      </g>
    );
  });

  return (
    <svg width={size} height={size} style={{ maxWidth: '100%', height: 'auto' }}>
      {/* Background circle */}
      <circle cx={center} cy={center} r={radius} fill="rgba(0, 0, 0, 0.02)" />
      
      {/* Grid web */}
      {webLines}
      
      {/* Axis lines */}
      {axisLines}
      
      {/* Stat polygon */}
      <polygon
        points={points}
        fill={`${color}20`}
        stroke={color}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      
      {/* Stat points */}
      {normalizedStats.map((value, i) => {
        const angle = (statLabels[i].angle - 90) * (Math.PI / 180);
        const r = radius * value;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="5"
            fill={color}
            stroke="white"
            strokeWidth="2"
          />
        );
      })}
      
      {/* Labels */}
      {labels}
    </svg>
  );
};

export default StatRadarChart;
