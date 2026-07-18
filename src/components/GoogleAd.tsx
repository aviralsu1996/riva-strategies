import React, { useEffect, useState } from 'react';
import { Sparkles, Info, Settings, Eye, HelpCircle, AlertCircle, Copy, Check } from 'lucide-react';

interface GoogleAdProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
}

export default function GoogleAd({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
}: GoogleAdProps) {
  const [adClientId, setAdClientId] = useState<string>(() => {
    return localStorage.getItem('riva_adsense_client_id') || 'ca-pub-9876543210123456';
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBlockedOrEmpty, setIsBlockedOrEmpty] = useState(true);
  const [showConfig, setShowConfig] = useState(false);
  const [copied, setCopied] = useState(false);

  // Monitor Ad Client ID changes from localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('riva_adsense_client_id');
      if (stored) {
        setAdClientId(stored);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    // Custom event check
    const interval = setInterval(handleStorageChange, 1000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // 1. Inject Google AdSense Script if a valid client is found and not already present
    if (!adClientId || adClientId.startsWith('ca-pub-987654321')) {
      setIsBlockedOrEmpty(true);
      return;
    }

    try {
      const scriptId = 'google-adsense-script';
      let script = document.getElementById(scriptId) as HTMLScriptElement | null;
      
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClientId}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }

      setIsLoaded(true);

      // 2. Initialize the ad unit
      const adsbygoogle = (window as any).adsbygoogle || [];
      adsbygoogle.push({});
      setIsBlockedOrEmpty(false);
    } catch (err) {
      console.warn('AdSense script initialization failed or was blocked by an ad-blocker:', err);
      setIsBlockedOrEmpty(true);
    }
  }, [adClientId, slot]);

  const copyCodeToClipboard = () => {
    const code = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClientId}" crossorigin="anonymous"></script>
<!-- Responsive Minister Ad Unit -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="${adClientId}"
     data-ad-slot="${slot}"
     data-ad-format="${format}"
     data-full-width-responsive="${responsive ? 'true' : 'false'}"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Premium, highly styled Ad placeholder container
  return (
    <div id={`ad-container-${slot}`} className={`w-full my-6 transition-all duration-300 relative ${className}`}>
      
      {/* If Google Ads is fully configured and active, render the real AdSense markup */}
      {!isBlockedOrEmpty ? (
        <div className="overflow-hidden bg-white dark:bg-[#0b0d1e] rounded-xl border border-slate-200 dark:border-slate-800/80 p-1">
          <div className="text-[9px] uppercase tracking-wider font-mono text-slate-400 dark:text-slate-500 mb-1 text-center px-4 pt-1">
            Sponsored Advertisement
          </div>
          <ins
            className="adsbygoogle"
            style={{ display: 'block', minHeight: '90px' }}
            data-ad-client={adClientId}
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive={responsive ? 'true' : 'false'}
          />
        </div>
      ) : (
        /* Gorgeous, highly realistic visual placeholder matching RIVA branding */
        <div className="bg-white dark:bg-[#07091c]/80 rounded-2xl border border-dashed border-slate-200 dark:border-indigo-500/20 p-5 relative overflow-hidden flex flex-col items-center justify-center min-h-[120px] text-center shadow-sm">
          
          {/* Absolute Background Accents */}
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-xl pointer-events-none" />

          {/* Header Indicators */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800/60 text-[9px] font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase mb-3">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Ad Placement Slot
          </div>

          <div className="max-w-md">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-snug">
              Google AdSense Integration Point
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-sans">
              Slot ID: <span className="font-mono bg-slate-200/50 dark:bg-slate-800/50 px-1 py-0.5 rounded text-[9px]">{slot}</span> • Format: <span className="font-mono bg-slate-200/50 dark:bg-slate-800/50 px-1 py-0.5 rounded text-[9px]">{format}</span>
            </p>
          </div>

          {/* Setup / Configuration Hover Controls */}
          <div className="mt-3.5 flex items-center gap-2">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-white dark:text-indigo-300 text-[10px] font-bold rounded-lg border border-indigo-500/20 transition-all cursor-pointer shadow-sm"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Configure AdSense</span>
            </button>
            <a
              href="https://adsense.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 dark:bg-transparent dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 text-[10px] rounded-lg border border-slate-200 dark:border-white/10 transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Get Code</span>
            </a>
          </div>

          {/* Expandable Live Script Setup Console */}
          {showConfig && (
            <div className="w-full mt-4 p-4 text-left bg-white dark:bg-[#090b16] rounded-xl border border-slate-200 dark:border-indigo-500/30 shadow-lg text-xs space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs">
                  <Settings className="w-4 h-4 text-indigo-500" />
                  <span>Google AdSense Settings</span>
                </div>
                <button
                  onClick={() => setShowConfig(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-black text-sm"
                >
                  ×
                </button>
              </div>

              {/* Publisher ID Form Input */}
              <div className="space-y-1">
                <label className="block text-[10px] font-mono uppercase text-slate-400 dark:text-slate-400 font-bold">
                  Your Publisher Client ID (ca-pub-xxx)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={adClientId}
                    onChange={(e) => {
                      const val = e.target.value.trim();
                      setAdClientId(val);
                      localStorage.setItem('riva_adsense_client_id', val);
                    }}
                    placeholder="e.g. ca-pub-9876543210123456"
                    className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={() => {
                      // Reset to custom placeholder
                      setAdClientId('ca-pub-9876543210123456');
                      localStorage.setItem('riva_adsense_client_id', 'ca-pub-9876543210123456');
                    }}
                    className="px-2.5 py-1 text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-750 transition"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Live Status Warning */}
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg text-[10.5px] leading-relaxed flex gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Important:</span> To serve actual ads, your website domain must be approved in your AdSense account dashboard, and you must use a live, non-sandbox production build.
                </div>
              </div>

              {/* Ready-to-copy Code Generator */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Generated Ad Unit Snippet</span>
                  <button
                    onClick={copyCodeToClipboard}
                    className="flex items-center gap-1 text-[10px] text-indigo-500 hover:text-indigo-400 transition"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre className="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-lg text-[9px] font-mono text-slate-600 dark:text-slate-400 overflow-x-auto max-h-[120px] select-all">
                  {`<!-- Google AdSense Code -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClientId}" crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="${adClientId}"
     data-ad-slot="${slot}"
     data-ad-format="${format}"
     data-full-width-responsive="${responsive ? 'true' : 'false'}"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`}
                </pre>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
