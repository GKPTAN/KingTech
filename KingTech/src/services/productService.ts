import { useCallback } from "react";

import AxiosConfig from "@/config/AxiosConfig";

import { useAuth } from "@/context/useAuth";

import type { ErrorApiResponse, SucessApiResponse } from "@/types/api";
import type { AxiosError } from "axios";
import type { CreateProduct } from "@/types/products";
import type { UploadedFile } from "@/components/layout/form/ImageUploader";
import type { UploadImageResponse } from "@/types/products";

export interface CarouselProduct {
  id: string;
  name: string;
  img: string;
  alt: string;
  prevPrice: number | null;
  price: number;
}

export interface HomeProductsResponse {
  data: {
    flash: CarouselProduct[];
    mostWanted: CarouselProduct[];
    recommendations: CarouselProduct[];
  } 
}

export const useProductService = () => {

  const { setGlobalStatus } = useAuth();  

  const uploadProductImages = async (images: UploadedFile[], productCode: string): Promise<SucessApiResponse<UploadImageResponse> | ErrorApiResponse> => {
    try {
      const formData = new FormData();

      formData.append("code", productCode);
      images.forEach((image) => {
        formData.append("images", image.file);
      });

      const response = await AxiosConfig.post(`product/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      setGlobalStatus("sucess");
      setTimeout(() => {
        setGlobalStatus(null);
      }, 5000);

      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorApiResponse>;
      console.error("Erro no upload de imagens: ", err);
      setGlobalStatus("error");
      setTimeout(() => {
        setGlobalStatus(null);
      }, 7000);

      return {
        error: true,
        message: err.response?.data.message || "Erro ao conectar com o servidor, tente novamente mais tarde",
        technicalError: false
      };
    }
  }

  const createProduct = async (product: CreateProduct): Promise<SucessApiResponse | ErrorApiResponse> => {
    try {
      const response = await AxiosConfig.post(`product/create`, product);

      setGlobalStatus("sucess");
      setTimeout(() => {
        setGlobalStatus(null);
      }, 5000);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorApiResponse>;
      console.error("Erro no cadastro do produto: ", err);
      setGlobalStatus("error");
      setTimeout(() => {
        setGlobalStatus(null);
      }, 7000);

      return {
        error: true,
        message: err.response?.data.message || "Erro ao conectar com o servidor, tente novamente mais tarde",
        technicalError: false
      };
    }
  };

  const getProductsForHome = useCallback(async (): Promise<SucessApiResponse<HomeProductsResponse> | ErrorApiResponse> => {
    try {
      const response = await AxiosConfig.get(`product/display/home`);

      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorApiResponse>;
      console.error("Erro na exibição dos produtos no carrossel: ", err);

      return {
        error: true,
        message: err.response?.data.message || "Erro ao conectar com o servidor, tente novamente mais tarde",
        technicalError: false
      };
    }
  }, []);

  return { createProduct, uploadProductImages, getProductsForHome };
};
