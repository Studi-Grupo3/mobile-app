export const paymentCharts = [
    {
      title: 'Pagamentos por Método',
      type: 'pie',
      data: {
        labels: ['Pix', 'Cartão de Crédito', 'Boleto', 'Transferência'],
        datasets: [
          {
            label: 'Métodos de Pagamento',
            data: [42, 30, 20, 8],
            backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'],
            borderColor: '#fff',
            borderWidth: 1,
          },
        ],
      },
    },
    {
      title: 'Pagamentos por Dia',
      type: 'bar',
      data: {
        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
        datasets: [
          {
            label: 'Pagamentos',
            data: [80, 95, 70, 85, 110, 60, 30],
            backgroundColor: '#22c55e',
          },
        ],
      },
    },
  ];
  