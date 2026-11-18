import type { FastifyRequest, FastifyReply } from "fastify";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database.types";
import type { ErrorResponse, SucessResponse } from "@/types/response";
import type { DisplayProductsDepartmentsQuery } from "@/utils/validateData";

type DepartmentProductRow = Pick<
  Database["public"]["Tables"]["products"]["Row"],
  "id" | "name" | "img" | "prev_price" | "price_in_card_store"
>;

interface DepartmentProduct {
  id: string;
  name: string;
  img: string;
  alt: string;
  prevPrice: number | null;
  price: number;
}

interface DepartmentProductsResponse {
  data: {
    releases: DepartmentProduct[];
    products: DepartmentProduct[];
    totalCount: number;
  };
}

const toDepartmentProduct = (
  product: DepartmentProductRow,
): DepartmentProduct | null => {
  const firstImage = product.img[0];

  if (!firstImage) return null;

  return {
    id: product.id,
    name: product.name,
    img: firstImage,
    alt: product.name,
    prevPrice: product.prev_price,
    price: product.price_in_card_store,
  };
};

const toDepartmentProducts = (
  products: DepartmentProductRow[],
): DepartmentProduct[] =>
  products
    .map(toDepartmentProduct)
    .filter((product): product is DepartmentProduct => product !== null);

const displayProductsDepartmentsController = async (
  query: DisplayProductsDepartmentsQuery,
  reply: FastifyReply<{
    Reply: SucessResponse<DepartmentProductsResponse> | ErrorResponse;
  }>,
  supabase: SupabaseClient<Database>,
) => {
  const { department, subcategory, page, limit } = query;
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  try {
    const { data: productReleases, error: releasesError } = await supabase
      .from("products")
      .select("id, name, img, prev_price, price_in_card_store")
      .eq("department", department)
      .eq("subcategory", subcategory)
      .order("created_at", { ascending: true })
      .limit(10);

    if (releasesError || !productReleases) throw releasesError;

    const {
      data: productRows,
      count,
      error,
    } = await supabase
      .from("products")
      .select("id, name, img, prev_price, price_in_card_store", {
        count: "exact",
      })
      .eq("department", department)
      .eq("subcategory", subcategory)
      .order("name", { ascending: true })
      .range(start, end);

    if (error) throw error;

    if (productRows === null || count === null) {
      throw new Error("A consulta não retornou os produtos ou a contagem");
    }

    return reply.status(200).send({
      error: false,
      technicalError: false,
      message: "",
      data: {
        releases: toDepartmentProducts(productReleases),
        products: toDepartmentProducts(productRows),
        totalCount: count,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar produtos do departamento:", error);

    return reply.status(500).send({
      error: true,
      technicalError: false,
      message: "Erro no servidor, tente novamente mais tarde",
    });
  }
};

export default displayProductsDepartmentsController;