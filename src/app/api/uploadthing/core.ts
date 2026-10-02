import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getUserId } from "../actions/user.action";
import { UTApi } from "uploadthing/server";

const f = createUploadthing();

//DELETE
export const utapi = new UTApi();
export async function deleteFileFromUploadThing(fileKey: string) {
  try {
    // 傳入你上一題拿到的 fileKey
    const response = await utapi.deleteFiles(fileKey); 
    
    if (response.success) {
      return { success: true, message: "刪除成功！" };
    }
    return { success: false, message: "刪除失敗" };
  } catch (error) {
    console.error("UTAPI 刪除發生錯誤:", error);
    return { success: false, error: "伺服器出錯" };
  }
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  postImage: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 20,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
     // const user = await getUserId();
        console.log(":white_check_mark: middleware reached");
      // If you throw, the user will not be able to upload
      //if (!user) throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: "user" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try{
        console.log("Upload complete for userId:", metadata.userId);
        console.log("file url", file.ufsUrl);
        return { fileUrl: file.ufsUrl }; 
      }
      catch(e){
        console.error("Error in onUploadComplete:", e);
        return { fileUrl: file.ufsUrl }; 
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
