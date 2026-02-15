export const appointmentCharts = [
    {
      title: 'Agendamentos por Semana',
      type: 'bar',
      data: {
        labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
        datasets: [
          {
            label: 'Agendamentos',
            data: [110, 130, 120, 130],
            backgroundColor: '#3b82f6',
          },
        ],
      },
    },
    {
      title: 'Status dos Agendamentos',
      type: 'doughnut',
      data: {
        labels: ['Confirmados', 'Pendentes', 'Cancelados'],
        datasets: [
          {
            label: 'Status',
            data: [75, 15, 10],
            backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
            borderColor: '#fff',
            borderWidth: 2,
          },
        ],
      },
    },
  ];
  