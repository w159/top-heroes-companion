
import React, { useState } from 'react';
import { EDUCATION_MODULES, EducationModule } from '../data/education';
import { BookOpen, Clock, Tag, ChevronRight, X } from 'lucide-react';

export const EducationPanel: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<EducationModule | null>(null);
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(EDUCATION_MODULES.map(m => m.category)))];
  
  const filteredModules = filter === 'All' 
    ? EDUCATION_MODULES 
    : EDUCATION_MODULES.filter(m => m.category === filter);

  return (
    <div className="ios-card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Strategy Guide</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '6px 12px',
                borderRadius: 16,
                border: 'none',
                background: filter === cat ? 'var(--ios-blue)' : 'rgba(0,0,0,0.05)',
                color: filter === cat ? 'white' : 'var(--ios-text-primary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {filteredModules.map(module => (
          <div 
            key={module.id}
            onClick={() => setSelectedModule(module)}
            style={{
              padding: 16,
              borderRadius: 12,
              background: 'var(--ios-background)',
              border: '1px solid rgba(0,0,0,0.05)',
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
              <span style={{ 
                fontSize: '10px', 
                fontWeight: 700, 
                textTransform: 'uppercase',
                color: 'var(--ios-blue)',
                background: 'rgba(0,122,255,0.1)',
                padding: '2px 6px',
                borderRadius: 4
              }}>
                {module.difficulty}
              </span>
              <ChevronRight size={16} color="var(--ios-text-secondary)" />
            </div>
            
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: 8, color: 'var(--ios-text-primary)' }}>
              {module.title}
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--ios-text-secondary)', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={12} />
                <span>{module.readTimeMinutes} min</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Tag size={12} />
                <span>{module.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedModule && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(5px)'
        }} onClick={() => setSelectedModule(null)}>
          <div 
            style={{
              width: '90%',
              maxWidth: '600px',
              maxHeight: '80vh',
              background: 'white',
              borderRadius: 20,
              padding: 32,
              position: 'relative',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedModule(null)}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <X size={24} color="var(--ios-text-secondary)" />
            </button>

            <span style={{ 
              fontSize: '12px', 
              fontWeight: 700, 
              color: 'var(--ios-blue)', 
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {selectedModule.category} • {selectedModule.difficulty}
            </span>
            
            <h2 style={{ fontSize: '28px', fontWeight: 800, marginTop: 8, marginBottom: 24 }}>
              {selectedModule.title}
            </h2>

            <div style={{ lineHeight: '1.6', color: '#333' }}>
              {selectedModule.content.split('\n').map((line, i) => {
                if (line.startsWith('# ')) return <h3 key={i} style={{ fontSize: '20px', fontWeight: 700, marginTop: 24, marginBottom: 12 }}>{line.replace('# ', '')}</h3>;
                if (line.startsWith('## ')) return <h4 key={i} style={{ fontSize: '18px', fontWeight: 600, marginTop: 20, marginBottom: 10 }}>{line.replace('## ', '')}</h4>;
                if (line.startsWith('- ')) return <li key={i} style={{ marginLeft: 20, marginBottom: 8 }}>{line.replace('- ', '').split('**').map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}</li>;
                if (line.trim() === '') return <br key={i} />;
                return <p key={i} style={{ marginBottom: 12 }}>{line.split('**').map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}</p>;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
