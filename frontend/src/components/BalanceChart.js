import React, { useMemo, useRef, useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const BalanceChart = ({ wallet = 0, investments = [], transactions = [] }) => {
  const [chartPoints, setChartPoints] = useState([]);
  const prevTotalRef = useRef(null);
  const initializedRef = useRef(false);

  // Inicializa o gráfico com o histórico de transações na primeira montagem
  useEffect(() => {
    if (!initializedRef.current && transactions.length > 0) {
      const points = [];
      let runningWallet = 0;
      let runningInvested = 0;

      // Ordena transações por data
      const sorted = [...transactions].sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });

      sorted.forEach(tx => {
        const amount = Number(tx.amount || 0);
        const txDate = new Date(tx.createdAt);

        // Reconstrói o estado no histórico
        if (tx.type === 'deposit') {
          runningWallet += amount;
        } else if (tx.type === 'withdrawal') {
          runningWallet -= amount;
        } else if (tx.type === 'buy') {
          runningWallet -= amount;
          runningInvested += amount;
        } else if (tx.type === 'sell') {
          runningInvested -= amount;
          runningWallet += amount;
        }

        const total = Math.max(0, runningWallet + runningInvested);
        const timeStr = txDate.toLocaleTimeString('pt-BR').slice(0, 5);
        const dateStr = txDate.toLocaleDateString('pt-BR');

        points.push({
          time: txDate,
          label: `${dateStr} ${timeStr}`,
          value: total
        });
      });

      setChartPoints(points);
      prevTotalRef.current = wallet + investments.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
      initializedRef.current = true;
    }
  }, [transactions, wallet, investments]);

  // Calcula o total em tempo real: wallet + investimentos
  const totalInvested = useMemo(() => {
    return investments.reduce((sum, inv) => {
      if (!inv.soldEm) { // Só conta investimentos não resgatados
        return sum + Number(inv.amount || 0);
      }
      return sum;
    }, 0);
  }, [investments]);

  const currentTotal = wallet + totalInvested;

  // Sempre que wallet ou investimentos mudam, adiciona um novo ponto
  useEffect(() => {
    if (initializedRef.current && prevTotalRef.current !== currentTotal) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('pt-BR').slice(0, 5);
      const dateStr = now.toLocaleDateString('pt-BR');
      const label = `${dateStr} ${timeStr}`;

      setChartPoints(prev => [
        ...prev,
        { time: now, label, value: currentTotal }
      ]);

      console.log(`💰 Saldo atualizado: Wallet: ${wallet} + Investidos: ${totalInvested} = Total: R$ ${currentTotal}`);
      prevTotalRef.current = currentTotal;
    }
  }, [currentTotal, wallet, totalInvested]);

  const chartData = useMemo(() => {
    if (chartPoints.length === 0) {
      return {
        labels: [],
        series: [],
        options: {}
      };
    }

    const labels = chartPoints.map(p => p.label);
    const values = chartPoints.map(p => Math.max(0, p.value));

    const options = {
      chart: {
        type: 'area',
        toolbar: { show: false },
        background: 'transparent',
        animations: {
          enabled: true,
          speed: 300,
          animateGradually: {
            enabled: true,
            delay: 0
          },
          dynamicAnimation: {
            enabled: true,
            speed: 300
          }
        }
      },
      colors: ['#FFD700'],
      stroke: {
        curve: 'smooth',
        width: 2,
        colors: ['#FFD700']
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.45,
          opacityTo: 0.05,
          stops: [20, 100, 100, 100]
        }
      },
      dataLabels: { enabled: false },
      grid: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        strokeDashArray: 4,
      },
      xaxis: {
        categories: labels,
        labels: {
          style: {
            colors: '#999',
            fontSize: 12
          }
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#999',
            fontSize: 12
          },
          formatter: (val) => `R$ ${val.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`
        }
      },
      tooltip: {
        enabled: true,
        theme: 'dark',
        style: {
          fontSize: '12px'
        },
        y: {
          formatter: (val) => `R$ ${val.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`
        }
      },
      responsive: [{
        breakpoint: 1024,
        options: {
          chart: {
            height: 300
          }
        }
      }]
    };

    const series = [{
      name: 'Saldo Total',
      data: values
    }];

    return { options, series, labels, values };
  }, [chartPoints]);

  if (chartPoints.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: 300,
        color: '#999'
      }}>
        Carregando dados...
      </div>
    );
  }

  return (
    <Chart
      key={chartPoints.length} // Force re-render quando dados mudam
      options={chartData.options}
      series={chartData.series}
      type="area"
      height={300}
    />
  );
};

export default BalanceChart;
