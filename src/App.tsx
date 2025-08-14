import React, { useState, useEffect } from 'react';

interface PlayerStats {
  vpip: number;
  pfr: number;
  checkRaise: number;
  memo: string;
}

type PlayerType = 'TAG' | 'LAG' | 'TP' | 'LP' | 'Unknown';

const PokerStatsApp: React.FC = () => {
  const [hands, setHands] = useState(0);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>(
    Array(9).fill(null).map(() => ({ vpip: 0, pfr: 0, checkRaise: 0, memo: '' }))
  );
  const [showSettings, setShowSettings] = useState(false);
  const [vpipThreshold, setVpipThreshold] = useState(20);
  const [tightDiffThreshold, setTightDiffThreshold] = useState(5);
  const [looseDiffThreshold, setLooseDiffThreshold] = useState(8);
  const [minHands, setMinHands] = useState(10);

  // ローカルストレージから読み込み
  useEffect(() => {
    const savedHands = localStorage.getItem('pokerHands');
    const savedStats = localStorage.getItem('pokerPlayerStats');
    const savedVpipThreshold = localStorage.getItem('vpipThreshold');
    const savedTightDiffThreshold = localStorage.getItem('tightDiffThreshold');
    const savedLooseDiffThreshold = localStorage.getItem('looseDiffThreshold');
    const savedMinHands = localStorage.getItem('minHands');
    
    if (savedHands) {
      setHands(parseInt(savedHands));
    }
    if (savedStats) {
      setPlayerStats(JSON.parse(savedStats));
    }
    if (savedVpipThreshold) {
      setVpipThreshold(parseInt(savedVpipThreshold));
    }
    if (savedTightDiffThreshold) {
      setTightDiffThreshold(parseInt(savedTightDiffThreshold));
    }
    if (savedLooseDiffThreshold) {
      setLooseDiffThreshold(parseInt(savedLooseDiffThreshold));
    }
    if (savedMinHands) {
      setMinHands(parseInt(savedMinHands));
    }
  }, []);

  // ローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('pokerHands', hands.toString());
    localStorage.setItem('pokerPlayerStats', JSON.stringify(playerStats));
    localStorage.setItem('vpipThreshold', vpipThreshold.toString());
    localStorage.setItem('tightDiffThreshold', tightDiffThreshold.toString());
    localStorage.setItem('looseDiffThreshold', looseDiffThreshold.toString());
    localStorage.setItem('minHands', minHands.toString());
  }, [hands, playerStats, vpipThreshold, tightDiffThreshold, looseDiffThreshold, minHands]);

  const incrementHands = () => {
    setHands(prev => prev + 1);
  };

  const incrementPlayerStat = (playerIndex: number, stat: keyof Omit<PlayerStats, 'memo'>) => {
    setPlayerStats(prev => {
      const newStats = [...prev];
      newStats[playerIndex] = {
        ...newStats[playerIndex],
        [stat]: (newStats[playerIndex][stat] as number) + 1
      };
      return newStats;
    });
  };

  const resetAllStats = () => {
    setHands(0);
    setPlayerStats(Array(9).fill(null).map(() => ({ vpip: 0, pfr: 0, checkRaise: 0, memo: '' })));
  };

  const resetPlayerStats = (playerIndex: number) => {
    setPlayerStats(prev => {
      const newStats = [...prev];
      newStats[playerIndex] = { vpip: 0, pfr: 0, checkRaise: 0, memo: '' };
      return newStats;
    });
  };

  const updatePlayerMemo = (playerIndex: number, memo: string) => {
    setPlayerStats(prev => {
      const newStats = [...prev];
      newStats[playerIndex] = {
        ...newStats[playerIndex],
        memo: memo
      };
      return newStats;
    });
  };

  const getPlayerType = (playerIndex: number): PlayerType => {
    const stats = playerStats[playerIndex];
    if (hands < minHands) return 'Unknown';
    
    const vpipPercent = (stats.vpip / hands) * 100;
    const pfrPercent = (stats.pfr / hands) * 100;
    const diff = vpipPercent - pfrPercent;
    
    if (vpipPercent <= vpipThreshold) {
      return diff <= tightDiffThreshold ? 'TAG' : 'TP';
    } else {
      return diff <= looseDiffThreshold ? 'LAG' : 'LP';
    }
  };

  const getTypeColor = (type: PlayerType): string => {
    const colors = {
      'TAG': '#10b981',
      'LAG': '#3b82f6',
      'TP': '#f59e0b',
      'LP': '#ef4444',
      'Unknown': '#6b7280'
    };
    return colors[type];
  };

  const calculatePercentage = (value: number, total: number): number => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      padding: '8px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '14px'
    }}>
      
      {/* ヘッダー */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        padding: '12px', 
        marginBottom: '8px',
        textAlign: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <h1 style={{ 
            fontSize: '16px', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            margin: 0 
          }}>
            🃏 ポーカー統計
          </h1>
          <div style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            color: '#3b82f6'
          }}>
            {hands}ハンド
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
          <button
            onClick={incrementHands}
            style={{
              padding: '6px 12px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '12px'
            }}
          >
            ハンド +1
          </button>
          <button
            onClick={resetAllStats}
            style={{
              padding: '6px 12px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '12px'
            }}
          >
            リセット
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              padding: '6px 12px',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '12px'
            }}
          >
            設定
          </button>
        </div>

        {/* 設定パネル */}
        {showSettings && (
          <div style={{
            marginTop: '12px',
            padding: '12px',
            backgroundColor: '#f1f5f9',
            borderRadius: '6px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 8px 0', color: '#374151' }}>
              プレイヤータイプ判別設定
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
              <div>
                <label style={{ display: 'block', color: '#6b7280', marginBottom: '2px' }}>
                  VPIP閾値 (タイト/ルーズ)
                </label>
                <input
                  type="number"
                  value={vpipThreshold}
                  onChange={(e) => setVpipThreshold(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '4px 6px',
                    border: '1px solid #d1d5db',
                    borderRadius: '3px',
                    fontSize: '11px'
                  }}
                />
                <div style={{ color: '#9ca3af', fontSize: '9px', marginTop: '1px' }}>
                  {vpipThreshold}%以下=タイト
                </div>
              </div>

              <div>
                <label style={{ display: 'block', color: '#6b7280', marginBottom: '2px' }}>
                  最小ハンド数
                </label>
                <input
                  type="number"
                  value={minHands}
                  onChange={(e) => setMinHands(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '4px 6px',
                    border: '1px solid #d1d5db',
                    borderRadius: '3px',
                    fontSize: '11px'
                  }}
                />
                <div style={{ color: '#9ca3af', fontSize: '9px', marginTop: '1px' }}>
                  判定に必要なハンド数
                </div>
              </div>

              <div>
                <label style={{ display: 'block', color: '#6b7280', marginBottom: '2px' }}>
                  タイト差分閾値
                </label>
                <input
                  type="number"
                  value={tightDiffThreshold}
                  onChange={(e) => setTightDiffThreshold(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '4px 6px',
                    border: '1px solid #d1d5db',
                    borderRadius: '3px',
                    fontSize: '11px'
                  }}
                />
                <div style={{ color: '#9ca3af', fontSize: '9px', marginTop: '1px' }}>
                  {tightDiffThreshold}%以下=アグレッシブ
                </div>
              </div>

              <div>
                <label style={{ display: 'block', color: '#6b7280', marginBottom: '2px' }}>
                  ルーズ差分閾値
                </label>
                <input
                  type="number"
                  value={looseDiffThreshold}
                  onChange={(e) => setLooseDiffThreshold(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '4px 6px',
                    border: '1px solid #d1d5db',
                    borderRadius: '3px',
                    fontSize: '11px'
                  }}
                />
                <div style={{ color: '#9ca3af', fontSize: '9px', marginTop: '1px' }}>
                  {looseDiffThreshold}%以下=アグレッシブ
                </div>
              </div>
            </div>

            <div style={{ 
              marginTop: '8px', 
              padding: '6px', 
              backgroundColor: '#e0f2fe', 
              borderRadius: '4px',
              fontSize: '9px',
              color: '#0c4a6e'
            }}>
              <div><strong>現在の判別基準：</strong></div>
              <div>• TAG: VPIP≤{vpipThreshold}% かつ V-P差≤{tightDiffThreshold}%</div>
              <div>• LAG: VPIP>{vpipThreshold}% かつ V-P差≤{looseDiffThreshold}%</div>
              <div>• TP: VPIP≤{vpipThreshold}% かつ V-P差>{tightDiffThreshold}%</div>
              <div>• LP: VPIP>{vpipThreshold}% かつ V-P差>{looseDiffThreshold}%</div>
              <div>• Unknown: {minHands}ハンド未満</div>
            </div>
          </div>
        )}
      </div>

      {/* プレイヤー一覧 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {Array.from({ length: 9 }, (_, index) => {
          const playerNumber = index + 1;
          const stats = playerStats[index];
          const playerType = getPlayerType(index);
          const vpipPercent = calculatePercentage(stats.vpip, hands);
          const pfrPercent = calculatePercentage(stats.pfr, hands);
          const checkRaisePercent = calculatePercentage(stats.checkRaise, hands);

          return (
            <div 
              key={playerNumber} 
              style={{ 
                backgroundColor: 'white',
                borderRadius: '6px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                overflow: 'hidden'
              }}
            >
              {/* メインの統計行 */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '6px',
                gap: '6px'
              }}>
                {/* プレイヤー番号とタイプ */}
                <div style={{ 
                  minWidth: '40px',
                  textAlign: 'center'
                }}>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: 'bold', 
                    color: '#1f2937' 
                  }}>
                    P{playerNumber}
                  </div>
                  <div style={{
                    fontSize: '8px',
                    color: getTypeColor(playerType),
                    fontWeight: '600'
                  }}>
                    {playerType}
                  </div>
                </div>

                {/* 統計表示 */}
                <div style={{ 
                  display: 'flex', 
                  gap: '6px', 
                  flex: 1,
                  fontSize: '10px'
                }}>
                  <div style={{ textAlign: 'center', minWidth: '32px' }}>
                    <div style={{ fontWeight: 'bold', color: '#3b82f6', fontSize: '11px' }}>
                      {vpipPercent}%
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '8px' }}>
                      V{stats.vpip}/{hands}
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', minWidth: '32px' }}>
                    <div style={{ fontWeight: 'bold', color: '#10b981', fontSize: '11px' }}>
                      {pfrPercent}%
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '8px' }}>
                      P{stats.pfr}/{hands}
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', minWidth: '32px' }}>
                    <div style={{ fontWeight: 'bold', color: '#f59e0b', fontSize: '11px' }}>
                      {checkRaisePercent}%
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '8px' }}>
                      C{stats.checkRaise}/{hands}
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', minWidth: '30px' }}>
                    <div style={{ fontWeight: 'bold', color: '#6b7280', fontSize: '10px' }}>
                      {Math.max(0, vpipPercent - pfrPercent)}%
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '7px' }}>
                      V-P差
                    </div>
                  </div>
                </div>

                {/* アクションボタン */}
                <div style={{ display: 'flex', gap: '2px' }}>
                  <button
                    onClick={() => incrementPlayerStat(index, 'vpip')}
                    style={{
                      padding: '4px 5px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '9px',
                      fontWeight: '500',
                      minWidth: '26px'
                    }}
                  >
                    V
                  </button>
                  <button
                    onClick={() => incrementPlayerStat(index, 'pfr')}
                    style={{
                      padding: '4px 5px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '9px',
                      fontWeight: '500',
                      minWidth: '26px'
                    }}
                  >
                    P
                  </button>
                  <button
                    onClick={() => incrementPlayerStat(index, 'checkRaise')}
                    style={{
                      padding: '4px 5px',
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '9px',
                      fontWeight: '500',
                      minWidth: '26px'
                    }}
                  >
                    C
                  </button>
                  <button
                    onClick={() => resetPlayerStats(index)}
                    style={{
                      padding: '4px 4px',
                      backgroundColor: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '9px',
                      minWidth: '22px'
                    }}
                  >
                    ↻
                  </button>
                </div>
              </div>

              {/* メモ欄 */}
              <div style={{ 
                padding: '6px',
                borderTop: '1px solid #f1f5f9',
                backgroundColor: '#f8fafc'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px' 
                }}>
                  <span style={{ 
                    fontSize: '10px', 
                    color: '#6b7280',
                    minWidth: '15px'
                  }}>
                    📝
                  </span>
                  <input
                    type="text"
                    value={stats.memo}
                    onChange={(e) => updatePlayerMemo(index, e.target.value)}
                    placeholder="プレイヤーの特徴をメモ..."
                    style={{
                      flex: 1,
                      padding: '3px 6px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '3px',
                      fontSize: '10px',
                      backgroundColor: 'white',
                      color: '#374151'
                    }}
                  />
                  {stats.memo && (
                    <button
                      onClick={() => updatePlayerMemo(index, '')}
                      style={{
                        padding: '2px 4px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        fontSize: '8px'
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* フッター */}
      <div style={{ 
        marginTop: '8px', 
        textAlign: 'center', 
        fontSize: '10px', 
        color: '#6b7280',
        padding: '8px'
      }}>
        <div>V=VPIP, P=PFR, C=CheckRaise</div>
        <div>TAG/LAG/TP/LP (10H以上で判定)</div>
        <div>📝 各プレイヤーの特徴をメモできます</div>
      </div>
    </div>
  );
};

export default PokerStatsApp;