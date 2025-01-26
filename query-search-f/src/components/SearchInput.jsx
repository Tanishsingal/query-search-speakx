import { Input } from './ui/Input'
import { Search } from 'lucide-react'

export function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder || "Search questions..."}
        value={value}
        onChange={onChange}
        className="pl-8"
      />
    </div>
  )
}