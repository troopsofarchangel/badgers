
import React, { useState, useCallback, useEffect } from 'react';
import { BadgeData } from './types';
import BadgeForm from './components/BadgeForm';
import BadgeDisplay from './components/BadgeDisplay';
import AcademicCapIcon from './components/icons/AcademicCapIcon';
import SunIcon from './components/icons/SunIcon';
import MoonIcon from './components/icons/MoonIcon';

const comicBadgesData: BadgeData[] = [
  {
    id: 'comic-1',
    title: 'Mestre Cafeinador Profissional',
    recipientName: 'Amante de Café',
    issuerName: 'Instituto do Grão Arábica',
    issueDate: '01 de Abril de 2024',
    criteria: 'Consumiu mais de 1000L de café mantendo a funcionalidade (quase sempre). Provou maestria em identificar um bom expresso a quilômetros de distância.',
    imageUrl: 'https://via.placeholder.com/150/FFC107/000000?Text=☕',
    isCracha: false,
  },
  {
    id: 'comic-2',
    title: 'Sussurrador de Bugs',
    recipientName: 'O(A) Dev Paciente',
    issuerName: 'Oráculo do Código Fonte',
    issueDate: '10 de Março de 2024',
    criteria: 'Encarou um bug por tanto tempo que ele se auto-corrigiu por pura intimidação. Consegue traduzir mensagens de erro arcanas para linguagem humana.',
    imageUrl: 'https://via.placeholder.com/150/4CAF50/FFFFFF?Text=🐛✨',
    isCracha: false,
  },
  {
    id: 'comic-3',
    title: 'PhD em Procrastinação Produtiva',
    recipientName: 'Especialista do "Depois Eu Faço"',
    issuerName: 'Academia do Amanhã Incerto',
    issueDate: '15 de Fevereiro de 2024',
    criteria: 'Elevou a arte de adiar tarefas a um novo nível, realizando feitos incríveis sob a pressão do último segundo. A casa nunca esteve tão limpa durante um prazo importante.',
    imageUrl: 'https://via.placeholder.com/150/9E9E9E/FFFFFF?Text=🐌🚀',
    isCracha: true, // Example of a comic badge as a cracha
    recipientPhotoUrl: 'https://via.placeholder.com/200/CCCCCC/000000?Text=👤', // Placeholder for comic cracha
  },
  {
    id: 'comic-4',
    title: 'Sobrevivente de Reuniões Intermináveis',
    recipientName: 'Guerreiro(a) Corporativo(a)',
    issuerName: 'Liga da Paciência Testada',
    issueDate: '05 de Maio de 2024',
    criteria: 'Resistiu bravamente a inúmeras reuniões que poderiam ter sido um e-mail. Manteve a sanidade (na maior parte do tempo) e contribuiu com acenos de cabeça estratégicos.',
    imageUrl: 'https://via.placeholder.com/150/F44336/FFFFFF?Text=🗓️🤯',
    isCracha: false,
  }
];


const App: React.FC = () => {
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const addBadge = useCallback((newBadgeData: Omit<BadgeData, 'id' | 'issueDate'>) => {
    const badge: BadgeData = {
      id: Date.now().toString() + Math.random().toString(36).substring(2,9),
      title: newBadgeData.title,
      recipientName: newBadgeData.recipientName,
      issuerName: newBadgeData.issuerName,
      criteria: newBadgeData.criteria,
      issueDate: new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }),
      imageUrl: newBadgeData.imageUrl,
      isCracha: newBadgeData.isCracha,
      recipientPhotoUrl: newBadgeData.recipientPhotoUrl, // Save recipientPhotoUrl
    };
    setBadges(prevBadges => [badge, ...prevBadges]);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 py-8 px-4 font-sans transition-colors duration-300" role="application">
      <header className="mb-10 text-center relative">
        <h1 className="text-4xl font-bold text-brand-primary dark:text-blue-400">Gerador de Badges & Crachás</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
          Crie e visualize credenciais digitais que reconhecem suas competências.
        </p>
        <button
          onClick={toggleTheme}
          className="absolute top-0 right-0 p-2 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-150"
          aria-label={theme === 'light' ? "Ativar modo noturno" : "Ativar modo claro"}
        >
          {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
        </button>
      </header>

      <main className="container mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <section className="md:col-span-1 sticky top-8" aria-labelledby="form-section-title">
          <h2 id="form-section-title" className="sr-only">Formulário de Criação de Badge ou Crachá</h2>
          <BadgeForm onAddBadge={addBadge} />
        </section>

        <section className="md:col-span-2" aria-labelledby="badges-section-title">
          <h2 id="badges-section-title" className="sr-only">Lista de Badges e Crachás Criados</h2>
          {badges.length === 0 ? (
            <div className="text-center py-10 px-6 bg-white dark:bg-slate-800 shadow-lg rounded-xl">
              <div className="flex justify-center items-center mb-6">
                <AcademicCapIcon className="w-24 h-24 text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-2">Nenhum item criado ainda.</h3>
              <p className="text-slate-500 dark:text-slate-400">Use o formulário para gerar seu primeiro badge ou crachá!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {badges.map((badge) => (
                <BadgeDisplay key={badge.id} badge={badge} />
              ))}
            </div>
          )}
        </section>
      </main>

      <section className="container mx-auto max-w-6xl mt-16 py-8" aria-labelledby="comic-badges-section-title">
        <div className="text-center mb-10">
            <h2 id="comic-badges-section-title" className="text-3xl font-bold text-slate-700 dark:text-slate-200">Galeria de Exemplos Divertidos</h2>
            <p className="text-md text-slate-500 dark:text-slate-400 mt-2">Inspire-se com alguns exemplos criativos e bem-humorados!</p>
        </div>
        {comicBadgesData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
            {comicBadgesData.map((badge) => (
              <BadgeDisplay key={badge.id} badge={badge} />
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500 dark:text-slate-400">Nenhum exemplo cômico disponível no momento.</p>
        )}
      </section>

      <footer className="text-center mt-12 py-6 border-t border-slate-300 dark:border-slate-700">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          &copy; {new Date().getFullYear()} Gerador de Badges & Crachás. Inspirado na Open Badge Specification.
        </p>
      </footer>
    </div>
  );
};

export default App;