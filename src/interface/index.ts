// export interface StoreType {
//   tel_no: null | string;
//   cob_code_nm: string | null;
//   bizcnd_code_nm: string;
//   upso_nm: string;
//   x_cnts: string;
//   y_dnts: string;
//   rdn_code_nm: string;
//   crtfc_gbn_nm: string;
// }

export interface StoreType {
  id: number;
  phone?: string | null;
  address?: string | null;
  lat?: string | null;
  lng?: string | null;
  name?: string | null;
  category?: string | null;
  storeType?: string | null;
  foodCertifyName?: string | null;
}

export interface StoreApiResponse {
  data: StoreType[];
  totalPage?: number;
  totalCount?: number;
  page?: number;
}
