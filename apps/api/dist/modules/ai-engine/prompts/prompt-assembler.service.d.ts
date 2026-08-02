import { AiMensaje } from '../providers/ai-provider.interface';
import { ContextoConversacion } from '../context/context-builder.service';
export declare class PromptAssemblerService {
    assemble(contexto: ContextoConversacion): AiMensaje[];
    private armarPromptSistema;
    private textoDeJson;
    private condicionesHandoff;
    private bloqueMemoriaCliente;
}
