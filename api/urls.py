
from django.urls import path , include
from . import views
from . import payments
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt import views as jwt_views

routers = DefaultRouter()

routers.register('products', views.ProductView)
routers.register('categories', views.CategoryView)
routers.register('brands', views.BrandView)



urlpatterns = [
    path("viewset/", include(routers.urls) ),
    path('token/', views.CustomTokenObtainPairView.as_view(), name ='token_obtain_pair'), # login
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name ='token_refresh'),
    path('token/verify/', jwt_views.TokenVerifyView.as_view(), name ='token_verify'),
    path('signup/', views.SignupView.as_view(), name ='signup'),
    path('logout/', views.LogoutView.as_view(), name ='logout'), # By using Postman we can hit this URL with POST request and pass the access token in authorization in header and refresh token in body.
    
    path('cart/',views.CartView.as_view(), name='orderproduct' ),
    path('cart/product/add/<int:pk>/',views.CartView.as_view(), name='order_product_add' ),
    path('cart/product/delete/<int:pk>/',views.CartView.as_view(), name='order_product_delete' ),
    
    path('reviews/add/<int:pk>/',views.ReviewView.as_view(), name='review_add' ),
    
    path('shipping-address/',views.ShippingAddressView.as_view(), name='shipping_address' ),
    path('order/<str:action>/', views.OrderView.as_view(), name='order_action'),
    path('orders/', views.OrderView.as_view(), name='orders'),
    path('payment/order/', payments.PaymentAPIView.as_view(), name='create_payment'),
    path('execute-payment/', payments.ExecutePaymentAPIView.as_view(), name='execute_payment'),


    
]
