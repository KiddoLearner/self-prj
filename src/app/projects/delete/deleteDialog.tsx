"use client";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteProject } from "../../api/actions/projects.action";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

interface DeleteDialogProps {
    name: string;
    imgURL: string[];
}

export default function DeleteDialog({ name, imgURL }: DeleteDialogProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if(isDeleting) return;
    setIsDeleting(true);
    try {
      const deletedItem = await deleteProject(name,imgURL);
      if(deletedItem.success){
        alert(`成功刪除 ${name}!`);
          setOpen(false);
          router.refresh(); // 刷新首頁快取，確保看到最新資料
          router.push(`/projects`); // 自動跳轉回首頁
      }
      else{
        alert(`儲存失敗: ${deletedItem.error}`);
      }
    } catch (error) {
      console.error("Error deleting plant:", error);
      alert("Failed to delete plant");
    }
    finally{
        setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
     <AlertDialogTrigger render={<Button variant='outline' className="ml-auto flex items-center gap-2"/>}><Trash2 className="w-4 h-4" />Delete Project</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-[15px]">
            This action cannot be undone. This will permanently delete the project from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} disabled={isDeleting}>
                {isDeleting? "Deleting..." : "Confirm Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        
      </AlertDialogContent>
    </AlertDialog>
  );
}