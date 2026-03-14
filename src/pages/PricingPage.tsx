import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '@/i18n/I18nContext';
import { useAuth } from '@/contexts/AuthContext';

export default function PricingPage() {
  const { t } = useI18n();
  const { user, isAuthenticated, updateProfile } = useAuth();
  const navigate = useNavigate();

  const plans = [
    {
      id: 'free' as const,
      name: t('pricing.free'),
      price: t('pricing.freePlan.price'),
      desc: t('pricing.freePlan.desc'),
      features: [
        t('pricing.feature.basicCourses'),
        t('pricing.feature.wikiAccess'),
      ],
      popular: false,
    },
    {
      id: 'pro' as const,
      name: t('pricing.pro'),
      price: t('pricing.proPlan.price'),
      desc: t('pricing.proPlan.desc'),
      features: [
        t('pricing.feature.allCourses'),
        t('pricing.feature.wikiAccess'),
        t('pricing.feature.certificates'),
        t('pricing.feature.prioritySupport'),
      ],
      popular: true,
    },
    {
      id: 'enterprise' as const,
      name: t('pricing.enterprise'),
      price: t('pricing.enterprisePlan.price'),
      desc: t('pricing.enterprisePlan.desc'),
      features: [
        t('pricing.feature.allCourses'),
        t('pricing.feature.wikiAccess'),
        t('pricing.feature.certificates'),
        t('pricing.feature.prioritySupport'),
        t('pricing.feature.teamAccess'),
        t('pricing.feature.customBranding'),
        t('pricing.feature.apiAccess'),
      ],
      popular: false,
    },
  ];

  const handleChoose = (planId: 'free' | 'pro' | 'enterprise') => {
    if (!isAuthenticated) { navigate('/register'); return; }
    updateProfile({ subscription: planId });
  };

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('pricing.title')}</h1>
        <p className="text-muted-foreground text-sm">{t('pricing.subtitle')}</p>
      </div>

      <div className="grid gap-4">
        {plans.map((plan, i) => {
          const isCurrent = user?.subscription === plan.id;
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative bg-card border rounded-2xl p-6 ${
                plan.popular ? 'border-primary shadow-brand-glow' : 'border-border'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 start-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase rounded-full">
                  {t('pricing.popular')}
                </span>
              )}
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-bold text-foreground font-mono">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{t('pricing.perMonth')}</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
              <p className="text-xs text-muted-foreground mb-4">{plan.desc}</p>

              <ul className="space-y-2 mb-6">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check size={14} className="text-success flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleChoose(plan.id)}
                disabled={isCurrent}
                className={`w-full py-3 rounded-xl font-semibold transition-all text-sm ${
                  isCurrent
                    ? 'bg-secondary text-muted-foreground'
                    : plan.popular
                    ? 'bg-primary text-primary-foreground hover:bg-brand-dark'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {isCurrent ? t('pricing.currentPlan') : t('pricing.choosePlan')}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
