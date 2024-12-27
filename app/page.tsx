import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#E6E1E5] mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="bg-[#2B2930] p-6 rounded-3xl border border-[#48464C]/30">
          <h3 className="text-[#CAC4D0] text-sm font-medium">Total Users</h3>
          <p className="text-[#E6E1E5] text-2xl font-bold mt-2">2,543</p>
          <div className="mt-4 flex items-center text-[#D0BCFF]">
            <span className="text-sm">↑ 12%</span>
            <span className="text-xs ml-2">vs last month</span>
          </div>
        </div>

        <div className="bg-[#2B2930] p-6 rounded-3xl border border-[#48464C]/30">
          <h3 className="text-[#CAC4D0] text-sm font-medium">Total Appointments</h3>
          <p className="text-[#E6E1E5] text-2xl font-bold mt-2">1,234</p>
          <div className="mt-4 flex items-center text-[#D0BCFF]">
            <span className="text-sm">↑ 8%</span>
            <span className="text-xs ml-2">vs last month</span>
          </div>
        </div>

        <div className="bg-[#2B2930] p-6 rounded-3xl border border-[#48464C]/30">
          <h3 className="text-[#CAC4D0] text-sm font-medium">Active Users</h3>
          <p className="text-[#E6E1E5] text-2xl font-bold mt-2">892</p>
          <div className="mt-4 flex items-center text-[#D0BCFF]">
            <span className="text-sm">↑ 15%</span>
            <span className="text-xs ml-2">vs last month</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-[#E6E1E5] mb-4">Recent Activity</h2>
        <div className="bg-[#2B2930] rounded-3xl border border-[#48464C]/30">
          <div className="p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#D0BCFF]/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#D0BCFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-[#E6E1E5] text-sm">New appointment booked</p>
                    <p className="text-[#CAC4D0] text-xs">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
