import getProducts from '../data/getProducts.json';
import getProductsCategories from '../data/getProductsCategories.json';
import getCart from '../data/getCart.json';
import getAllTerms from '../data/getAllTerms.json';
import addToCart from '../data/addToCart.json';
import updateCartQuantity from '../data/updateCartQuantity.json';
import emptyCart from '../data/emptyCart.json';

export default defineNuxtPlugin(() => {
  return {
    provide: {
      useGql2: (methodName: string, params: any) => {
        console.log('useGql2:', methodName, params);
        switch (methodName) {
          case 'getProduct':
            return {
              data: {
                value: {
                  product: getProducts.data.value.products.nodes.find((product) => product.slug === params.slug),
                },
              },
            };

          case 'getProducts':
            return getProducts;

          case 'getStockStatus':
            return {
              data: {
                product: {
                  stockStatus: getProducts.data.value.products.nodes.find((product) => product.slug === params.slug)?.stockStatus ?? 'IN_STOCK',
                },
              },
            };

          case 'getProductCategories':
            return getProductsCategories;

          case 'getCart':
            return getCart;

          case 'getAllTerms':
            return getAllTerms;

          case 'addToCart':
            return addToCart;

          case 'updateCartQuantity':
            return updateCartQuantity;

          case 'emptyCart':
            return emptyCart;

          default:
            return console.log('Method not found');
        }
      },
    },
  };
});
