/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";

import Search from "@/components/Search";
import "@/style/components/layout/pages/Cart/AddressBuy.css";

interface ViaCepResponse {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  estado?: string;
  uf: string;
  erro?: boolean;
}

interface IBGEStateResponse {
  id: number;
  nome: string;
  sigla: string;
  região: {
    id: number;
    nome: string;
    sigla: string;
  };
}

interface IBGECityResponse {
  id: number;
  nome: string;
  microrregiao: {
    id: number;
    nome: string;
    mesorregiao: {
      id: number;
      nome: string;
      uf: IBGEStateResponse;
    };
  };
}

export interface AddressData {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  state: string;
  city: string;
  reference?: string;
  nickname?: string;
}

interface AddressBuyProps {
  data: AddressData;
  updateFields: (data: Partial<AddressData>) => void;
}

const AddressBuy = ({data, updateFields}: AddressBuyProps) => {
  const [states, setStates] = useState<IBGEStateResponse[]>();
  const [cities, setCities] = useState<IBGECityResponse[]>();
  const [suggestionsStates, setSuggestionsStates] = useState<string[]>();
  const [suggestionsCities, setSuggestionsCities] = useState<string[]>();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const pesquisaCep = async (value: string) => {
    const cep = value.replace(/\D/g, ""); // Remove caracteres não numéricos

    updateFields({ cep: value });

    const validacep = /^[0-9]{8}$/; // Expressão regular para validar o CEP

    if (validacep.test(cep)) {
      try {
        setLoading(true); // Exibe "Carregando..." enquanto aguarda a resposta da API

        const { data } = await axios.get<ViaCepResponse>(
          `https://viacep.com.br/ws/${cep}/json/`,
          { withCredentials: false },
        );

        if (!data.erro) {
          updateFields({
            street: data.logradouro || "",
            neighborhood: data.bairro || "",
            city: data.localidade || "",
            state: data.estado || "",
            cep: value || "",
          });
          setLoading(false);
          setDisabled(true);
        }
      } catch (error) {
        console.error("Erro ao buscar o CEP:", error);
        setLoading(false);
        setDisabled(false);
      }
    } else {
      setLoading(false);
      setDisabled(false);
    }
  };

  const handleStateSuggestions = (search: string) => {
    if (search.length > 1 && states) {
      const termo = search.toLowerCase();

      const nameStartsWith = states.filter((s) => s.nome.toLowerCase().startsWith(termo));

      const nameIncludes = states.filter((s) => s.nome.toLowerCase().includes(termo) && !s.nome.toLowerCase().startsWith(termo));

      const result = [...nameStartsWith, ...nameIncludes].slice(0, 5).map((s) => s.nome);
      setSuggestionsStates(result);
    } else {
      setSuggestionsStates([]);
    }
  };

  const handleCitySuggestions = (search: string) => {
    if (search.length > 1 && data.state) {
      const termo = search.toLowerCase();

      if (states?.find((s) => s.nome === data.state)) {

        console.log("Cidades disponíveis para o estado selecionado: ", cities);

        const nameStartsWith = cities?.filter((c) => c.nome.toLowerCase().startsWith(termo));

        const nameIncludes = cities?.filter((c) => c.nome.toLowerCase().includes(termo) && !c.nome.toLowerCase().startsWith(termo));

        const result = [...nameStartsWith!, ...nameIncludes!].slice(0, 10).map((c) => c.nome);
        setSuggestionsCities(result);
      }
    } else {
      setSuggestionsCities([]);
    }
  }

  const getCitiesByState = async (uf: string) => {
    try {
      const { data } = await axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`, { withCredentials: false });

      console.log("Cidades retornadas pela API: ", data);
      
      const orderedCities = data.sort((a, b) => a.nome.localeCompare(b.nome));
      setCities(orderedCities);
    } catch (error) {
      console.error("Erro ao buscar as cidades: ", error);
    }
  }

  useEffect(() => {
    const getStates = async () => {
      try {
        const { data } = await axios.get<IBGEStateResponse[]>(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados`,
          { withCredentials: false },
        );

        const orderedStates = data.sort((a, b) => a.nome.localeCompare(b.nome));
        setStates(orderedStates);
      } catch (error) {
        console.error("Erro ao buscar os estados: ", error);
      }
    };

    getStates();
  }, []);

  return (
    <div className="form-address-buy">
      <input
        type="text"
        name="cep_user"
        placeholder="informe seu cep (Obrigatório)"
        id="cep"
        value={data.cep}
        size={10}
        maxLength={9}
        onChange={(e) => pesquisaCep(e.target.value)}
        required
      />

      <input
        type="text"
        name="street_user"
        id="street"
        placeholder={loading ? "Carregando..." : "informe sua rua (Obrigatório)"}
        size={60}
        value={data.street}
        onChange={(e) => updateFields({ street: e.target.value })}
        required
      />

      <input
        type="text"
        name="number_home"
        id="number"
        value={data.number}
        onChange={(e) => updateFields({ number: e.target.value })}
        placeholder="Informe o número da casa (Obrigatório)"
        required
      />

      <input
        type="text"
        name="complement_user"
        id="complement"
        value={data.complement}
        onChange={(e) => updateFields({ complement: e.target.value })}
        placeholder="complemento (casa, apartamento, etc..)"
      />

      <input
        type="text"
        name="neighborhood_user"
        id="neighborhood"
        size={40}
        placeholder={loading ? "Carregando..." : "Informe seu bairro (Obrigatório)"}
        value={data.neighborhood}
        onChange={(e) => updateFields({ neighborhood: e.target.value })}
        required
      />

      <Search
        name="state_user"
        id="state"
        text={loading ? "Carregando..." : "Informe o seu estado (Obrigatório)"}
        button={false}
        asForm={false}
        value={data.state}
        onSearchChange={(search) => {
          updateFields({ state: search });
          handleStateSuggestions(search);

          let uf = states?.find((s) => s.nome.toLowerCase() === search.toLowerCase())?.sigla;
          console.log("UF encontrada para o estado selecionado: ", uf);
          if (uf) {
            getCitiesByState(uf);
          }
        }}
        suggestions={suggestionsStates!}
        disabled={disabled}
        required
      />

      <Search
        name="city_user"
        id="city"
        text={loading ? "Carregando..." : "Informe a sua cidade (Obrigatório)"}
        button={false}
        asForm={false}
        value={data.city}
        onSearchChange={(search) => {
          updateFields({ city: search });
          handleCitySuggestions(search);
        }}
        suggestions={suggestionsCities!}
        disabled={disabled}
        required
      />

      <input
        type="text"
        name="reference_point"
        id="reference"
        size={40}
        value={data.reference}
        onChange={(e) => updateFields({ reference: e.target.value })}
        placeholder="Informe o ponto de referêcia (ex: próximo ao hospital)"
      />

      <input
        type="text"
        name="nickname_place"
        id="nickname"
        size={40}
        value={data.nickname}
        onChange={(e) => updateFields({ nickname: e.target.value })}
        placeholder="Salvar nome do lugar para as próximas compras (ex: casa, trabalho, casa dos pais...)"
      />
    </div>
  );
};

export default AddressBuy;
