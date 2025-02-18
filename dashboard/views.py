from django.shortcuts import get_object_or_404
from api.models import Product , Order ,OrderProduct , Payment , ProductPriceHistory
from django.db.models import Sum, Count, F , Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from django.contrib.auth.models import User
from api.serializers import OrderSerializer , ProductPriceHistorySerializer
from api.views import get_user_from_token
from rest_framework.exceptions import ValidationError

class DashboardView(APIView):
    permission_classes = [IsAdminUser]
    def get(self, request):
        try:
            auth_header = request.headers.get('Authorization')
            if not auth_header or ' ' not in auth_header:
                raise ValidationError("Authorization header is missing or malformed.")
            
            token = auth_header.split(' ')[1]
            user = get_user_from_token(token)

            if not user:
                raise ValidationError("Invalid or expired token.")
            
            # Aggregate total price of all products in stock and count
            products = Product.objects.aggregate(
                total=Sum(F('price') * F('quantity')), 
                count=Count('id')
            )

            # Aggregate completed orders: total count and total revenue
            completed_order = Order.objects.filter(status='completed').aggregate(
                count=Count('id'),
                total_revenue=Sum(F('items__quantity') * F('items__product__price'))
            )

            # Get total number of orders efficiently
            orders_count = Order.objects.count()

            # Total users
            users_count = User.objects.count()
            
            # Recent Orders
            recent_orders = Order.objects.order_by('-id')[:5]
            
            # Aggregating total quantity sold per product
            sales_data = (
                OrderProduct.objects
                .values("product__name")
                .annotate(total_sold=Sum("quantity"))
                .order_by("-total_sold")
            )

            # Formatting response
            labels = [item["product__name"][0:25] for item in sales_data]
            total = [item["total_sold"] for item in sales_data]
            
            # Product Availability (in or out of stock)
            products_availability = Product.objects.aggregate(
                in_stock=Count('id', filter=Q(quantity__gt=0)),
                out_of_stock=Count('id', filter=Q(quantity=0))
            )
            # Payment Methods
            payment_methods = Payment.objects.aggregate(
                cod=Count('id', filter=Q(payment_method='cod')),
                paypal=Count('id', filter=Q(payment_method='paypal')),
            )

            # Order status
            order_status = Order.objects.aggregate(
                pending=Count('id', filter=Q(status='pending')),
                completed=Count('id', filter=Q(status='completed')),
                cancelled=Count('id', filter=Q(status='cancelled'))
            )

            # Prepare response data
            data = {
                'products_price': products.get('total', 0),  # Total price for products in stock
                'product_count': products.get('count', 0),
                'orders_count': orders_count,
                'completed_orders_count': completed_order.get('count', 0),
                'revenue': completed_order.get('total_revenue', 0) or 0,  # Total price for products in completed orders
                'users_count': users_count,
                'recent_orders': OrderSerializer(recent_orders, many=True).data,
                'sales':{'labels':labels , 'total':total},
                'payment_methods':payment_methods,
                'products_availability':products_availability,
                'order_status':order_status,
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as ex:
            return Response({"error": str(ex)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ProductsPriceHistoryView(APIView):
    permission_classes = [IsAdminUser]
    def get(self, request):
        try:
            auth_header = request.headers.get('Authorization')
            if not auth_header or ' ' not in auth_header:
                raise ValidationError("Authorization header is missing or malformed.")
            
            token = auth_header.split(' ')[1]
            user = get_user_from_token(token)

            if not user:
                raise ValidationError("Invalid or expired token.")
            
            # Products Price History
            products_price_history = ProductPriceHistory.objects.values('product__name','new_price','changed_at')
            # Convert datetime to string for JSON serialization
            history = {}
            for entry in products_price_history:
                product_name = entry["product__name"]
                if product_name not in history:
                    history[product_name] = {"dates": [], "prices": []}

                history[product_name]["dates"].append(entry["changed_at"].strftime("%Y-%m-%d"))  # Format date
                history[product_name]["prices"].append(float(entry["new_price"]))  # Ensure decimal is float
            data = {
                'products':Product.objects.all().values('id','name'),
                'products_price_history': history,
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as ex:
            return Response({"error": str(ex)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def post(self, request):
        """ get specific product history for specific product """
        try:
            auth_header = request.headers.get('Authorization')
            if not auth_header or ' ' not in auth_header:
                raise ValidationError("Authorization header is missing or malformed.")
            
            token = auth_header.split(' ')[1]
            user = get_user_from_token(token)

            if not user:
                raise ValidationError("Invalid or expired token.")
            
            # Access Product Id 
            id = request.data.get('id',None)
            
            product = get_object_or_404(Product, id=id)
            
            product_price_history = ProductPriceHistory.objects.filter(product=product)
            return Response(data = ProductPriceHistorySerializer(product_price_history,many=True).data, status=status.HTTP_200_OK)

        except Exception as ex:
            return Response({"error": str(ex)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            