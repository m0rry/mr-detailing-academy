import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, CreditCard, BarChart3, BookOpen, FileText, Plus, Eye, EyeOff } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { courses, getCourseTitle } from '@/data/courses';
import { wikiArticles, getArticleTitle } from '@/data/wiki';

type AdminTab = 'dashboard' | 'users' | 'courses' | 'wiki' | 'subscriptions';

const mockUsers = [
  { id: '1', name: 'Alex Gloss', email: 'admin@gloss.academy', role: 'admin', subscription: 'enterprise', joined: '2024-01-15' },
  { id: '2', name: 'Demo Student', email: 'student@gloss.academy', role: 'student', subscription: 'pro', joined: '2024-06-01' },
  { id: '3', name: 'Maria K.', email: 'maria@example.com', role: 'student', subscription: 'free', joined: '2024-09-12' },
  { id: '4', name: 'David L.', email: 'david@example.com', role: 'student', subscription: 'pro', joined: '2024-10-05' },
  { id: '5', name: 'John D.', email: 'john@example.com', role: 'student', subscription: 'free', joined: '2024-11-20' },
];

export default function AdminPage() {
  const { t, locale } = useI18n();
  const [tab, setTab] = useState<AdminTab>('dashboard');

  const tabs: { id: AdminTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: t('admin.dashboard'), icon: BarChart3 },
    { id: 'users', label: t('admin.users'), icon: Users },
    { id: 'courses', label: t('admin.courses'), icon: BookOpen },
    { id: 'wiki', label: t('admin.wiki'), icon: FileText },
    { id: 'subscriptions', label: t('admin.subscriptions'), icon: CreditCard },
  ];

  const stats = [
    { label: t('admin.totalStudents'), value: '1,284', change: '+12%', positive: true },
    { label: t('admin.totalRevenue'), value: '$14,200', change: '+8%', positive: true },
    { label: t('admin.activeSubs'), value: '847', change: '+15%', positive: true },
    { label: t('admin.courseCompletion'), value: '64%', change: '-2%', positive: false },
  ];

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('admin.title')}</h1>
          <p className="text-muted-foreground text-sm">{t('admin.manage')}</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              tab === id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {tab === 'dashboard' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-4">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground font-mono">{stat.value}</p>
                <span className={`text-xs ${stat.positive ? 'text-success' : 'text-destructive'}`}>
                  {stat.change} vs last month
                </span>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 mb-4">
            <h3 className="font-semibold text-foreground text-sm mb-3">Recent Activity</h3>
            <div className="space-y-3 text-xs text-muted-foreground">
              <p>• New student signup: maria@example.com</p>
              <p>• Pro subscription activated: david@example.com</p>
              <p>• Course "Paint Correction Mastery" completed by 3 students</p>
              <p>• New wiki article published: "Iron Fallout Removers"</p>
              <p>• Support ticket resolved: #1247</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Users */}
      {tab === 'users' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-start p-3 text-xs text-muted-foreground font-medium">Name</th>
                    <th className="text-start p-3 text-xs text-muted-foreground font-medium">Email</th>
                    <th className="text-start p-3 text-xs text-muted-foreground font-medium">Role</th>
                    <th className="text-start p-3 text-xs text-muted-foreground font-medium">Plan</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map(u => (
                    <tr key={u.id} className="border-b border-border last:border-0">
                      <td className="p-3 text-foreground font-medium">{u.name}</td>
                      <td className="p-3 text-muted-foreground">{u.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${u.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground capitalize">{u.subscription}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Courses management */}
      {tab === 'courses' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button className="mb-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center gap-2">
            <Plus size={14} /> {t('admin.newCourse')}
          </button>
          <div className="space-y-3">
            {courses.map(course => (
              <div key={course.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-xl">
                <div className="flex items-center gap-3">
                  <img src={course.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <h3 className="text-sm font-medium text-foreground">{getCourseTitle(course, locale)}</h3>
                    <p className="text-xs text-muted-foreground">{course.modules.length} modules • {course.studentsCount} students</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${course.isFree ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                    {course.isFree ? 'Free' : 'Premium'}
                  </span>
                  <button className="p-1.5 hover:bg-secondary rounded transition-colors">
                    <Eye size={14} className="text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Wiki management */}
      {tab === 'wiki' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button className="mb-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center gap-2">
            <Plus size={14} /> {t('admin.newArticle')}
          </button>
          <div className="space-y-2">
            {wikiArticles.map(article => (
              <div key={article.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-xl">
                <div>
                  <h3 className="text-sm font-medium text-foreground">{getArticleTitle(article, locale)}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{article.category} • {article.tags.join(', ')}</p>
                </div>
                <button className="p-1.5 hover:bg-secondary rounded transition-colors">
                  <Eye size={14} className="text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Subscriptions */}
      {tab === 'subscriptions' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-card border border-border rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-foreground font-mono">412</p>
              <p className="text-[10px] text-muted-foreground">Free</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-foreground font-mono">687</p>
              <p className="text-[10px] text-muted-foreground">Pro</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-foreground font-mono">185</p>
              <p className="text-[10px] text-muted-foreground">Enterprise</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4">
            <h3 className="font-semibold text-foreground text-sm mb-3">Recent Transactions</h3>
            <div className="space-y-3">
              {[
                { user: 'David L.', plan: 'Pro', amount: '$29', date: '2024-12-01' },
                { user: 'Sarah M.', plan: 'Enterprise', amount: '$99', date: '2024-11-28' },
                { user: 'Tom W.', plan: 'Pro', amount: '$29', date: '2024-11-25' },
              ].map((tx, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-foreground font-medium">{tx.user}</p>
                    <p className="text-xs text-muted-foreground">{tx.plan} • {tx.date}</p>
                  </div>
                  <span className="text-success font-mono font-medium">{tx.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
