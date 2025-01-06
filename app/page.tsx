export default function Home() {
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

        {/* ... 其他卡片 ... */}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        {/* ... 活动列表 ... */}
      </div>
    </div>
  )
}
