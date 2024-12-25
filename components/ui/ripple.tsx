'use client'

import { useEffect, useState } from 'react'
import styles from './ripple.module.css'

interface RippleStyle {
  left: number
  top: number
  size: number
}

export function Ripple() {
  const [ripples, setRipples] = useState<RippleStyle[]>([])

  return (
    <>
      {ripples.map((style, i) => (
        <span
          key={i}
          className={`${styles.ripple} absolute`}
          style={{transform: `translate(${style.left}px, ${style.top}px)`}}
        />
      ))}
    </>
  )
} 