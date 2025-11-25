export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold">홈</h1>
          <div className="flex gap-3">
            <button className="p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button className="p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 pt-16 pb-20">
        {/* Banner Section */}
        <div className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
          <h2 className="text-xl font-bold mb-2">환영합니다!</h2>
          <p className="text-sm opacity-90">새로운 경험을 시작해보세요</p>
        </div>

        {/* Menu Grid */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          {[
            { icon: "🏠", label: "홈" },
            { icon: "🔍", label: "검색" },
            { icon: "❤️", label: "좋아요" },
            { icon: "⭐", label: "즐겨찾기" },
            { icon: "📱", label: "앱" },
            { icon: "⚙️", label: "설정" },
            { icon: "📊", label: "통계" },
            { icon: "🎯", label: "목표" },
          ].map((item, index) => (
            <button
              key={index}
              className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
            >
              <span className="text-2xl mb-2">{item.icon}</span>
              <span className="text-xs text-gray-700">{item.label}</span>
            </button>
          ))}
        </div>

        {/* List Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">최근 활동</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">항목 {item}</h4>
                    <p className="text-sm text-gray-500">상세 설명이 들어갑니다</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto px-4 py-2 flex justify-around">
          {[
            { icon: "🏠", label: "홈" },
            { icon: "🔍", label: "검색" },
            { icon: "➕", label: "추가" },
            { icon: "❤️", label: "활동" },
            { icon: "👤", label: "프로필" },
          ].map((item, index) => (
            <button
              key={index}
              className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
