from django.contrib import admin
from CategoriaProducto.models import CategoriaProducto,Proveedor, Producto, Venta, Compra, detalleVenta, detalleCompra, Usuario, Rol
# Register your models here.

admin.site.register(CategoriaProducto)
admin.site.register(Proveedor)
admin.site.register(Producto)
admin.site.register(Venta)
admin.site.register(Compra)
admin.site.register(detalleVenta)
admin.site.register(detalleCompra)
admin.site.register(Usuario)
admin.site.register(Rol)