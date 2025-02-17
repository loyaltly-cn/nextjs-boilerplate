'use client'
import { useLanguage } from '@/app/language';

export default function Home() {
  const { translations } = useLanguage();
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#E6E1E5] mb-8">{translations.dashboard.title}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="bg-[#2B2930] p-6 rounded-3xl border border-[#48464C]/30">
          <h3 className="text-[#CAC4D0] text-sm font-medium">{translations.dashboard.user}</h3>
          <p className="text-[#E6E1E5] text-2xl font-bold mt-2">2,543</p>
        </div>

        {/* ... 其他卡片 ... */}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        {/* ... 活动列表 ... */}
      </div>
    </div>
  )
}
