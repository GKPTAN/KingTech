import sharp from "sharp";
import crypto from "crypto";
import type { FastifyRequest, FastifyReply } from "fastify";
import type { SucessResponse, ErrorResponse } from "@/types/response";
import type { uploadProductImagesInput } from "@/utils/validateData";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

const uploadImagesProductController = async (
    req: FastifyRequest<{Body: uploadProductImagesInput}>,
    reply: FastifyReply<{Reply: SucessResponse<{urls: string[]}> | ErrorResponse}>,
    supabase: SupabaseClient<Database>
) => {
    try {
        const body = req.body;
        const imagesField = body.images;
        const publicUrls: string[] = [];

        for (const fileData of imagesField) {
            if (fileData) {

                const safeFileName = `${crypto.randomUUID()}.webp`;

                const fileBuffer = (fileData as any)._buf;

                if (!fileBuffer || fileBuffer.length === 0) {
                    console.error(`O buffer do arquivo ${fileData.filename} veio vazio`);
                    continue;
                };

                const cleanImageBuffer = await sharp(fileBuffer)
                .resize({
                    width: 600,
                    height: 600,
                    fit: "cover",
                    position: "center"
                })
                .toFormat("webp", {quality: 82})
                .toBuffer();

                const {data: storageData, error: storageError} = await supabase.storage.from("product-images")
                .upload(`catalogo/${safeFileName}`, cleanImageBuffer, {
                    contentType: "image/webp",
                    cacheControl: "3600",
                    upsert: false
                });

                if (storageError) {
                    console.error("Erro no storage da Supabase: ", storageError.message);
                    throw new Error("Falha ao salvar o arquivo no armazenamento em nuvem")
                };

                if (storageData) {
                    const {data: urlData} = await supabase.storage
                    .from("product-images")
                    .getPublicUrl(storageData.path);

                    publicUrls.push(urlData.publicUrl);
                };
            }
        }

        if (publicUrls.length === 0) {
            return reply.status(400).send({
                error: true,
                technicalError: false,
                message: "Nenhuma imagem válida pôde ser processada"
            });
        }

        return reply.status(200).send({
            error: false,
            technicalError: false,
            message: "Imagens processadas e hospedadas com sucesso",
            urls: publicUrls
        })
    } catch (error) {
        console.error("Erro crítico no controlador de upload: ", error);

        return reply.status(500).send({
            error: true,
            technicalError: false,
            message: "Ocorreu um erro interno no servidor ao processar as mídias"
        });
    };
};

export default uploadImagesProductController;