'use client'

// React Imports
import { useState, type SVGProps , useEffect} from 'react'

// Third-party Imports
import { AnimatePresence, motion } from 'motion/react'

// Component Imports
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon, ArrowRightIcon, Sprout } from 'lucide-react'

import { getSimpleProjects } from '../api/actions/projects.action'
import Link from 'next/link'
import { cn } from '@/src/lib/utils'
import { buttonVariants } from '@/src/components/ui/button'



interface Project {
  name: string
  projectIconURL: string
  description: string
}

const TILE_SIZE = 100
const TILE_GAP = 8
const BLOCK_HEIGHT = TILE_SIZE * 3 + TILE_GAP * 2
const SHADOW_ROOM = 60
const VIEWPORT_HEIGHT = BLOCK_HEIGHT + SHADOW_ROOM
const SIDE_ROOM = 40
const VIEWPORT_WIDTH = TILE_SIZE + SIDE_ROOM * 2
const SIDE_COLUMN_TILES = 5
const COLUMN_STEP = TILE_SIZE + TILE_GAP
const ROW_OFFSET = COLUMN_STEP / 2

const TILE_CLASS = 'bg-card size-25 rounded-md border border-border/70 shadow-xs'

const slideVariants = {
  enter: (direction: number) => ({ y: direction > 0 ? 32 : -32, opacity: 0 }),
  center: { y: 0, opacity: 1 },
  exit: (direction: number) => ({ y: direction > 0 ? -32 : 32, opacity: 0 })
}

const sideColumnVariants = {
  initial: { y: ROW_OFFSET + COLUMN_STEP },
  animate: { y: ROW_OFFSET },
  exit: { y: ROW_OFFSET - COLUMN_STEP }
}

const QuoteMark = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' {...props}>
    <path
      fill='currentColor'
      d='M7.17 6C4.87 6 3 7.87 3 10.17V18h7.17v-7.83H6.17c0-.92.75-1.67 1.67-1.67h1V6H7.17ZM17.17 6c-2.3 0-4.17 1.87-4.17 4.17V18h7.17v-7.83h-4c0-.92.75-1.67 1.67-1.67h1V6h-1.67Z'
    />
  </svg>
)

const MiddleColumnBlock = ({ avatar, name }: { avatar: string; name: string }) => (
  <div className='mx-auto w-fit space-y-2'>
    <div className={TILE_CLASS} />
    <div className='shadow-realistic relative size-25 rounded-md'>
      <img src={avatar} alt={name} loading='lazy' className='absolute inset-0 h-full w-full rounded-md object-cover' />
    </div>
    <div className={TILE_CLASS} />
  </div>
)

const projectPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectIndex, setProjectIndex] = useState(0);
  const [previousProjectIndex, setPreviousProjectIndex] = useState(0);
  const [direction, setDirection] = useState(1);
    useEffect(() => {
      async function loadProjects() {
      const data = await getSimpleProjects();

      setProjects(data);
    }

    loadProjects();
  }, []);

  const goTo = (nextDirection: number) => {
     if (projects.length === 0) {
        return;
      }

      setPreviousProjectIndex(projectIndex);

      setProjectIndex(
        (current) =>
          (current + nextDirection + projects.length) %
          projects.length,
      );

      setDirection(nextDirection);
  }

  const project = projects[projectIndex];
  const outgoingProject = projects[previousProjectIndex];

  if (projects.length === 0) {
    return (
      <section className="bg-background px-4 py-24">
        <div className="mx-auto max-w-5xl text-center">
          Loading projects...
        </div>
      </section>
    );
  }
  return (
    

    <section className='bg-background py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-5xl space-y-8 px-4 sm:px-6 lg:space-y-16 lg:px-8'>
        <div className='space-y-2'>
          <p className='text-primary text-lg font-medium italic sm:text-xl'>{'Self-Learnt Projects'}</p>
          <h2 className='text-2xl font-semibold sm:text-3xl lg:text-4xl'>
            some good fresh experience learnt through the internet~
          </h2>
        </div>

        <div className='grid grid-cols-1 items-center gap-6 sm:grid-cols-[323px_1fr] sm:gap-8'>
          <div className='relative mx-auto h-78 w-full mask-[radial-gradient(ellipse_at_center,black_25%,transparent_80%)] sm:mx-0'>
            <div className='absolute inset-0 grid h-auto grid-cols-3 content-center gap-3 max-sm:mx-auto max-sm:w-fit'>
              <AnimatePresence initial={false}>
                <motion.div
                  key={`left-${projectIndex}`}
                  style={{ gridColumn: 1, gridRow: 1, alignSelf: 'center' }}
                  variants={sideColumnVariants}
                  initial='initial'
                  animate='animate'
                  exit='exit'
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className='space-y-2'
                >
                  {Array.from({ length: SIDE_COLUMN_TILES }, (_, tileIndex) => (
                    <div key={tileIndex} className={TILE_CLASS} />
                  ))}
                </motion.div>
              </AnimatePresence>

              <div
                className='relative'
                style={{ gridColumn: 2, gridRow: 1, alignSelf: 'center', width: TILE_SIZE, height: VIEWPORT_HEIGHT }}
              >
                <div
                  className='absolute top-0 mask-[linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]'
                  style={{
                    left: '50%',
                    transform: `translate(-50%, ${SHADOW_ROOM / 2}px)`,
                    width: VIEWPORT_WIDTH,
                    height: VIEWPORT_HEIGHT
                  }}
                >
                  <motion.div
                    key={projectIndex}
                    initial={{ y: -VIEWPORT_HEIGHT }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    <MiddleColumnBlock avatar={project.projectIconURL} name={project.name} />
                    <div style={{ marginTop: SHADOW_ROOM }}>
                      <MiddleColumnBlock avatar={outgoingProject.projectIconURL} name={outgoingProject.name} />
                    </div>
                  </motion.div>
                </div>
              </div>

              <AnimatePresence initial={false}>
                <motion.div
                  key={`right-${projectIndex}`}
                  style={{ gridColumn: 3, gridRow: 1, alignSelf: 'center' }}
                  variants={sideColumnVariants}
                  initial='initial'
                  animate='animate'
                  exit='exit'
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className='space-y-2'
                >
                  {Array.from({ length: SIDE_COLUMN_TILES }, (_, tileIndex) => (
                    <div key={tileIndex} className={TILE_CLASS} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className='overflow-hidden'>
            <div className='mb-8'>
              <QuoteMark className='fill-primary size-9 rotate-180' />
            </div>

            <AnimatePresence initial={false} custom={direction} mode='wait'>
              <motion.div
                key={projectIndex}
                custom={direction}
                variants={slideVariants}
                initial='enter'
                animate='center'
                exit='exit'
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className='space-y-5'
              >
                <p className='text-primary max-w-xl text-xl font-medium lg:text-[26px]'>{project.description}</p>
                <div>
                  <p className='text-base font-medium'>{project.name}</p>
                  {/* <p className='text-muted-foreground text-xs'>Self-Learnt Project</p> */}
                  <PressToProject projectname={project.name}/>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className='mt-6 flex gap-3'>
              <Button
                onClick={() => goTo(-1)}
                aria-label='Previous testimonial'
                variant='outline'
                size='icon'
                className='hover:border-primary/30 dark:hover:border-primary/30 text-primary hover:bg-primary/10 dark:hover:bg-primary/10 hover:text-primary rounded-full'
              >
                <ArrowLeftIcon className='size-4' />
              </Button>
              <Button
                onClick={() => goTo(1)}
                aria-label='Next testimonial'
                variant='outline'
                size='icon'
                className='hover:border-primary/30 dark:hover:border-primary/30 text-primary hover:bg-primary/10 dark:hover:bg-primary/10 hover:text-primary rounded-full'
              >
                <ArrowRightIcon className='size-4' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default projectPage

const PressToProject = ({projectname,}: {projectname: string;}) => {
  return(
    <Link
    href={`/projects/${projectname}`}
    className={cn(
      buttonVariants({ variant: "ghost", size: "default" }),
      "flex w-fit items-center justify-start gap-2 px-0 text-left"
    )}
  >
    <Sprout className="w-4 h-4" />
    <span className="hidden lg:inline underline">Press to View {projectname}</span>
  </Link>
  );
}