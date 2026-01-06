
import React, { useState } from 'react';
import { GIFT_CODES } from '../constants';
import { useUserData } from '../utils';
import { Copy, Check, Gift, ExternalLink } from 'lucide-react';

const Codes: React.FC = () => {
  const { data, toggleCodeRedeemed } = useUserData();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const activeCodes = GIFT_CODES.filter(c => c.isActive);
  const expiredCodes = GIFT_CODES.filter(c => !c.isActive);

  // Fixed: Added React.FC typing to CodeItem to resolve 'key' prop TypeScript errors in JSX
  const CodeItem: React.FC<{ codeItem: typeof GIFT_CODES[0] }> = ({ codeItem }) => {
    const isRedeemed = data.redeemedCodes.includes(codeItem.code);

    return (
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border ${isRedeemed ? 'bg-gray-900/50 border-gray-800 opacity-60' : 'bg-bg-secondary border-border'} transition-all hover:border-gray-600`}>
            <div className="mb-3 sm:mb-0">
                <div className="flex items-center space-x-3">
                    <span className={`font-mono text-lg font-bold ${isRedeemed ? 'text-gray-500 line-through' : 'text-blue-400'}`}>
                        {codeItem.code}
                    </span>
                    {isRedeemed && <span className="text-xs text-green-500 font-bold border border-green-900 bg-green-900/20 px-2 py-0.5 rounded">REDEEMED</span>}
                </div>
                <p className="text-sm text-gray-400 mt-1">{codeItem.rewards}</p>
                {codeItem.addedDate && <p className="text-xs text-gray-600 mt-1">Added: {codeItem.addedDate}</p>}
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button 
                    onClick={() => copyToClipboard(codeItem.code)}
                    className="flex-1 sm:flex-none px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm flex items-center justify-center transition-colors"
                >
                    {copiedCode === codeItem.code ? <Check size={16} /> : <Copy size={16} />}
                    <span className="ml-2">{copiedCode === codeItem.code ? 'Copied' : 'Copy'}</span>
                </button>
                
                <button 
                    onClick={() => toggleCodeRedeemed(codeItem.code)}
                    className={`px-3 py-2 rounded text-sm transition-colors ${
                        isRedeemed 
                        ? 'bg-transparent border border-gray-600 text-gray-500 hover:text-gray-300' 
                        : 'bg-green-700 hover:bg-green-600 text-white'
                    }`}
                >
                    {isRedeemed ? 'Undo' : 'Mark Used'}
                </button>
            </div>
        </div>
    );
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-start">
            <div>
                <h1 className="text-3xl font-display font-bold text-white">Gift Codes</h1>
                <p className="text-gray-400 mt-1">Free rewards! Tap 'Copy' and redeem in-game.</p>
            </div>
            <div className="mt-4 md:mt-0 p-3 bg-blue-900/20 border border-blue-900/50 rounded-lg text-sm text-blue-200">
                <strong>How to redeem:</strong> Avatar &gt; Settings &gt; Gift Code
            </div>
       </div>

       <div className="space-y-4">
           <h2 className="text-xl font-bold text-white flex items-center">
               <Gift className="mr-2 text-green-400" size={20} /> Active Codes
           </h2>
           <div className="grid gap-3">
               {activeCodes.map(code => <CodeItem key={code.code} codeItem={code} />)}
           </div>
       </div>

       <div className="pt-8 space-y-4">
           <h2 className="text-xl font-bold text-gray-500">Expired Codes</h2>
           <div className="grid gap-3">
               {expiredCodes.map(code => <CodeItem key={code.code} codeItem={code} />)}
           </div>
       </div>
    </div>
  );
};

export default Codes;
