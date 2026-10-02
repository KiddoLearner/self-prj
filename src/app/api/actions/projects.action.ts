'use server';

import { prisma } from "@/src/lib/auth/prisma";
import { getUserId } from "./user.action";
import { revalidatePath } from "next/cache";
import { Prisma } from "../../generated/prisma/client";
//import { Prisma } from "@/generated/prisma/client";
import { utapi } from '@/src/app/api/uploadthing/core';

export async function getProjects() {
    const projects = await prisma.projects.findMany({
    });
    return projects;
}

export async function getSimpleProjects(){
  const projects = await prisma.projects.findMany({
    select:{
      name: true,
      projectIconURL: true,
      description: true
    }
    });
    return projects;
}

export async function getProjectByName(name: string) {
  const project = await prisma.projects.findUnique({
    where: {
      name: name,
    },
  });
  return project;
}

export async function createProject(
  projectData: Prisma.ProjectsCreateInput,
) {
  try {
    if (!projectData.name.trim()) {
      return {
        success: false,
        error: "Project name 不可以為空",
      };
    }

    

    const project = await prisma.projects.create({
      data: projectData,
    });

    revalidatePath("/projects");
    revalidatePath("/projects/create");

    return {
      success: true,
      project,
      count: project.title.length,
    };
  } catch (error) {
    console.error("createProject error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          success: false,
          error: "Project name 已經存在",
        };
      }
    }

    return {
      success: false,
      error: "建立 Project 失敗，請稍後再試",
    };
  }
}

export interface EditProjectData {
  name: string;
  demoURL: string;
  gitHubURL: string;
  description: string;
  title: string[];
  detailDescription: string[];
  imgsURL: string[];
}

export async function editProject(
  projectData: EditProjectData,
  projectId: string,
  oldImageURLs: string[],
  removedImageURLs: string[] = [],
){
  try{
    const urlsToCompare = [...(oldImageURLs ?? []), ...(removedImageURLs ?? [])];

    const oldFileKeys = [...new Set(
      urlsToCompare
        .map((url) => getUploadThingFileKey(url))
        .filter((key): key is string => Boolean(key)),
    )];

    const newFileKeys = [...new Set(
      (projectData.imgsURL ?? [])
        .map((url) => getUploadThingFileKey(url))
        .filter((key): key is string => Boolean(key)),
    )];

    const oldFileKeysToDelete = oldFileKeys.filter(
      (key) => !newFileKeys.includes(key),
    );

    if (oldFileKeysToDelete.length > 0) {
      await utapi.deleteFiles(oldFileKeysToDelete);
    }

    const project = await prisma.projects.update({
      where: {
        name: projectId,
      },
      data: projectData,
    });

    revalidatePath('/projects');
    revalidatePath(
      `/projects/${project.name}`,
    );

    return {
      success: true,
      project,
      count: project.title.length,
    };
  } catch (error) {
    console.error(
      'editProject error:',
      error,
    );

    if (
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      if (error.code === 'P2025') {
        return {
          success: false,
          error: '找不到要更新的 Project',
        };
      }

      if (error.code === 'P2002') {
        return {
          success: false,
          error: 'Project name 已經存在',
        };
      }
    }

    return {
      success: false,
      error: '更新 Project 失敗，請稍後再試',
    };
  }
}

export async function deleteProject(projectName : string, imgURLs: string[]) {
  try{
    const deletedProject = await prisma.projects.delete({
      where: {
        name: projectName,
      },
    });

    const fileKeys = [...new Set(
      imgURLs
        .map((url) => getUploadThingFileKey(url))
        .filter((key): key is string => Boolean(key)),
    )];


    if (fileKeys.length > 0) {
      await utapi.deleteFiles(fileKeys);
    }
    return {
      success: true,
    };

    } catch (error) {
      console.error('deleteProject error:', error);
      return {
        success: false,
        error: '刪除 Project 失敗，請稍後再試',
      };
  }
}


function getUploadThingFileKey(
  imageUrl: string,
) {
  try {
    const url = new URL(imageUrl);

    // 新格式：
    // https://APP_ID.ufs.sh/f/FILE_KEY
    const fileIndex =
      url.pathname.split('/').findIndex(
          (part) => part === 'f',
        );

    if (fileIndex === -1) {
      return null;
    }

    const pathParts = url.pathname
      .split('/')
      .filter(Boolean);

    const fIndex = pathParts.indexOf('f');

    if (
      fIndex === -1 ||
      !pathParts[fIndex + 1]
    ) {
      return null;
    }

    return pathParts[fIndex + 1];
  } catch {
    return null;
  }
}