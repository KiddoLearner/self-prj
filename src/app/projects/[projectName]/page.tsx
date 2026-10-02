//'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar } from 'swiper/modules';
//import { useParams } from "next/navigation";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import { MoneyRecord, Projects } from '../ProjectList';
import { getProjectByName } from '../../api/actions/projects.action';
import SwiperingForProject from './swiperforproject';
import EditDialog from '../edit/EditDialog';
import DeleteDialog from '../delete/deleteDialog';
import { getUserId } from '../../api/actions/user.action';


type originalProject = Awaited<ReturnType<typeof getProjectByName>>;
interface project{
  decodedproject : originalProject;
}

async function SwiperForProject({params}:{params:{projectName:string}}) {
  const routedProjectName = await params;
  const user = await getUserId();
  
  const project = await getProjectByName(routedProjectName.projectName);

  if(project === null){
    return (
      <>
        <h1>Project not found</h1>
      </>
    );
  }
  return (
  
  <>
    <SwiperingForProject decodedproject={project} />
    {user?
    <>
    <EditDialog pages={project} />
    <DeleteDialog name={project.name} imgURL={project.imgsURL} />
    </>:null
    }
    
  </>
  );
}

export default SwiperForProject;