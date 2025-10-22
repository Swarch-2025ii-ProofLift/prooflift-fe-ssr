'use client'

import { memo } from 'react'
import { Textarea } from "@/components/ui/input"

interface PostTextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus: () => void;
  onSubmit?: () => void;
  isExpanded: boolean;
  placeholder: string;
  maxLength: number;
}

function PostTextarea({
  value,
  onChange,
  onFocus,
  onSubmit,
  isExpanded,
  placeholder,
  maxLength
}: PostTextareaProps) {
  const characterCount = value.length;
  const isNearLimit = characterCount > maxLength * 0.8;
  const isOverLimit = characterCount > maxLength;

  return (
    <div className="relative">
      <Textarea
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`p-3 md:p-4 text-primary resize-none
                   ${isExpanded ? 'min-h-[120px]' : 'min-h-[60px]'}
                   ${isOverLimit ? 'border-red-500 focus:ring-red-500/50' : ''}`}
        rows={isExpanded ? 5 : 2}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && onSubmit) {
            e.preventDefault()
            onSubmit()
          }
        }}
      />

      {isExpanded && (
        <div className={`absolute bottom-2 right-2 text-xs font-medium
                        ${isOverLimit ? 'text-red-400' : isNearLimit ? 'text-yellow-400' : 'text-gray-500'}`}>
          {characterCount}/{maxLength}
        </div>
      )}
    </div>
  );
}

export default memo(PostTextarea)