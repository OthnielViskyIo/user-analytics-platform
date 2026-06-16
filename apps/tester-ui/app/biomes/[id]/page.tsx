import Image, { StaticImageData } from 'next/image'
import { Card } from '@/components/Card'
import { ImageWrapper } from '@/components/ImageWrapper'
import { notFound } from 'next/navigation'

import blue1 from '@/assets/blue1.png'
import blue2 from '@/assets/blue2.png'
import blue3 from '@/assets/blue3.png'
import green1 from '@/assets/green1.png'
import green2 from '@/assets/green2.png'
import green3 from '@/assets/green3.png'
import red1 from '@/assets/red1.png'
import red2 from '@/assets/red2.png'
import red3 from '@/assets/red3.png'
import yellow1 from '@/assets/yellow1.png'
import yellow2 from '@/assets/yellow2.png'
import yellow3 from '@/assets/yellow3.png'

const biomes: Record<string, { title: string; images: StaticImageData[] }> = {
  desert: { title: 'Desert', images: [yellow1, yellow2, yellow3] },
  jungle: { title: 'Jungle', images: [green1, green2, green3] },
  ocean: { title: 'Ocean', images: [blue1, blue2, blue3] },
  rock: { title: 'Rock', images: [red1, red2, red3] },
}

export async function generateStaticParams() {
  return Object.keys(biomes).map((id) => ({
    id,
  }))
}

export default async function BiomePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
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
          {loremIpsum.trim().split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph.trim()}</p>
          ))}
        </div>
      </div>
    </Card>
  )
}
