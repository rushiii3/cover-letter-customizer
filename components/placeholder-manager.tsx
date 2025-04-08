"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, X } from "lucide-react"

interface PlaceholderManagerProps {
  placeholders: { [key: string]: string }
  onAddPlaceholder: (key: string, value: string) => void
  onRemovePlaceholder: (key: string) => void
}

export function PlaceholderManager({ placeholders, onAddPlaceholder, onRemovePlaceholder }: PlaceholderManagerProps) {
  const [newPlaceholderKey, setNewPlaceholderKey] = useState("")

  const handleAddPlaceholder = () => {
    if (newPlaceholderKey.trim() && !placeholders[newPlaceholderKey]) {
      onAddPlaceholder(newPlaceholderKey, "")
      setNewPlaceholderKey("")
    }
  }

  const handlePlaceholderValueChange = (key: string, value: string) => {
    onAddPlaceholder(key, value)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Placeholders</h3>
      <p className="text-sm text-gray-500">Fill in the values for each placeholder in your template.</p>

      {Object.keys(placeholders).length > 0 ? (
        <div className="space-y-3">
          {Object.entries(placeholders).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              <div className="flex-1">
                <Label htmlFor={`placeholder-${key}`} className="text-sm font-medium">
                  {key}
                </Label>
                <Input
                  id={`placeholder-${key}`}
                  value={value}
                  onChange={(e) => handlePlaceholderValueChange(key, e.target.value)}
                  placeholder={`Value for ${key}`}
                />
              </div>
              <Button variant="ghost" size="icon" onClick={() => onRemovePlaceholder(key)} className="h-9 w-9">
                <X className="h-4 w-4" />
                <span className="sr-only">Remove placeholder</span>
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          No placeholders found. Add a placeholder or use &#123;&#123;placeholder&#125;&#125; format in your template.
        </div>
      )}

      <div className="flex items-end space-x-2 pt-2">
        <div className="flex-1">
          <Label htmlFor="new-placeholder" className="text-sm font-medium">
            Add New Placeholder
          </Label>
          <Input
            id="new-placeholder"
            value={newPlaceholderKey}
            onChange={(e) => setNewPlaceholderKey(e.target.value)}
            placeholder="Enter placeholder name"
          />
        </div>
        <Button onClick={handleAddPlaceholder} className="flex items-center">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>
    </div>
  )
}

