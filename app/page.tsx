import { CoverLetterCustomizer } from "@/components/cover-letter-customizer"

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Cover Letter Customizer</h1>
      <p className="text-center text-gray-600 mb-8">Personalize your cover letter using smart placeholders</p>
      <CoverLetterCustomizer />
    </main>
  )
}

