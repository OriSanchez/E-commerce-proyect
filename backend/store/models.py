from django.conf import settings
from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, related_name='products', null=True)  # Asegúrate de que 'null=True' esté aquí.
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.name

class Cart(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # Aquí usamos AUTH_USER_MODEL
        on_delete=models.CASCADE,
        related_name='carts'
    )
    products = models.ManyToManyField(Product, through='CartItem')

    def __str__(self):
        return f"Carrito de {self.user.username}"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

class Order(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # Aquí usamos AUTH_USER_MODEL
        on_delete=models.CASCADE,
        related_name='orders'
    )
    total = models.DecimalField(max_digits=10, decimal_places=2)
    address = models.TextField()
    status = models.CharField(max_length=20, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Guarda el precio en el momento de la compra

    def __str__(self):
        return f"{self.quantity} x {self.product.name} (Orden {self.order.id})"


