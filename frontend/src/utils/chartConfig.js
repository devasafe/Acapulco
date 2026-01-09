/**
 * Professional ApexCharts configurations for Admin Dashboard
 * Dark theme with gradients, smooth animations, and pro styling
 */

// Base dark theme colors
const darkPalette = {
  primary: '#667eea',
  secondary: '#764ba2',
  success: '#48bb78',
  danger: '#f56565',
  warning: '#ed8936',
  info: '#4299e1',
  neutral: '#e6eef8',
  darkBg: '#0f1724',
  darkCard: '#1a2540',
};

export const getAreaChartConfig = (title = 'Net Flow') => {
  return {
    chart: {
      id: 'netflow-area',
      type: 'area',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      background: 'transparent',
      sparkline: { enabled: false },
    },
    stroke: {
      curve: 'smooth',
      width: 3,
      lineCap: 'round',
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100],
        colorStops: [
          {
            offset: 0,
            color: '#667eea',
            opacity: 0.5,
          },
          {
            offset: 100,
            color: '#764ba2',
            opacity: 0.05,
          },
        ],
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: darkPalette.neutral,
          fontSize: '11px',
        },
      },
      axisBorder: {
        color: 'rgba(230, 238, 248, 0.1)',
      },
      axisTicks: {
        color: 'rgba(230, 238, 248, 0.05)',
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: darkPalette.neutral,
          fontSize: '11px',
        },
        formatter: (val) => `R$ ${Number(val).toFixed(0)}`,
      },
    },
    grid: {
      borderColor: 'rgba(230, 238, 248, 0.05)',
      strokeDashArray: 5,
      xaxis: {
        lines: { show: false },
      },
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '12px',
      },
      x: {
        formatter: (val) => {
          const date = new Date(val);
          return date.toLocaleDateString('pt-BR');
        },
      },
      y: {
        formatter: (val) => `R$ ${Number(val).toFixed(2)}`,
      },
      marker: {
        show: true,
      },
    },
    colors: ['#667eea'],
    states: {
      hover: {
        filter: {
          type: 'none',
          value: 0.15,
        },
      },
      active: {
        filter: {
          type: 'none',
          value: 0.15,
        },
      },
    },
  };
};

export const getBarChartConfig = (title = 'Deposits vs Withdrawals') => {
  return {
    chart: {
      type: 'bar',
      stacked: false,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 600,
        animateGradually: {
          enabled: true,
          delay: 100,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 300,
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 8,
        dataLabels: {
          position: 'top',
        },
        distributed: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: false,
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: darkPalette.neutral,
          fontSize: '11px',
        },
      },
      axisBorder: {
        color: 'rgba(230, 238, 248, 0.1)',
      },
      axisTicks: {
        color: 'rgba(230, 238, 248, 0.05)',
      },
    },
    yaxis: {
      title: {
        text: 'Valor (R$)',
        style: {
          color: darkPalette.neutral,
          fontSize: '12px',
        },
      },
      labels: {
        style: {
          colors: darkPalette.neutral,
          fontSize: '11px',
        },
        formatter: (val) => `R$ ${Number(val).toFixed(0)}`,
      },
    },
    grid: {
      borderColor: 'rgba(230, 238, 248, 0.05)',
      strokeDashArray: 5,
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val) => `R$ ${Number(val).toFixed(2)}`,
      },
    },
    legend: {
      position: 'top',
      fontSize: '12px',
      fontFamily: 'Inter, Roboto, sans-serif',
      labels: {
        colors: darkPalette.neutral,
      },
    },
    colors: ['#48bb78', '#f56565'],
    states: {
      hover: {
        filter: {
          type: 'none',
          value: 0.15,
        },
      },
      active: {
        filter: {
          type: 'none',
          value: 0.15,
        },
      },
    },
  };
};

export const getDoughnutChartConfig = (title = 'Distribution') => {
  return {
    chart: {
      type: 'donut',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          reset: true,
        },
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '12px',
              fontFamily: 'Inter, Roboto, sans-serif',
              color: darkPalette.neutral,
            },
            value: {
              show: true,
              fontSize: '14px',
              fontFamily: 'Inter, Roboto, sans-serif',
              color: darkPalette.neutral,
              formatter: (val) => `R$ ${Number(val).toFixed(0)}`,
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '12px',
              color: darkPalette.neutral,
              formatter: (val) => `R$ ${val.globals.seriesTotals.reduce((a, b) => a + b, 0).toFixed(0)}`,
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${Number(val).toFixed(1)}%`,
      style: {
        fontSize: '11px',
        fontFamily: 'Inter, Roboto, sans-serif',
        color: '#fff',
      },
    },
    stroke: {
      colors: ['#0f1724'],
      width: 3,
    },
    legend: {
      position: 'bottom',
      fontSize: '12px',
      fontFamily: 'Inter, Roboto, sans-serif',
      labels: {
        colors: darkPalette.neutral,
      },
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val) => `R$ ${Number(val).toFixed(2)}`,
      },
    },
    colors: ['#667eea', '#764ba2', '#48bb78', '#f56565'],
    states: {
      hover: {
        filter: {
          type: 'none',
          value: 0.15,
        },
      },
    },
  };
};

export const getRadarChartConfig = () => {
  return {
    chart: {
      type: 'radar',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          reset: true,
        },
      },
      sparkline: { enabled: false },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['#667eea'],
      dashArray: 0,
    },
    plotOptions: {
      radar: {
        size: 140,
        polygons: {
          strokeColors: 'rgba(230, 238, 248, 0.1)',
          fill: 'rgba(230, 238, 248, 0.02)',
        },
      },
    },
    markers: {
      size: 5,
      colors: ['#667eea'],
      strokeWidth: 2,
      strokeColors: ['#764ba2'],
      hover: {
        size: 7,
      },
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      labels: {
        style: {
          colors: darkPalette.neutral,
          fontSize: '11px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: darkPalette.neutral,
          fontSize: '11px',
        },
      },
    },
    grid: {
      show: true,
      borderColor: 'rgba(230, 238, 248, 0.05)',
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val) => `${Number(val).toFixed(0)}`,
      },
    },
    colors: ['#667eea'],
    states: {
      hover: {
        filter: {
          type: 'none',
        },
      },
    },
  };
};

export const getSparklineChartConfig = () => {
  return {
    chart: {
      sparkline: { enabled: true },
      toolbar: { show: false },
      animations: {
        enabled: true,
        speed: 500,
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0,
      },
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      min: 0,
    },
    tooltip: {
      theme: 'dark',
      x: {
        show: false,
      },
      y: {
        formatter: (val) => `R$ ${Number(val).toFixed(0)}`,
      },
    },
    colors: ['#667eea'],
  };
};

export default {
  getAreaChartConfig,
  getBarChartConfig,
  getDoughnutChartConfig,
  getRadarChartConfig,
  getSparklineChartConfig,
};
