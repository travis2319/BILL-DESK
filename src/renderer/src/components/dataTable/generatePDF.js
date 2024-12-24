import jsPDF from "jspdf";
import "jspdf-autotable";

export const generatePDF = async (order) => {
  const doc = new jsPDF();

  // Define common styles
  const pageWidth = doc.internal.pageSize.width;

  // Owner Details (Header Section)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("The Hungover Foods", pageWidth / 2, 20, { align: "center" });

  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.text('"Feel like home made food"', pageWidth / 2, 25, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text("Porvorim, Goa", pageWidth / 2, 30, { align: "center" });
  doc.text("Phone: 9049088999", pageWidth / 2, 35, { align: "center" });

  doc.line(14, 40, pageWidth - 14, 40); // Horizontal line below header

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Invoice", pageWidth / 2, 50, { align: "center" });

  // Customer Information Section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Customer Information", 14, 60);

  doc.setFont("helvetica", "normal");
  
   // Use fetched order data
   doc.setFontSize(10);
   doc.text(`Customer Name: ${order.CustomerName}`, 14, 68);
   doc.text(`Phone Number: ${order.PhoneNumber}`, 14, 73);
   doc.text(`Email: ${order.Email}`, 14, 78);

   // Order Information Section
   doc.setFont("helvetica", "bold");
   doc.text("Order Details", 14, 88);

   doc.setFont("helvetica", "normal");
   doc.text(`Order ID: ${order.OrderID}`, 14, 96);
   const orderDate = new Date(order.TimeStamp).toLocaleString();
   doc.text(`Order Timestamp: ${orderDate}`, 14, 101);

   // Items Table Section
   const startY = 110;

   // Prepare items for the table including price
   const items = order.Items.map(item => [item.ItemName, item.Quantity, (item.ItemPrice * item.Quantity).toFixed(2)]); 

   // Calculate subtotal
   const subtotal = order.Items.reduce((total, item) => total + (item.ItemPrice * item.Quantity), 0);
   
   // Calculate GST using taxRate from order
   const gstAmount = subtotal * (order.TaxRate / 100); // Assuming TaxRate is a percentage

   // Calculate total amount
   const totalAmount = subtotal + gstAmount;

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
       fillColor: [41, 128, 185], // Blue header
       textColor: [255],
       fontSize: [11],
       fontStyle: ["bold"],
     },
     margin: { top: startY },
     tableWidth: pageWidth -28,
     theme: "grid",
   });

   // Totals Section
   const totalsY = doc.lastAutoTable.finalY +10;
   doc.setFontSize(12);
   doc.setFont("helvetica", "bold");
   doc.text("Summary",14, totalsY);

   doc.setFont("helvetica","normal");
   const summaryStartY = totalsY +8;
   
   // Displaying totals with proper formatting
   doc.text(`Sub Total: ${subtotal.toFixed(2)}`, pageWidth -14 , summaryStartY , { align:"right" });
   doc.text(`GST (${order.TaxRate}%): ${gstAmount.toFixed(2)}`, pageWidth -14 , summaryStartY +5 , { align:"right" });
   
   doc.setFont("helvetica","bold");
   doc.text(`Total Amount: ${totalAmount.toFixed(2)}`, pageWidth -14 , summaryStartY +15 , { align:"right" });

   // Footer Section
   const footerY =doc.internal.pageSize.height -15;
   doc.setFontSize(10);
   doc.setFont("helvetica","italic");
   doc.text("Thank you for your business!",pageWidth /2 , footerY,{ align:"center" });

   // Save the PDF
   try {
      await doc.save(`invoice_${order.OrderID}.pdf`);
      console.log(`Invoice saved as invoice_${order.OrderID}.pdf`);
   } catch (saveError) {
      console.error("Error saving PDF:", saveError);
   }
};
