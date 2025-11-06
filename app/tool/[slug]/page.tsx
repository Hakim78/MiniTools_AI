import { notFound, redirect } from 'next/navigation'
import { checkSubscription } from '@/lib/clerk'
import toolsData from '@/data/tools.json'
import ToolInterface from '@/components/ToolInterface'

interface ToolPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return toolsData.map((tool) => ({
    slug: tool.slug,
  }))
}

export async function generateMetadata({ params }: ToolPageProps) {
  const { slug } = await params
  const tool = toolsData.find((t) => t.slug === slug)

  if (!tool) {
    return {
      title: 'Outil introuvable - AI Daily Hub',
    }
  }

  return {
    title: `${tool.title} - AI Daily Hub`,
    description: tool.longDescription,
    openGraph: {
      title: `${tool.title} - AI Daily Hub`,
      description: tool.longDescription,
    },
  }
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params
  const tool = toolsData.find((t) => t.slug === slug)

  if (!tool) {
    notFound()
  }

  // Je vérifie l'abonnement
  const { isSubscribed } = await checkSubscription()

  if (!isSubscribed) {
    redirect('/pricing')
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent text-4xl mb-6 shadow-2xl">
            {tool.icon}
          </div>
          <h1 className="text-4xl font-sans font-bold text-gray-900 mb-4">
            {tool.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {tool.longDescription}
          </p>
        </div>

        <ToolInterface tool={tool} />
      </div>
    </div>
  )
}
