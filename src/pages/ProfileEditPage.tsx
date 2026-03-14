import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileEditPage() {
  const { t } = useI18n();
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  const handleSave = () => {
    updateProfile({ name });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 text-sm">
        <ArrowLeft size={16} /> {t('common.back')}
      </button>

      <h1 className="text-2xl font-bold text-foreground mb-6">{t('dashboard.editProfile')}</h1>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">{t('common.name')}</label>
          <input
            type="text" value={name} onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">{t('common.email')}</label>
          <input type="email" value={user.email} disabled className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-muted-foreground" />
        </div>

        <button onClick={handleSave} className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-brand-dark transition-all">
          {saved ? t('common.success') : t('common.save')}
        </button>
      </div>
    </div>
  );
}
