'use client'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar } from 'swiper/modules';
//import { useParams } from "next/navigation";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { getProjectByName } from '../../api/actions/projects.action';
type originalProject = Awaited<ReturnType<typeof getProjectByName>>;
interface selectedproject{
  decodedproject : Exclude<originalProject,null>;
}

function SwiperingForProject({decodedproject}: selectedproject){
    return(
        <>
        <div className="project-content-frame">
            <div className="project-name-link">
            <h1 className='project-name text-5xl font-bold'>{decodedproject?.name}</h1>
            <a href={decodedproject?.gitHubURL} target="_blank" className='project-link-1'>GitHub Link</a>
            <a href={decodedproject?.demoURL} target="_blank" className='project-link-2'>Demo Link</a>
            </div>
            <Swiper
                className="swipercontent-scrollbar"
                modules={[Navigation, Pagination, Scrollbar]}
                spaceBetween={20}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true, dragSize: 40 }}
                style={{ width: '900px', maxWidth: '100%', height: '600px', margin: '10px auto',borderRadius:'10px' }}
            >

                {decodedproject!.detailDescription.map((item,index) => (
                    <SwiperSlide key={index}>
                    <div className="swipercontent">
                        {/*<h2 className="swipercontent-item">{item.title}</h2*/}
                        <h1 className="swipercontent-title text-3xl">{decodedproject!.title[index]}</h1>
                        <div className='swipercontent-item swipercontent-imagebox'>
                         <img className="swipercontent-img" src={`${decodedproject!.imgsURL[index]}`}></img> 
                        </div>
                        <div className="swipercontent-item swipercontent-txtbox">
                        <div className="swipercontent-txt whitespace-pre-wrap"> 
                            {item}
                        </div>
                        </div>
                    </div>
                    </SwiperSlide>
                ))}

            </Swiper>
        </div>
        </>
    );
}

export default SwiperingForProject