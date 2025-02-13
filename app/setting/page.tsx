'use client'
import { useState } from 'react';
import { useLanguage } from '@/app/language';
import { toast } from '@/components/ui/toast';
import { useSession } from 'next-auth/react';
import { md5 } from '@/lib/utils';
export default function Settings() {
  const { language, setLanguage, translations } = useLanguage();
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zn' : 'en');
  };

  const { data: session } = useSession();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      
      const response = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: md5(passwordData.oldPassword),
          newPassword: md5(passwordData.newPassword),
          email: session?.user.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '修改密码失败');
      }

      toast('密码修改成功', 'success');
      setPasswordData({ oldPassword: '', newPassword: '' });
    } catch (error) {
      console.error('Failed to change password:', error);
      toast(error instanceof Error ? error.message : '修改密码失败', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold text-[#E6E1E5] mb-4 text-center">Settings</h1>
      <div onClick={toggleLanguage} className="cursor-pointer mb-4">
        切换语言: {translations.language}
      </div>
      <form onSubmit={handleChangePassword} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#CAC4D0] mb-1">
            旧密码
          </label>
          <input
            type="password"
            value={passwordData.oldPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
            className="w-full p-3 bg-[#1E1E1E] border border-[#333] rounded-lg focus:outline-none focus:border-[#BB86FC]"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#CAC4D0] mb-1">
            新密码
          </label>
          <input
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
            className="w-full p-3 bg-[#1E1E1E] border border-[#333] rounded-lg focus:outline-none focus:border-[#BB86FC]"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-[#D0BCFF] text-[#381E72] rounded-xl hover:bg-[#E8DEF8] transition-colors disabled:opacity-50"
        >
          {loading ? '处理中...' : '修改密码'}
        </button>
      </form>
    </div>
  );
} 