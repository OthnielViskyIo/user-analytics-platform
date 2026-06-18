import Image from 'next/image'
import { Card } from '@/components/Card'
import { ImageWrapper } from '@/components/ImageWrapper'
import { notFound } from 'next/navigation'

const biomes: Record<string, { title: string; images: string[] }> = {
  desert: { title: 'Desert', images: ['/yellow1.png', '/yellow2.png', '/yellow3.png'] },
  jungle: { title: 'Jungle', images: ['/green1.png', '/green2.png', '/green3.png'] },
  ocean: { title: 'Ocean', images: ['/blue1.png', '/blue2.png', '/blue3.png'] },
  rock: { title: 'Rock', images: ['/red1.png', '/red2.png', '/red3.png'] },
}

export async function generateStaticParams() {
  return Object.keys(biomes).map((id) => ({
    id,
  }))
}

export default async function BiomePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const biome = biomes[id]

  if (!biome) {
    notFound()
  }

  const loremIpsum = `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    
    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. 
    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
  `

  return (
    <Card>
      <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold mb-8">{biome.title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 w-full">
          {biome.images.map((image, i) => (
            <ImageWrapper key={i}>
              <Image
                src={image}
                alt={`${biome.title} image ${i + 1}`}
                className="object-cover"
                fill
              />
            </ImageWrapper>
          ))}
        </div>

        <div className="space-y-4 text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
          {loremIpsum
            .trim()
            .split('\n\n')
            .map((paragraph, index) => (
              <p key={index}>{paragraph.trim()}</p>
            ))}
        </div>
      </div>
    </Card>
  )
}
