from rest_framework import serializers
from .models import Category, Product, Cart, CartItem, Order

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'stock', 'category', 'image', 'created_at', 'updated_at']

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url  
        return None

class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_id = serializers.IntegerField(source="product.id")
    price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ['product_id', 'product_name', 'quantity', 'price']

class CartSerializer(serializers.ModelSerializer):
    cart_items = CartItemSerializer(source='cartitem_set', many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'cart_items']

    def update(self, instance, validated_data):
        cart_items_data = validated_data.pop('cartitem_set', [])
        for item_data in cart_items_data:
            product = item_data['product']
            quantity = item_data['quantity']
            # Actualiza o crea CartItem
            cart_item, created = CartItem.objects.update_or_create(
                cart=instance,
                product=product,
                defaults={'quantity': quantity}
            )
        return instance   
         
class OrderSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    products = CartItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'total', 'address', 'status', 'created_at', 'products']

