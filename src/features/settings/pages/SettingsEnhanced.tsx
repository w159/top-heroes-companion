import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Download,
  Upload,
  RefreshCw,
  DollarSign,
  TrendingUp,
  Package,
  Clock,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { services } from '../src/core/ServiceContainer';
import { SpendAnalytics, ROIAnalysis, Purchase } from '../src/core/domain/interfaces';

const SettingsEnhanced: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'purchases' | 'updates'>('general');
  const [analytics, setAnalytics] = useState<SpendAnalytics | null>(null);
  const [roiAnalysis, setROIAnalysis] = useState<ROIAnalysis | null>(null);
  const [contentFreshness, setContentFreshness] = useState<any>(null);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [newPurchase, setNewPurchase] = useState({
    type: 'diamonds' as const,
    name: '',
    costUSD: 0,
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    if (activeTab === 'purchases') {
      const analytics = await services.purchase.getAnalytics();
      setAnalytics(analytics);

      if (analytics.totalSpent > 0) {
        const roi = await services.purchase.calculateROI(2000000); // Target 2M power
        setROIAnalysis(roi);
      }
    } else if (activeTab === 'updates') {
      const freshness = services.contentUpdate.getContentFreshness();
      setContentFreshness(freshness);
    }
  };

  const handleExportData = async () => {
    try {
      const data = await services.dataRepository.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `top-heroes-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data');
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      await services.dataRepository.importData(text);
      alert('Data imported successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import data. Please check the file format.');
    }
  };

  const handleCheckUpdates = async () => {
    try {
      await services.contentUpdate.checkForUpdates();
      const freshness = services.contentUpdate.getContentFreshness();
      setContentFreshness(freshness);
      alert('Update check complete!');
    } catch (error) {
      console.error('Update check failed:', error);
    }
  };

  const handleRecordPurchase = async () => {
    if (!newPurchase.name || newPurchase.costUSD <= 0) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await services.purchase.recordPurchase({
        ...newPurchase,
        rewards: { gems: 0 }, // Would be populated from form
      });
      setShowPurchaseForm(false);
      setNewPurchase({ type: 'diamonds', name: '', costUSD: 0 });
      await loadData();
      alert('Purchase recorded!');
    } catch (error) {
      console.error('Failed to record purchase:', error);
      alert('Failed to record purchase');
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <SettingsIcon size={32} />
        <h1>Settings & Analytics</h1>
      </div>

      {/* Tab Navigation */}
      <div className="settings-tabs">
        <button
          className={`tab ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          <SettingsIcon size={18} />
          General
        </button>
        <button
          className={`tab ${activeTab === 'purchases' ? 'active' : ''}`}
          onClick={() => setActiveTab('purchases')}
        >
          <DollarSign size={18} />
          Purchase Tracking
        </button>
        <button
          className={`tab ${activeTab === 'updates' ? 'active' : ''}`}
          onClick={() => setActiveTab('updates')}
        >
          <RefreshCw size={18} />
          Content Updates
        </button>
      </div>

      {/* Tab Content */}
      <div className="settings-content">
        {activeTab === 'general' && (
          <div className="tab-panel">
            <section className="settings-section">
              <h2>Data Management</h2>

              <div className="settings-actions">
                <button onClick={handleExportData} className="btn-action">
                  <Download size={18} />
                  Export Data
                </button>

                <label className="btn-action">
                  <Upload size={18} />
                  Import Data
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              <p className="settings-note">
                Export your data to back up progress or transfer to another device.
              </p>
            </section>

            <section className="settings-section">
              <h2>About</h2>
              <div className="about-info">
                <p>Top Heroes Companion v2.0</p>
                <p>Local-first game companion with RAG-powered assistance</p>
                <p>Clean Architecture + TypeScript + React 19</p>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'purchases' && (
          <div className="tab-panel">
            <section className="settings-section">
              <div className="section-header">
                <h2>Purchase Analytics</h2>
                <button
                  onClick={() => setShowPurchaseForm(!showPurchaseForm)}
                  className="btn-primary"
                >
                  <Package size={18} />
                  Record Purchase
                </button>
              </div>

              {showPurchaseForm && (
                <div className="purchase-form">
                  <select
                    value={newPurchase.type}
                    onChange={(e) =>
                      setNewPurchase({ ...newPurchase, type: e.target.value as any })
                    }
                  >
                    <option value="diamonds">Diamonds</option>
                    <option value="battle_pass">Battle Pass</option>
                    <option value="special_offer">Special Offer</option>
                    <option value="subscription">Subscription</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Purchase name"
                    value={newPurchase.name}
                    onChange={(e) =>
                      setNewPurchase({ ...newPurchase, name: e.target.value })
                    }
                  />

                  <input
                    type="number"
                    placeholder="Cost (USD)"
                    value={newPurchase.costUSD || ''}
                    onChange={(e) =>
                      setNewPurchase({ ...newPurchase, costUSD: parseFloat(e.target.value) })
                    }
                  />

                  <button onClick={handleRecordPurchase} className="btn-submit">
                    Save Purchase
                  </button>
                </div>
              )}

              {analytics && (
                <div className="analytics-grid">
                  <div className="stat-card">
                    <DollarSign size={24} className="stat-icon" />
                    <div className="stat-value">${analytics.totalSpent.toFixed(2)}</div>
                    <div className="stat-label">Total Spent</div>
                  </div>

                  <div className="stat-card">
                    <Package size={24} className="stat-icon" />
                    <div className="stat-value">{analytics.purchaseCount}</div>
                    <div className="stat-label">Purchases</div>
                  </div>

                  <div className="stat-card">
                    <TrendingUp size={24} className="stat-icon" />
                    <div className="stat-value">${analytics.averagePurchase.toFixed(2)}</div>
                    <div className="stat-label">Avg Purchase</div>
                  </div>
                </div>
              )}

              {roiAnalysis && (
                <div className="roi-section">
                  <h3>ROI Analysis</h3>
                  <div className="roi-card">
                    <p>
                      <strong>Spend Profile:</strong> {roiAnalysis.spendProfile}
                    </p>
                    <p>
                      <strong>Efficiency:</strong> {roiAnalysis.efficiency.toFixed(0)} power per $
                    </p>
                    <p>
                      <strong>Time Saved:</strong>{' '}
                      {roiAnalysis.timeToGoalF2P - roiAnalysis.timeToGoalWithSpend} days vs F2P
                    </p>
                    <div className="recommendation">
                      <AlertCircle size={16} />
                      {roiAnalysis.recommendation}
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === 'updates' && (
          <div className="tab-panel">
            <section className="settings-section">
              <div className="section-header">
                <h2>Content Updates</h2>
                <button onClick={handleCheckUpdates} className="btn-action">
                  <RefreshCw size={18} />
                  Check for Updates
                </button>
              </div>

              {contentFreshness && (
                <div className="freshness-grid">
                  {Object.entries(contentFreshness).map(([category, data]: [string, any]) => (
                    <div key={category} className="freshness-card">
                      {data.isStale ? (
                        <AlertCircle size={20} className="status-icon stale" />
                      ) : (
                        <CheckCircle size={20} className="status-icon fresh" />
                      )}
                      <div className="freshness-info">
                        <div className="category-name">{category}</div>
                        <div className="freshness-age">
                          <Clock size={14} />
                          {data.age} days old
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <p className="settings-note">
                Content updates are checked automatically every 24 hours. Stale content (7+ days
                old) will be highlighted.
              </p>
            </section>
          </div>
        )}
      </div>

      <style>{`
        .settings-container {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .settings-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
        }

        .settings-header h1 {
          font-size: 32px;
          font-weight: 700;
          color: white;
        }

        .settings-tabs {
          display: flex;
          gap: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 24px;
        }

        .tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }

        .tab:hover {
          color: rgba(255, 255, 255, 0.9);
        }

        .tab.active {
          color: #007AFF;
          border-bottom-color: #007AFF;
        }

        .settings-content {
          min-height: 500px;
        }

        .tab-panel {
          animation: fadeIn 0.3s;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .settings-section {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .settings-section h2 {
          font-size: 20px;
          font-weight: 600;
          color: white;
          margin-bottom: 16px;
        }

        .settings-section h3 {
          font-size: 18px;
          font-weight: 600;
          color: white;
          margin-bottom: 12px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .settings-actions {
          display: flex;
          gap: 12px;
        }

        .btn-action, .btn-primary, .btn-submit {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.1);
          color: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-action:hover, .btn-primary:hover, .btn-submit:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: #007AFF;
        }

        .btn-primary {
          background: #007AFF;
          border-color: #007AFF;
        }

        .btn-submit {
          background: #30D158;
          border-color: #30D158;
          width: 100%;
          justify-content: center;
        }

        .settings-note {
          margin-top: 12px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
        }

        .about-info p {
          margin-bottom: 8px;
          color: rgba(255, 255, 255, 0.8);
        }

        .purchase-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          margin-bottom: 24px;
        }

        .purchase-form input, .purchase-form select {
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 14px;
        }

        .analytics-grid, .freshness-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-top: 20px;
        }

        .stat-card, .freshness-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px;
        }

        .stat-icon {
          color: #007AFF;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: white;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
        }

        .roi-section {
          margin-top: 24px;
        }

        .roi-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 16px;
        }

        .roi-card p {
          margin-bottom: 8px;
          color: rgba(255, 255, 255, 0.9);
        }

        .recommendation {
          margin-top: 12px;
          padding: 12px;
          background: rgba(0, 122, 255, 0.1);
          border-left: 3px solid #007AFF;
          border-radius: 4px;
          display: flex;
          gap: 8px;
          color: rgba(255, 255, 255, 0.9);
        }

        .freshness-card {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .status-icon {
          flex-shrink: 0;
        }

        .status-icon.fresh {
          color: #30D158;
        }

        .status-icon.stale {
          color: #FF9F0A;
        }

        .freshness-info {
          flex: 1;
        }

        .category-name {
          font-weight: 600;
          color: white;
          text-transform: capitalize;
          margin-bottom: 4px;
        }

        .freshness-age {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </div>
  );
};

export default SettingsEnhanced;
