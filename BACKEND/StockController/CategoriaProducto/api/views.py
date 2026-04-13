from rest_framework import viewsets
from CategoriaProducto.models import CategoriaProducto,Proveedor, Producto, Venta, Compra, detalleVenta, detalleCompra, Usuario, Rol
from .serializers import CategoriaProductoSerializer, ProveedorSerializer, ProductoSerializer, VentaSerializer, CompraSerializer, detalleVentaSerializer, detalleCompraSerializer, UsuarioSerializer, RolSerializer


#viewsets.ModelViewSet proporciona una implementación completa de las operaciones CRUD para el modelo CategoriaProducto.
#CategoriaProducto ViewSet
class CategoriaProductoViewSet(viewsets.ModelViewSet):
    queryset = CategoriaProducto.objects.all()
    serializer_class = CategoriaProductoSerializer

#Proveedor ViewSet
class ProveedorViewSet(viewsets.ModelViewSet):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer

#Producto ViewSet
class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

#venta ViewSet
class VentaViewSet(viewsets.ModelViewSet):
    queryset = Venta.objects.all()
    serializer_class = VentaSerializer

#Compra ViewSet
class CompraViewSet(viewsets.ModelViewSet):
    queryset = Compra.objects.all()
    serializer_class = CompraSerializer

#detalleVenta ViewSet
class detalleVentaViewSet(viewsets.ModelViewSet):
    queryset = detalleVenta.objects.all()
    serializer_class = detalleVentaSerializer

#detalleCompra ViewSet
class detalleCompraViewSet(viewsets.ModelViewSet):
    queryset = detalleCompra.objects.all()
    serializer_class = detalleCompraSerializer

#Usuario ViewSet
class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

#Rol ViewSet
class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer