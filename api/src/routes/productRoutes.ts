import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { createProductSchema, uploadProductImagesSchema } from "@/utils/validateData";
import { ResponseErrorSchema } from "@/types/response";
import { SucessResponseProductSchema, SucessUploadImageResponseSchema } from "@/types/products/product";
import createProductController from "@/controllers/products/register/createProduct";
import displayProductsHomeController from "@/controllers/products/read/displayProductsHome";
import uploadImagesProductController from "@/controllers/products/register/uploadImagesProduct";

const ProductRoutes = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
    const app = fastify.withTypeProvider<ZodTypeProvider>();

    app.post("/create", {schema: {
        body: createProductSchema,
        response: {200: SucessResponseProductSchema, default: ResponseErrorSchema}
    }}, (request, reply) => createProductController(request, reply, fastify.supabase));
    
    app.post("/upload", {schema: {
        body: uploadProductImagesSchema,
        response: {200: SucessUploadImageResponseSchema, default: ResponseErrorSchema}
    }}, (request, reply) => uploadImagesProductController(request, reply, fastify.supabase));

    app.register(
        async (dysplayRoutes) => {
            dysplayRoutes.get("/home", (request, reply) => displayProductsHomeController(request, reply, fastify.supabase));
        },
        { prefix: "/display" }
    );
};

export default ProductRoutes;