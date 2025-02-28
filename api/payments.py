from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import User
from .models import Payment, Order, ShippingAddress
from rest_framework.exceptions import ValidationError
from django.db import transaction
import paypalrestsdk
from .serializers import PaymentSerializer
from django.conf import settings
def get_user_from_token(token):
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


paypalrestsdk.configure({
    "mode": "sandbox",  # 'live' for production
    "client_id": settings.PAYPAL_CLIENT_ID,
    "client_secret": settings.PAYPAL_SECRET
})

class PaymentAPIView(APIView):
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        try:
            # Extract token from Authorization header
            auth_header = request.headers.get('Authorization')
            if not auth_header or ' ' not in auth_header:
                raise ValidationError("Authorization header is missing or malformed.")
            token = auth_header.split(' ')[1]
            
            user = get_user_from_token(token)
            if not user:
                raise ValidationError("Invalid or expired token.")

            payment_option = request.data.get("paymentOption")
            total = request.data.get("total")

            if payment_option == 'paypal':
                payment = paypalrestsdk.Payment({
                    "intent": "sale",
                    "payer": {"payment_method": "paypal"},
                    "transactions": [{
                        "amount": {
                            "total": total,
                            "currency": "USD"
                        },
                        "description": "Payment for your order"
                    }],
                    "redirect_urls": {
                        "return_url": "http://localhost:3000/payment/success",
                        "cancel_url": "http://localhost:3000/payment/cancel"
                    }
                })

                if payment.create():
                    approval_url = next(
                        link['href'] for link in payment['links'] if link['rel'] == 'approval_url'
                    )
                    print("PAYMENT ID" , payment.id)
                    with transaction.atomic():
                        payment_pypl = Payment.objects.create(
                            user=user,
                            payment_method="paypal",
                            payment_status="pending",
                            payment_reference=payment.id,
                            total=total
                        )
                        shipping_address = ShippingAddress.objects.filter(user=user).first()
                        if not shipping_address:
                            raise ValidationError("No shipping address found for the user.")
                        order = Order.objects.get(user=user, status__iexact='pending')
                        order.payment = payment_pypl
                        order.address = shipping_address
                        order.save()
                        return Response({"approval_url": approval_url}, status=status.HTTP_201_CREATED)
                return Response({"error": payment.error}, status=status.HTTP_400_BAD_REQUEST)

            elif payment_option == 'cod':
                with transaction.atomic():
                    payment = Payment.objects.create(
                        user=user,
                        payment_method="cod",
                        payment_status="pending",
                        total=total
                    )
                    shipping_address = ShippingAddress.objects.filter(user=user).first()
                    if not shipping_address:
                        raise ValidationError("No shipping address found for the user.")
                    order = Order.objects.get(user=user, status__iexact='pending')
                    order.payment = payment
                    order.address = shipping_address
                    order.save()
                    return Response({"message": "Order placed successfully with COD."}, status=status.HTTP_201_CREATED)
            return Response({"error": "Invalid payment option."}, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as ve:
            return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "An unexpected error occurred.", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def get(self, request):
        try:
            # Extract token from Authorization header
            auth_header = request.headers.get('Authorization')
            if not auth_header or ' ' not in auth_header:
                raise ValidationError("Authorization header is missing or malformed.")
            token = auth_header.split(' ')[1]
            
            user = get_user_from_token(token)
            if not user:
                raise ValidationError("Invalid or expired token.")

            order = Order.objects.filter(user=user, status__iexact="pending").first()
            if not order:
                return Response({"error": "Pending order not found."}, status=status.HTTP_404_NOT_FOUND)

            if order.payment:
                payment_status = order.payment.payment_status or 'pending'
                serializer = PaymentSerializer(order.payment)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({'error':'no payment exist for this order'}, status=status.HTTP_200_OK)

        except ValidationError as ve:
            return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "An unexpected error occurred.", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ExecutePaymentAPIView(APIView):
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        try:
            # Extract token from Authorization header
            auth_header = request.headers.get('Authorization')
            if not auth_header or ' ' not in auth_header:
                raise ValidationError("Authorization header is missing or malformed.")
            token = auth_header.split(' ')[1]
            
            user = get_user_from_token(token)
            if not user:
                raise ValidationError("Invalid or expired token.")

            payment_id = request.data.get("paymentId")
            payer_id = request.data.get("PayerID")
            ref_number = request.data.get("token")
            
            if not payment_id or not payer_id:
                return Response({"error": "Missing paymentId or PayerID"}, status=status.HTTP_400_BAD_REQUEST)

            payment = paypalrestsdk.Payment.find(payment_id)
            print("Payment Details:", payment) #ex Payment Details: {'id': 'PAYID-M5WHDBA9WN44858B40174708', 'intent': 'sale', 'state': 'created', 'cart': '9N710349GA2095255', 'payer': {'payment_method': 'paypal', 'status': 'VERIFIED', 'payer_info': {'email': 'fcaisssads@gmail.com', 'first_name': 'FCAI', 'last_name': 'Ahmed', 'payer_id': 'Q4XS79BK8K8WS', 'shipping_address': {'recipient_name': 'FCAI Ahmed', 'line1': '1 Main St', 'city': 'San Jose', 'state': 'CA', 'postal_code': '95131', 'country_code': 'US'}, 'country_code': 'US'}}, 'transactions': [{'amount': {'total': '20000.00', 'currency': 'USD'}, 'payee': {'merchant_id': 'YLZ2Z5HKCN6P2', 'email': 'sb-nnzul20899238@business.example.com'}, 'description': 'Payment for your order', 'item_list': {'shipping_address': {'recipient_name': 'FCAI Ahmed', 'line1': '1 Main St', 'city': 'San Jose', 'state': 'CA', 'postal_code': '95131', 'country_code': 'US'}}, 'related_resources': []}], 'redirect_urls': {'return_url': 'http://localhost:3000/payment/success?paymentId=PAYID-M5WHDBA9WN44858B40174708', 'cancel_url': 'http://localhost:3000/payment/cancel'}, 'create_time': '2024-12-25T20:56:35Z', 'update_time': '2024-12-25T20:58:20Z', 'links': [{'href': 'https://api.sandbox.paypal.com/v1/payments/payment/PAYID-M5WHDBA9WN44858B40174708', 'rel': 'self', 'method': 'GET'}, {'href': 'https://api.sandbox.paypal.com/v1/payments/payment/PAYID-M5WHDBA9WN44858B40174708/execute', 'rel': 'execute', 'method': 'POST'}, {'href': 'https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-9N710349GA2095255', 'rel': 'approval_url', 'method': 'REDIRECT'}]}

            # Check if a pending order exists and retrieve it
            order = Order.objects.filter(user=user, status__iexact='pending').first()
            if order:
                order.status = 'completed'
                order.save()

                # Check if a payment exists for the user with the given payment_id
                payment_pypl = Payment.objects.filter(user=user, payment_reference=payment_id).first()
                if payment_pypl:
                    payment_pypl.payment_reference = ref_number

                    # Attempt to execute the payment
                    if payment.execute({"payer_id": payer_id}):
                        payment_pypl.payment_status = 'completed'
                        payment_pypl.save()
                        return Response({"status": "success"}, status=status.HTTP_200_OK)
                    else:
                        payment_pypl.payment_status = 'failed'
                        payment_pypl.save()
                        print("PayPal Payment Execution Error:", payment.error)
                        return Response({"error": payment.error}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({"error": "Payment not found"}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

        
# {
#     'intent': 'sale', 
#     'payer': {
#         'payment_method': 'paypal'
#     }, 
#     'transactions': [
#         {
#             'amount': {
#                 'total': '20000.00', 
#                 'currency': 'USD'
#             }, 
#             'description': 'Payment for your order', 
#             'related_resources': []
#         }
#     ], 
#     'redirect_urls': {
#         'return_url': 'http://localhost:3000/payment/success', 
#         'cancel_url': 'http://localhost:3000/payment/cancel'
#     }, 
#     'id': 'PAYID-M5WH3JY5KK92660KH939441G', 
#     'state': 'created', 
#     'create_time': '2024-12-25T21:48:22Z', 
#     'links': [
#         {
#             'href': 'https://api.sandbox.paypal.com/v1/payments/payment/PAYID-M5WH3JY5KK92660KH939441G', 
#             'rel': 'self', 
#             'method': 'GET'
#         }, 
#         {
#             'href': 'https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-22P54546N3297851D', 
#             'rel': 'approval_url', 
#             'method': 'REDIRECT'
#         }, 
#         {
#             'href': 'https://api.sandbox.paypal.com/v1/payments/payment/PAYID-M5WH3JY5KK92660KH939441G/execute', 
#             'rel': 'execute', 
#             'method': 'POST'
#         }
#     ]
# }