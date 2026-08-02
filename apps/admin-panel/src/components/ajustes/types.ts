export interface EmpresaAjustes {
  id: string;
  nombre: string;
  slug: string;
  rubro: string | null;
  logoUrl: string | null;
  moneda: string;
  timezone: string;
  telefonoWhatsapp: string | null;
  instagramAccountId: string | null;
  shopifyShopDomain: string | null;
  shopifyConectado: boolean;
}

export type RolUsuario = 'OWNER' | 'ADMIN' | 'AGENTE';
export type EstadoUsuario = 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  estado: EstadoUsuario;
  ultimoLogin: string | null;
  rol: RolUsuario;
}
