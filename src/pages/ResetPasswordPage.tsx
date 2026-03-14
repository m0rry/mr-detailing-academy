import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const { t } = useI18n();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetPassword(email);
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {sent ? (
          <div className="text-center">
            <CheckCircle size={48} className="text-success mx-auto mb-4" />
            <h1 className="text-xl font-bold text-foreground mb-2">{t('auth.resetSent')}</h1>
            <Link to="/login" className="text-primary font-medium hover:underline text-sm">{t('common.signIn')}</Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">{t('auth.resetPassword')}</h1>
              <p className="text-muted-foreground text-sm">{t('auth.resetPassword.subtitle')}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder={t('common.email')}
                className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
              />
              <button type="submit" className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-brand-dark transition-all">
                {t('common.submit')}
              </button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              <Link to="/login" className="text-primary hover:underline">{t('common.back')}</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
