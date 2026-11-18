import { z } from 'zod';
import { departmentsData } from '@/data/departmentsData';

const validGenders = ["masculino", "feminino", "binary", "non-binary", "outros"] as const;
const regexDate = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const parseData = (val: string) => val.split('/').map(Number) as [number, number, number];

export const UserDataRegisterSchema = z.object({
    full_name: z.string("formato de nome inválido!").trim().min(3, "o campo (nome completo) precisa ter no mínimo 3 caracteres e no máximo 255 caracteres!").max(255, "o campo (nome completo) precisa ter no mínimo 3 caracteres e no máximo 255 caracteres!").regex(/^((?!\s{3,}).)*$/, "o campo (nome completo) não pode conter mais de dois espaços seguidos!").regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/, "o campo (nome completo) não pode conter números e símbolos exceto '-"),
    gender: z.enum(validGenders, {
        error: () => ({ message: "informe um gênero válido!"})
    }),
    date_birth: z.string("formato de data inválido!").min(1, "o campo (data de nascimento) é obrigatório!")
    .refine((val) => regexDate.test(val), "formato de data inválido, use dd/mm/aaaa")
    .refine((val) => {
        const [dia, mes, ano] = parseData(val);
        const dateObj = new Date(ano, mes - 1, dia);
        const today = new Date();

        const validDate = (
            dateObj.getDate() === dia && 
            dateObj.getMonth() === mes - 1 && 
            dateObj.getFullYear() === ano
        );

        return validDate && dateObj <= today;
    }, "data inexistente!")
    .refine((val) => {
        const [dia, mes, ano] = parseData(val);
        const today = new Date();
        let age = today.getFullYear() - ano;
        const hadBirthDayThisYear = (
            today.getMonth() > (mes - 1) || 
            (today.getMonth() === (mes - 1) && today.getDate() >= dia)
        );
        const realAge = hadBirthDayThisYear ? age : age - 1;

        return realAge >= 18;
    }, "é preciso ter a idade mínima de 18 anos para comprar produtos nessa loja!"),
    email: z.email("formato de email inválido!").max(255, "o campo (email) precisa ter no máximo 255 caracteres!"),
    password: z.string("formato de senha inválida!").min(6, "o campo (senha) precisa ter no mínimo 6 caracteres!").max(255, "o campo (senha) precisa ter no máximo 255 caracteres!").refine((val) => !val.includes(" "), "o campo (senha) não pode conter espaços entre os caracteres!")
});

export type RegisterInput = z.infer<typeof UserDataRegisterSchema>;

export const UserDataLoginSchema = z.object({
    email: z.email("Formato de email inválido!").max(255, "Não exagere no tamanho do email!"),
    password: z.string("formato de senha inválido!").min(1, "O campo senha é obrigatório!").min(6, "Sua senha precisa ter no mínimo 6 caracteres!").max(255, "Não exagere no tamanho da senha!").refine((val) => !val.includes(" "), "Não pode haver espaços entre os caracteres da senha!")
});

export type LoginInput = z.infer<typeof UserDataLoginSchema>;

export const UserVerifySchema = z.object({
    code: z.string()
    .min(1, "O código é obrigatório")
    .regex(/^\d+$/, "O código deve conter apenas números")
    .length(6, "O código deve ter exatamente 6 digitos")
});

export type VerifyInput = z.infer<typeof UserVerifySchema>;

// Validação de dados para criação de produtos

const departmentNames = Object.keys(departmentsData) as [
  keyof typeof departmentsData,
  ...(keyof typeof departmentsData)[],
];

