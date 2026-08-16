import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProgressRing } from '../ui/progress-ring'

describe('ProgressRing', () => {
  it('renders SVG with progressbar role', () => {
    render(<ProgressRing value={50} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('has correct aria-valuenow', () => {
    render(<ProgressRing value={75} />)
    const svg = screen.getByRole('progressbar')
    expect(svg).toHaveAttribute('aria-valuenow', '75')
  })

  it('clamps value at 0', () => {
    render(<ProgressRing value={-10} />)
    const svg = screen.getByRole('progressbar')
    expect(svg).toHaveAttribute('aria-valuenow', '0')
  })

  it('clamps value at 100', () => {
    render(<ProgressRing value={150} />)
    const svg = screen.getByRole('progressbar')
    expect(svg).toHaveAttribute('aria-valuenow', '100')
  })

  it('applies custom className', () => {
    render(<ProgressRing value={50} className="my-class" />)
    const svg = screen.getByRole('progressbar')
    expect(svg.getAttribute('class')).toContain('my-class')
  })
})
