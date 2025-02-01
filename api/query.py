from django.http import JsonResponse
from api.models import Product
from django.db import connection, reset_queries
# This Example show N+1 queries Problem

# def get_products(request):

#     reset_queries()  # Clear the query log

#     # Fetch all products
#     products = Product.objects.all()  # This is one query

#     # Access category for each product
#     product_data = [{'name': product.name, 'category': product.category.name} for product in products]  # N additional queries

#     num_queries = len(connection.queries)
#     print(f"Number of queries executed: {num_queries}")

#     return JsonResponse({'products': product_data, 'queries': num_queries})


def get_products(request):

    reset_queries()  # Clear the query log

    # Use select_related to fetch related data in a single query
    products = Product.objects.select_related('category').all()  # Single query

    # Access category for each product
    product_data = [{'name': product.name, 'category': product.category.name} for product in products]

    num_queries = len(connection.queries)
    print(f"Number of queries executed: {num_queries}")

    return JsonResponse({'products': product_data, 'queries': num_queries})

from .serializers import ProductSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import connection, reset_queries
class ProductListView(APIView):
    def get(self, request, *args, **kwargs):
        # Reset query log
        reset_queries()

        # Fetch data
        products = Product.objects.select_related('category').all()  # Example with optimization

        # Serialize data
        serializer = ProductSerializer(products, many=True)
        
        # Access category for each product
        product_data = [{'name': product.name, 'category': product.category.name} for product in products]

        # Count queries
        num_queries = len(connection.queries)
        print(f"Number of queries executed: {num_queries}")

        return Response({
            "queries": num_queries
        })
  