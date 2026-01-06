import React from 'react';
import { useUserData, calculateHeroPower } from '../utils';
import { EVENTS, GIFT_CODES } from '../constants';
import { Shield, Zap, Gift, Trophy, ArrowRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Dashboard: React.FC = () => {
  const { data } = useUserData();

  const activeEvents = EVENTS.filter(e => e.isActive);
  const activeCodes = GIFT_CODES.filter(c => c.isActive && !data.redeemedCodes.includes(c.code));
  
  const totalPower = data.roster.reduce((acc, hero) => acc + calculateHeroPower(hero), 0);
  const heroCount = data.roster.length;
  const mythicCount = data.roster.filter(h => h.rarity === 'Mythic').length;

  const factionDistribution = [
      { name: 'Nature', value: data.roster.filter(h => h.faction === 'Nature').length, color: '#8BC34A' },
      { name: 'League', value: data.roster.filter(h => h.faction === 'League').length, color: '#64B5F6' },
      { name: 'Horde', value: data.roster.filter(h => h.faction === 'Horde').length, color: '#EF5350' },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
            <h1 className="text-3xl font-display font-bold text-white mb-1">Welcome, Commander</h1>
            <p className="text-gray-400">Server Group: <span className="text-blue-400 font-mono">{data.settings.serverGroup}</span></p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center bg-gray-800 rounded-lg px-4 py-2 border border-border">
            <Zap className="text-yellow-400 mr-2" size={20} />
            <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Total Power</span>
                <span className="text-xl font-mono font-bold text-white">{totalPower.toLocaleString()}</span>
            </div>
        </div>
      </div>

      {/* Alert Section for Codes */}
      {activeCodes.length > 0 && (
          <div className="bg-gradient-to-r from-green-900/40 to-green-800/20 border border-green-700/50 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center">
                  <div className="bg-green-500/20 p-2 rounded-full mr-3">
                    <Gift className="text-green-400" size={20} />
                  </div>
                  <div>
                      <h3 className="font-bold text-green-100">Gift Codes Available</h3>
                      <p className="text-sm text-green-300">You have {activeCodes.length} unredeemed codes waiting.</p>
                  </div>
              </div>
              <Link to="/codes" className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg text-sm font-semibold transition-colors">
                  View Codes
              </Link>
          </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Quick Stats */}
          <div className="bg-bg-secondary border border-border rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Shield size={18} className="mr-2 text-blue-400" /> Roster Status
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-bg-tertiary p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-white">{heroCount}</div>
                      <div className="text-xs text-gray-500 uppercase">Heroes</div>
                  </div>
                  <div className="bg-bg-tertiary p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-400">{mythicCount}</div>
                      <div className="text-xs text-gray-500 uppercase">Mythics</div>
                  </div>
              </div>
              <div className="h-32 w-full">
                {factionDistribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie 
                                data={factionDistribution} 
                                innerRadius={25} 
                                outerRadius={40} 
                                paddingAngle={5} 
                                dataKey="value"
                            >
                                {factionDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#161B22', border: '1px solid #30363D', borderRadius: '8px' }}
                                itemStyle={{ color: '#E6EDF3' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-600 text-sm italic">
                        No heroes added
                    </div>
                )}
              </div>
              <Link to="/roster" className="block w-full text-center mt-2 text-sm text-blue-400 hover:text-blue-300">
                  Manage Roster &rarr;
              </Link>
          </div>

          {/* Active Events */}
          <div className="bg-bg-secondary border border-border rounded-xl p-6 md:col-span-2">
               <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Trophy size={18} className="mr-2 text-yellow-400" /> Active Events
              </h2>
              <div className="space-y-3">
                  {activeEvents.map(event => (
                      <div key={event.id} className="bg-bg-tertiary rounded-lg p-4 border-l-4 border-yellow-500">
                          <div className="flex justify-between items-start">
                              <h3 className="font-bold text-gray-100">{event.name}</h3>
                              <span className="text-xs bg-yellow-900/40 text-yellow-400 px-2 py-1 rounded border border-yellow-900/60">Active Now</span>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">{event.description}</p>
                          <div className="mt-2 text-xs text-gray-500 flex items-start">
                              <AlertCircle size={12} className="mr-1 mt-0.5" />
                              <span className="flex-1 italic">
                                {event.preparationChecklist?.[0] 
                                    ? (event.preparationChecklist[0].length > 100 
                                        ? `${event.preparationChecklist[0].substring(0, 100)}...` 
                                        : event.preparationChecklist[0])
                                    : "Check detailed strategy in Events tab"}
                              </span>
                          </div>
                      </div>
                  ))}
                  <Link to="/events" className="flex items-center text-sm text-gray-400 hover:text-white mt-2">
                     See all strategies <ArrowRight size={14} className="ml-1" />
                  </Link>
              </div>
          </div>
      </div>
      
      {/* Quick Recommendations */}
      <div className="bg-bg-secondary border border-border rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Recommended Actions</h2>
        <ul className="space-y-2">
            {!data.roster.some(h => h.id === 'tidecaller') && (
                <li className="flex items-center text-sm text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-orange-500 mr-3"></span>
                    Acquire <strong className="text-orange-400 mx-1">Tidecaller</strong> - Top tier tank/support.
                </li>
            )}
            {mythicCount < 3 && (
                 <li className="flex items-center text-sm text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-3"></span>
                    Focus on saving vouchers for Arms Race Day 4 to get more Mythics.
                </li>
            )}
             <li className="flex items-center text-sm text-gray-300">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-3"></span>
                Check "Guild Arms Race" schedule in Events tab to prepare resources.
            </li>
        </ul>
      </div>

    </div>
  );
};

export default Dashboard;