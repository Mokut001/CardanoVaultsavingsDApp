
'use client';
import { useState, useEffect } from 'react';
import { CardanoWallet, useWallet } from '@meshsdk/react';
import { 
  Target, 
  Wallet, 
  ArrowUpRight, 
  CheckCircle, 
  AlertCircle, 
  Calculator,
  Trophy,
  History
} from 'lucide-react';

export default function SavingsVault() {
  const { connected, wallet } = useWallet();
  const [targetAda, setTargetAda] = useState(1000);
  const [timeframe, setTimeframe] = useState(12);
  const [savedAda, setSavedAda] = useState(0);
  const [loading, setLoading] = useState(false);

  const monthlyAda = (targetAda / timeframe).toFixed(2);
  const progress = Math.min((savedAda / targetAda) * 100, 100);
  const remaining = targetAda - savedAda;
  const isGoalMet = savedAda >= targetAda;

  // Mock function to simulate deposit
  const handleDeposit = async () => {
    if(!connected) return;
    setLoading(true);
    // Simulate chain delay
    setTimeout(() => {
      setSavedAda(prev => prev + Number(monthlyAda));
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white selection:bg-blue-500/30">
      {/* Header */}
      <nav className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center border-b border-gray-800/50">
        <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                <Target size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Vault<span className="text-blue-500">Node</span></h1>
        </div>
        <CardanoWallet />
      </nav>

      <main className="max-w-6xl mx-auto p-6 md:p-12">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Dashboard Left */}
          <div className="lg:col-span-7 space-y-8">
            <div className="glass p-8 rounded-[2rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                    <History size={120} />
                </div>
                <h2 className="text-gray-400 font-medium mb-1">Total Locked Balance</h2>
                <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-6xl font-black text-white">{savedAda.toLocaleString()}</span>
                    <span className="text-2xl font-bold text-blue-500">ADA</span>
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-sm font-semibold text-gray-400">Target Progress</span>
                        <span className="text-xl font-bold text-white">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="h-6 w-full bg-[#30363d]/50 rounded-full overflow-hidden p-1 border border-gray-700">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(59,130,246,0.5)] ${isGoalMet ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-blue-600 to-indigo-500'}`}
                          style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="glass p-6 rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Remaining</p>
                        <p className="text-xl font-black">{remaining > 0 ? remaining.toLocaleString() : 0} ADA</p>
                    </div>
                </div>
                <div className="glass p-6 rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                        <Trophy size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Goal Met In</p>
                        <p className="text-xl font-black">{isGoalMet ? 'Completed' : timeframe + ' Months'}</p>
                    </div>
                </div>
            </div>

            {isGoalMet && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-3xl flex items-center gap-4 animate-pulse">
                    <CheckCircle className="text-emerald-500" size={32} />
                    <div>
                        <h3 className="text-emerald-400 font-bold text-lg">Target Reached!</h3>
                        <p className="text-emerald-500/80 text-sm">Your {targetAda} ADA is fully saved. You can now withdraw the entire amount back to your wallet.</p>
                    </div>
                </div>
            )}
          </div>

          {/* Action Center Right */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass p-8 rounded-[2rem]">
                <div className="flex items-center gap-2 mb-8">
                    <Calculator size={20} className="text-blue-500" />
                    <h2 className="text-lg font-bold">Goal Settings</h2>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Savings Target (ADA)</label>
                        <input 
                          type="number" 
                          value={targetAda} 
                          onChange={(e) => setTargetAda(Math.max(0, Number(e.target.value)))}
                          className="w-full bg-[#0d1117] border border-gray-800 rounded-2xl p-4 focus:ring-2 ring-blue-500 outline-none text-xl font-bold transition-all" 
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Timeframe (Months)</label>
                        <input 
                          type="number" 
                          value={timeframe} 
                          onChange={(e) => setTimeframe(Math.max(1, Number(e.target.value)))}
                          className="w-full bg-[#0d1117] border border-gray-800 rounded-2xl p-4 focus:ring-2 ring-blue-500 outline-none text-xl font-bold transition-all" 
                        />
                    </div>

                    <div className="p-5 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                        <p className="text-sm text-blue-400 mb-1">Recommended Deposit</p>
                        <p className="text-3xl font-black">{monthlyAda} <span className="text-sm font-normal text-gray-500">ADA / month</span></p>
                    </div>

                    <div className="pt-4 flex flex-col gap-3">
                        <button 
                          onClick={handleDeposit}
                          disabled={!connected || loading || isGoalMet}
                          className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(37,99,235,0.2)]"
                        >
                            {loading ? 'Processing...' : `Deposit ${monthlyAda} ADA`}
                            <ArrowUpRight size={20} />
                        </button>

                        <button 
                          disabled={!isGoalMet}
                          className={`w-full py-5 rounded-2xl font-black text-lg transition-all border-2 flex items-center justify-center gap-2 ${isGoalMet ? 'bg-white text-black border-white hover:bg-gray-200' : 'bg-transparent border-gray-800 text-gray-600 cursor-not-allowed'}`}
                        >
                            Withdraw Everything
                            <Wallet size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-4 text-center">
                <p className="text-[10px] text-gray-700 uppercase font-black tracking-[0.2em]">Secured by Cardano Plutus Smart Contract</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}