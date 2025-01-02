import jsPDF from "jspdf";
import "jspdf-autotable";

export const generatePDF = async (order) => {
  const doc = new jsPDF();

  // Define common styles
  const pageWidth = doc.internal.pageSize.width;
  const leftMargin = 14;
  const rightMargin = pageWidth - 14;
  const centerX = pageWidth / 2;

  // Title Section (Centered)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("The Hungover Foods", centerX, 20, { align: "center" });

  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.text('"Feel like home made food"', centerX, 25, { align: "center" });

  // Horizontal line below header
  doc.line(leftMargin, 30, rightMargin, 30);

  // Owner Details Title (Left Column)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("From:", leftMargin, 38);
  
  // Owner Details
  doc.setFontSize(10);
  doc.text("HUNGOVER FOODS", leftMargin, 45);
  
  // Address and other details in normal font
  doc.setFont("helvetica", "normal");
  doc.text([
    "Sy No 389/1, Bardez, Socorro, Near Porvorim Medical Store,",
    "Porvorim, North Goa, Goa, 403521",
    "Phone: 9049088999",
  ], leftMargin, 50);
  
  // GSTIN in bold
  doc.setFont("helvetica", "bold");
  doc.text("GSTIN: 30APXPV4783R1ZK", leftMargin, 65);

  // Customer Details Title (Right Column)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Bill To:", rightMargin, 38, { align: "right" });
  
  // Customer Details
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const customerDetails = [
    `Customer Name: ${order.CustomerName}`,
    `Phone: ${order.PhoneNumber}`,
    `Email: ${order.Email}`
  ];
  
  doc.text(customerDetails, rightMargin, 45, { align: "right" });

  // Horizontal line below details
  doc.line(leftMargin, 70, rightMargin, 70);

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Invoice", centerX, 80, { align: "center" });

  // Order Information Section
  doc.setFontSize(12);
  doc.text("Order Details", leftMargin, 95);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Order ID: ${order.OrderID}`, leftMargin, 103);
  const orderDate = new Date(order.TimeStamp).toLocaleString();
  doc.text(`Order Timestamp: ${orderDate}`, leftMargin, 108);

  // Items Table Section
  const startY = 115;

  // Prepare items for the table including price
  const items = order.Items.map(item => [
    item.ItemName,
    item.Quantity,
    (item.ItemPrice * item.Quantity).toFixed(2)
  ]);

  // Calculate subtotal
  const subtotal = order.Items.reduce((total, item) => total + (item.ItemPrice * item.Quantity), 0);
  
  // Calculate GST using taxRate from order
  const sgstAmount = subtotal * (order.sgstRate / 100);
  const cgstAmount = subtotal * (order.cgstRate / 100);
  // Calculate total amount
  const totalAmount = subtotal + sgstAmount + cgstAmount;

  // Update autoTable to include item price
  doc.autoTable({
    startY,
    head: [["Item Name", "Quantity", "Price"]],
    body: items,
    styles: {
      fontSize: 10,
      halign: "center",
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: [255],
      fontSize: 11,
      fontStyle: "bold",
    },
    margin: { top: startY },
    tableWidth: pageWidth - 28,
    theme: "grid",
  });

  // Totals Section
  const totalsY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Summary", leftMargin, totalsY);
  
  doc.setFont("helvetica", "normal");
  const summaryStartY = totalsY + 8;
  
  // Displaying totals with proper formatting
  doc.text(`Sub Total: ${subtotal.toFixed(2)}`, rightMargin, summaryStartY, { align: "right" });
  doc.text(`CGST (${order.cgstRate}%): ${cgstAmount.toFixed(2)}`, rightMargin, summaryStartY + 5, { align: "right" });
  doc.text(`SGST (${order.sgstRate}%): ${sgstAmount.toFixed(2)}`, rightMargin, summaryStartY + 10, { align: "right" });
  
  doc.setFont("helvetica", "bold");
  doc.text(`Total Amount: ${totalAmount.toFixed(2)}`, rightMargin, summaryStartY + 20, { align: "right" });
  
  // Footer Section
  const footerY = doc.internal.pageSize.height - 15;
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.text("Thank you for your business!", centerX, footerY, { align: "center" });
  
  // Save the PDF
  try {
    await doc.save(`invoice_${order.OrderID}.pdf`);
    console.log(`Invoice saved as invoice_${order.OrderID}.pdf`);
  } catch (saveError) {
    console.error("Error saving PDF:", saveError);
  }
};