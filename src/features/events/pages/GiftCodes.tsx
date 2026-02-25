import React, { useState } from 'react';
import { Copy, Check, Gift, ExternalLink, AlertTriangle, Sparkles, Info, Clock } from 'lucide-react';
import { toast } from 'sonner';
import gameGuides from '@/data/gameGuides.json';
import { Card, CardContent, CardHeader } from '@/shared/ui/components/card';
import { Button } from '@/shared/ui/components/button';
import { Badge } from '@/shared/ui/components/badge';
import { Alert, AlertTitle, AlertDescription } from '@/shared/ui/components/alert';
import { cn } from '@/shared/lib/utils';

const COPY_FEEDBACK_DURATION_MS = 2000;

const GiftCodes: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => { /* clipboard unavailable */ });
    setCopiedCode(code);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopiedCode(null), COPY_FEEDBACK_DURATION_MS);
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/30">
          <Gift className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-headline-lg font-bold">Gift Codes</h1>
          <p className="text-body-md text-muted-foreground">
            {gameGuides.giftCodes.length} active codes • Updated {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* How to Redeem */}
      <Card variant="filled" className="border-2 border-primary-500/30 bg-primary-500/5">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
              <Info className="w-5 h-5 text-primary-400" />
            </div>
            <h2 className="text-title-lg font-semibold">How to Redeem Codes</h2>
          </div>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-body-md text-muted-foreground">
            {[
              'Launch Top Heroes: Kingdom Saga',
              'Tap your Avatar icon (top-left corner)',
              'Tap Settings at the bottom',
              'Tap Gift Code button',
              'Enter code and tap Confirm'
            ].map((step, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 text-label-sm font-semibold text-primary-400">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          <Alert variant="warning" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Case Sensitive</AlertTitle>
            <AlertDescription>Codes are case-sensitive! Copy them exactly as shown.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Codes List */}
      <div className="space-y-3">
        {gameGuides.giftCodes.map((item, index) => (
          <Card
            key={index}
            variant="filled"
            className={cn(
              'overflow-hidden transition-all duration-300',
              copiedCode === item.code && 'ring-2 ring-success-500 bg-success-500/5'
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <code className="text-title-lg font-mono font-bold text-foreground bg-surface-800 px-3 py-1 rounded-lg">
                      {item.code}
                    </code>
                    <Badge variant="success" size="sm">
                      <Sparkles className="w-3 h-3" />
                      Active
                    </Badge>
                  </div>
                  <p className="text-body-md text-muted-foreground">{item.rewards}</p>
                </div>

                <Button
                  variant={copiedCode === item.code ? 'default' : 'secondary'}
                  size="default"
                  onClick={() => copyToClipboard(item.code)}
                  className={cn(
                    'flex-shrink-0 transition-all',
                    copiedCode === item.code && 'bg-success-500 hover:bg-success-400'
                  )}
                >
                  {copiedCode === item.code ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Copy All */}
      <Card variant="filled" className="border border-dashed border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-tertiary-500/20 flex items-center justify-center">
                <Copy className="w-5 h-5 text-tertiary-400" />
              </div>
              <div>
                <p className="text-title-sm font-medium">Copy All Codes</p>
                <p className="text-body-sm text-muted-foreground">One code per line</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                const allCodes = gameGuides.giftCodes.map(c => c.code).join('\n');
                navigator.clipboard.writeText(allCodes).catch(() => { /* clipboard unavailable */ });
                setCopiedCode('all');
                setTimeout(() => setCopiedCode(null), COPY_FEEDBACK_DURATION_MS);
              }}
            >
              {copiedCode === 'all' ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied All!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy All
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sources */}
      <Card variant="filled">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <ExternalLink className="w-5 h-5 text-primary-400" />
            <h2 className="text-title-lg font-semibold">Sources & Updates</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-body-md text-muted-foreground">
            Codes sourced from official channels and community:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://www.pocketgamer.com/top-heroes/codes/"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center gap-3 p-4 bg-surface-800/50 rounded-xl',
                'hover:bg-surface-800 transition-colors group border border-transparent hover:border-primary-500/30'
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                <ExternalLink className="w-5 h-5 text-primary-400" />
              </div>
              <div className="flex-1">
                <p className="text-title-sm font-medium group-hover:text-primary-400 transition-colors">
                  PocketGamer Gift Codes
                </p>
                <p className="text-body-sm text-muted-foreground">Official code updates</p>
              </div>
            </a>

            <a
              href="https://topheroes.info/"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center gap-3 p-4 bg-surface-800/50 rounded-xl',
                'hover:bg-surface-800 transition-colors group border border-transparent hover:border-primary-500/30'
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-tertiary-500/20 flex items-center justify-center">
                <ExternalLink className="w-5 h-5 text-tertiary-400" />
              </div>
              <div className="flex-1">
                <p className="text-title-sm font-medium group-hover:text-primary-400 transition-colors">
                  TopHeroes.info
                </p>
                <p className="text-body-sm text-muted-foreground">Community database</p>
              </div>
            </a>
          </div>

          <Alert className="mt-4">
            <Clock className="h-4 w-4" />
            <AlertDescription>Codes expire frequently. If a code doesn&apos;t work, it may have expired. Check back regularly for new codes!</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default GiftCodes;
