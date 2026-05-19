import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Camera, Loader2, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
  className?: string;
}

export default function ImageUpload({ onUpload, currentUrl, className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Debes seleccionar una imagen.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('jugadores')
        .upload(filePath, file);

      if (uploadError) {
        if (uploadError.message.includes('bucket not found')) {
          throw new Error('Error: El bucket "jugadores" no existe en Supabase. Créalo en la sección Storage.');
        }
        throw uploadError;
      }

      const { data } = supabase.storage.from('jugadores').getPublicUrl(filePath);
      
      setPreview(data.publicUrl);
      onUpload(data.publicUrl);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative group">
        <div className="w-32 h-32 rounded-[2rem] overflow-hidden bg-slate-950/50 border-2 border-dashed border-slate-800 flex items-center justify-center group-hover:border-indigo-500/50 transition-all duration-300">
          {preview ? (
            <img src={preview} alt="Vista previa" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          ) : (
            <Camera className="w-8 h-8 text-slate-700 group-hover:text-indigo-400 transition-colors" />
          )}
          
          {uploading && (
            <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center rounded-[2rem] backdrop-blur-sm">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          )}
        </div>
        
        <label className="absolute -bottom-2 -right-2 p-3 bg-indigo-500 rounded-2xl text-white shadow-2xl cursor-pointer hover:bg-indigo-600 transition-all active:scale-90 border border-white/10">
          <input
            type="file"
            accept="image/*"
            onChange={uploadImage}
            disabled={uploading}
            className="hidden"
          />
          <Camera className="w-5 h-5" />
        </label>
      </div>
      
      {preview && (
        <button 
          onClick={(e) => { e.preventDefault(); setPreview(null); onUpload(''); }}
          className="text-[10px] font-bold uppercase tracking-widest text-rose-500 hover:text-rose-400 flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-lg transition-colors"
        >
          <X className="w-3 h-3" /> Liminar
        </button>
      )}
    </div>
  );
}
