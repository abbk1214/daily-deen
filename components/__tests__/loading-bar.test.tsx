import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoadingBar } from '../loading-bar'

describe('LoadingBar', () => {
  it('renders nothing when not loading', () => {
    const { container } = render(<LoadingBar isLoading={false} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders progressbar when loading', () => {
    render(<LoadingBar isLoading={true} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('has aria-label when loading', () => {
    render(<LoadingBar isLoading={true} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'Loading')
  })
})
