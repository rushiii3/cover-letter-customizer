"use client"

import { useState, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Bold, Italic, Underline, List, ListOrdered } from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [selection, setSelection] = useState<{ start: number; end: number }>({ start: 0, end: 0 })

  const saveSelection = () => {
    if (textareaRef.current) {
      setSelection({
        start: textareaRef.current.selectionStart,
        end: textareaRef.current.selectionEnd,
      })
    }
  }

  const restoreSelection = () => {
    if (textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(selection.start, selection.end)
    }
  }

  const applyFormatting = (prefix: string, suffix: string = prefix) => {
    saveSelection()

    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart
      const end = textareaRef.current.selectionEnd
      const selectedText = value.substring(start, end)

      const newText = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end)

      onChange(newText)

      // Update selection for next action
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
          textareaRef.current.setSelectionRange(start + prefix.length, end + prefix.length)
        }
      }, 0)
    }
  }

  const insertPlaceholder = () => {
    saveSelection()

    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart
      const end = textareaRef.current.selectionEnd
      const selectedText = value.substring(start, end)

      const placeholderText = selectedText.trim() ? selectedText : "placeholder"
      const newText = value.substring(0, start) + `{{${placeholderText}}}` + value.substring(end)

      onChange(newText)

      // Update selection for next action
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
          const newCursorPos = start + placeholderText.length + 4
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos)
        }
      }, 0)
    }
  }

  const formatBold = () => applyFormatting("**")
  const formatItalic = () => applyFormatting("*")
  const formatUnderline = () => applyFormatting("__")
  const formatBulletList = () => {
    saveSelection()

    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart
      const end = textareaRef.current.selectionEnd
      const selectedText = value.substring(start, end)

      // Split the selected text by newlines and add bullet points
      const formattedText = selectedText
        .split("\n")
        .map((line) => (line.trim() ? `• ${line}` : line))
        .join("\n")

      const newText = value.substring(0, start) + formattedText + value.substring(end)

      onChange(newText)

      // Update selection
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
          textareaRef.current.setSelectionRange(start, start + formattedText.length)
        }
      }, 0)
    }
  }

  const formatNumberedList = () => {
    saveSelection()

    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart
      const end = textareaRef.current.selectionEnd
      const selectedText = value.substring(start, end)

      // Split the selected text by newlines and add numbers
      const lines = selectedText.split("\n")
      const formattedText = lines.map((line, index) => (line.trim() ? `${index + 1}. ${line}` : line)).join("\n")

      const newText = value.substring(0, start) + formattedText + value.substring(end)

      onChange(newText)

      // Update selection
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
          textareaRef.current.setSelectionRange(start, start + formattedText.length)
        }
      }, 0)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 p-1 border rounded-md bg-gray-50">
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={formatBold}>
          <Bold className="h-4 w-4" />
          <span className="sr-only">Bold</span>
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={formatItalic}>
          <Italic className="h-4 w-4" />
          <span className="sr-only">Italic</span>
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={formatUnderline}>
          <Underline className="h-4 w-4" />
          <span className="sr-only">Underline</span>
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1 my-auto" />
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={formatBulletList}>
          <List className="h-4 w-4" />
          <span className="sr-only">Bullet List</span>
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={formatNumberedList}>
          <ListOrdered className="h-4 w-4" />
          <span className="sr-only">Numbered List</span>
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1 my-auto" />
        <Button type="button" variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={insertPlaceholder}>
          + Placeholder
        </Button>
      </div>

      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[300px] font-mono"
        onSelect={saveSelection}
      />
      <div className="mt-2 text-sm text-gray-500">
        <p className="font-medium">Formatting Tips:</p>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li>
            <strong>Bold:</strong> **text**
          </li>
          <li>
            <em>Italic:</em> *text*
          </li>
          <li>
            <u>Underline:</u> __text__
          </li>
          <li>Placeholder: &#123;&#123;placeholder_name&#125;&#125;</li>
        </ul>
      </div>
    </div>
  )
}

