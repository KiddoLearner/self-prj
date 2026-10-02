import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import IdCard from '@/src/components/ui/id-card'
import { Marquee } from '@/src/components/ui/marquee'
import GreetingWord from './greeting-word'
import { ArrowRightIcon } from "lucide-react"
import FloatingIcon from '@/src/app/component/FloatingIcon'

const PROFILE_IMAGE_URL = 'https://lvm8znm7tg.ufs.sh/f/wSUFRJOSF6buHYRFxV2nL2ch9BgUraYo7i16ZsGpXzTlKuFD'

type brandLogos = {
  image: string
  name: string
}

const HeroSection = () => {
  return (
    // <section className='lg:relative'>
    <section className="relative overflow-hidden">
      {/* <div className='max-sm:pt-20 sm:py-16 lg:pt-32 lg:pb-24'>
        <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8'> */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-32">
          <div className="relative z-10 space-y-6 lg:max-w-lg">
          {/* <div className='space-y-6 lg:max-w-lg'> */}
            <Badge
              variant='outline'
              className='bg-card h-6.5 gap-1 overflow-visible rounded-full text-green-600 dark:text-green-400'
            >
              <span className='relative inline-flex size-1.5'>
                <span className='absolute -inset-0.5 animate-[ping_1.8s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-green-600/40 opacity-75 dark:bg-green-400/40' />
                <span className='relative inline-flex size-1.5 rounded-full bg-green-600 dark:bg-green-400' />
              </span>
              Simple Personal Info
            </Badge>

            {/* <h1 className='mb-2 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[64px] lg:font-bold'> */}
            <h1 className="mb-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[64px] lg:font-bold">
              <GreetingWord />I am Tony 👋🏻
            </h1>

            <p className='text-muted-foreground text-xl font-medium sm:text-2xl lg:text-3xl'>Newbie Programmer</p>

            <p className='text-muted-foreground mb-8 max-w-2xl text-base'>
              I am a new developer. I am learning React, Next.js. Before that, I leanrt some basic Flutter for Android application, C# for Unity games and some other programming languages like HTML, CSS, JavaScript.
            </p>

            {/* <div className='flex items-center gap-2.5 pt-2'>
              <Button
                variant='outline'
                className='h-11 rounded-full px-4 text-base'
                render={<a href='#' />}
                nativeButton={false}
              >
                Download CV
              </Button>

              <Button
                variant='outline'
                className='hover:bg-card bg-card group h-11 gap-2.5 rounded-full pr-4! pl-4! text-base shadow-sm transition-[padding] duration-300 hover:pl-2!'
                render={<a href='#' />}
                nativeButton={false}
              >
                <span className='bg-primary relative flex size-2.5 items-center justify-center overflow-hidden rounded-full transition-all duration-300 group-hover:size-6.5'>
                  <ArrowRightIcon className='text-primary-foreground absolute size-4.5 -translate-x-3 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100' />
                </span>
                Let&apos;s connect
              </Button>
            </div> */}
          </div>
          <div className="relative flex min-h-[420px] w-full items-center justify-center lg:min-h-[560px] hidden md:block">
          <FloatingIcon src={PROFILE_IMAGE_URL}alt="Money Record"className="w-full"/>
        </div>
        </div>
      {/* </div> */}
        
      {/* <IdCard
        frontImage={PROFILE_IMAGE_URL}
        className='mx-auto mt-8 aspect-4/5 w-full max-w-80 max-lg:hidden lg:absolute lg:-top-31 lg:right-0 lg:left-0 lg:z-10 lg:mt-0 lg:aspect-auto lg:h-182 lg:max-w-none'
      /> */}
      

      {/* <div className='relative mx-auto mt-10 mb-10 w-full max-w-5xl'>
        <div className='from-background pointer-events-none absolute inset-y-0 left-0 z-1 w-16 bg-linear-to-r to-transparent sm:w-35' />
        <div className='from-background pointer-events-none absolute inset-y-0 right-0 z-1 w-16 bg-linear-to-l to-transparent sm:w-35' />
        <div className='mx-auto w-full max-w-5xl overflow-hidden'>
          <Marquee pauseOnHover duration={25} gap={2}>
            {brandLogos.map((logo, logoIndex) => (
              <div
                key={`${logo.image}-${logoIndex}`}
                className='bg-muted flex size-16 shrink-0 items-center justify-center rounded-md'
              >
                <img src={logo.image} alt='' loading='lazy' className='size-10 object-contain grayscale' />
              </div>
            ))}
          </Marquee> 
        </div>
      </div> */}
    </section>
  )
}

export default HeroSection
