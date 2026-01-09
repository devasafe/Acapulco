import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function CryptoChart({ symbol }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchChartData() {
      try {
        // Mapear símbolos comuns para IDs da CoinGecko
        const symbolMap = {
          'BTC': 'bitcoin',
          'ETH': 'ethereum',
          'BNB': 'binancecoin',
          'XRP': 'ripple',
          'ADA': 'cardano',
          'DOGE': 'dogecoin',
          'SOL': 'solana',
          'TRX': 'tron',
          'DOT': 'polkadot',
          'MATIC': 'matic-network',
          'LTC': 'litecoin',
          'SHIB': 'shiba-inu',
          'AVAX': 'avalanche-2',
          'UNI': 'uniswap',
          'LINK': 'chainlink',
          'XLM': 'stellar',
          'ATOM': 'cosmos',
          'ETC': 'ethereum-classic',
          'BCH': 'bitcoin-cash',
          'USDT': 'tether',
          'USDC': 'usd-coin'
        };

        const coinId = symbolMap[symbol.toUpperCase()] || symbol.toLowerCase();
        
        // Buscar dados dos últimos 7 dias
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=brl&days=7`
        );

        if (!response.ok) {
          throw new Error('Criptomoeda não encontrada');
        }

        const data = await response.json();
        
        const prices = data.prices.map(price => ({
          time: new Date(price[0]).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          value: price[1]
        }));

        // Determinar cor baseada na tendência (alta ou baixa)
        const firstPrice = prices[0]?.value || 0;
        const lastPrice = prices[prices.length - 1]?.value || 0;
        const isPositive = lastPrice >= firstPrice;
        
        const mainColor = isPositive ? 'rgb(76, 175, 80)' : 'rgb(244, 67, 54)';
        const bgColor = isPositive ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)';

        setChartData({
          labels: prices.map(p => p.time),
          datasets: [
            {
              label: `${symbol.toUpperCase()} (BRL)`,
              data: prices.map(p => p.value),
              borderColor: mainColor,
              backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, bgColor);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                return gradient;
              },
              fill: true,
              tension: 0.4,
              borderWidth: 3,
              pointRadius: 0,
              pointHoverRadius: 6,
              pointHoverBackgroundColor: mainColor,
              pointHoverBorderColor: '#fff',
              pointHoverBorderWidth: 2
            }
          ]
        });
        setLoading(false);
      } catch (err) {
        setError('Não foi possível carregar o gráfico para este símbolo.');
        setLoading(false);
      }
    }

    if (symbol) {
      fetchChartData();
    }
  }, [symbol]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 14,
            weight: 'bold',
            family: "'Segoe UI', 'Roboto', sans-serif"
          },
          color: '#333',
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: `📈 Variação de Preço (Últimos 7 dias)`,
        font: {
          size: 18,
          weight: 'bold',
          family: "'Segoe UI', 'Roboto', sans-serif"
        },
        color: '#1976d2',
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#1976d2',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 16,
          weight: 'bold'
        },
        callbacks: {
          label: function(context) {
            return `💰 R$ ${context.parsed.y.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11,
            family: "'Segoe UI', 'Roboto', sans-serif"
          },
          color: '#666'
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          lineWidth: 1
        },
        ticks: {
          font: {
            size: 12,
            family: "'Segoe UI', 'Roboto', sans-serif"
          },
          color: '#666',
          callback: function(value) {
            return 'R$ ' + value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          },
          padding: 10
        }
      }
    }
  };

  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: 40, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 12,
        color: '#fff',
        marginTop: 20
      }}>
        <div style={{ fontSize: 18, fontWeight: 'bold' }}>⏳ Carregando gráfico...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: 40, 
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        borderRadius: 12,
        color: '#fff',
        marginTop: 20
      }}>
        <div style={{ fontSize: 16 }}>⚠️ {error}</div>
      </div>
    );
  }

  return (
    <div style={{ 
      height: 350, 
      marginTop: 20,
      padding: 20,
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      borderRadius: 12,
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
    }}>
      {chartData && <Line data={chartData} options={options} />}
    </div>
  );
}
