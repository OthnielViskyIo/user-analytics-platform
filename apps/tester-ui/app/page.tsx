import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/Card'
import { ImageWrapper } from '@/components/ImageWrapper'
import desert from '@/assets/desert.png'
import jungle from '@/assets/jungle.png'
import ocean from '@/assets/ocean.png'
import rock from '@/assets/rock.png'

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <Card>
        <h1 className="text-4xl font-bold mb-8">Home</h1>
        <div className="grid grid-cols-2 gap-4">
          <Link href="/biomes/desert">
            <ImageWrapper>
              <Image src={desert} alt="Desert" className="object-cover" fill />
            </ImageWrapper>
          </Link>
          <Link href="/biomes/jungle">
            <ImageWrapper>
              <Image src={jungle} alt="Jungle" className="object-cover" fill />
            </ImageWrapper>
          </Link>
          <Link href="/biomes/ocean">
            <ImageWrapper>
              <Image src={ocean} alt="Ocean" className="object-cover" fill />
            </ImageWrapper>
          </Link>
          <Link href="/biomes/rock">
            <ImageWrapper>
              <Image src={rock} alt="Rock" className="object-cover" fill />
            </ImageWrapper>
          </Link>
        </div>
      </Card>

      <Card>
        <div className="h-125 flex items-center justify-center">
          <p className="text-lg text-zinc-600 dark:text-zinc-400">secret content</p>
        </div>
      </Card>
    </div>
  )
}