export const displayProductsDepartmentsQuerySchema = z.object({
  department: z.enum(departmentNames),
  subcategory: z.string().min(1, "A subcategoria é obrigatória"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(20).default(20),
})
.superRefine(({ department, subcategory }, ctx) => {
  const belongsToDepartment = departmentsData[department].subcategories.some((item) => item.slug === subcategory,);

  if (!belongsToDepartment) {
    ctx.addIssue({
      code: "custom",
      path: ["subcategory"],
      message: "A subcategoria não pertence ao departamento informado."
    })
  }
});

export type DisplayProductsDepartmentsQuery = z.infer<typeof displayProductsDepartmentsQuerySchema>;

const validDepartments = Object.keys(departmentsData) as [string, ...string[]];
const validSubcategories = Object.values(departmentsData).flatMap(dept => dept.subcategories.map(sub => sub.slug)) as [string, ...string[]];

const VariantsProductSchema = z.object({
  category: z.string().trim().min(2, "A categoria é obrigatória"),
  options: z.array(z.string().trim().min(1, "A opção de variante não pode ficar vazia.")).min(1, "Adicione pelo menos uma opção de variante!")
});

const MainInfoProductShema = z.object({
  id: z.number(),
  title: z.string().trim().min(2, "O titulo é obrigatório!"),
  info: z.string().trim().min(3, "A informação é obrigatória"),
});

export const createProductSchema = z.object({
    brand: z.string().trim().min(2, "A marca é obrigatória").max(100, "O nome da marca é muito longo! Simplifique"),
    name: z.string().trim().min(3, "O nome do produto precisa ter no mínimo 3 caracteres").max(100, "O nome do produto deve ter no máximo 100 caracteres"),
    code: z.string().trim().length(10, "O código precisa ter exatamente 10 caracteres"),
    quantity: z.number().min(0, "A quantidade não pode ser negativa").int("A quantidade precisa ser um número inteiro"),
    department: z.enum(validDepartments, {error: "Selecione um departamento válido da lista!"}),
    subcategory: z.enum(validSubcategories, {error: "Selecione uma subcategoria válida da lista!"}),
    tags: z.array(z.string()).min(1, "Adicione pelo menos uma tag no produto!"),
    images: z.array(z.url("Formato de link de imagem inválido!")).min(1, "Adicione pelo menos 1 imagem do produto!"),
    prev_price: z.number().min(1, "O preço antigo não pode ter um valor inferior a 1").optional().nullable(),
    descount: z.number().min(0, "O desconto não pode ser negativo").max(100, "O desconto não pode passar de 100").optional().nullable(),
    price_in_card_store: z.number({error: "Preço no cartão da loja é obrigatório"}).min(1, "Preço inválido"),
    price_part_in_card_store: z.number({error: "O preço total parcelado no cartão da loja é obrigatório!"}).min(1, "Preço obrigatório"),
    price_pix: z.number({error: "O preço no pix é obrigatório"}).min(1, "Preço inválido"),
    descount_pix: z.number().min(0, "O desconto no pix não pode ser negativo").max(100, "O desconto no pix não pode passar de 100").optional().nullable(),
    variants: z.array(VariantsProductSchema).default([]),
    main_informations: z.array(MainInfoProductShema).default([]),
    specs: z.record(z.string(), z.string()).refine((obj) => Object.keys(obj).length > 0, {error: "Adicione pelo menos uma especificação técnica na ficha do produto"})
}).refine((data) => {
  const department = departmentsData[data.department as keyof typeof departmentsData];
  if (!department) return false;
  const subcategoryExists = department.subcategories.some(sub => sub.slug === data.subcategory);
  
  return subcategoryExists;
}, {
  error: "A subcategoria selecionada não pertence ao departamento escolhido!",
  path: ["subcategory"]
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const fastifyFileSchema = z.object({
  filename: z.string().min(1, "O nome do arquivo é inválido!"),
  mimetype: z.string().refine((type) => type.startsWith("image/"), {error: "Apenas arquivos de imagem são permitidos!"}),
  file: z.any(),
  _buf: z.any().optional()
})

export const uploadProductImagesSchema = z.object({
  code: z.preprocess((val: any) => {
    if (val && typeof val === "object" && "value" in val) {
      return val.value;
    }

    return val;
  }, z.string().trim().length(10, "O código precisa ter exatamente 10 caracteres")),
  images: z.union([fastifyFileSchema, z.array(fastifyFileSchema)]).transform((val) => {
    return Array.isArray(val) ? val : [val];
  }).refine((files) => files.length > 0, {error: "Adicione pelo menos 1 imagem do produto!"})
});

export type uploadProductImagesInput = z.infer<typeof uploadProductImagesSchema>;