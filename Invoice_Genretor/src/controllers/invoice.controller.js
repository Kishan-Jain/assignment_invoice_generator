import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ToWords } from "to-words";

// Function to create an invoice
export const createInvoice = asyncHandler(async (req, res) => {
  // Check if request body is empty
  if (!req.body) {
    throw new ApiError(400, "Data not received");
  }
  
  const invoiceData = req.body; // Assign invoiceData from req.body
  

  // Check if invoiceData is empty or contains only whitespace
  if (!invoiceData || invoiceData.toString().trim() === "") {
    throw new ApiError(400, "Data not received");
  }

  // Destructure seller, customer, invoice, order, and product details from invoiceData
  const { seller, customer, invoice, order, product } = invoiceData;

  // Calculate net amount, tax, and total amount for each product
  product.forEach((prd) => {
    prd.netAmount = prd.basePrice * prd.quantity;

    if (seller.address.state === customer.billingAddress.state) {
      // Intra-state transaction (CGST + SGST)
      prd.taxArray = [
        { "Rate": "9%", "Type": "CGST", "Amount": prd.netAmount * (9 / 100) },
        { "Rate": "9%", "Type": "SGST", "Amount": prd.netAmount * (9 / 100) }
      ];
      prd.shippingChargesTaxArray = [
        { "Rate": "9%", "Type": "CGST", "Amount": prd.shippingCharges * (9 / 100) },
        { "Rate": "9%", "Type": "SGST", "Amount": prd.shippingCharges * (9 / 100) }
      ];
    } else {
      // Inter-state transaction (IGST)
      prd.taxArray = [
        { "Rate": "18%", "Type": "IGST", "Amount": prd.netAmount * (18 / 100) }
      ];
      prd.shippingChargesTaxArray = [
        { "Rate": "18%", "Type": "IGST", "Amount": prd.shippingCharges * (18 / 100) }
      ];
    }

    // Calculate total shipping charges including tax
    let netshippingChargesTax = 0;
    prd.shippingChargesTaxArray.forEach((taxvalue) => {
      netshippingChargesTax += taxvalue.Amount;
    });
    prd.totalshippingCharges = prd.shippingCharges + netshippingChargesTax;
  });

  // Calculate total tax without shipping charges tax
  let totalTaxwithoutShippingChargesTax = 0;
  product.forEach((prd) => prd.taxArray.forEach((ptax) => {
    totalTaxwithoutShippingChargesTax += ptax.Amount;
  }));

  // Calculate total shipping charges tax
  let totalshippingChargesTax = 0;
  product.forEach((prd) => prd.shippingChargesTaxArray.forEach((stax) => {
    totalshippingChargesTax += stax.Amount;
  }));

  // Calculate total amount without tax
  let totalAmountWithoutTax = 0;
  product.forEach((prd) => totalAmountWithoutTax += prd.netAmount);

  // Calculate total tax and total amount
  const totalTax = totalTaxwithoutShippingChargesTax + totalshippingChargesTax;
  const totalAmount = totalAmountWithoutTax + totalTax;

  // Total amount in words 
  let toWords = new ToWords()
  let amountInWords = toWords.convert(totalAmount)

  // Prepare data to be returned
  const returnedData = { seller, customer, invoice, order, product, totalTax, totalAmount, amountInWords };

  // Render the invoice template with the returned data
  res.render('invoice.views.ejs', { "invoiceData": returnedData });
});
