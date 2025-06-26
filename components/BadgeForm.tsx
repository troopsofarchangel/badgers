import React, { useState } from 'react';
import { BadgeData } from '../types';

interface BadgeFormProps {
  onAddBadge: (badge: Omit<BadgeData, 'id' | 'issueDate'>) => void;
}

const BadgeForm: React.FC<BadgeFormProps> = ({ onAddBadge }) => {
  const [title, setTitle] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [issuerName, setIssuerName] = useState('');
  const [criteria, setCriteria] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [isCracha, setIsCracha] = useState(false);
  const [recipientPhotoUrl, setRecipientPhotoUrl] = useState<string | undefined>(undefined);
  const [recipientPhotoPreview, setRecipientPhotoPreview] = useState<string | undefined>(undefined);

  const processImage = (
    file: File,
    targetSize: number | { width: number; height: number },
    outputFormat: 'image/png' | 'image/jpeg' = 'image/png',
    callback: (processedImageUrl: string | undefined, error?: string) => void
  ) => {
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      callback(undefined, 'A imagem é muito grande. O tamanho máximo permitido é 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = 200;
        let height = 200;
        if (typeof targetSize === 'number') {
          width = height = targetSize;
        } else {
          width = targetSize.width;
          height = targetSize.height;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          callback(undefined, 'Não foi possível processar a imagem. Seu navegador pode não suportar esta funcionalidade.');
          return;
        }
        ctx.clearRect(0, 0, width, height);

        const originalWidth = img.width;
        const originalHeight = img.height;
        const targetRatio = width / height;
        const originalRatio = originalWidth / originalHeight;
        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = originalWidth;
        let sourceHeight = originalHeight;

        if (originalRatio > targetRatio) {
          sourceWidth = originalHeight * targetRatio;
          sourceX = (originalWidth - sourceWidth) / 2;
        } else if (originalRatio < targetRatio) {
          sourceHeight = originalWidth / targetRatio;
          sourceY = (originalHeight - sourceHeight) / 2;
        }

        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          0,
          0,
          width,
          height
        );

        callback(canvas.toDataURL(outputFormat));
      };
      img.onerror = () => {
        callback(undefined, 'Não foi possível carregar a imagem. Verifique o formato do arquivo e tente novamente.');
      };
      if (event.target?.result && typeof event.target.result === 'string') {
        img.src = event.target.result;
      } else {
         callback(undefined, 'Erro ao ler o arquivo de imagem.');
      }
    };
    reader.onerror = () => {
      callback(undefined, 'Erro ao ler o arquivo. Tente novamente.');
    };
    reader.readAsDataURL(file);
  };

  const handleBadgeImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file, 110, 'image/png', (url, error) => {
        if (error) {
          alert(error);
          e.target.value = '';
          setImageUrl(undefined);
          setImagePreview(undefined);
        } else {
          setImageUrl(url);
          setImagePreview(url);
        }
      });
    } else {
      setImageUrl(undefined);
      setImagePreview(undefined);
    }
  };

  const handleRecipientPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file, { width: 400, height: 500 }, 'image/png', (url, error) => {
        if (error) {
          alert(error);
          e.target.value = '';
          setRecipientPhotoUrl(undefined);
          setRecipientPhotoPreview(undefined);
        } else {
          setRecipientPhotoUrl(url);
          setRecipientPhotoPreview(url);
        }
      });
    } else {
      setRecipientPhotoUrl(undefined);
      setRecipientPhotoPreview(undefined);
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !recipientName || !issuerName || !criteria) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    onAddBadge({ title, recipientName, issuerName, criteria, imageUrl, isCracha, recipientPhotoUrl });
    setTitle('');
    setRecipientName('');
    setIssuerName('');
    setCriteria('');
    setImageUrl(undefined);
    setImagePreview(undefined);
    setIsCracha(false);
    setRecipientPhotoUrl(undefined);
    setRecipientPhotoPreview(undefined);
    
    const badgeImageInput = document.getElementById('badgeImage') as HTMLInputElement;
    if (badgeImageInput) badgeImageInput.value = '';
    const recipientPhotoInput = document.getElementById('recipientPhoto') as HTMLInputElement;
    if (recipientPhotoInput) recipientPhotoInput.value = '';
  };

  const inputClass = "mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 dark:placeholder-slate-400 dark:text-slate-200 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary dark:focus:border-brand-primary dark:focus:ring-brand-primary";
  const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300";

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-slate-800 shadow-lg rounded-xl space-y-6">
      <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 text-center">Criar Novo Badge</h2>
      
      <div>
        <label htmlFor="title" className={labelClass}>Título do Badge/Crachá</label>
        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Ex: Mestre em React" required aria-required="true" />
      </div>
      
      <div>
        <label htmlFor="recipientName" className={labelClass}>Nome do Recebedor</label>
        <input type="text" id="recipientName" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} className={inputClass} placeholder="Ex: João Silva" required aria-required="true" />
      </div>
      
      <div>
        <label htmlFor="issuerName" className={labelClass}>Nome do Emissor</label>
        <input type="text" id="issuerName" value={issuerName} onChange={(e) => setIssuerName(e.target.value)} className={inputClass} placeholder="Ex: Academia de Código" required aria-required="true" />
      </div>

      <div>
        <label htmlFor="badgeImage" className={labelClass}>Imagem do Símbolo do Badge/Crachá (Opcional)</label>
        <input 
          type="file" 
          id="badgeImage" 
          onChange={handleBadgeImageChange} 
          className={`${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20 dark:file:bg-brand-primary/20 dark:file:text-brand-primary dark:hover:file:bg-brand-primary/30`}
          accept="image/png, image/jpeg, image/gif" 
          aria-describedby="badge-image-constraints"
        />
        <p id="badge-image-constraints" className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          O símbolo será redimensionado para 110x110 pixels (PNG). Máx 2MB. <br />
          Para um efeito de "recorte", envie um PNG com fundo já transparente. <br/>
          A aplicação preservará a transparência, mas não remove fundos de imagens opacas automaticamente.
        </p>
        {imagePreview && (
          <div className="mt-4">
            <p className={`${labelClass} mb-1`}>Pré-visualização do Símbolo (110x110 PNG):</p>
            <img src={imagePreview} alt="Pré-visualização do símbolo do badge processado" className="w-[110px] h-[110px] object-cover rounded-lg border border-slate-300 dark:border-slate-600 shadow-sm" />
          </div>
        )}
      </div>
      
      <div>
        <label htmlFor="criteria" className={labelClass}>Critérios / Descrição</label>
        <textarea id="criteria" value={criteria} onChange={(e) => setCriteria(e.target.value)} className={`${inputClass} min-h-[100px]`} placeholder="Descreva a conquista ou competência..." required aria-required="true" />
      </div>

      <div className="flex items-center">
        <input
          id="isCracha"
          type="checkbox"
          checked={isCracha}
          onChange={(e) => setIsCracha(e.target.checked)}
          className="h-4 w-4 text-brand-primary border-slate-300 dark:border-slate-600 rounded focus:ring-brand-primary dark:focus:ring-offset-slate-800"
        />
        <label htmlFor="isCracha" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
          Renderizar como Crachá (formato 8,6 x 5,5 cm)?
        </label>
      </div>

      {isCracha && (
        <div>
          <label htmlFor="recipientPhoto" className={labelClass}>Foto do Recebedor (para Crachá)</label>
          <input 
            type="file" 
            id="recipientPhoto" 
            onChange={handleRecipientPhotoChange} 
            className={`${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-accent/10 file:text-brand-accent hover:file:bg-brand-accent/20 dark:file:bg-brand-accent/20 dark:file:text-brand-accent dark:hover:file:bg-brand-accent/30`}
            accept="image/png, image/jpeg, image/gif" 
            aria-describedby="recipient-photo-constraints"
          />
          <p id="recipient-photo-constraints" className="mt-1 text-xs text-slate-500 dark:text-slate-400">Foto será redimensionada para 400x500 pixels (proporção 4:5). Máx 2MB.</p>
          {recipientPhotoPreview && (
            <div className="mt-4">
              <p className={`${labelClass} mb-1`}>Pré-visualização da Foto (400x500 PNG):</p>
              <img src={recipientPhotoPreview} alt="Pré-visualização da foto do recebedor processada" className="w-[400px] h-[500px] object-cover rounded-lg border border-slate-300 dark:border-slate-600 shadow-sm" />
            </div>
          )}
        </div>
      )}
      
      <button 
        type="submit" 
        className="w-full bg-brand-primary hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        aria-label="Gerar o badge ou crachá com as informações fornecidas"
      >
        Gerar
      </button>
    </form>
  );
};

export default BadgeForm;

