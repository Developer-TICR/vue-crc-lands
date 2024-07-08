  // format price field
  export const propertyPrice = (price) =>
        //console.log(price)
        Number(price).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        })
    //console.log(price)