'use client'

export function getDefaultAvatar(email?: string | null) {
  if (!email) return '/default-avatar.png'
  const initial = email.charAt(0).toUpperCase()
  const colors = [
    '#F87171', '#FB923C', '#FBBF24', '#34D399', '#60A5FA', '#818CF8', '#A78BFA', '#E879F9'
  ]
  const colorIndex = initial.charCodeAt(0) % colors.length
  const svg = `
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="${colors[colorIndex]}"/>
      <text x="50" y="50" text-anchor="middle" dy="0.35em" fill="white" font-family="sans-serif" font-size="40" font-weight="bold">
        ${initial}
      </text>
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(svg)}`
} 