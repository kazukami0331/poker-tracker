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

  // ローカルストレージから読み込み
  useEffect(() => {
    const savedHands = localStorage.getItem('pokerHands');
    const savedStats = localStorage.getItem('pokerPlayerStats');
    
    if (savedHands) {
      setHands(parseInt(savedHands));
    }
    if (savedStats) {
      setPlayerStats(JSON.parse(savedStats));
    }
  }, []);

  // ローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('pokerHands', hands.toString());
    localStorage.setItem('pokerPlayerStats', JSON.stringify(playerStats));
  }, [hands, playerStats]);

  const incrementHands = () => {
    setHands(prev => prev + 1);
  };

  const incrementPlayerStat = (playerIndex: number, stat: keyof PlayerStats) => {
    setPlayerStats(prev => {
      const newStats = [...prev];
      newStats[playerIndex] = {
        ...newStats[playerIndex],
        [stat]: newStats[playerIndex][stat] + 1
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
    if (hands < 10) return 'Unknown';
    
    const vpipPercent = (stats.vpip / hands) * 100;
    const pfrPercent = (stats.pfr / hands) * 100;
    const diff = vpipPercent - pfrPercent;
    
    if (vpipPercent <= 20) {
      return diff <= 5 ? 'TAG' : 'TP';
    } else {
      return diff <= 8 ? 'LAG' : 'LP';
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
            {hands}H
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
        </div>
      </div>

      {/* プレイヤー一覧 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {Array.from({ length: 9 }, (_, index) => {
          const playerNumber = index + 1;
          const stats = playerStats[index];
          const playerType = getPlayerType(index);
          const vpipPercent = calculatePercentage(stats.vpip, hands);
          const pfrPercent = calculatePercentage(stats.pfr, hands);

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
                  gap: '8px', 
                  flex: 1,
                  fontSize: '11px'
                }}>
                  <div style={{ textAlign: 'center', minWidth: '35px' }}>
                    <div style={{ fontWeight: 'bold', color: '#3b82f6' }}>
                      {vpipPercent}%
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '9px' }}>
                      V{stats.vpip}
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', minWidth: '35px' }}>
                    <div style={{ fontWeight: 'bold', color: '#10b981' }}>
                      {pfrPercent}%
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '9px' }}>
                      P{stats.pfr}
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', minWidth: '35px' }}>
                    <div style={{ fontWeight: 'bold', color: '#f59e0b' }}>
                      {stats.checkRaise}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '9px' }}>
                      CR
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', minWidth: '30px' }}>
                    <div style={{ fontWeight: 'bold', color: '#6b7280', fontSize: '10px' }}>
                      {Math.max(0, vpipPercent - pfrPercent)}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '8px' }}>
                      差
                    </div>
                  </div>
                </div>

                {/* アクションボタン */}
                <div style={{ display: 'flex', gap: '3px' }}>
                  <button
                    onClick={() => incrementPlayerStat(index, 'vpip')}
                    style={{
                      padding: '4px 6px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '10px',
                      fontWeight: '500',
                      minWidth: '30px'
                    }}
                  >
                    V
                  </button>
                  <button
                    onClick={() => incrementPlayerStat(index, 'pfr')}
                    style={{
                      padding: '4px 6px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '10px',
                      fontWeight: '500',
                      minWidth: '30px'
                    }}
                  >
                    P
                  </button>
                  <button
                    onClick={() => incrementPlayerStat(index, 'checkRaise')}
                    style={{
                      padding: '4px 6px',
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '10px',
                      fontWeight: '500',
                      minWidth: '30px'
                    }}
                  >
                    C
                  </button>
                  <button
                    onClick={() => resetPlayerStats(index)}
                    style={{
                      padding: '4px 6px',
                      backgroundColor: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '10px',
                      minWidth: '25px'
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
                    minWidth: '30px'
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
                      padding: '4px 6px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '3px',
                      fontSize: '11px',
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
      </div>
    </div>
  );
};

export default PokerStatsApp;