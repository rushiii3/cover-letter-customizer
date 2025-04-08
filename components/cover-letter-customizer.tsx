"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/rich-text-editor";
import { PlaceholderManager } from "@/components/placeholder-manager";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import './react-pdf.css'
export function CoverLetterCustomizer() {
  const [template, setTemplate] = useState<string>("");
  const [placeholders, setPlaceholders] = useState<{ [key: string]: string }>(
    {}
  );
  const [customizedLetter, setCustomizedLetter] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("template");
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef, documentTitle: 'Cover Letter' });
  const formatMarkdown = (text: string) => {
    if (!text) return "";

    // Format links: [text](url) -> <a href="url">text</a>
    let formatted = text.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" style="color:#007bff;" rel="noopener noreferrer">$1</a>'
    );

    // Format bold text: **text** -> <strong>text</strong>
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Format italic text: *text* -> <em>$1</em>
    formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Format underline: __text__ -> <u>text</u>
    formatted = formatted.replace(/__(.*?)__/g, "<u>$1</u>");

    // Format bullet lists
    formatted = formatted.replace(/^• (.*?)$/gm, "<li>$1</li>");
    formatted = formatted.replace(/(<li>.*?<\/li>(\n|$))+/g, "<ul>$&</ul>");

    // Format numbered lists
    formatted = formatted.replace(/^\d+\. (.*?)$/gm, "<li>$1</li>");
    formatted = formatted.replace(/(<li>.*?<\/li>(\n|$))+/g, "<ol>$&</ol>");

    // Convert newlines to <br>
    formatted = formatted.replace(/\n/g, "<br>");

    return formatted;
  };

  const addPlaceholder = (key: string, value: string) => {
    setPlaceholders((prev) => ({ ...prev, [key]: value }));
  };

  const removePlaceholder = (key: string) => {
    setPlaceholders((prev) => {
      const newPlaceholders = { ...prev };
      delete newPlaceholders[key];
      return newPlaceholders;
    });
  };

  const customizeLetter = () => {
    let result = template;

    // Replace all placeholders in the format {{placeholder}}
    Object.entries(placeholders).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
      result = result.replace(regex, value);
    });

    setCustomizedLetter(result);
    setActiveTab("preview");
  };

  const handleTemplateChange = (value: string) => {
    setTemplate(value);

    // Extract placeholders from the template
    const placeholderRegex = /\{\{([^}]+)\}\}/g;
    const matches = [...value.matchAll(placeholderRegex)];

    const extractedPlaceholders: { [key: string]: string } = {};
    matches.forEach((match) => {
      const key = match[1];
      if (!placeholders[key]) {
        extractedPlaceholders[key] = "";
      }
    });

    setPlaceholders((prev) => ({ ...prev, ...extractedPlaceholders }));
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="template">Template</TabsTrigger>
          <TabsTrigger value="placeholders">Placeholders</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="template" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label htmlFor="template">Cover Letter Template</Label>
                <p className="text-sm text-gray-500">
                  Enter your cover letter template with placeholders in the
                  format: &#123;&#123;placeholder&#125;&#125;
                </p>
                <RichTextEditor
                  value={template}
                  onChange={handleTemplateChange}
                  placeholder="Dear {{company}},

I am writing to express my interest in the {{position}} position at {{company}}. With my {{years_experience}} years of experience in {{industry}}, I believe I would be a great fit for your team.

Sincerely,
{{name}}"
                />
                <div className="flex justify-end mt-4">
                  <Button onClick={() => setActiveTab("placeholders")}>
                    Continue to Placeholders
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="placeholders">
          <Card>
            <CardContent className="pt-6">
              <PlaceholderManager
                placeholders={placeholders}
                onAddPlaceholder={addPlaceholder}
                onRemovePlaceholder={removePlaceholder}
              />
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("template")}
                >
                  Back to Template
                </Button>
                <Button onClick={customizeLetter}>Generate Cover Letter</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">
                    Customized Cover Letter
                  </h3>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(customizedLetter);
                    }}
                  >
                    Copy to Clipboard
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => reactToPrintFn()}
                  >
                    Print
                  </Button>
                </div>
                <div
                  className="p-4 border rounded-md bg-white min-h-[300px]  text-sm text-justify"
                  style={{
                    fontFamily : "'Times New Roman', Times, serif"

                  }}
                  dangerouslySetInnerHTML={{
                    __html:
                      formatMarkdown(customizedLetter) ||
                      "Your customized cover letter will appear here.",
                  }}
                />
                <div
                  ref={contentRef}
                  className=" border rounded-md  page text-justify hidden"
                >
                  <div
                    className="subpage text-justify text-sm"
                    dangerouslySetInnerHTML={{
                      __html:
                        formatMarkdown(customizedLetter) ||
                        "Your customized cover letter will appear here.",
                    }}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("placeholders")}
                  >
                    Edit Placeholders
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("template")}
                  >
                    Edit Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="mt-8 p-4 border rounded-md bg-gray-50">
        <h3 className="text-lg font-medium mb-2">Formatting Guide</h3>
        <p className="text-sm text-gray-600 mb-2">
          Use these formatting options in your cover letter:
        </p>
        <ul className="text-sm space-y-1 list-disc pl-5">
          <li>
            <strong>Bold text:</strong> Wrap text with{" "}
            <code className="bg-gray-200 px-1">**double asterisks**</code>
          </li>
          <li>
            <em>Italic text:</em> Wrap text with{" "}
            <code className="bg-gray-200 px-1">*single asterisks*</code>
          </li>
          <li>
            <u>Underlined text:</u> Wrap text with{" "}
            <code className="bg-gray-200 px-1">__double underscores__</code>
          </li>
          <li>
            Bullet list: Start lines with{" "}
            <code className="bg-gray-200 px-1">• </code> (bullet point and
            space)
          </li>
          <li>
            Numbered list: Start lines with{" "}
            <code className="bg-gray-200 px-1">1. </code> (number, period, and
            space)
          </li>
          <li>
            Placeholders: Use{" "}
            <code className="bg-gray-200 px-1">
              &#123;&#123;placeholder_name&#125;&#125;
            </code>{" "}
            format
          </li>
        </ul>
      </div>
    </div>
  );
}
