from rest_framework.routers import DefaultRouter
from .views import CategoriaProductoViewSet, ProveedorViewSet, ProductoViewSet, VentaViewSet, CompraViewSet, detalleVentaViewSet, detalleCompraViewSet, UsuarioViewSet, RolViewSet

# Creamos un enrutador para registrar nuestras vistas
router = DefaultRouter()

# Registramos las vistas en el enrutador
router.register(r'categorias', CategoriaProductoViewSet)
router.register(r'proveedores', ProveedorViewSet)
router.register(r'productos', ProductoViewSet)
router.register(r'ventas', VentaViewSet)
router.register(r'compras', CompraViewSet)
router.register(r'detalleVentas', detalleVentaViewSet)
router.register(r'detalleCompras', detalleCompraViewSet)
router.register(r'usuarios', UsuarioViewSet)
router.register(r'roles', RolViewSet)
urlpatterns = router.urls