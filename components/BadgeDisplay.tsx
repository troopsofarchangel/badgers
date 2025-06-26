import React, { useState, useRef } from 'react';
import { BadgeData } from '../types';
import AcademicCapIcon from './icons/AcademicCapIcon';
import UserIcon from './icons/UserIcon';
import BuildingOfficeIcon from './icons/BuildingOfficeIcon';
import CalendarDaysIcon from './icons/CalendarDaysIcon';
import ClipboardDocumentListIcon from './icons/ClipboardDocumentListIcon';
import CheckBadgeIcon from './icons/CheckBadgeIcon';
import ShareIcon from './icons/ShareIcon';
import html2canvas from 'html2canvas';
import { Textfit } from 'react-textfit';

interface BadgeDisplayProps {
  badge: BadgeData;
  onClear?: () => void;
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ badge, onClear }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null); // Ref for html2canvas
  const [isExporting, setIsExporting] = useState(false); // Mantém para esconder botão

  const downloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadCurrentView = async () => {
    if (!badgeRef.current) {
      alert('Não foi possível gerar a imagem. A referência ao elemento do card não foi encontrada.');
      setShowShareModal(false);
      return;
    }
    if (typeof html2canvas === 'undefined') {
      alert('Não foi possível gerar a imagem. A biblioteca html2canvas não está carregada.');
      setShowShareModal(false);
      return;
    }

    const elementToCapture = badgeRef.current;

    if (elementToCapture.offsetWidth === 0 || elementToCapture.offsetHeight === 0) {
        console.error("Element to capture has zero width or height.", elementToCapture.offsetWidth, elementToCapture.offsetHeight);
        alert("Não é possível capturar o elemento pois suas dimensões são zero. Verifique se ele está visível e tente novamente.");
        setShowShareModal(false);
        return;
    }

    setIsExporting(true); // Esconde o botão
    await new Promise(r => setTimeout(r, 50)); // Garante re-render

    try {
      const currentBgColor = document.documentElement.classList.contains('dark') ? 
                             (badge.isCracha ? '#1e293b' : '#334155') : // slate-800 for cracha, slate-700 for badge
                             (badge.isCracha ? '#ffffff' : '#f8fafc'); // white for cracha, slate-50 for badge
      
      console.log("Attempting to capture element:", elementToCapture);
      console.log("Using dimensions:", elementToCapture.offsetWidth, "x", elementToCapture.offsetHeight);
      console.log("Using background color:", currentBgColor);

      const canvas = await html2canvas(elementToCapture, {
        scale: 2, 
        useCORS: true,
        backgroundColor: currentBgColor,
        logging: false,
        width: elementToCapture.offsetWidth,
        height: elementToCapture.offsetHeight,
      });
      
      console.log("html2canvas process completed.");

      let dataUrl;
      try {
        dataUrl = canvas.toDataURL('image/png');
        console.log("Data URL generated (first 100 chars):", dataUrl ? dataUrl.substring(0, 100) : "null");
      } catch (e) {
        console.error("Error calling toDataURL:", e);
        alert('Erro ao converter a imagem capturada. Isso pode ocorrer devido a restrições de segurança com imagens de fontes externas (CORS).');
        setShowShareModal(false);
        setIsExporting(false);
        return;
      }

      if (!dataUrl || dataUrl === "data:," || dataUrl.length < 100) { // Basic check for invalid/empty data URL
          console.error("Generated Data URL is empty or invalid:", dataUrl);
          alert("Não foi possível gerar os dados da imagem para download. A imagem resultante estava vazia ou inválida.");
          setShowShareModal(false);
          setIsExporting(false);
          return;
      }

      const filename = `${badge.title.toLowerCase().replace(/\s+/g, '_')}_${badge.isCracha ? 'cracha_completo' : 'badge_completo'}.png`;
      downloadImage(dataUrl, filename);
      console.log("Download initiated for:", filename);

    } catch (error) {
      console.error('Erro geral ao gerar imagem com html2canvas:', error);
      alert('Ocorreu um erro geral ao tentar gerar a imagem do card.');
    } finally {
      setShowShareModal(false);
      setIsExporting(false);
    }
  };
  

  const handleCopyToClipboard = async () => {
    const shareText = `Confira meu ${badge.isCracha ? 'crachá' : 'badge'}: ${badge.title}\nRecebedor: ${badge.recipientName}\nEmitido por: ${badge.issuerName}\nCritérios: ${badge.criteria}`;
    let clipboardText = shareText;
    const isWebURL = window.location.protocol === "http:" || window.location.protocol === "https:";
    if (isWebURL) {
      clipboardText += `\nVerificável em: ${window.location.href}`;
    }

    try {
      await navigator.clipboard.writeText(clipboardText);
      alert(`Informações do ${badge.isCracha ? 'crachá' : 'badge'} "${badge.title}" copiadas para a área de transferência!`);
    } catch (err) {
      console.error('Erro ao copiar para a área de transferência:', err);
      alert(`Não foi possível copiar as informações.`);
    }
    setShowShareModal(false);
  };

  const handleNativeShare = async () => {
    const shareText = `Confira meu ${badge.isCracha ? 'crachá' : 'badge'}: ${badge.title}\nEmitido por: ${badge.issuerName}`;
    const sharePayload: { title: string; text: string; url?: string } = {
      title: `${badge.isCracha ? 'Crachá' : 'Badge'}: ${badge.title}`,
      text: shareText,
    };
    const isWebURL = window.location.protocol === "http:" || window.location.protocol === "https:";
    if (isWebURL) {
      sharePayload.url = window.location.href;
    }

    if (navigator.share) {
      try {
        await navigator.share(sharePayload);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Erro ao compartilhar:', error);
          // Don't alert for AbortError, which means the user cancelled the share sheet
        }
      }
    } else {
      alert('Compartilhamento nativo não disponível neste navegador. Tente copiar as informações.');
    }
    setShowShareModal(false);
  };


  const commonCardClasses = "bg-white dark:bg-slate-800 shadow-xl rounded-xl overflow-hidden transform transition-all hover:shadow-2xl hover:-translate-y-1 w-full mx-auto";
  const crachaResponsive = "max-w-md w-full min-w-[260px] min-h-[220px] flex flex-col sm:flex-row p-0";

  // Classes para efeito vitrificado
  const glassCard =
    "backdrop-blur-md bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-slate-200/20 shadow-2xl rounded-3xl overflow-hidden";

  // Glassmorphism escuro fiel ao CSS fornecido
  const glassExport = isExporting
    ? 'bg-[rgba(30,30,30,0.4)] backdrop-blur-[14px] border border-white/10 shadow-2xl rounded-[28px] overflow-hidden w-[320px] p-6 text-[#f1f1f1] text-center'
    : '';
  // Fundo colorido desfocado para exportação (removido, pois o gradiente já está no card)
  const exportBg = '';

  // Estilo para bloco de critérios
  const criteriaBlock =
    'mt-4 px-4 py-3 bg-slate-100/60 dark:bg-slate-700/60 rounded-xl text-base text-slate-800 dark:text-slate-100 font-medium shadow-sm border border-slate-200 dark:border-slate-600 w-full text-left break-words';

  if (badge.isCracha) {
    return (
      <>
        <div
          ref={badgeRef}
          data-badge-id={badge.id}
          className={`badge-glass flex flex-row items-stretch justify-start bg-[#1c1c26] relative`}
          style={{ width: 460, height: 315, borderRadius: 16, padding: 16, boxSizing: 'border-box' }}
          role="article"
          aria-labelledby={`badge-title-${badge.id}`}
        >
          <div className="main-image relative flex-shrink-0" style={{ width: 180, height: 260, border: '3px solid #007aff', borderRadius: 12, overflow: 'hidden', boxSizing: 'border-box' }}>
            <img
              src={badge.recipientPhotoUrl || ''}
              alt={`Foto de ${badge.recipientName}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }}
            />
            {badge.imageUrl && (
              <div className="avatar-overlay" style={{ position: 'absolute', bottom: 20, left: 48, width: 64, height: 64, border: '3px solid #FFD700', borderRadius: '50%', overflow: 'hidden', zIndex: 2, background: '#18181b' }}>
                <img
                  src={badge.imageUrl}
                  alt="Badge"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                />
              </div>
            )}
          </div>
          <div className="info flex flex-col justify-center pl-6 pr-2 py-1" style={{ color: '#f1f1f1', fontFamily: 'Segoe UI, sans-serif', flex: 1, minWidth: 0 }}>
            <Textfit mode="multi" min={16} max={32} style={{ lineHeight: 1.1, fontWeight: 'bold', marginBottom: 4, maxHeight: 70 }}>
              {badge.title}
            </Textfit>
            <Textfit mode="multi" min={12} max={22} style={{ marginBottom: 4, maxHeight: 48, fontWeight: 500 }}>
              {badge.recipientName}
            </Textfit>
            <div className="text-[16px] mb-1">Por: <span className="font-medium">{badge.issuerName}</span></div>
            <div className="text-[16px] font-bold mb-1">Critérios:</div>
            <div className="text-[16px] mb-2" style={{ wordBreak: 'break-word' }}>{badge.criteria}</div>
            <div className="text-[15px] text-[#bfc4ca]">Emissão: {badge.issueDate}</div>
          </div>
        </div>
        {(!isExporting) && (
          <div className="flex justify-center mt-4 w-full">
            <button 
              onClick={() => setShowShareModal(true)}
              className="w-full max-w-xs flex items-center justify-center bg-brand-secondary hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
              aria-label={`Compartilhar o crachá ${badge.title}`}
            >
              <ShareIcon className="w-5 h-5 mr-2 shrink-0" aria-hidden="true" />
              Compartilhar/Salvar Crachá
            </button>
          </div>
        )}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowShareModal(false)}>
            <div className="bg-[#18181b] p-5 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h4 className="text-xl font-semibold text-slate-100 mb-4">Compartilhar Crachá</h4>
              <div className="space-y-2">
                <button onClick={() => { handleDownloadCurrentView(); if (typeof onClear === 'function') onClear(); }} className="w-full text-left p-2.5 hover:bg-slate-700 rounded text-sm">Baixar Crachá (.png)</button>
                <button onClick={() => { handleCopyToClipboard(); if (typeof onClear === 'function') onClear(); }} className="w-full text-left p-2.5 hover:bg-slate-700 rounded text-sm">Copiar Informações</button>
                {navigator.share && <button onClick={() => { handleNativeShare(); if (typeof onClear === 'function') onClear(); }} className="w-full text-left p-2.5 hover:bg-slate-700 rounded text-sm">Compartilhamento Nativo...</button>}
              </div>
              <button onClick={() => setShowShareModal(false)} className="mt-6 w-full bg-slate-600 hover:bg-slate-500 py-2.5 rounded text-sm font-medium">Fechar</button>
            </div>
          </div>
        )}
      </>
    );
  }

  // STANDARD BADGE LAYOUT
  return (
    <>
      <div
        ref={badgeRef}
        data-badge-id={badge.id}
        className={
          `badge-glass relative flex flex-col items-center justify-start ${glassExport} ${isExporting ? 'ring-0' : ''}`
        }
        style={isExporting ? { backgroundColor: 'rgba(30,30,30,0.4)', borderRadius: 28, boxShadow: '0 0 20px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)', minWidth: 320, maxWidth: 320, padding: 24, color: '#f1f1f1', textAlign: 'center' } : {}}
        role="article"
        aria-labelledby={`badge-title-${badge.id}`}
      >
        <img
          src={badge.imageUrl || ''}
          alt={`Imagem do badge ${badge.title}`}
          className="avatar w-[100px] h-[100px] rounded-full object-cover border-[3px] border-white/10 shadow-[0_0_10px_rgba(255,0,0,0.3)] mx-auto"
          style={{ marginTop: 0 }}
        />
        <Textfit mode="multi" min={18} max={36} style={{ color: 'white', fontWeight: 'bold', margin: '16px 0', maxHeight: 90 }}>
          {badge.title}
        </Textfit>
        <div className="info text-left mt-6 w-full flex flex-col gap-4">
          <p><span className="label">Recebedor:</span> {badge.recipientName}</p>
          <p><span className="label">Emitido por:</span> {badge.issuerName}</p>
          <div>
            <span className="label">Critérios da Conquista:</span><br />
            {badge.criteria}
          </div>
          <p className="text-[15px] text-[#bfc4ca] mt-2">Data de Emissão: {badge.issueDate}</p>
        </div>
      </div>
      {(!isExporting) && (
        <div className="flex justify-center mt-4 w-full">
          <button 
            onClick={() => setShowShareModal(true)}
            className="w-full max-w-xs flex items-center justify-center bg-brand-secondary hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
            aria-label={`Compartilhar o badge ${badge.title}`}
          >
            <ShareIcon className="w-5 h-5 mr-2 shrink-0" aria-hidden="true" />
            Compartilhar Badge
          </button>
        </div>
      )}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50" onClick={() => setShowShareModal(false)}>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h4 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">Compartilhar {badge.isCracha ? 'Crachá' : 'Badge'}</h4>
            <div className="space-y-2">
              <button onClick={handleDownloadCurrentView} className="w-full text-left p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-sm">Baixar Card Completo (.png)</button>
              <button onClick={handleCopyToClipboard} className="w-full text-left p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-sm">Copiar Informações</button>
              {navigator.share && <button onClick={handleNativeShare} className="w-full text-left p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-sm">Compartilhamento Nativo...</button>}
            </div>
            <button onClick={() => setShowShareModal(false)} className="mt-6 w-full bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 py-2.5 rounded text-sm font-medium">Fechar</button>
          </div>
        </div>
      )}
    </>
  );
};

export default BadgeDisplay;

