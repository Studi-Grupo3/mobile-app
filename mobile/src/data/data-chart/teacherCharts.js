export const teacherCharts = [
    {
      title: 'Aulas por Dia da Semana',
      type: 'bar',
      data: {
        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
        datasets: [
          {
            label: 'Aulas',
            data: [25, 30, 28, 35, 20, 15, 0],
            backgroundColor: '#8b5cf6',
          },
        ],
      },
    },
    {
      title: 'Receitas Mensais',
      type: 'line',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [
          {
            label: 'Receitas',
            data: [12000, 15000, 18000, 16000, 17000, 19500],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            tension: 0.4,
            fill: true,
          },
        ],
      },
    },
  ];
  