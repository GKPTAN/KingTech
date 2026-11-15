import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaChartBar ,FaChevronRight, FaChevronUp } from "react-icons/fa";
import { MdArrowBack, MdBarChart } from "react-icons/md";
import { TfiSettings } from "react-icons/tfi";

import { useProductService } from "@/services/productService";
import { validateProductData } from "@/utils/validateData";

import { useAuth } from "@/context/useAuth";

import type { CreateProduct } from "@/types/products";
import type { createProductInput } from "@/utils/validateData";
import type { MainInfo } from "@/components/layout/form/MainInformation";
import type { UploadedFile } from "@/components/layout/form/ImageUploader";
import type { Variant } from "@/components/layout/form/Variants";

import AddTags from "@/components/layout/form/AddTags";
import Button from "@/components/layout/Button";
import CustomInput from "@/components/layout/form/CustomInput";
import ImageUploader from "@/components/layout/form/ImageUploader";
import Form from "@/components/Form";
import MainInformation from "@/components/layout/form/MainInformation";
import SpecsManager from "@/components/layout/form/SpecsManager";
import Variants from "@/components/layout/form/Variants";

import { type Department, departmentsData, type Subcategory } from "@/data/departmentsData";

import "@/style/Admin.css";

type FormErrors = Partial<Record<keyof CreateProduct, string>>;

