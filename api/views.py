from django.shortcuts import get_object_or_404, render

# Create your views here.
from django.contrib.auth.models import User

from api.paginations import StandardResultsSetPagination
from .serializers import CustomTokenObtainPairSerializer, ProductSerializer , CategorySerializer , ShippingSerializer , OrderProductSerializer , UserSerializer, OrderSerializer , BrandSerializer , ReviewSerializer
from .models import Product , Category , Order ,  OrderProduct , ShippingAddress , Invoice , FeaturedManufacturer ,  generate_unique_invoice_number , Review

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets  , status
from rest_framework.authentication import TokenAuthentication
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated , AllowAny
from rest_framework_simplejwt.tokens import AccessToken , RefreshToken
from django.contrib.auth.models import User  # Replace this with your custom User model if applicable
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


def order_invoice_test(request):
    # Get the order object from the request
    order = Order.objects.filter(status__iexact='completed').last()
    return render(request , template_name='invoice.html',context={'order':order})
    
def get_user_from_token(token):
    """Helper method to extract and validate user from token."""
    try:
        # Decode the token
        access_token = AccessToken(token)
        user_id = access_token['user_id']
        
        # Fetch the user object
        user = User.objects.get(id=user_id)
        return user
    except Exception as e:
        print(f"Error: {e}")
        return None
    

class CustomTokenObtainPairView(TokenObtainPairView):    
    serializer_class = CustomTokenObtainPairSerializer
    
