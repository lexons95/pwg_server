import { format, isAfter } from 'date-fns';

export const cartCalculation = (items = [], promotions = [], config = null) => {
  let result = {
    items: [],
    deliveryFee: 0,
    charges: [],
    total: 0,
    subTotal: 0,
    allowOrder: false,
    totalWeight: 0
  }

  if (config && items.length > 0) {
    let minPurchases = 0;
    let minWeight = 0;
    let initialWeight = 0;

    let totalWeight = initialWeight;
    let subTotal = 0;
    let deliveryFee = config.delivery ? config.delivery : 0
  
    if (items.length > 0) {
  
      items.forEach((anItem)=>{
        if (anItem.onSale) {
          let checkedSalePrice = anItem.salePrice ? anItem.salePrice : anItem.price;
          subTotal += (checkedSalePrice * anItem.qty)
        }
        else {
          subTotal += (anItem.price * anItem.qty)
        }
        totalWeight += (anItem.weight * anItem.qty)
      });
      
      let allExtras = [];
      let finalSubtotal = subTotal;
      let finalDeliveryFee = deliveryFee;
      promotions.forEach((aPromotion)=>{
        let discountValue = aPromotion.discountValue ? parseFloat(aPromotion.discountValue) : 0
        if (aPromotion.rewardType == 'percentage') {
          finalSubtotal = finalSubtotal - (finalSubtotal * discountValue / 100)
          if (finalSubtotal < 0) {
            finalSubtotal = 0;
          }
        }
        else if (aPromotion.rewardType == 'fixedAmount') {
          finalSubtotal = finalSubtotal - discountValue;
          if (finalSubtotal < 0) {
            finalSubtotal = 0;
          }
        }
        else if (aPromotion.rewardType == 'freeShipping') {
          finalDeliveryFee = 0;
        }
        else if (aPromotion.rewardType == 'charges') {
          finalSubtotal += discountValue;
          if (finalSubtotal < 0) {
            finalSubtotal = 0;
          }
        }

        allExtras.push({
          promotionId: aPromotion._id,
          name: aPromotion.name,
          description: aPromotion.description,
          type: aPromotion.type,
          rewardType: aPromotion.rewardType,
          discountValue: aPromotion.discountValue
        })
      })

      let total = 0;
      total = finalSubtotal + finalDeliveryFee;

      result = {
        items: items,
        deliveryFee: deliveryFee,
        charges: allExtras,
        total: total,
        subTotal: subTotal,
        allowOrder: totalWeight >= minWeight && subTotal >= minPurchases,
        totalWeight: totalWeight
      }
    }
  }

  return result;
}

const groupPromotions = (promotions=[]) => {
  let allPromotions = promotions
  let activePromotions = []
  let passivePromotions = []
  allPromotions.forEach((aPromotion)=>{
    let validPromotion = checkPromotionStatus(aPromotion.startDate, aPromotion.endDate) && aPromotion.published;
    if (validPromotion) {
      if (aPromotion.type == 'active') {
        activePromotions.push(aPromotion)
      }
      else if (aPromotion.type == 'passive') {
        passivePromotions.push(aPromotion)
      }
    }
  })

  return {
    activePromotions,
    passivePromotions
  }
}

const checkPromotionStatus = (start, end) => {
  let started = isAfter(new Date(), new Date(start));
  let expired = isAfter(new Date(), new Date(end));

  return expired ? false : (started ? true : false) 
}

const checkPromotionConditions = (cartItems, promotion) => {
  let totalPurchases = 0;
  let totalQuantity = 0;
  let totalWeight = 0;

  let selectedPromotionProducts = promotion.products;
  let selectedPromotionCategories = promotion.categories;

  cartItems.forEach((aCartItem)=>{
    let passedProducts = false;
    if (aCartItem.product && aCartItem.product._id) {
      passedProducts = selectedPromotionProducts.length > 0 ? selectedPromotionProducts.indexOf(aCartItem.product._id) >= 0 : true;
    }
    let passedCategories = false;
    if (aCartItem.product && aCartItem.product.categoryId) {
      passedCategories = selectedPromotionCategories.length > 0 ? selectedPromotionCategories.indexOf(aCartItem.product.categoryId) >= 0 : true;
    }

    if (passedProducts && passedCategories) {
      let price = aCartItem.onSale ? (aCartItem.salePrice ? aCartItem.salePrice : aCartItem.price) : aCartItem.price;
      totalPurchases += (price * aCartItem.qty);
      totalQuantity += aCartItem.qty;
      if (aCartItem.weight) {
        totalWeight += (aCartItem.weight * aCartItem.qty);
      }
    }
  });

  let minPurchases = promotion.minPurchases;
  let minQuantity = promotion.minQuantity;
  let minWeight = promotion.minWeight;

  let passedPurchases = true;
  if (minPurchases) {
    passedPurchases = totalPurchases >= minPurchases
  }
  let passedQuantity = true;
  if (minQuantity) {
    passedQuantity = totalQuantity >= minQuantity 
  }
  let passedWeight = true;
  if (minWeight) {
    passedWeight = totalWeight >= minWeight
  }

  let result = null;

  if (passedPurchases && passedQuantity && passedWeight) {
    result = promotion
  }
  
  return result;
}

const checkPassivePromotions = (cartItems=[], promotions=[]) => {
  let availablePromotions = [];
  promotions.forEach(aPromotion=>{
    let passed = checkPromotionConditions(cartItems, aPromotion)
    if (passed) {
      availablePromotions.push(passed);
    }
  });
  return availablePromotions;
}

export const checkActivePromotions = (cartItems=[], promotions=[], promoCode=null) => {
  let result = [];
  if (promoCode) {
    let foundPromotion = promotions.find((aPromotion)=>{
      if (aPromotion.code) {
        return aPromotion.code == promoCode
      }
      return false;
    });

    if (foundPromotion) {
      let passed = checkPromotionConditions(cartItems, foundPromotion);
      if (passed) {
        result.push(passed);
      }
    }
  }

  return result;
}

export const handlePromotionsChecking = (cartItems, promotionsData=[], promoCode=null) => {
  let { activePromotions, passivePromotions } = groupPromotions(promotionsData);
  let passedPassive = checkPassivePromotions(cartItems, passivePromotions);
  let passedActive = checkActivePromotions(cartItems, activePromotions, promoCode);

  let allPassed = [...passedPassive, ...passedActive]
  // console.log('allPassed',allPassed)
  // console.log('activePromotions',activePromotions)
  // console.log('passivePromotions',passivePromotions)
  return allPassed;
}