from CategoriaProducto.models import CategoriaProducto,Proveedor, Producto, Venta, Compra, detalleVenta, detalleCompra, Usuario, Rol
from rest_framework import serializers

#Categoria Producto Serializer
class CategoriaProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaProducto
        fields = '__all__'  

#Proveedor Serializer
class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = '__all__'

#Producto Serializer
class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(
        source='categoria.nombre',
        read_only=True
    )

    proveedor_nombre = serializers.CharField(
        source='proveedor.nombre',
        read_only=True
    )

    class Meta:
        model = Producto
        fields = '__all__'

#Venta Serializer
class VentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venta
        fields = '__all__'

#Compra Serializer
class CompraSerializer(serializers.ModelSerializer):
    proveedor_nombre = serializers.CharField(
        source='proveedor.nombre',
        read_only=True
    )
    class Meta:
        model = Compra
        fields = '__all__'

#detalleVenta Serializer
class detalleVentaSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(
        source='producto.nombre',
        read_only=True
    )
    class Meta:
        model = detalleVenta
        fields = '__all__' 

#detalleCompra Serializer
class detalleCompraSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(
        source='producto.nombre',
        read_only=True
    )
    class Meta:
        model = detalleCompra
        fields = '__all__'

#Usuario Serializer
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'  

#Rol Serializer
class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'  