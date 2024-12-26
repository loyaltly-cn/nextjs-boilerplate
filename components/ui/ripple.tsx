'use client'

import { useState } from 'react'
import styles from './ripple.module.css'

interface RippleProps {
  color?: string;
}

export function Ripple({ color = 'rgba(255, 255, 255, 0.4)' }: RippleProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number }>>([])

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setRipples(prev => [...prev, { x, y }])
    setTimeout(() => {
      setRipples(prev => prev.slice(1))
    }, 850)
  }

  return (
    <div className={styles.rippleContainer} onClick={handleClick}>
      {ripples.map((pos, i) => (
        <span
          key={i}
          className={styles.ripple}
          style={{ 
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            backgroundColor: color
          }}
        />
      ))}
    </div>
  )
} 