
import React, { useState, useEffect } from 'react';
import { EVENTS } from '../../../shared/types/constants';
import { GameEvent } from '../../../shared/types';
import { getEventState, getTimeUntilReset, useUserData } from '../../../shared/utils';
import { recommendEventStrategies } from '../../../shared/utils/recommendations';
import {
  Calendar, Clock, AlertTriangle, CheckCircle,
  ChevronDown, ChevronUp, Sword, Hammer,
  UserPlus, Zap, Info, Target, List, Gift, Trophy, CheckSquare, Square
} from 'lucide-react';

const Events: React.FC = () => {
  const { data } = useUserData();
  const [activeTab, setActiveTab] = useState<'active' | 'library'>('active');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});
  const [resetCountdown, setResetCountdown] = useState<string>(getTimeUntilReset());

  useEffect(() => {
    const timer = setInterval(() => {
      setResetCountdown(getTimeUntilReset());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeEventsWithState = EVENTS.map(e => ({ ...e, state: getEventState(e) })).filter(e => e.state.isActive);
  const inactiveEvents = EVENTS.filter(e => !getEventState(e).isActive);

  const eventStrategies = React.useMemo(
    () => recommendEventStrategies(data, EVENTS),
    [data],
  );

  const toggleEvent = (id: string) => {
      setExpandedEventId(expandedEventId === id ? null : id);
  };

  const toggleTask = (taskId: string) => {
    setCheckedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const getEventIcon = (name: string) => {
      if (name.includes('Arms')) return <Sword className="text-orange-400" size={20} />;
      if (name.includes('Ruins') || name.includes('War')) return <Hammer className="text-blue-400" size={20} />;
      if (name.includes('Recruitment') || name.includes('Pet')) return <UserPlus className="text-green-400" size={20} />;
      if (name.includes('Boss') || name.includes('Lava')) return <Target className="text-red-400" size={20} />;
      return <Calendar className="text-gray-400" size={20} />;
  };

  // Fixed: Added React.FC typing to EventCard to resolve 'key' prop TypeScript errors in JSX
  const EventCard: React.FC<{ event: GameEvent & { state?: ReturnType<typeof getEventState> }, isActiveView: boolean }> = ({ event, isActiveView }) => {
      const isExpanded = expandedEventId === event.id || (isActiveView && event.state?.isActive);
      const activePhaseIdx = event.state?.activePhaseIndex ?? -1;

      return (
          <div className={`bg-bg-secondary border rounded-xl overflow-hidden transition-all duration-300 ${isActiveView ? 'border-yellow-500/50 shadow-lg shadow-yellow-900/10' : 'border-border hover:border-gray-600'}`}>
          <div
                className="p-5 cursor-pointer flex justify-between items-start"
                onClick={() => toggleEvent(event.id)}
              >
                  <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${isActiveView ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-700/50 text-gray-400'}`}>
                          {getEventIcon(event.name)}
                      </div>
                      <div>
                          <h2 className="text-xl font-bold text-white flex items-center">
                              {event.name}
                              {isActiveView && <span className="ml-3 text-xs bg-yellow-600 text-white px-2 py-0.5 rounded-full animate-pulse">LIVE</span>}
                          </h2>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-gray-500">{event.type} Event</span>
                            {event.scheduleType === 'Weekly-UTC' && <span className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded flex items-center"><Clock size={10} className="mr-1"/> UTC Cycle</span>}
                          </div>
                      </div>
                  </div>
                  <button className="text-gray-400 mt-2">
                      {isExpanded ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                  </button>
              </div>

              {isExpanded && (
                  <div className="px-5 pb-6 border-t border-gray-800/50 pt-4 animate-in slide-in-from-top-2">
                      <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                          {event.description}
                      </p>

                      {isActiveView && activePhaseIdx !== -1 && event.phases && event.phases[activePhaseIdx] && (
                          <div className="mb-8 bg-blue-900/10 border border-blue-500/20 rounded-xl p-5 relative overflow-hidden group">
                              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <Zap size={80} className="text-blue-500" />
                              </div>
                              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3 flex items-center">
                                  <Clock size={14} className="mr-2" /> ACTIVE NOW: {event.phases[activePhaseIdx].name}
                              </h3>
                              <p className="text-white text-lg font-bold mb-2">{event.phases[activePhaseIdx].description}</p>

                              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <div className="text-[10px] uppercase font-bold text-gray-500">Key Tasks</div>
                                  <ul className="space-y-1">
                                    {event.phases[activePhaseIdx].keyTasks.map((t, i) => (
                                      <li key={i} className="text-sm text-gray-300 flex items-center">
                                        <CheckCircle size={14} className="text-blue-500 mr-2" /> {t}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="space-y-2">
                                  <div className="text-[10px] uppercase font-bold text-gray-500">Strategy</div>
                                  <p className="text-sm text-yellow-400/90 italic font-medium">{event.phases[activePhaseIdx].pointsStrategy}</p>
                                </div>
                              </div>
                          </div>
                      )}

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                          {event.phases && (
                            <div>
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center">
                                    <List size={16} className="mr-2" /> Schedule & Tips
                                </h3>
                                <div className="space-y-3">
                                    {event.phases.map((phase, idx) => {
                                        const isCurrent = isActiveView && activePhaseIdx === idx;
                                        return (
                                          <div
                                            key={idx}
                                              className={`p-4 rounded-lg border transition-all ${isCurrent ? 'bg-blue-900/10 border-blue-500/40 shadow-inner' : 'bg-bg-tertiary border-gray-700 opacity-60 hover:opacity-100'}`}
                                            >
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className={`font-bold ${isCurrent ? 'text-blue-400' : 'text-gray-300'}`}>{phase.name}</span>
                                                    {isCurrent && <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-mono animate-pulse">CURRENT</span>}
                                                </div>
                                                <p className="text-xs text-gray-500 mb-3">{phase.description}</p>

                                                {phase.tips && (
                                                   <div className="bg-black/20 p-3 rounded border border-gray-800/50">
                                                      <div className="flex items-center text-[10px] font-bold text-blue-400 mb-1 uppercase"><Info size={10} className="mr-1"/> Pro Tips</div>
                                                      <ul className="space-y-1">
                                                        {phase.tips.map((t, i) => (
                                                          <li key={i} className="text-[11px] text-gray-400 flex items-start">
                                                            <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 mr-2 flex-shrink-0"></div>
                                                            {t}
                                                          </li>
                                                        ))}
                                                      </ul>
                                                   </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-6">
                          {event.preparationChecklist && (
                              <div className="bg-bg-tertiary rounded-xl p-5 border border-orange-500/20">
                                  <h3 className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-4 flex items-center">
                                      <CheckSquare size={16} className="mr-2" /> Prep Checklist
                                  </h3>
                                  <ul className="space-y-3">
                                      {event.preparationChecklist.map((item, idx) => {
                                          const taskId = `${event.id}-task-${idx}`;
                                          const isChecked = checkedTasks[taskId];
                                          return (
                                            <li
                                              key={idx}
                                                onClick={() => toggleTask(taskId)}
                                                className={`flex items-start text-xs cursor-pointer select-none transition-colors ${isChecked ? 'text-gray-600' : 'text-gray-300 hover:text-white'}`}
                                              >
                                                  {isChecked ? <CheckSquare size={16} className="text-orange-500 mr-3 flex-shrink-0" /> : <Square size={16} className="text-gray-600 mr-3 flex-shrink-0" />}
                                                  <span className={isChecked ? 'line-through' : ''}>{item}</span>
                                              </li>
                                          );
                                      })}
                                  </ul>
                              </div>
                          )}

                          {event.rewardsHighlight && (
                              <div className="bg-bg-tertiary rounded-xl p-5 border border-green-500/20">
                                  <h3 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-4 flex items-center">
                                      <Gift size={16} className="mr-2" /> Expected Rewards
                                  </h3>
                                  <div className="flex flex-wrap gap-2">
                                      {event.rewardsHighlight.map((reward, idx) => (
                                          <div key={idx} className="flex items-center px-2.5 py-1.5 bg-green-900/10 border border-green-900/30 rounded text-[11px] text-green-300 font-medium">
                                              <Trophy size={10} className="mr-1.5 opacity-50"/>
                                              {reward}
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          )}
                        </div>
                      </div>
                  </div>
              )}
          </div>
      );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-bg-secondary p-6 rounded-2xl border border-border shadow-xl">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Event Command Center</h1>
            <p className="text-gray-500 text-sm mt-1">Detailed strategy library for Kingdom Saga commanders.</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1 flex items-center">
              <Clock size={12} className="mr-1"/> Time to Daily Reset
            </div>
            <div className="text-2xl font-mono font-bold text-white tabular-nums bg-black/30 px-4 py-2 rounded-lg border border-gray-800">
              {resetCountdown}
            </div>
          </div>
      </div>

      <div className="bg-bg-secondary p-4 rounded-2xl border border-border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center">
            <Target size={14} className="mr-1" /> Recommended focus
          </div>
          {eventStrategies.length === 0 ? (
            <p className="text-xs text-gray-400">Event data not available yet.</p>
          ) : (
            <>
              <p className="text-sm text-gray-200">
                {eventStrategies
                  .filter(s => s.priority === 'High')
                  .slice(0, 1)
                  .map(s => s.focus)[0] || eventStrategies[0].focus}
              </p>
              <ul className="mt-1 text-xs text-gray-400 list-disc list-inside space-y-0.5">
                {eventStrategies
                  .filter(s => s.priority === 'High')
                  .flatMap(s => s.actions.slice(0, 2))
                  .slice(0, 3)
                  .map(item => (
                    <li key={item}>{item}</li>
                  ))}
              </ul>
            </>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {eventStrategies
            .filter(s => s.priority === 'High')
            .slice(0, 3)
            .map(s => (
              <span
                key={s.eventId}
                className="px-2 py-1 rounded-full text-[11px] bg-blue-900/30 border border-blue-500/40 text-blue-300 font-medium"
              >
                {s.eventName}
              </span>
            ))}
        </div>
      </div>

      <div className="flex space-x-1 bg-bg-secondary p-1 rounded-xl w-fit border border-border">
        <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'active' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
              Live Events
          </button>
        <button
            onClick={() => setActiveTab('library')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'library' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
              Global Strategy
          </button>
      </div>

      <div className="space-y-6">
          {activeTab === 'active' ? (
              activeEventsWithState.length > 0 ? (
                activeEventsWithState.map(event => <EventCard key={event.id} event={event} isActiveView={true} />)
              ) : (
                  <div className="text-center py-20 bg-bg-secondary rounded-2xl border border-dashed border-gray-700">
                      <div className="inline-block p-4 bg-gray-800 rounded-full mb-4">
                        <Calendar className="text-gray-500" size={40} />
                      </div>
                      <h3 className="text-xl font-bold text-white">Quiet in the Kingdom</h3>
                      <p className="text-gray-500 mt-2 max-w-sm mx-auto">No major timed events are currently live in your server cycle. Check the strategy guide for tomorrow's prep.</p>
                      <button onClick={() => setActiveTab('library')} className="mt-6 px-6 py-2 bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all text-sm font-bold">Browse Library</button>
                  </div>
              )
          ) : (
              inactiveEvents.map(event => <EventCard key={event.id} event={event} isActiveView={false} />)
          )}
      </div>

      <div className="bg-blue-900/10 border border-blue-500/20 p-6 rounded-2xl flex items-start space-x-4">
        <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400 flex-shrink-0">
          <Info size={24} />
        </div>
        <div>
          <h4 className="font-bold text-white mb-1">Commander's Tip</h4>
          <p className="text-sm text-gray-400">All events follow the UTC timezone (00:00 Reset). If you are preparing for Construction or Training days, always check your speedup reserves 12 hours before reset to ensure you can secure the top rank brackets.</p>
        </div>
      </div>
    </div>
  );
};

export default Events;
