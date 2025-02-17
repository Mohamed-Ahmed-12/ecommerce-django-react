from django.db import models
from django.template.defaultfilters import slugify
from django.contrib.auth.models import User
from datetime import datetime
from django.db.models.signals import post_save
from django.dispatch import receiver
import random
import string
from weasyprint import HTML
from django.template.loader import render_to_string
from django.conf import settings
import logging
import os
from django.core.mail import EmailMessage
from celery import shared_task

# Logger setup
logger = logging.getLogger(__name__)

# Models
class Category(models.Model):
    name = models.CharField(verbose_name='Category', max_length=50)
    image = models.ImageField(blank=True, null=True, upload_to='categories')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']


class FeaturedManufacturer(models.Model):
    name = models.CharField(verbose_name='Manufacturer Name', max_length=25)
    img = models.ImageField(upload_to='brands')

    def __str__(self):
        return self.name


class Compatibility(models.Model):
    model_name = models.CharField(verbose_name='Model Name', max_length=75, unique=True)

    def __str__(self):
        return self.model_name

    class Meta:
        verbose_name_plural = 'Compatibilities'


class Product(models.Model):
    Product_Condition = [
        ('new', 'New'),
        ('used', 'Used'),
        ('imported', 'Imported'),
        ('copy', 'Copy')
    ]

    name = models.CharField(verbose_name='Product Name', max_length=255, blank=False, default='')
    name_ar = models.CharField(verbose_name='Product Name In Arabic', max_length=255, blank=False, default='')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, related_name='productcategory')
    partnumber = models.CharField(verbose_name='Part Number', max_length=20)
    description = models.TextField(verbose_name='Description')
    description_ar = models.TextField(verbose_name='Description In Arabic')
    compatibility = models.ManyToManyField(Compatibility)
    price = models.PositiveIntegerField()
    old_price = models.PositiveIntegerField(blank=True, null=True)
    brand = models.ForeignKey(FeaturedManufacturer, on_delete=models.CASCADE, verbose_name="Brand")
    image = models.ImageField(upload_to='products')
    image2 = models.ImageField(upload_to='products')
    image3 = models.ImageField(upload_to='products')
    slug = models.SlugField(unique=True, null=True, blank=True)
    condition = models.CharField(max_length=10, choices=Product_Condition)
    quantity = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['created_at']


class ProductView(models.Model):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name='userviews')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='productviews')

    def __str__(self):
        return self.product.name


class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ManyToManyField(Product, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username

    class Meta:
        ordering = ['created_at']


class Review(models.Model):
    Rating_Star = [
        (1, 1),
        (2, 2),
        (3, 3),
        (4, 4),
        (5, 5)
    ]
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    review = models.TextField()
    rating = models.IntegerField(choices=Rating_Star)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.product.name

    class Meta:
        unique_together = [['user', 'product']]
        managed = True


class ShippingAddress(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email = models.EmailField(max_length=75)
    phone = models.CharField(max_length=11)
    country = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    state = models.CharField(max_length=75)
    area = models.CharField(max_length=75)

    def __str__(self):
        return self.user.username


class Payment(models.Model):
    PAYMENT_METHODS = [
        ('cod', 'Cash on Delivery'),
        ('paypal', 'PayPal'),
        ('credit_card', 'Credit/Debit Card'),
        ('bank_transfer', 'Bank Transfer'),
        ('vodafone', 'Vodafone Cash'),
        ('fawry', 'Fawry Pay'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    payment_status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('completed', 'Completed'), ('failed', 'Failed')],
        default='pending'
    )
    payment_reference = models.CharField(max_length=100, blank=True, null=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Payment'
        verbose_name_plural = 'Payments'

    def __str__(self):
        return f'{self.user.username} - {self.payment_method} - {self.payment_status}'


class Order(models.Model):
    OrderStatus = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(choices=OrderStatus, max_length=50, verbose_name='Order Status', default='pending')
    payment = models.OneToOneField(Payment, on_delete=models.CASCADE, null=True, blank=True, related_name='order')
    address = models.ForeignKey(ShippingAddress, on_delete=models.CASCADE, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']


class OrderProduct(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(verbose_name="Quantity In Order", default=1)
    created_at = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return self.product.name
    
    @property
    def total_per_item(self):
        return self.product.price * self.quantity

    class Meta:
        ordering = ['created_at']


class Invoice(models.Model):
    invoice_number = models.CharField(max_length=15, editable=False, unique=True, blank=True)
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='invoice')
    created_at = models.DateTimeField(auto_now_add=True)
    file = models.FileField(upload_to='invoices', blank=True, null=True)


# Tasks
@shared_task
def generate_pdf(invoice_id):
    try:
        invoice = Invoice.objects.get(id=invoice_id)
        context = {
            "invoice": invoice,
            "order": invoice.order,
            "subtotal": sum(item.quantity * item.product.price for item in invoice.order.items.all()),
        }
        invoices_dir = os.path.join(settings.MEDIA_ROOT, 'invoices')
        os.makedirs(invoices_dir, exist_ok=True)
        pdf_file_path = os.path.join(invoices_dir, f'invoice_{invoice.invoice_number}.pdf')
        html_content = render_to_string("invoice.html", context)
        html = HTML(string=html_content, base_url=settings.MEDIA_ROOT)
        html.write_pdf(target=pdf_file_path)
        invoice.file.name = os.path.relpath(pdf_file_path, settings.MEDIA_ROOT)
        invoice.save()
    except Exception as e:
        logger.error(f"Failed to generate PDF for invoice {invoice.invoice_number}: {str(e)}")
        raise


@shared_task
def send_invoice_email(invoice_id, to_email):
    try:
        invoice = Invoice.objects.get(id=invoice_id)
        subject = f"Invoice #{invoice.invoice_number}"
        from_email = "noreply@example.com"
        html_message = render_to_string("invoice_email.html", {"invoice": invoice})
        email = EmailMessage(
            subject=subject,
            body=html_message,
            from_email=from_email,
            to=[to_email],
        )
        email.content_subtype = "html"
        if invoice.file and os.path.exists(invoice.file.path):
            email.attach_file(invoice.file.path)
        email.send()
    except Exception as e:
        logger.error(f"Failed to send invoice email for Invoice #{invoice.invoice_number}: {str(e)}")
        raise


# Signal for generating invoice
@receiver(post_save, sender=Invoice)
def generate_invoice_pdf_signal(sender, instance, created, **kwargs):
    if created:
        generate_pdf.delay(instance.id)
        if instance.order.address and instance.order.address.email:
            send_invoice_email.delay(instance.id, to_email=instance.order.address.email)


def generate_unique_invoice_number():
    while True:
        invoice_number = ''.join(random.choices(string.ascii_uppercase + string.digits, k=15))
        if not Invoice.objects.filter(invoice_number=invoice_number).exists():
            return invoice_number
