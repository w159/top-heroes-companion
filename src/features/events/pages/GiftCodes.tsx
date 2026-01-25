import React, { useState } from 'react';
import { Copy, Check, Gift, ExternalLink } from 'lucide-react';
import gameGuides from '../../../data/gameGuides.json';

const GiftCodes: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 700,
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Gift size={32} color="var(--ios-blue)" />
          Gift Codes
        </h1>
        <p style={{ color: 'var(--ios-text-secondary)', fontSize: '15px' }}>
          {gameGuides.giftCodes.length} active codes • Updated {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* How to Redeem */}
      <div style={{
        background: 'var(--ios-blue-tint)',
        border: '1px solid var(--ios-blue)',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '24px'
      }}>
        <h3 style={{ fontSize: '17px', fontWeight: 600, marginBottom: '12px' }}>
          How to Redeem Codes
        </h3>
        <ol style={{
          margin: 0,
          paddingLeft: '20px',
          color: 'var(--ios-text-secondary)',
          fontSize: '15px',
          lineHeight: '1.6'
        }}>
          <li>Launch Top Heroes: Kingdom Saga</li>
          <li>Tap your Avatar icon (top-left corner)</li>
          <li>Tap Settings at the bottom</li>
          <li>Tap Gift Code button</li>
          <li>Enter code and tap Confirm</li>
        </ol>
        <p style={{
          marginTop: '12px',
          fontSize: '14px',
          color: 'var(--ios-orange)',
          fontWeight: 500
        }}>
          ⚠️ Codes are case-sensitive! Copy them exactly as shown.
        </p>
      </div>

      {/* Codes List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {gameGuides.giftCodes.map((item, index) => (
          <div
            key={index}
            style={{
              background: 'var(--ios-card-bg)',
              border: '1px solid var(--ios-border)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: 'monospace',
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--ios-text-primary)',
                marginBottom: '4px'
              }}>
                {item.code}
              </div>
              <div style={{
                fontSize: '14px',
                color: 'var(--ios-text-secondary)'
              }}>
                {item.rewards}
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(item.code)}
              style={{
                background: copiedCode === item.code ? 'var(--ios-green)' : 'var(--ios-blue)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 16px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              {copiedCode === item.code ? (
                <>
                  <Check size={16} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Sources */}
      <div style={{
        marginTop: '32px',
        padding: '16px',
        background: 'var(--ios-grouped-bg)',
        borderRadius: '12px'
      }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>
          Sources & Updates
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--ios-text-secondary)', marginBottom: '12px' }}>
          Codes sourced from official channels and community:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <a
            href="https://www.pocketgamer.com/top-heroes/codes/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--ios-blue)',
              fontSize: '14px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ExternalLink size={14} />
            PocketGamer Gift Codes
          </a>
          <a
            href="https://topheroes.info/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--ios-blue)',
              fontSize: '14px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ExternalLink size={14} />
            TopHeroes.info
          </a>
        </div>
        <p style={{
          fontSize: '13px',
          color: 'var(--ios-text-tertiary)',
          marginTop: '12px',
          fontStyle: 'italic'
        }}>
          Codes expire frequently. If a code doesn't work, it may have expired. Check back regularly for new codes!
        </p>
      </div>
    </div>
  );
};

export default GiftCodes;
