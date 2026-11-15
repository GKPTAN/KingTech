import type { FastifyRequest, FastifyReply } from "fastify";
import type { SucessResponse, ErrorResponse } from "@/types/response";
import type { CreateProductInput } from "@/utils/validateData";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types"; 

const createProductController = async (
    req: FastifyRequest<{Body: CreateProductInput}>, 
    reply: FastifyReply<{Reply: SucessResponse | ErrorResponse}>,
    supabase: SupabaseClient<Database>
) => {

    const body = req.body;

    try {
        const { data: existingProduct, error: findError } = await supabase
        .from("products")
        .select("id")
        .eq("code", body.code)
        .maybeSingle();

        if (findError) {
            console.error("Erro ao checar o código da supabase: ", findError.message);
            throw new Error(`Falha ao consultar banco de dados, erro: ${findError.message}`);
        };

        if (existingProduct) {
            return reply.status(400).send({
                message: "Um produto com esse código já existe, digite outro código",
                error: true,
                technicalError: false,
                field: "code",
            });
        };

        const { error: errorInsert } = await supabase
        .from("products")
        .insert({
            brand: body.brand,
            name: body.name,
            code: body.code,
            department: body.department,
            subcategory: body.subcategory,
            img: body.images,
            price_in_card_store: body.price_in_card_store,
            price_part_in_card_store: body.price_part_in_card_store,
            descount: body.descount !== null && body.descount !== undefined ? String(body.descount) : null,
            descount_pix: body.descount_pix !== null && body.descount_pix !== undefined ? String(body.descount_pix) : null,
            prev_price: body.prev_price ?? null,
            price_pix: body.price_pix,
            quantity: body.quantity,
            variations: body.variants,
            main_informations: body.main_informations,
            specs: body.specs,
            tags: body.tags,
        });

        if (errorInsert) {
            console.error("Erro ao cadastrar o produto: ", errorInsert);
            return reply.status(400).send({
                error: true,
                technicalError: false,
                message: "Erro ao cadastrar o produto no banco de dados, tente novamente mais tarde",
                details: errorInsert.message
            });
        };

        return reply.status(200).send({
            error: false,
            technicalError: false,
            message: "Produto cadastrado com sucesso"
        });
    } catch (error) {
        console.error("Erro na rota /product/create, erro capturado: ", error);
        return reply.status(500).send({
            error: true,
            technicalError: false,
            message: "Erro no servidor, tente novamente mais tarde"
        });
    };
};

export default createProductController;