/* eslint-disable react-hooks/exhaustive-deps */
import React, { type ChangeEvent, type Dispatch, type SetStateAction, useEffect, useRef, useState } from "react";
import { FcCompactCamera } from "react-icons/fc";
import { RiInboxArchiveFill } from "react-icons/ri";

import Button from "../Button";

import '@/style/components/layout/form/imageUploader.css';

export interface UploadedFile {
  file: File;
  previewUrl: string;
}

interface imageUploader {
    images: UploadedFile[];
    setImages: Dispatch<SetStateAction<UploadedFile[]>>; 
}
const ImageUploader = ({images, setImages}: imageUploader) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    }
  }, []);

  const createUploadedFiles = (files: File[]): UploadedFile[] => {
    return files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file)
    }))
  };

  const handleFileChange = (e: ChangeEvent) => {
    const input = e.target as HTMLInputElement;

    const files = input.files;

    if (files) {
        const filesArray = Array.from(files);

        setImages((prev) => [...prev, ...createUploadedFiles(filesArray)])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
  }

  const handleDragEnter = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setDragging(true);
  }

  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setDragging(false);
  }

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setDragging(false);

    if (e.dataTransfer.files) {
        const filesArray = Array.from(e.dataTransfer.files);
        const imageFiles = filesArray.filter(file => file.type.startsWith('image/'));

        setImages((prev) => [...prev, ...createUploadedFiles(imageFiles)])
    }
  }

  const triggerInputClick = () => {
    fileInputRef.current?.click();
  }

  const formatFileName = (name: string) => {
    const maxChars = 15;
    const dotIndex = name.lastIndexOf('.');

    if (dotIndex === -1 || name.length <= maxChars + 6) return name;

    const extension = name.slice(dotIndex);
    const startName = name.slice(0, maxChars);

    return `${startName}...${extension}`
  };

  const removeImage = (indexToRemove: number) => {
    const imageToDelete = images[indexToRemove];

    if (imageToDelete) {
      URL.revokeObjectURL(imageToDelete.previewUrl);
    }

    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="uploader_wrapper">
        <h2>Imagens do produto</h2>
        <p>Essas imagens serão usadas na primeira seção da página do produto</p>
        <input 
            type="file" 
            ref={fileInputRef} 
            multiple 
            accept="image/*" 
            onChange={handleFileChange}
            style={{display: 'none'}}
        />

        <div 
            className={`drop_zone ${dragging ? 'dragging' : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={triggerInputClick}
        >
            <p><RiInboxArchiveFill size={20}/> arraste suas imagens aqui ou <span>clique para buscar</span></p>
        </div>

        <Button 
            type="button" 
            className="custom_upload_btn"
            nameAction="Selecionar arquivos"
            icon={<FcCompactCamera size={20}/>}
            disabled={false}
            onClick={triggerInputClick}
        />

        {images.length > 0 && (
            <ul className="upload_list">
                {images.map((item, idx) => (
                    <li key={idx} className="upload_item">
                        <img 
                            src={item.previewUrl}
                            alt="preview"
                            className="upload_thumb"
                        />

                        <span className="upload_filename">{formatFileName(item.file.name)}</span>

                        <Button 
                            type="button"
                            nameAction="&times;"
                            className="remove_btn"
                            disabled={false}
                            onClick={() => removeImage(idx)}
                        />
                    </li>
                ))}
            </ul>
        )}
    </div>
  )
}

export default ImageUploader