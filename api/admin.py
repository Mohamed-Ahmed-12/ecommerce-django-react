
from django.contrib import admin
from .models import( Product , 
                     Category , 
                     Compatibility , 
                     FeaturedManufacturer , 
                     Order , 
                     OrderProduct ,  
                     Payment  , 
                     ShippingAddress , 
                     Invoice  , 
                     Review,
                     ProductPriceHistory
                    )
# Register your models here.
from django.templatetags.static import static
from django.utils.html import format_html
from .models import generate_pdf


class ProductAdmin(admin.ModelAdmin):
    list_display = ("name","brand","partnumber","quantity","price","condition","thumbnail")
    # fields = [ ("name","name_ar"),("description" , "description_ar"),("price" , "old_price") , ("image","image2","image3") , "brand" , "compatibility" , "condition" , "quantity" , "partnumber" , "category"] # appear in form
    exclude = ('slug',)
    search_fields = ('name','partnumber','brand')
    date_hierarchy = ('created_at')
    list_filter = ('created_at',)
    
    def view_on_site(self, obj):
        return "http://localhost:3000/product/" + obj.slug
    @admin.display(description="Images")
    def thumbnail(self, instance):
        if instance.image:
            return format_html(f'<img src="{instance.image.url}" style="width:75px; height: 75px; object-fit:cover;border-radius: 15px;"  draggable="false"/>')
        return 

class OrderAdmin(admin.ModelAdmin):
    list_display = ('id','user', 'payment', 'status' , 'get_items')
    list_filter = ('status',)
    date_hierarchy = "created_at"
    def save_model(self, request, obj, form, change):
        if change:  # Object is being updated, not created
            if obj.status == 'completed': # if admin make order completed will reduce the quantity of product in stock
                for item in obj.items.all():
                    item.product.quantity -= item.quantity
                    item.product.save()
            elif obj.status == 'cancelled': # if admin make order cancelled will increase the quantity of product in stock
                for item in obj.items.all():
                    item.product.quantity += item.quantity
                    item.product.save()
        super().save_model(request, obj, form, change)

    class Media:
        css = {
            'all': (static('admin_styles.css'),)  # Load custom CSS
        }
        js = (static('admin_scripts.js'),)  # Load the custom JavaScript 
        
    @admin.display(description="Order Items")
    def get_items(self , instance):
        li_elements = ''
        for item in instance.items.all():
            li_elements += f'<ul><li>Item : {item.product.name}</li><li>Price per item : {item.product.price}</li><li>Qty : {item.quantity}</li><li>Total : {item.quantity * item.product.price}</li></ul>'
        return format_html(f'{li_elements}')
    

class InvoiceAdmin(admin.ModelAdmin):
    list_display = ['file','order']
    list_filter = ('order',)
    date_hierarchy = "created_at"
    search_fields = ('file',)
    actions = ["generate_invoice",]
    
    @admin.action(description="Generate Invoice for order")
    def generate_invoice(self, request, queryset):
        for invoice in queryset:
            if not invoice.file :
                generate_pdf(invoice.id)

class OrderProductAdmin(admin.ModelAdmin):
    list_display = ('product', 'order', 'quantity')    
        
admin.site.register(Product,ProductAdmin)    
admin.site.register(Order , OrderAdmin)
admin.site.register(OrderProduct,OrderProductAdmin)
admin.site.register(Invoice, InvoiceAdmin)

admin.site.register(ShippingAddress)
admin.site.register(Payment)    
admin.site.register(Category)
admin.site.register(Compatibility)
admin.site.register(FeaturedManufacturer)
admin.site.register(Review)
admin.site.register(ProductPriceHistory)
