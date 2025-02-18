from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Product , Category , OrderProduct , ShippingAddress , Payment , Order , FeaturedManufacturer , Compatibility , Invoice , Review , ProductPriceHistory
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','email', "password"]
        extra_kwargs = {
            'password': {'write_only': True}  # Ensure password is write-only not appear in other Serializer that use UserSerializer
        }
    
    #@override create method to hashed the password
    def create(self,validated_data):
        password = validated_data.pop('password',None)
        instance = self.Meta.model(**validated_data)
        if password is not None :
            instance.set_password(password)
        instance.save()
        return instance   


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    '''This custom serializer for return user data when obtain tokens (refresh and access)'''
    def validate(self, attrs):
        # Get the validated data (tokens)
        data = super().validate(attrs)
        # Add user info to the response
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            # Add more fields if needed
        }
        return data


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeaturedManufacturer
        fields = "__all__"
        
class CompatiabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Compatibility
        fields = "__all__"
       
class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Review
        fields = "__all__"
         
class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer() # Nested category serializer to get category details
    brand = BrandSerializer() # Nested brand serializer to get brand details
    compatibility = CompatiabilitySerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True)
    class Meta:
        model = Product
        fields= '__all__'
        

class OrderProductSerializer(serializers.ModelSerializer):
    product = ProductSerializer()  # Nested product serializer to get product details
    class Meta:
        model = OrderProduct
        fields = '__all__'
    
class ShippingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = ShippingAddress
        fields= '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ["payment_method", "payment_status" , "total", "created_at"]
        
class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = "__all__"
        
class OrderSerializer(serializers.ModelSerializer):
    payment = PaymentSerializer()
    invoice = InvoiceSerializer(read_only=True)
    items = OrderProductSerializer(many=True)
    class Meta:
        model = Order
        fields = "__all__"
        
class ProductPriceHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductPriceHistory
        fields = ['changed_at','new_price']