class SignupView(APIView):
    permission_classes = (AllowAny,)     
    def post(self,request):
      serializer = UserSerializer(data=request.data)
      if serializer.is_valid():
        # Save the user
        user = serializer.save()
        # Generate token for the new user
        token_serializer = TokenObtainPairSerializer(data={
            "username": user.username, 
            "password": request.data.get("password")  # Assuming password is in the request
        })
        if token_serializer.is_valid():
            tokens = token_serializer.validated_data
            return Response(tokens, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": ""}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class LogoutView(APIView):     
   permission_classes = (IsAuthenticated,)     
   def post(self, request):
    try:               
        refresh_token = request.data["refresh_token"]     
        token = RefreshToken(refresh_token)               
        token.blacklist()              
        return Response(status=status.HTTP_205_RESET_CONTENT)          
    except Exception as e:               
        return Response({"error": e},status=status.HTTP_400_BAD_REQUEST)


class CategoryView(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
class BrandView(viewsets.ModelViewSet):
    queryset = FeaturedManufacturer.objects.all()
    serializer_class = BrandSerializer

class ProductView(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    # Specify the lookup field as 'slug'
    lookup_field = 'slug'
    pagination_class =  StandardResultsSetPagination
    
      
        
class CartView(APIView):
    """
    API view to handle adding products to the cart.
    - Requires token authentication.
    - Validates product quantity against available stock.
    """
    authentication_classes = [TokenAuthentication]
    def post(self, request, pk):
        try:
            # Extract token from Authorization header
            auth_header = request.headers.get('Authorization')
            if not auth_header or ' ' not in auth_header:
                raise ValidationError("Authorization header is missing or malformed.")
            token = auth_header.split(' ')[1]

            # Verify the token and get the user
            user = get_user_from_token(token)
            if not user:
                raise ValidationError("Invalid or expired token.")

            # Get the product
            product = get_object_or_404(Product, id=pk)

            # Validate item quantity from the request body
            product_quantity = int(request.data.get("itemQty", 1))
            if not isinstance(product_quantity, int) or product_quantity <= 0:
                return Response({"error": "Invalid item quantity."}, status=status.HTTP_400_BAD_REQUEST)

            # Check if requested quantity exceeds available stock
            if product_quantity > product.quantity:
                return Response({"error": f"Requested quantity ({product_quantity}) exceeds available stock ({product.quantity})."},
                                status=status.HTTP_400_BAD_REQUEST)

            # Get or create a pending order for the user
            order, _ = Order.objects.get_or_create(user=user, status='pending')

            # Check if the product is already in the order
            order_product, created = OrderProduct.objects.get_or_create(order=order, product=product)

            # Update item quantity in the order
            order_product.quantity = product_quantity
            order_product.save()

            return Response({
                "success": "Item added successfully",
                "cart_total": sum(item.product.price * item.quantity for item in order.items.all()),
            }, status=status.HTTP_201_CREATED)

        except ObjectDoesNotExist as e:
            # Handle case where Product or other object does not exist
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)

        except ValidationError as e:
            # Handle validation errors, e.g., invalid token
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # Catch-all for any other exceptions
            return Response({"error": "Something went wrong", "details": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)     
    ''' Display cart for specific user (GET method) '''
    def get(self, request):
        try:
            auth_header = request.headers.get('Authorization')
            if not auth_header or ' ' not in auth_header:
                raise ValidationError("Authorization header is missing or malformed.")
            
            token = auth_header.split(' ')[1]
            user = get_user_from_token(token)
            if not user:
                raise ValidationError("Invalid or expired token.")
            
            # Prefetch product data
            order = Order.objects.prefetch_related('items__product').filter(
                user=user, status__iexact='Pending'
            ).first()
            
            if not order:
                return Response({"error": "No pending order found."}, status=status.HTTP_404_NOT_FOUND)
            
            order_products = order.items.all()
            serializer = OrderProductSerializer(order_products, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "Something went wrong", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        
    ''' Delete item from cart which pk is product.id '''
    def delete(self, request, pk):
        try:
            # Extract token from Authorization header
            auth_header = request.headers.get('Authorization')
            if not auth_header or ' ' not in auth_header:
                raise ValidationError("Authorization header is missing or malformed.")
            
            token = auth_header.split(' ')[1]
            
            # Get user from token
            user = get_user_from_token(token)
            if not user:
                raise ValidationError("Invalid or expired token.")
            
            # Retrieve product by ID
            try:
                product = Product.objects.get(id=pk)
            except Product.DoesNotExist:
                return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

            # Check if the user has a pending order
            order = Order.objects.get(user=user, status__iexact='Pending')
            print(order)
            if not order:
                return Response({"message": "No items in cart"}, status=status.HTTP_200_OK)
            
            # Check if the product exists in the order
            try:
                order_product = OrderProduct.objects.get(order=order, product=product)
                # Optionally, restore product quantity if needed
                # product.quantity += order_product.quantity
                # product.save()
                order_product.delete()
                return Response({"message": "Product has been deleted from the cart successfully"}, status=status.HTTP_200_OK)
            except OrderProduct.DoesNotExist:
                return Response({"error": "Product not found in cart"}, status=status.HTTP_404_NOT_FOUND)

        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({"error": "Could not delete product from cart", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ShippingAddressView(APIView):
    authentication_classes = [TokenAuthentication]
    ''' Display Shipping Address for specific user (GET method) '''
    def get(self, request):
        try:
            # Extract token from Authorization header
            auth_header = request.headers.get('Authorization')
            if not auth_header or ' ' not in auth_header:
                raise ValidationError("Authorization header is missing or malformed.")
            
            token = auth_header.split(' ')[1]

            # Get user from token
            user = get_user_from_token(token)
            if not user:
                raise ValidationError("Invalid or expired token.")
            
            # Check if the user has a Shipping Address
            Shipping = ShippingAddress.objects.filter(user=user).first()
            
            # If no order exists, return an empty response
            if not Shipping:
                return Response({"message": "No Shipping Address Found"}, status=status.HTTP_404_NOT_FOUND)
            
            # Serialize the order products
            serializer = ShippingSerializer(Shipping)

            return Response(serializer.data)
        
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({"error": "Could not retrieve cart", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    ''' Create & Update New Shipping Address '''
    def post(self, request):
        try:
            # Extract token from Authorization header
            auth_header = request.headers.get('Authorization')
            if not auth_header or ' ' not in auth_header:
                raise ValidationError("Authorization header is missing or malformed.")

            token = auth_header.split(' ')[1]

            # Get user from token
            user = get_user_from_token(token)
            if not user:
                raise ValidationError("Invalid or expired token.")

            # Extract data from request
            data = {
                "email": request.data.get("email"),
                "phone": request.data.get("phone"),
                "country": request.data.get("country"),
                "address": request.data.get("address"),
                "state": request.data.get("state"),
                "area": request.data.get("area"),
            }
            
            # Validate the input data
            serializer = ShippingSerializer(data=data)
            serializer.is_valid(raise_exception=True)

            # Check if the user already has a shipping address
            try:
                shipping_address = ShippingAddress.objects.get(user=user)
                # Update existing shipping address
                serializer = ShippingSerializer(instance=shipping_address, data=data, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save(user=user)
                return Response({"message": "Shipping Address Updated", "data": serializer.data}, status=status.HTTP_200_OK)

            except ShippingAddress.DoesNotExist:
                # Create a new shipping address
                serializer.save(user=user)
                return Response({"message": "Shipping Address Created", "data": serializer.data}, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "Something went wrong", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class OrderView(APIView):
    """
    View to handle Orders
    """
    def post(self, request):
        try:
            auth_header = request.headers.get('Authorization')
            if not auth_header or ' ' not in auth_header:
                raise ValidationError("Authorization header is missing or malformed.")
            token = auth_header.split(' ')[1]
            user = get_user_from_token(token)
            if not user:
                raise ValidationError("Invalid or expired token.")
            
            order = Order.objects.prefetch_related('items__product').filter(
                user=user, status__iexact='Pending'
            ).last()
            
            if order:
                items = order.items.all()
                for item in items:
                    item.product.quantity -= item.quantity
                    item.product.save()
                order.status = 'completed'
                order.save()
                Invoice.objects.create(invoice_number=generate_unique_invoice_number(), order=order)
                return Response({"message": "Order Completed"}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Order Not Found"}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "Something went wrong", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def get(self,request):
        try:
            # Extract token from Authorization header
            auth_header = request.headers.get('Authorization')
            if not auth_header or ' ' not in auth_header:
                raise ValidationError("Authorization header is missing or malformed.")
            token = auth_header.split(' ')[1]
            
            # Verify the token and get the user
            user = get_user_from_token(token)
            if not user:
                raise ValidationError("Invalid or expired token.")
          
            # Optimize by prefetching related data
            orders = Order.objects.filter(user=user).prefetch_related(
                'items__product'
            ).select_related('user')
            if orders.exists():
                serializer = OrderSerializer(orders, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({"error": "Could not confirm your order", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class ReviewView(APIView):
    """
    View to handle reviews for a product.
    """
    authentication_classes = [TokenAuthentication]
    def post(self, request, pk):
        try:
            # Extract token from Authorization header
            auth_header = request.headers.get('Authorization')
            if not auth_header or ' ' not in auth_header:
                raise ValidationError("Authorization header is missing or malformed.")
            token = auth_header.split(' ')[1]

            # Verify the token and get the user
            user = get_user_from_token(token)
            if not user:
                raise ValidationError("Invalid or expired token.")
            rating = int(request.data.get('rating'))
            comment = request.data.get('comment')
            product_id = pk
            if rating < 1 or rating > 5:
                raise ValidationError("Invalid rating. Please enter a rating between 1 and 5.")
            if not comment:
                raise ValidationError("Comment is required.")
            product = Product.objects.get(id=product_id)
            
            review , created = Review.objects.get_or_create(user=user, product=product, rating=rating, review=comment)
            if not created:
                raise ValidationError("You have already reviewed this product.")
            serializer = ReviewSerializer(review)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except ObjectDoesNotExist as e:
            # Handle case where object or other object does not exist
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)

        except ValidationError as e:
            # Handle validation errors, e.g., invalid token
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # Catch-all for any other exceptions
            return Response({"error": "Something went wrong", "details": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)     