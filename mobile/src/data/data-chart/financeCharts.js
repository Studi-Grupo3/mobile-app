export const financeCharts = [
    {
      title: 'Faturamento Mensal',
      type: 'bar',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [
          {
            label: 'Faturamento',
            data: [12000, 15000, 10000, 18000, 22000, 20000],
            backgroundColor: 'rgba(34, 197, 94, 0.5)',
            borderColor: 'rgba(34, 197, 94, 1)',
            borderWidth: 1,
          },
        ],
      },
    },
    {
      title: 'Distribuição de Pagamentos',
      type: 'pie',
      data: {
        labels: ['Pix', 'Cartão', 'Boleto'],
        datasets: [
          {
            data: [45, 35, 20],
            backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b'],
            borderColor: '#fff',
            borderWidth: 1,
          },
        ],
      },
    },
  ];
  