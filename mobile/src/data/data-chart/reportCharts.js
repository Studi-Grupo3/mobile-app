// data-chart/reportCharts.js

export const financeCharts = [
    {
      title: 'Faturamento Anual',
      type: 'bar',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [
          {
            label: 'Faturamento',
            data: [32000, 42000, 45000, 47000, 46000, 49000, 48000, 47000, 50000, 52000, 53000, 55000],
            backgroundColor: '#3b82f6',
          },
        ],
      },
    },
    {
      title: 'Distribuição de Despesas por Categoria',
      type: 'doughnut',
      data: {
        labels: ['Salários', 'Aluguel', 'Marketing', 'Equipamentos', 'Outros'],
        datasets: [
          {
            data: [70, 12, 8, 5, 5],
            backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#facc15', '#9ca3af'],
          },
        ],
      },
    },
  ];
  
  export const studentCharts = [
    {
      title: 'Crescimento de Alunos',
      type: 'bar',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [
          {
            label: 'Alunos',
            data: [50, 80, 110, 140, 170, 200, 230, 250, 270, 290, 310, 330],
            backgroundColor: '#facc15',
          },
        ],
      },
    },
    {
      title: 'Distribuição de Alunos por Curso',
      type: 'doughnut',
      data: {
        labels: ['Matemática', 'Inglês', 'Música', 'Ciências', 'História'],
        datasets: [
          {
            data: [120, 80, 60, 40, 20],
            backgroundColor: ['#6366f1', '#3b82f6', '#10b981', '#f97316', '#ef4444'],
          },
        ],
      },
    },
  ];
  
  export const classCharts = [
    {
      title: 'Aulas por Disciplina',
      type: 'doughnut',
      data: {
        labels: ['Matemática', 'Inglês', 'Música', 'Ciências', 'História', 'Outros'],
        datasets: [
          {
            data: [30, 25, 15, 12, 10, 8],
            backgroundColor: ['#6366f1', '#3b82f6', '#10b981', '#f97316', '#ef4444', '#9ca3af'],
          },
        ],
      },
    },
    {
      title: 'Aulas por Mês',
      type: 'bar',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [
          {
            label: 'Aulas',
            data: [100, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220],
            backgroundColor: '#10b981',
          },
        ],
      },
    },
  ];
  