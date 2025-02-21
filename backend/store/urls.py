from django.urls import path
from .views import CategoryList, ProductList, ProductDetailView, CartView, OrderView, CreateProductView, get_products

urlpatterns = [
    # path('products/', ProductList.as_view(), name='product-list'),
    path('products/', get_products, name='product-list'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('products/create/', CreateProductView.as_view(), name='product-create'),
    path('categories/', CategoryList.as_view(), name='category-list'),
    path('cart/', CartView.as_view(), name='cart'),
    path('cart/<int:product_id>/', CartView.as_view(), name='cart-detail'),
    path('order/', OrderView.as_view(), name='order'),
]


