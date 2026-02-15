export const overviewCharts = [
    {
      title: 'Novos Usuários por Mês',
      type: 'line',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [
          {
            label: 'Usuários',
            data: [120, 190, 170, 220, 240, 210],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            fill: true,
            tension: 0.4,
          },
        ],
      },
    },
    {
      title: 'Distribuição de Acessos',
      type: 'doughnut',
      data: {
        labels: ['Alunos', 'Professores', 'Administradores'],
        datasets: [
          {
            data: [65, 25, 10],
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
            borderColor: '#fff',
            borderWidth: 2,
          },
        ],
      },
    },
  ];  