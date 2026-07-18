"use client"

import { memo, useCallback, useRef, useState } from "react"
import { Search, X } from "lucide-react"

interface TimelineSearchProps {
  onSearch: (query: string) => void
}

export const TimelineSearch = memo(function TimelineSearch({
  onSearch,
}: TimelineSearchProps) {
  const [value, setValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value
      setValue(v)
      onSearch(v)
    },
    [onSearch],
  )

  const handleClear = useCallback(() => {
    setValue("")
    onSearch("")
    inputRef.current?.focus()
  }, [onSearch])

  return (
    <div
      className="flex items-center gap-3 rounded-xl border border-border bg-card px-4"
      style={{ height: 44 }}
    >
      <Search size={16} className="text-muted-foreground flex-shrink-0" />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={handleChange}
        placeholder="Search your journey..."
        aria-label="Search timeline"
        className="flex-1 bg-transparent outline-none text-foreground"
        style={{
          fontSize: 'var(--text-body-sm)',
          fontFamily: 'var(--font-body)',
        }}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
          style={{ width: 24, height: 24, background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
})
