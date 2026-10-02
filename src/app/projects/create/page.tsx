'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// 匯入 Swiper 必要樣式 (Next.js 13+ App Router 支援直接這樣匯入)
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { createProject } from '../../api/actions/projects.action';



import { useUploadThing } from '../../../lib/uploadthing';

// 定義你的資料結構
interface wholeProject{
    name: string;
    demoURL: string;
    gitHubURL: string;
    description: string;
    title: string[];
    detailDescription: string[];
    imgsURL: string[];
}
interface projectPage {
  title: string;
  detailDescription: string;
  imgsURL: string;
  file? : File;
}

export default function CreateProjectPage() {
  const router = useRouter();
  
  // 1. 初始化資料狀態：預設有一頁空白的 projectPage 物件
  const [pages, setPages] = useState<projectPage[]>([
    { title: '', detailDescription: '', imgsURL: '' }
  ]);
  
  const {
  startUpload,
  isUploading,
} = useUploadThing("postImage", {
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

  // 用來追蹤 Swiper 當前在第幾頁，以及控制 Swiper 轉頁
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

    //Title & DemoURL&GitHubURL
  const [projectName, setprojectName] = useState('');
  const [demoURL, setDemoURL] = useState('');
  const [gitHubURL, setGitHubURL] = useState('');

  // 控制 submit button loading 狀態。
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 2. 處理文字與內容變更 (使用不污染原狀態的淺拷貝方式)
  const handleInputChange = (index: number, field: keyof projectPage, value: string) => {
    const updatedPages = [...pages];
    updatedPages[index] = {
      ...updatedPages[index],
      [field]: value
    };
    setPages(updatedPages);
  };

  // 3. 處理圖片拖放與點擊上傳 (目前先轉成本地 Preview URL，後續可改成雲端上傳)
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

    const localUrl = URL.createObjectURL(file); // 產生臨時預覽網址
    //handleInputChange(index, 'imgsURL', localUrl);
    setPages((currentPages) =>
      currentPages.map((page, pageIndex) =>
        pageIndex === index
          ? {
              ...page,
              file,
              imgsURL: localUrl,
            }
          : page,
      ),
    );
  };

  const removeImage = (index: number) => {
    setPages((currentPages) =>
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

  // 4. 按鈕功能：新增一頁，並自動滑動到最新那一頁npx prisma db push
  const addNewPage = () => {
    // setPages([...pages, { title: '', detailDescription: '', imgsURL: '' }]);
    // // 延遲 50 毫秒等 DOM 渲染完成後，控制 Swiper 滑動到最後一頁
    // setTimeout(() => {
    //   if (swiperRef.current) {
    //     swiperRef.current.slideTo(pages.length);
    //   }
    // }, 50);

    setPages((currentPages) => [
      ...currentPages,
      {
        title: "",
        detailDescription: "",
        imgsURL: "",
      },
    ]);

    // 使用 setTimeout 等待新 slide render 完成。
    setTimeout(() => {
      swiperRef.current?.slideTo(pages.length);
    }, 50);
  };

  // 5. 按鈕功能：刪除當前頁面
  const deletePage = (indexToDelete: number) => {
    if (pages.length <= 1) {
      alert("最少需要保留一頁內容！");
      return;
    }
     // 如果刪除嘅係本地 preview，釋放 object URL。
    const pageToDelete = pages[indexToDelete];
    if (pageToDelete?.imgsURL.startsWith("blob:")) {
      URL.revokeObjectURL(pageToDelete.imgsURL);
    }

    const updatedPages = pages.filter((_, index) => index !== indexToDelete);
    setPages(updatedPages);

    // 如果刪除的是最後一頁，強制將 Swiper 的焦點往前移一頁，防止畫面卡死
    if (activeIndex >= updatedPages.length) {
      const nextIndex = updatedPages.length - 1;
      setActiveIndex(nextIndex);
      swiperRef.current?.slideTo(nextIndex);
    }
  };

  // 6. 🔥 核心 Form 提交邏輯
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 👈 絕對關鍵：阻止瀏覽器將網頁刷新！

        if (isSubmitting || isUploading) {
      return;
    }
    // 前端基本驗證：檢查是否所有頁面都填寫了 Title
    const hasEmptyTitle = pages.some(page => !page.title.trim());
    if (hasEmptyTitle) {
      alert("請確保所有分頁的 Title 都有填寫！");
      return;
    }

    if (!projectName.trim()) {
        alert('請輸入專案名稱');
        return;
    }
    const hasEmptyDescription = pages.some(
        page => !page.detailDescription.trim()
    );

    try {
      // 呼叫 Server Action，將資料寫入 Neon DB
        setIsSubmitting(true);

        // ===============================
      // Step 1:
      // 取得所有需要上傳嘅原始 File
      // ===============================
      // 只拎有 file 嘅 page。
      //
      // file 可能係 undefined，
      // 所以用 type predicate 確保結果係 File[]。
      const filesToUpload: File[] = pages
        .map((page) => page.file)
        .filter(
          (file): file is File => Boolean(file),
        );

      let uploadedURLs: string[] = [];
        
        // ===============================
      // Step 2:
      // Upload 去 UploadThing
      // ===============================

      if (filesToUpload.length > 0) {
        // 呢一步會先完成所有圖片上傳，
        // 未完成之前唔會呼叫 createProject。
        const uploadResult = await startUpload(
          filesToUpload,
        );

        if (!uploadResult || uploadResult.length === 0) {
          throw new Error(
            "圖片上傳失敗，UploadThing 沒有返回結果。",
          );
        }
        uploadedURLs = uploadResult.map((file) => {
          const url = file.ufsUrl ?? file.url;

          if (!url) {
            throw new Error(
              "UploadThing 沒有返回圖片 URL。",
            );
          }

          return url;
        });
    }
    let uploadIndex = 0;

      const finalPages = pages.map((page) => {
        // 呢頁冇新圖片：
        // 保留原本 imgsURL。
        if (!page.file) {
          return page;
        }

        const uploadedURL = uploadedURLs[uploadIndex];

        if (!uploadedURL) {
          throw new Error(
            "找不到對應嘅 UploadThing 圖片 URL。",
          );
        }
        uploadIndex += 1;

        return {
          ...page,

          // 🟩 修改：
          // 用真正 UploadThing URL 覆蓋本地 blob URL。
          imgsURL: uploadedURL,
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
      const projectData: wholeProject = {
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

        const response = await createProject(projectData);

      if (response.success) {
        alert(`成功儲存 ${response.count} 個頁面到資料庫！`);
        router.refresh(); // 刷新首頁快取，確保看到最新資料
        router.push('/'); // 自動跳轉回首頁
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
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-xl shadow-md my-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">新增專案分頁</h2>

      {/* 使用 🗺️ <form> 包裹整個內容，並綁定 onSubmit */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Project Name & Demo & GitHub */}
    <div className="flex mb-1">
        <input
        type="text"
        value={projectName}
        onChange={(e) => {setprojectName(e.target.value)}}
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
        
        {/* Swiper 輪播區塊 */}
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          onSwiper={(swiper) => { swiperRef.current = swiper; }} // 獲取 Swiper 的控制權
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)} // 實時記錄當前頁數
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          {pages.map((page, index) => (
            <SwiperSlide key={index} className="pb-10">
              <div className="space-y-5">
                
                {/* 頂部控制列：顯示頁碼與刪除按鈕 */}
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    第 {index + 1} / {pages.length} 頁
                  </span>
                  {pages.length > 1 && (
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
                    value={page.title}
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
                    value={page.detailDescription}
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
                    {page.imgsURL ? (
                      <div className="relative w-full h-36">
                        <img src={page.imgsURL} alt="Preview" className="w-full h-full object-contain rounded-lg" />
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
  );
}
