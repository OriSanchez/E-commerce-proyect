from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from .models import Category, Product, Cart, Order, CartItem, OrderItem
from .serializers import CategorySerializer, ProductSerializer, CartSerializer, OrderSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff  # Solo admins pueden acceder

class ProductDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def delete(self, request, pk):
        """Eliminar un producto del stock (solo admins)"""
        try:
            product = Product.objects.get(id=pk)
            product.delete()
            return Response({"message": "Producto eliminado correctamente"}, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({"error": "Producto no encontrado"}, status=status.HTTP_404_NOT_FOUND)

class CreateProductView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        """Crear un nuevo producto (solo admins)"""
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryList(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class ProductList(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]


@api_view(['GET'])
def get_products(request):
    category_id = request.GET.get('category')
    
    if category_id:
        productos = Product.objects.filter(category_id=category_id)
    else:
        productos = Product.objects.all()

    serializer = ProductSerializer(productos, many=True, context={'request': request})  
    return Response(serializer.data)



    

    serializer = ProductSerializer(productos, many=True)

    return Response(serializer.data)

class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Obtener el carrito del usuario autenticado"""
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def post(self, request):
        """Agregar un producto al carrito"""
        cart, created = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)

        if not product_id:
            return Response({"detail": "Product ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        cart_item.quantity += quantity
        cart_item.save()

        return Response({"message": "Product added to cart"}, status=status.HTTP_201_CREATED)

    def put(self, request):
        """Actualizar la cantidad de un producto en el carrito"""
        cart, created = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity')

        if not product_id or quantity is None:
            return Response({"detail": "Product ID and quantity are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart_item = CartItem.objects.get(cart=cart, product_id=product_id)
        except CartItem.DoesNotExist:
            return Response({"detail": "Product not found in cart"}, status=status.HTTP_404_NOT_FOUND)

        cart_item.quantity = quantity
        cart_item.save()

        return Response({"message": "Cart updated"}, status=status.HTTP_200_OK)

    def delete(self, request, product_id):
        """Eliminar un producto del carrito"""
        cart, created = Cart.objects.get_or_create(user=request.user)
        
        if not product_id:
            return Response({"detail": "Product ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart_item = CartItem.objects.get(cart=cart, product_id=product_id)
            cart_item.delete()
            return Response({"message": "Product removed from cart"}, status=status.HTTP_200_OK)
        except CartItem.DoesNotExist:
            return Response({"detail": "Product not found in cart"}, status=status.HTTP_404_NOT_FOUND)


class OrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Crear una orden a partir del carrito del usuario"""
        user = request.user
        cart, created = Cart.objects.get_or_create(user=user)

        if not cart.cartitem_set.exists():
            return Response({"error": "El carrito está vacío"}, status=status.HTTP_400_BAD_REQUEST)

        total = sum(item.product.price * item.quantity for item in cart.cartitem_set.all())

        order = Order.objects.create(
            user=user,
            total=total,
            address=request.data.get("address", ""),
            status="Pending"
        )

        # Crear los OrderItem en lugar de order.products.create(...)
        for item in cart.cartitem_set.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price  # Guardamos el precio en el momento de la compra
            )

        # Vaciar el carrito después de la compra
        cart.cartitem_set.all().delete()

        return Response({"message": "Orden creada con éxito", "order_id": order.id}, status=status.HTTP_201_CREATED)






