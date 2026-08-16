import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MoodSelector } from '../mood-selector'

describe('MoodSelector', () => {
  it('renders all 5 mood options', () => {
    render(<MoodSelector value={null} onChange={() => {}} />)
    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(5)
  })

  it('renders with no selection', () => {
    render(<MoodSelector value={null} onChange={() => {}} />)
    const radios = screen.getAllByRole('radio')
    radios.forEach((radio) => {
      expect(radio).toHaveAttribute('aria-checked', 'false')
    })
  })

  it('shows selected mood', () => {
    render(<MoodSelector value="grateful" onChange={() => {}} />)
    const grateful = screen.getByRole('radio', { name: 'Grateful' })
    expect(grateful).toHaveAttribute('aria-checked', 'true')
  })

  it('calls onChange when mood is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<MoodSelector value={null} onChange={onChange} />)

    const grateful = screen.getByRole('radio', { name: 'Grateful' })
    await user.click(grateful)

    expect(onChange).toHaveBeenCalledWith('grateful')
  })

  it('deselects when clicking already selected mood', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<MoodSelector value="grateful" onChange={onChange} />)

    const grateful = screen.getByRole('radio', { name: 'Grateful' })
    await user.click(grateful)

    expect(onChange).toHaveBeenCalledWith(null)
  })

  it('navigates forward with arrow keys when a mood is selected', () => {
    const onChange = vi.fn()
    render(<MoodSelector value="grateful" onChange={onChange} />)

    const radiogroup = screen.getByRole('radiogroup')
    fireEvent.keyDown(radiogroup, { key: 'ArrowRight' })

    expect(onChange).toHaveBeenCalledWith('peaceful')
  })

  it('navigates backward with arrow keys', () => {
    const onChange = vi.fn()
    render(<MoodSelector value="peaceful" onChange={onChange} />)

    const radiogroup = screen.getByRole('radiogroup')
    fireEvent.keyDown(radiogroup, { key: 'ArrowLeft' })

    expect(onChange).toHaveBeenCalledWith('grateful')
  })

  it('wraps around forward from last to first', () => {
    const onChange = vi.fn()
    render(<MoodSelector value="seeking" onChange={onChange} />)

    const radiogroup = screen.getByRole('radiogroup')
    fireEvent.keyDown(radiogroup, { key: 'ArrowRight' })

    expect(onChange).toHaveBeenCalledWith('grateful')
  })

  it('wraps around backward from first to last', () => {
    const onChange = vi.fn()
    render(<MoodSelector value="grateful" onChange={onChange} />)

    const radiogroup = screen.getByRole('radiogroup')
    fireEvent.keyDown(radiogroup, { key: 'ArrowLeft' })

    expect(onChange).toHaveBeenCalledWith('seeking')
  })

  it('clears with Escape key', () => {
    const onChange = vi.fn()
    render(<MoodSelector value="grateful" onChange={onChange} />)

    const radiogroup = screen.getByRole('radiogroup')
    fireEvent.keyDown(radiogroup, { key: 'Escape' })

    expect(onChange).toHaveBeenCalledWith(null)
  })

  it('has proper aria-label on radiogroup', () => {
    render(<MoodSelector value={null} onChange={() => {}} />)
    expect(screen.getByRole('radiogroup', { name: 'Mood selector' })).toBeInTheDocument()
  })

  it('shows screen reader announcement when mood changes', () => {
    const { rerender } = render(<MoodSelector value={null} onChange={() => {}} />)
    expect(screen.getByText('Mood cleared')).toBeInTheDocument()

    rerender(<MoodSelector value="grateful" onChange={() => {}} />)
    expect(screen.getByText('Mood set to Grateful')).toBeInTheDocument()
  })
})
