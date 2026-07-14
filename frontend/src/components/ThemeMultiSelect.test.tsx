import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ThemeMultiSelect from './ThemeMultiSelect'

const THEMES = ['Education', 'Climate Action', 'Food Security']

function setup(selected: string[] = []) {
  const onChange = vi.fn()
  render(
    <>
      <span id="themes-label">Themes</span>
      <ThemeMultiSelect themes={THEMES} selected={selected} onChange={onChange} labelledBy="themes-label" />
    </>,
  )
  return { onChange }
}

describe('ThemeMultiSelect', () => {
  it('shows "All themes" when nothing is selected', () => {
    setup()
    expect(screen.getByRole('button')).toHaveTextContent('All themes')
  })

  it('shows the theme name when exactly one is selected', () => {
    setup(['Education'])
    expect(screen.getByRole('button')).toHaveTextContent('Education')
  })

  it('shows a count when multiple themes are selected', () => {
    setup(['Education', 'Climate Action'])
    expect(screen.getByRole('button')).toHaveTextContent('2 themes')
  })

  it('opens the option list on click and reflects aria-expanded', async () => {
    const user = userEvent.setup()
    setup()
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-expanded', 'false')

    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    THEMES.forEach((theme) => expect(screen.getByText(theme)).toBeInTheDocument())
  })

  it('calls onChange with the theme added when an unselected checkbox is clicked', async () => {
    const user = userEvent.setup()
    const { onChange } = setup()
    await user.click(screen.getByRole('button'))
    await user.click(screen.getByLabelText('Education'))
    expect(onChange).toHaveBeenCalledWith(['Education'])
  })

  it('calls onChange with the theme removed when an already-selected checkbox is clicked', async () => {
    const user = userEvent.setup()
    const { onChange } = setup(['Education', 'Climate Action'])
    await user.click(screen.getByRole('button'))
    await user.click(screen.getByLabelText('Education'))
    expect(onChange).toHaveBeenCalledWith(['Climate Action'])
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    setup()
    await user.click(screen.getByRole('button'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('closes when clicking outside', async () => {
    const user = userEvent.setup()
    setup()
    await user.click(screen.getByRole('button'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    await user.click(document.body)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
})
