export interface Empresa {
  id: string;
  nombre: string;
  rubro: string | null;
}

export interface ConfiguracionIA {
  tono: string | null;
  reglasNegocioJson: { texto?: string } | null;
  horarioAtencionJson: { texto?: string } | null;
  condicionesHandoffJson: {
    pedirHumano?: boolean;
    quejaGrave?: boolean;
    montoMayorA?: number | null;
  } | null;
}
