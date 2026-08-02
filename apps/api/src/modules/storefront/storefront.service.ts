import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { ProductosService } from '../catalog/productos/productos.service';
import { CategoriasService } from '../catalog/categorias/categorias.service';
import { CarritosService } from '../sales/carritos/carritos.service';
import { PedidosService } from '../sales/pedidos/pedidos.service';
import { ClientesService } from '../crm/clientes/clientes.service';
import { QueryStorefrontProductosDto } from './dto/query-storefront-productos.dto';
import { AddCarritoItemDto } from './dto/add-carrito-item.dto';
import { UpdateCarritoItemStorefrontDto } from './dto/update-carrito-item.dto';
import { CheckoutStorefrontDto } from './dto/checkout.dto';

/**
 * Todas las rutas acá son públicas (sin JWT): el "tenant" se resuelve por
 * slug en la URL en vez de por el token. El carrito de un visitante
 * anónimo se ata a un Cliente placeholder (telefono = "web:<sessionId>",
 * mismo patrón que usan los webhooks de WhatsApp/Instagram para guardar un
 * identificador opaco por canal) hasta que hace checkout con datos reales.
 */
@Injectable()
export class StorefrontService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productosService: ProductosService,
    private readonly categoriasService: CategoriasService,
    private readonly carritosService: CarritosService,
    private readonly pedidosService: PedidosService,
    private readonly clientesService: ClientesService,
  ) {}

  async resolverEmpresa(slug: string) {
    const empresa = await this.prisma.empresa.findUnique({ where: { slug } });
    if (!empresa || empresa.estado !== 'ACTIVO') {
      throw new NotFoundException('Tienda no encontrada');
    }
    return empresa;
  }

  async obtenerInfo(slug: string) {
    const empresa = await this.resolverEmpresa(slug);
    return {
      nombre: empresa.nombre,
      logoUrl: empresa.logoUrl,
      moneda: empresa.moneda,
      rubro: empresa.rubro,
    };
  }

  async listarProductos(slug: string, query: QueryStorefrontProductosDto) {
    const empresa = await this.resolverEmpresa(slug);
    return this.productosService.listar(empresa.id, { ...query, estado: 'ACTIVO' });
  }

  async obtenerProducto(slug: string, productoId: string) {
    const empresa = await this.resolverEmpresa(slug);
    const producto = await this.productosService.obtener(empresa.id, productoId);
    if (producto.estado !== 'ACTIVO') {
      throw new NotFoundException('Producto no encontrado');
    }
    return producto;
  }

  async listarCategorias(slug: string) {
    const empresa = await this.resolverEmpresa(slug);
    return this.categoriasService.listar(empresa.id);
  }

  async obtenerCarrito(slug: string, sessionId: string) {
    const empresa = await this.resolverEmpresa(slug);
    const cliente = await this.obtenerOCrearClienteAnonimo(empresa.id, sessionId);
    return this.carritosService.obtenerActivoOCrear(empresa.id, cliente.id);
  }

  async agregarItem(slug: string, dto: AddCarritoItemDto) {
    const empresa = await this.resolverEmpresa(slug);
    const cliente = await this.obtenerOCrearClienteAnonimo(empresa.id, dto.sessionId);
    const carrito = await this.carritosService.obtenerActivoOCrear(empresa.id, cliente.id);
    return this.carritosService.agregarItem(empresa.id, carrito.id, {
      varianteId: dto.varianteId,
      cantidad: dto.cantidad,
    });
  }

  async actualizarItem(
    slug: string,
    itemId: string,
    dto: UpdateCarritoItemStorefrontDto,
  ) {
    const empresa = await this.resolverEmpresa(slug);
    const carritoId = await this.verificarItemDeSesion(empresa.id, dto.sessionId, itemId);
    return this.carritosService.actualizarItem(empresa.id, carritoId, itemId, {
      cantidad: dto.cantidad,
    });
  }

  async eliminarItem(slug: string, itemId: string, sessionId: string) {
    const empresa = await this.resolverEmpresa(slug);
    const carritoId = await this.verificarItemDeSesion(empresa.id, sessionId, itemId);
    return this.carritosService.eliminarItem(empresa.id, carritoId, itemId);
  }

  async checkout(slug: string, dto: CheckoutStorefrontDto) {
    const empresa = await this.resolverEmpresa(slug);
    const clienteAnonimo = await this.obtenerOCrearClienteAnonimo(empresa.id, dto.sessionId);

    let clienteFinal = await this.prisma.cliente.findFirst({
      where: { empresaId: empresa.id, telefono: dto.telefono, deletedAt: null },
    });

    if (!clienteFinal) {
      clienteFinal = await this.prisma.cliente.update({
        where: { id: clienteAnonimo.id },
        data: {
          telefono: dto.telefono,
          nombre: dto.nombre,
          email: dto.email,
          canalOrigen: 'WEB',
        },
      });
    } else if (clienteFinal.id !== clienteAnonimo.id) {
      // Cliente recurrente: el carrito anónimo de esta sesión pasa a ser
      // el carrito de su cuenta ya conocida (misma lógica de merge que
      // haría un e-commerce real al reconocer un teléfono existente).
      await this.prisma.carrito.updateMany({
        where: { clienteId: clienteAnonimo.id, estado: 'ACTIVO' },
        data: { clienteId: clienteFinal.id },
      });
    }

    const carrito = await this.prisma.carrito.findFirst({
      where: { clienteId: clienteFinal.id, estado: 'ACTIVO' },
    });

    if (!carrito) {
      throw new ConflictException('El carrito está vacío');
    }

    let direccionId: string | undefined;
    if (dto.direccion) {
      const direccion = await this.clientesService.agregarDireccion(empresa.id, clienteFinal.id, {
        ...dto.direccion,
        esPrincipal: true,
      });
      direccionId = direccion.id;
    }

    return this.pedidosService.crearDesdeCarrito(empresa.id, {
      carritoId: carrito.id,
      direccionId,
    });
  }

  async estadoPedido(slug: string, numeroPedido: string, contacto: string) {
    const empresa = await this.resolverEmpresa(slug);

    const pedido = await this.prisma.pedido.findFirst({
      where: { empresaId: empresa.id, numeroPedido },
      include: {
        cliente: { select: { telefono: true, email: true } },
        estados: { orderBy: { createdAt: 'desc' } },
        seguimiento: true,
      },
    });

    // Mismo mensaje si no existe o si el contacto no coincide: no
    // confirmamos por enumeración si un número de pedido es válido o no.
    const coincide =
      pedido && (pedido.cliente.telefono === contacto || pedido.cliente.email === contacto);

    if (!coincide) {
      throw new NotFoundException('Pedido no encontrado');
    }

    return {
      numeroPedido: pedido.numeroPedido,
      estadoActual: pedido.estados[0]?.estado ?? null,
      historial: pedido.estados,
      seguimiento: pedido.seguimiento,
      total: pedido.total,
    };
  }

  private async obtenerOCrearClienteAnonimo(empresaId: string, sessionId: string) {
    const telefonoAnonimo = `web:${sessionId}`;
    const existente = await this.prisma.cliente.findFirst({
      where: { empresaId, telefono: telefonoAnonimo },
    });
    if (existente) return existente;

    return this.prisma.cliente.create({
      data: { empresaId, telefono: telefonoAnonimo, canalOrigen: 'WEB' },
    });
  }

  private async verificarItemDeSesion(empresaId: string, sessionId: string, itemId: string) {
    const cliente = await this.obtenerOCrearClienteAnonimo(empresaId, sessionId);
    const item = await this.prisma.carritoItem.findFirst({
      where: { id: itemId, carrito: { clienteId: cliente.id } },
    });

    if (!item) {
      throw new NotFoundException('Item no encontrado en tu carrito');
    }

    return item.carritoId;
  }
}
