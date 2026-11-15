import type { Database } from "@/types/database.types";
import type { ErrorResponse, SucessResponse } from "@/types/response"
import type { SupabaseClient } from "@supabase/supabase-js";
import type { FastifyRequest, FastifyReply } from "fastify";

type HomeProductRow = Pick<Database["public"]["Tables"]["products"]["Row"], "id" | "name" | "img" | "prev_price" | "price_in_card_store">;

interface HomeProduct {
    id: string;
    name: string;
    img: string;
    alt: string;
    prevPrice: number | null;
    price: number;
}

interface ResponseForHome {
    data: {
        flash: HomeProduct[];
        mostWanted: HomeProduct[];
        recommendations: HomeProduct[];
    }
}

const toHomeProduct = (product: HomeProductRow): HomeProduct | null => {
    const firstImage = product.img[0];

    if (!firstImage) return null;

    return {
        id: product.id,
        name: product.name,
        img: firstImage,
        alt: product.name,
        prevPrice: product.prev_price,
        price: product.price_in_card_store
    };
};

const toHomeProducts = (products: HomeProductRow[]): HomeProduct[] => products.map(toHomeProduct).filter((product): product is HomeProduct => product !== null);

const displayProductsHomeController = async (
    req: FastifyRequest,
    reply: FastifyReply<{Reply: SucessResponse<ResponseForHome> | ErrorResponse}>,
    supabase: SupabaseClient<Database>
) => {
    try {
        const { data: flashProducts, error: selectError } = await supabase
        .from("products")
        .select("id, name, img, prev_price, price_in_card_store")
        .order("quantity", {ascending: true})
        .limit(10);

        if (selectError || !flashProducts) throw selectError;

        const { data: recommendationProducts, error: recommendedError} = await supabase
        .from("products")
        .select("*")
        .order("code", {ascending: false})
        .limit(10)

        if (recommendedError || !recommendationProducts) throw recommendedError;

        const { data: mostWantedProducts, error: wantedError } = await supabase
        .from("products")
        .select("*")
        .order("price_pix", {ascending: true})
        .limit(10)

        if (wantedError || !mostWantedProducts) throw wantedError;

        return reply.status(200).send({
            error: false,
            technicalError: false,
            message: "",
            data: {
                flash: toHomeProducts(flashProducts),
                mostWanted: toHomeProducts(mostWantedProducts),
                recommendations: toHomeProducts(recommendationProducts)
            }
        })
    } catch (error) {
        console.error("Erro ao buscar produtos no banco de dados: ", error);

        return reply.status(500).send({
            error: true,
            technicalError: false,
            message: "Erro no servidor, tente novamente mais tarde",
        })
    }
};

export default displayProductsHomeController;