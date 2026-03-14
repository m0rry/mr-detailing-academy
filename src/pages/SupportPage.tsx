import React, { useState } from 'react';
import { useI18n } from '@/i18n/I18nContext';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SupportPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      setSent(true);
      setMessage('');
    }
  };

  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 text-sm">
        <ArrowLeft size={16} /> {t('common.back')}
      </button>

      <h1 className="text-2xl font-bold text-foreground mb-2">{t('support.title')}</h1>
      <p className="text-muted-foreground text-sm mb-8">{t('support.subtitle')}</p>

      {sent && (
        <div className="flex items-center gap-3 p-4 bg-success/10 border border-success/20 rounded-xl mb-6">
          <CheckCircle size={18} className="text-success" />
          <span className="text-sm text-foreground">{t('support.sent')}</span>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">{t('support.message')}</label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none resize-none"
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-brand-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Send size={16} /> {t('support.send')}
        </button>
      </div>
    </div>
  );
}