const Admin = () => {
  const [activeTab, setActiveTab] = useState<null | string>(null);
  const [disabled, setDisabled] = useState(false);
  const [department, setDepartment] = useState<Department | "">("");
  const [subcategory, setSubcategory] = useState<Subcategory | "">("");
  const [tags, setTags] = useState<string[]>([]);
  const [productImages, setProductImages] = useState<UploadedFile[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [mainInfo, setMainInfo] = useState<MainInfo[]>([]);
  const [specs, setSpecs] = useState({});
  const [errorZod, setErrorZod] = useState<FormErrors>({});

  const { setGlobalMessage, setGlobalStatus } = useAuth();
  const { createProduct, uploadProductImages } = useProductService();

  const { register, trigger, getValues, formState: { errors }, reset } = useForm<CreateProduct>({
    shouldUnregister: false,
    defaultValues: {
      brand: "",
      name: "",
      code: "",
      quantity: undefined,
      prev_price: undefined,
      descount: undefined,
      price_in_card_store: undefined,
      price_part_in_card_store: undefined,
      price_pix: undefined,
      descount_pix: undefined,

      department: "" as Department,
      subcategory: "" as Subcategory,
      tags: [],
      images: [],
      variants: [],
      main_informations: [],
      specs: {},
    }
  })

  const toggleTab = async (tab: string) => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  const handleCreateSubmit = async () => {
    
    setDisabled(true);
    const validHookForm = await trigger();

    if (!validHookForm) {
      setDisabled(false);
      setGlobalStatus("error");
      setTimeout(() => {
        setGlobalStatus(null);
      }, 7000);
      return {
        message: "Por favor, preencha os campos obrigatórios",
        error: true
      }
    }

    const dataForm = getValues();

    const dataToValidate: createProductInput = {
      brand: dataForm.brand,
      name: dataForm.name,
      code: dataForm.code,
      quantity: dataForm.quantity ?? "",
      prev_price: dataForm.prev_price === null ? "" : dataForm.prev_price,
      descount: dataForm.descount === null ? "" : dataForm.descount,
      price_in_card_store: dataForm.price_in_card_store === null ? "" : dataForm.price_in_card_store,
      price_part_in_card_store: dataForm.price_part_in_card_store === null ? "" : dataForm.price_part_in_card_store,
      price_pix: dataForm.price_pix === null ? "" : dataForm.price_pix,
      descount_pix: dataForm.descount_pix === null ? "" : dataForm.descount_pix,
      department: department,
      subcategory: subcategory,
      tags: tags,
      images: productImages,
      specs: specs
    }

    const validateZod = await validateProductData(dataToValidate);

    console.log("Resultado da validação do zod: ", validateZod);
    console.log("Campos com erro no hook form: ", errors);

    if (typeof validateZod === "object" && validateZod.error) {
      setDisabled(false);
      setGlobalStatus("error");
      setTimeout(() => {
        setGlobalStatus(null);
      }, 7000);
      setGlobalMessage(validateZod.message);
      setErrorZod({
        [validateZod.field]: validateZod.message || "campo inválido",
      })
      return validateZod;
    }

    setGlobalMessage("Enviando as imagens para o servidor, isso pode levar alguns segundos dependendo do tamanho das imagens...");

    const resultUpload = await uploadProductImages(productImages, dataForm.code);

    if (resultUpload.error) {
      setDisabled(false);
      setGlobalMessage(resultUpload.message);
      console.log("Mensagem que veio da api: ", resultUpload.message);
      return resultUpload;
    }

    console.log("Urls vindo do backend: ",resultUpload.urls);

    const payloadFinal: CreateProduct = {
      brand: dataForm.brand,
      name: dataForm.name,
      code: dataForm.code,
      quantity: Number(dataForm.quantity),
      prev_price: dataForm.prev_price ? Number(dataForm.prev_price) : null,
      descount: dataForm.descount ? Number(dataForm.descount) : null,
      price_in_card_store: dataForm.price_in_card_store ? Number(dataForm.price_in_card_store) : null,
      price_part_in_card_store: dataForm.price_part_in_card_store ? Number(dataForm.price_part_in_card_store) : null,
      price_pix: dataForm.price_pix ? Number(dataForm.price_pix) : null,
      descount_pix: dataForm.descount_pix ? Number(dataForm.descount_pix) : null,
      department: department as Department,
      subcategory: subcategory as Subcategory,
      tags: tags,
      images: resultUpload.urls,
      variants: variants,
      main_informations: mainInfo,
      specs: specs
    }

    const result = await createProduct(payloadFinal);

    setGlobalMessage(result.message);

    if (!result.error) {
      productImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
      reset();
      setDepartment("");
      setSubcategory("");
      setTags([]);
      setProductImages([]);
      setVariants([]);
      setMainInfo([]);
      setSpecs({});
      setErrorZod({});
      setDisabled(false);
    }

    setDisabled(false);

    return result;
  }

  return (
    <>
      <header>
        <Button 
          type="button"
          nameAction=""
          icon={<MdArrowBack color="#f9cb40" size={40}/>}
          onClick={() => window.history.back()}
        />
        <div className="info">
          <h1>Painel Administrativo <TfiSettings className="setting_icon" /></h1>
          <p>Bem-vindo ao painel de administração da loja. Gerencie seus produtos e acompanhe o desempenho do seu negócio.</p>
        </div>
      </header>
      <main className="adminTech_page">
        {/* SEÇÃO 1: Gerenciamento Direto do Estoque/Produtos */}
        <section className="manager_products">
          <h2>Gerenciar Produtos</h2>
      
          <div className="manager_options">
            {/* Opção: Cadastrar Produto */}
            <div className="create_product">
              <h3 onClick={() => toggleTab("create")}>Cadastrar produto <span>{activeTab === "create" ? <FaChevronUp /> : <FaChevronRight />}</span></h3>
              {activeTab === "create" && (
                <Form
                  classname="form_create"
                  buttonAction="Cadastrar"
                  disabled={disabled}
                  onSubmit={handleCreateSubmit}
                >
                  <CustomInput
                    errorZod={errorZod.brand}
                    errorHookForm={errors.brand}
                    register={register("brand", {required: "A marca é obrigatória"})}
                    type="text"
                    id="brand"
                    placeholder="Marca**"
                  />
                  <CustomInput
                    errorZod={errorZod.name}
                    errorHookForm={errors.name}
                    register={register("name", {required: "O nome é obrigatório"})}
                    type="text"
                    id="name"
                    placeholder="Nome do produto**"
                  />
                  <CustomInput
                    errorZod={errorZod.code}
                    errorHookForm={errors.code}
                    register={register("code", {required: "O código do produto é obrigatório"})}
                    type="text"
                    id="code"
                    placeholder="Código do produto**"
                  />
                  <CustomInput
                    errorZod={errorZod.quantity}
                    errorHookForm={errors.quantity}
                    register={register("quantity", {required: "A quantidade é obrigatória"})}
                    type="number"
                    id="quantity"
                    placeholder="Quantidade de produtos disponíveis**"
                  />
                  <CustomInput
                    errorZod={errorZod.department}
                    errorHookForm={errors.department}
                    type="text"
                    id="department"
                    placeholder="Departamento**"
                    name="department_product"
                    list="departments-list"
                    value={department}
                    onChange={(e) => {
                        setDepartment(e.target.value as Department)
                        setSubcategory("");
                    }}
                  />
                  <datalist id="departments-list">
                    {Object.keys(departmentsData).map((dept) => (
                      <option key={dept} value={dept}/>
                    ))}
                  </datalist>
                  <CustomInput
                    errorZod={errorZod.subcategory}
                    errorHookForm={errors.subcategory}
                    type="text"
                    id="subcategory"
                    placeholder="Subcategoria**"
                    name="subcategory_product"
                    list="subcategories-list"
                    value={subcategory}
                    onChange={(e) => {
                        setSubcategory(e.target.value as Subcategory);
                    }}
                    disabled={!department}
                  />
                  <datalist id="subcategories-list">
                    {department && departmentsData[department as Department]?.subcategories.map((sub) => (
                      <option key={sub.id} value={sub.slug}>
                        {sub.name}
                      </option>
                    ))}
                  </datalist>
                  <CustomInput
                    errorZod={errorZod.tags}
                  >
                    <AddTags tags={tags} setTags={setTags}/>
                  </CustomInput>
                  <CustomInput
                    errorZod={errorZod.images}
                  >
                    <ImageUploader images={productImages} setImages={setProductImages}/>
                  </CustomInput>
                  <CustomInput
                    errorZod={errorZod.variants}
                  >
                    <Variants savedVariants={variants} setSavedVariants={setVariants}/>
                  </CustomInput>
                  <CustomInput
                    errorZod={errorZod.main_informations}
                  >
                    <MainInformation savedMainInfo={mainInfo} setSavedMainInfo={setMainInfo}/>
                  </CustomInput>
      
                  <CustomInput
                    errorZod={errorZod.prev_price}
                    errorHookForm={errors.prev_price}
                    register={register("prev_price")}
                    type="number"
                    id="prev_price"
                    placeholder="Preço anterior do produto"
                    min={1}
                    step={0.01}
                  />
                  <CustomInput
                    errorZod={errorZod.descount}
                    errorHookForm={errors.descount}
                    register={register("descount")}
                    type="number"
                    id="descount"
                    placeholder="Desconto"
                    min={1}
                    max={100}
                  />
                  <CustomInput
                    errorZod={errorZod.price_in_card_store}
                    errorHookForm={errors.price_in_card_store}
                    register={register("price_in_card_store", {required: "Campo obrigatório"})}
                    type="number"
                    id="price_in_card_store"
                    placeholder="Preço no cartão da loja ou demais cartões**"
                    min={1}
                    step={0.01}
                  />
                  <CustomInput
                    errorZod={errorZod.price_part_in_card_store}
                    errorHookForm={errors.price_part_in_card_store}
                    register={register("price_part_in_card_store", {required: "Campo obrigatório"})}
                    type="number"
                    id="price_part_in_card_store"
                    placeholder="Preço total no cartão quando é parcelado**"
                    min={1}
                    step={0.01}
                  />
                  <CustomInput
                    errorZod={errorZod.price_pix}
                    errorHookForm={errors.price_pix}
                    register={register("price_pix", {required: "Campo obrigatório"})}
                    type="number"
                    id="price_pix"
                    placeholder="Preço no Pix**"
                    min={1}
                    step={0.01}
                  />
                  <CustomInput
                    errorZod={errorZod.descount_pix}
                    errorHookForm={errors.descount_pix}
                    register={register("descount_pix")}
                    type="number"
                    id="descount_pix"
                    placeholder="Desconto no Pix"
                    min={1}
                    max={100}
                  />
                  <CustomInput
                    errorZod={errorZod.specs}
                  >
                    <SpecsManager
                      specs={specs}
                      setSpecs={setSpecs}
                    />
                  </CustomInput>
                </Form>
              )}
            </div>
            {/* Opção: Atualizar Produto */}
            <div className="update_product">
              <h3 onClick={() => toggleTab("update")}>Atualizar produto <span>{activeTab === "update" ? <FaChevronUp /> : <FaChevronRight />}</span></h3>
            </div>
            {/* Opção: Remover Produto */}
            <div className="remove_product">
              <h3 onClick={() => toggleTab("remove")}>Remover produto <span>{activeTab === "remove" ? <FaChevronUp /> : <FaChevronRight />}</span></h3>
            </div>
          </div>
        </section>
        {/* SEÇÃO 2: Análise e Dados da Loja */}
        <section className="performance_analysis">
          <h2><FaChartBar style={{verticalAlign: "middle"}} /> Análise de Desempenho</h2>
      
          <div>
            {/* Opção: Relatórios */}
            <article>
              <p>Visualizar métricas de vendas, faturamento e produtos mais vendidos.</p>
              <MdBarChart size={80}/>
              <p>Sem Dados Disponíveis</p>
            </article>
          </div>
        </section>
      </main>
    </>
  );
};

export default Admin;

// opções:

//3 - adicionar produto de acordo com essa ficha:
//      - brand/marca: icon jsx X
//      - rating/nota média das avaliações: começa com 0 por padrão
//      - numberRating/número de avaliações do produto: começa com 0
//      - compositionRating/composição da nota em cada nível do 1 a 5 estrelas

//    - img: array de imagens X
//    - name/nome: nome do produto X
//    - code/código do produto X
//    - variations/variações: {"category/categoria, options/opções[]"} X
//    - mainInformations/informações de conteúdo: {"id, title/titulo, information/informação"} X
//    - texts/textos: {"category/categoria, title/título, text/texto, imgLg/imagem para background, imgSm/imagem pequena"} X Pausado por enquanto
//    - typeDelivery/tipo de entrega X
//    - prevPrice/preço anterior X
//    - descount/desconto X
//    - priceInCardStore/preço no cartão da loja X
//    - priceInPartCardStore/ preço total no cartão da loja quando é parcelado X
//    - discountPix/desconto no pix X
//    - pricePix/preço no pix X
//    - stock/em estoque: valor booleano de acordo com a quantidade em estoque X
//    - specs/especificações ou ficha técnica do produto X
//    - reviewComments/comentários de avaliação: {"id, name/nome, date/data, verified/se o usuário é verificado na loja ou cliente, rating/avaliação em estrelas, comment/comentário"}
