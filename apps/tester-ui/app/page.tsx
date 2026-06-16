import Image from 'next/image'
import { Card } from '@/components/Card'
import { ImageWrapper } from '@/components/ImageWrapper'
import desert from '@/assets/desert.png'
import jungle from '@/assets/jungle.png'
import ocean from '@/assets/ocean.png'
import rock from '@/assets/rock.png'

export default function Home() {
  return (
    <Card>
      <h1 className="text-4xl font-bold mb-8">Home</h1>
      <div className="grid grid-cols-2 gap-4">
        <ImageWrapper>
          <Image src={desert} alt="Desert" className="object-cover" fill />
        </ImageWrapper>
        <ImageWrapper>
          <Image src={jungle} alt="Jungle" className="object-cover" fill />
        </ImageWrapper>
        <ImageWrapper>
          <Image src={ocean} alt="Ocean" className="object-cover" fill />
        </ImageWrapper>
        <ImageWrapper>
          <Image src={rock} alt="Rock" className="object-cover" fill />
        </ImageWrapper>
      </div>
    </Card>
  )
}
