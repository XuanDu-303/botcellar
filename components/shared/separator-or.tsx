import { ReactNode } from 'react'

const SeparatorWithOr = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="relative flex items-center my-6 w-full">
      <div className="flex-grow border-t border-gray-300" />
      <span className="mx-4 text-sm text-muted-foreground whitespace-nowrap">
        {children ?? 'or'}
      </span>
      <div className="flex-grow border-t border-gray-300" />
    </div>
  )
}

export default SeparatorWithOr
