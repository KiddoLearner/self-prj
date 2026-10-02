'use client';
import React, { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { editProject, getProjectByName } from '../../api/actions/projects.action';


import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button';
import { useUploadThing } from '@/src/lib/uploadthing';
import { useRouter } from 'next/navigation';


type ProjectPages = NonNullable<Awaited<ReturnType<typeof getProjectByName>>>;
interface pageProps {
    pages: ProjectPages;
}
interface projectPage {
  title: string;
  detailDescription: string;
  imgsURL: string;
  originalImageUrl?: string;
  file?: File;
}

const buildProjectPages = (sourceProject: ProjectPages): projectPage[] => {
  if (!sourceProject || !sourceProject.detailDescription) {
    return [{ title: '', detailDescription: '', imgsURL: '', originalImageUrl: '', file: undefined }];
  }

  return sourceProject.detailDescription.map((_, index) => ({
    title: sourceProject.title?.[index] || '',
    detailDescription: sourceProject.detailDescription?.[index] || '',
    imgsURL: sourceProject.imgsURL?.[index] || '',
    originalImageUrl: sourceProject.imgsURL?.[index] || '',
    file: undefined,
  }));
};

const isRealNewImage = (page: projectPage) => {
  if (!(page.file instanceof File) || page.file.size === 0) {
    return false;
  }

  return page.imgsURL.startsWith('blob:') && page.imgsURL !== (page.originalImageUrl || '');
};

function EditDialog({pages}:pageProps) {
  const router = useRouter();
  const originalProjectRef = useRef<ProjectPages>(pages);
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const resetProjectForm = (sourceProject: ProjectPages) => {
    originalProjectRef.current = sourceProject;
    setProjectName(sourceProject.name || '');
    setDemoURL(sourceProject.demoURL || '');
    setGitHubURL(sourceProject.gitHubURL || '');
    setEachpage(buildProjectPages(sourceProject));
  };

  const [projectName, setProjectName] = useState(pages.name);
  const [demoURL, setDemoURL] = useState(pages.demoURL);
  const [gitHubURL, setGitHubURL] = useState(pages.gitHubURL);
  const [eachpage, setEachpage] = useState<projectPage[]>(() => buildProjectPages(pages));

    const [isSubmitting, setIsSubmitting] = useState(false);


    //Edit functions
    const handleInputChange = (index: number, field: keyof projectPage, value: string) => {
    const updatedPages = [...eachpage];
    updatedPages[index] = {
      ...updatedPages[index],
      [field]: value
    };
    setEachpage(updatedPages);
  };

  const handleImageChange = (index: number, file: File | undefined) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("請選擇圖片檔案！");
      return;
    }
    // 限制本地檔案大小為 8MB。
    if (file.size > 8 * 1024 * 1024) {
      alert("圖片大小不可超過 8MB！");
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setEachpage((currentPages) =>
      currentPages.map((page, pageIndex) =>
        pageIndex === index
          ? {
              ...page,
              file,
              imgsURL: localUrl,
              originalImageUrl: page.originalImageUrl || page.imgsURL || '',
            }
          : page,
      ),
    );
  };

  const removeImage = (index: number) => {
    setEachpage((currentPages) =>
      currentPages.map((page, pageIndex) => {
        if (pageIndex !== index) {
          return page;
        }
       
        // 清除之前嘅本地 preview URL，
        // 避免 browser 長期保留 object URL。
        if (page.imgsURL.startsWith("blob:")) {
          URL.revokeObjectURL(page.imgsURL);
        }

        return {
          ...page,
          file: undefined,
          imgsURL: "",
        };
      }),
    );
  };

  const {startUpload,isUploading,} = useUploadThing("postImage", {
    onClientUploadComplete: (res) => {
      console.log(
        "UploadThing client complete:",
        res,
      );
    },
  
    onUploadError: (error) => {
      console.error(
        "UploadThing real upload error:",
        error,
      );
  
      alert(
        `UploadThing upload failed: ${error.message}`,
      );
    },
  });

  const addNewPage = () => {
    setEachpage((currentPages) => [
      ...currentPages,
      {
        title: "",
        detailDescription: "",
        imgsURL: "",
      },
    ]);

    // 使用 setTimeout 等待新 slide render 完成。
    setTimeout(() => {
      swiperRef.current?.slideTo(eachpage.length);
    }, 50);
  };
  const deletePage = (indexToDelete: number) => {
    if (eachpage.length <= 1) {
      alert("最少需要保留一頁內容！");
      return;
    }
     // 如果刪除嘅係本地 preview，釋放 object URL。
    const pageToDelete = eachpage[indexToDelete];
    if (pageToDelete?.imgsURL.startsWith("blob:")) {
      URL.revokeObjectURL(pageToDelete.imgsURL);
    }

    const updatedPages = eachpage.filter((_, index) => index !== indexToDelete);
    setEachpage(updatedPages);

    // 如果刪除的是最後一頁，強制將 Swiper 的焦點往前移一頁，防止畫面卡死
    if (activeIndex >= updatedPages.length) {
      const nextIndex = updatedPages.length - 1;
      setActiveIndex(nextIndex);
      swiperRef.current?.slideTo(nextIndex);
    }
  };


  const resetWhenCancel = () => {
    resetProjectForm(originalProjectRef.current);
  };

  React.useEffect(() => {
    if (pages) {
      originalProjectRef.current = pages;
      setProjectName(pages.name || '');
      setDemoURL(pages.demoURL || '');
      setGitHubURL(pages.gitHubURL || '');
      setEachpage(buildProjectPages(pages));
    }
  }, [pages]);

  React.useEffect(() => {
    if (open) {
      resetProjectForm(pages);
    }
  }, [open, pages]);

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      if (isSubmitting || isUploading) {
        return;
      }
      const hasEmptyTitle = eachpage.some(page => !page.title.trim());
      if (hasEmptyTitle) {
        alert("請確保所有分頁的 Title 都有填寫！");
        return;
      }
  
      if (!projectName.trim()) {
          alert('請輸入專案名稱');
          return;
      }

      try {
        setIsSubmitting(true);

        const filesToUpload = eachpage
          .filter(isRealNewImage)
          .map((page) => page.file as File);

        let uploadedURLs: string[] = [];

        if (filesToUpload.length > 0) {
          const uploadResult = await startUpload(filesToUpload);

          if (!uploadResult || uploadResult.length === 0) {
            throw new Error("圖片上傳失敗，UploadThing 沒有返回結果。");
          }

          uploadedURLs = uploadResult.map((file) => {
            const url = file.ufsUrl ?? file.url;

            if (!url) {
              throw new Error("UploadThing 沒有返回圖片 URL。");
            }

            return url;
          });
        }

        let uploadIndex = 0;

        const finalPages = eachpage.map((page) => {
          const originalUrl = page.originalImageUrl || '';

          if (!isRealNewImage(page)) {
            return {
              ...page,
              imgsURL: page.imgsURL || originalUrl,
              originalImageUrl: page.originalImageUrl || originalUrl,
              file: undefined,
            };
          }

          const uploadedURL = uploadedURLs[uploadIndex];

          if (!uploadedURL) {
            throw new Error("找不到對應嘅 UploadThing 圖片 URL。");
          }
          uploadIndex += 1;

          return {
            ...page,
            imgsURL: uploadedURL,
            originalImageUrl: uploadedURL,
            file: undefined,
          };
        });
  
        const hasEmptyImage = finalPages.some(
          (page) => !page.imgsURL,
        );
  
        if (hasEmptyImage) {
          throw new Error(
            "請確保所有分頁都有成功上傳圖片。",
          );
        }
        const projectData: ProjectPages = {
          name: projectName.trim(),
          demoURL: demoURL.trim(),
          gitHubURL: gitHubURL.trim(),
          description: "",
  
          title: finalPages.map(
            (page) => page.title.trim(),
          ),
  
          detailDescription: finalPages.map(
            (page) => page.detailDescription.trim(),
          ),
  
          imgsURL: finalPages.map(
            (page) => page.imgsURL,
          ),
        };

        const finalImageUrls = finalPages
          .map((page) => page.imgsURL)
          .filter((url): url is string => Boolean(url));

        const removedImageUrls = [...new Set(
          (originalProjectRef.current.imgsURL ?? []).filter(
            (originalUrl: string) => Boolean(originalUrl) && !finalImageUrls.includes(originalUrl),
          ),
        )];
  
          const response = await editProject(projectData, originalProjectRef.current.name, originalProjectRef.current.imgsURL, removedImageUrls);
          setEachpage(
            finalPages.map((page) => ({
              title: page.title,
              detailDescription: page.detailDescription,
              imgsURL: page.imgsURL,
              file: undefined,
              originalImageUrl: page.imgsURL,
            })),
          );
        if (response.success) {
          alert(`成功儲存 ${response.count} 個頁面到資料庫！`);
          setOpen(false);
          router.refresh(); // 刷新首頁快取，確保看到最新資料
          router.push(`/projects/${projectData.name}`); // 自動跳轉回專案頁
        } else {
          alert(`儲存失敗: ${response.error}`);
        }
      } catch (error) {
        console.error("提交表單時發生錯誤:", error);
        alert("系統發生錯誤，請稍後再試。");
      }finally {
          setIsSubmitting(false);
      }
    };

  return (
    <>
    <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger render={<Button variant='outline' className="ml-auto flex items-center gap-2"/>}>Edit {originalProjectRef.current.name}</AlertDialogTrigger>
        <AlertDialogContent className="w-[95vw] max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
          <AlertDialogHeader>
            <AlertDialogTitle>Edit {originalProjectRef.current.name}</AlertDialogTitle>
          <AlertDialogDescription>Fill out the form ti edit the project</AlertDialogDescription>
          </AlertDialogHeader>
          

        {/* Project Name & Demo & GitHub */}
        <div className="w-full min-w-0 flex-1 overflow-y-auto overflow-x-hidden pr-2">
        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex mb-1">
            <input
            type="text"
            value={projectName}
            onChange={(e) => {setProjectName(e.target.value)}}
            placeholder="Project Name..."
            className="w-1/3 p-1 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none mb-1"
          />
          <input
            type="text"
            value={demoURL}
            onChange={(e) => {setDemoURL(e.target.value)}}
            placeholder="Demo URL..."
            className="w-1/3 p-1 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none mb-1"
          />
          <input
            type="text"
            value={gitHubURL}
            onChange={(e) => {setGitHubURL(e.target.value)}}
            placeholder="GitHub URL..."
            className="w-1/3 p-1 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none mb-1"
          />
        </div>

          <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          onSwiper={(swiper) => { swiperRef.current = swiper; }} // 獲取 Swiper 的控制權
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)} // 實時記錄當前頁數
          className="w-full max-w-full min-w-0 bg-white rounded-xl border border-gray-200 shadow-sm"
        >
          {eachpage.map((page, index) => (
            <SwiperSlide key={index} className="pb-10">
              <div className="space-y-5">
                
                {/* 頂部控制列：顯示頁碼與刪除按鈕 */}
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    第 {index + 1} / {eachpage.length} 頁
                  </span>
                  {eachpage.length > 1 && (
                    <button
                      type="button" // 👈 必須是 type="button"，不然按它會提交表單
                       onClick={() => deletePage(index)}
                      className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-md transition font-medium"
                    >
                      🗑️ 刪除此頁
                    </button>
                  )}
                </div>

                {/* 標題欄位 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">標題 (Title)</label>
                  <input
                    type="text"
                    value={eachpage[index].title}
                     onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                    placeholder="請輸入此頁的標題..."
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                {/* 內文大文字框欄位 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">內容 (Content)</label>
                  <textarea
                    rows={5} // 設定預設高度
                    value={eachpage[index].detailDescription}
                     onChange={(e) => handleInputChange(index, 'detailDescription', e.target.value)}
                    placeholder="請輸入大段文字內容..."
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-y"
                  />
                </div>

                {/* 圖片拖放/上傳區塊 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">上傳相片 (Image)</label>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                       handleImageChange(index, e.dataTransfer.files?.[0]); // 👈 加上 [0] 拿取第一張圖
                    }}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 hover:border-blue-400 transition cursor-pointer relative min-h-[140px] flex flex-col justify-center items-center"
                  >
                    {eachpage[index].imgsURL ? (
                      <div className="relative w-full h-36">
                        <img src={eachpage[index].imgsURL} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                        <button
                          type="button" // 👈 必須是 type="button"，防止觸發 submit
                           onClick={() =>removeImage(index)}
                          className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white text-xs px-2.5 py-1 rounded-md shadow-md transition"
                        >
                          移除相片
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600 font-medium">拖曳圖片到此處，或</p>
                        <label className="text-sm text-blue-600 hover:text-blue-700 underline cursor-pointer font-medium inline-block">
                          點擊此處上傳
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                             onChange={(e) => handleImageChange(index, e.target.files?.[0])} // 👈 加上 [0]
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {/* 底部操作按鈕區 */}
        <div className="flex justify-center gap-4 pt-2">
          <button
            type="button" // 👈 必須是 type="button"，防止按「新增一頁」時網頁直接重新整理提交
            onClick={addNewPage}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 px-6 rounded-xl transition shadow-sm disabled:cursor-not-allowed"
            disabled={isSubmitting || isUploading}
          >
            ➕ 新增一頁
          </button>

          <button
            type="submit" // 👈 這個才是真正的提交按鈕，會觸發 <form onSubmit={handleSubmit}>
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition shadow-md disabled:cursor-not-allowed"
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting || isUploading
                ? '處理中...'
                : '💾 儲存並提交到資料庫'}
          </button>
        </div>
        </form>
        </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={()=>resetWhenCancel()}>Cancel</AlertDialogCancel>
          </AlertDialogFooter>

        </AlertDialogContent>
    </AlertDialog>
       
    </>
  )
}

export default EditDialog