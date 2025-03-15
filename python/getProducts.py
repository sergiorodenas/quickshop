import json
import os
import stripe

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

def get_formatted_products():
    products = stripe.Product.list(limit=1000)  # Adjust the limit as needed
    formatted_products = []

    for product in products:
        # Fetch associated prices for the product
        prices = stripe.Price.list(product=product["id"])
        
        # Use the first price found, or set a default if none are available
        price_data = prices.data[0] if prices.data else None
        price = f"€{float(price_data.unit_amount) / 100}" if price_data else "€0.00"
        currency = price_data.currency.upper() if price_data else "EUR"
        
        formatted_product = {
            "name": product.get("name"),
            "type": "SIMPLE",
            "databaseId": product.get("id"),
            "id": product.get("id"),
            "metaData": [],
            "slug": product.get("name").lower().replace(" ", "-"),
            "sku": product.get("metadata", {}).get("sku"),
            "description": product.get("description"),
            "rawDescription": product.get("description"),
            "shortDescription": product.get("description"),
            "price_id": price_data.id,
            #"attributes": {"nodes": []},
            "productCategories": {"nodes": [
                {
                  "databaseId": 30,
                  "slug": "clothing",
                  "name": "Clothing",
                  "count": 12
                }
            ]},
            "terms": {"nodes": [
                {
                  "taxonomyName": "product_cat",
                  "slug": "clothing"
                },
            ]},
            "regularPrice": price,
            "rawRegularPrice": f"{float(price_data.unit_amount) / 100:.2f}" if price_data else "0.00",
            "currency": currency,
            "date": product.get("created"),
            "stockStatus": product.get("metadata", {}).get("stock_status", "IN_STOCK"),
            "stockQuantity": product.get("metadata", {}).get("stock_quantity"),
            "lowStockAmount": product.get("metadata", {}).get("low_stock_amount"),
            "averageRating": product.get("metadata", {}).get("average_rating", 0),
            "weight": product.get("metadata", {}).get("weight"),
            "length": product.get("metadata", {}).get("length"),
            "width": product.get("metadata", {}).get("width"),
            "height": product.get("metadata", {}).get("height"),
            "reviewCount": product.get("metadata", {}).get("review_count", 0),
            "onSale": product.get("metadata", {}).get("on_sale", False),
            "virtual": product.get("metadata", {}).get("virtual", False),
            "image": {
                "sourceUrl": product.get("images", [None])[0],
                "altText": "",
                "title": product.get("name"),
                "databaseId": product.get("id"),
                "cartSourceUrl": product.get("images", [None])[0],
                "producCardSourceUrl": product.get("images", [None])[0]
            },
            "galleryImages": {
                "nodes": [{"sourceUrl": url} for url in product.get("images", [])]
            },
            "reviews": {
                "averageRating": product.get("metadata", {}).get("average_rating", 0),
                "edges": []
            }
            
        }
        
        formatted_products.append(formatted_product)
    
    return formatted_products

def save_to_json(data, filename="woonuxt_base/app/data/getProducts.json"):
    json_data = {
        "data": {
            "value": {
                "products": {
                    "nodes": data
                }
            }
        }
    }
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(json_data, f, ensure_ascii=False, indent=4)
    print(f"File saved as {filename}")

# Execute the function and save the result to JSON
products = get_formatted_products()
save_to_json(products)
