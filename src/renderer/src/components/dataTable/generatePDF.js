import jsPDF from "jspdf";
import "jspdf-autotable";

export const generatePDF = (order) => {
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
  doc.setFontSize(10);
  doc.text(`Customer Name: ${order.CustomerName}`, 14, 68);
  doc.text(`Phone Number: ${order.PhoneNumber}`, 14, 73);
  doc.text(`Email: ${order.Email}`, 14, 78);

  // Order Information Section
  doc.setFont("helvetica", "bold");
  doc.text("Order Details", 14, 88);

  doc.setFont("helvetica", "normal");
  doc.text(`Order ID: ${order.OrderID}`, 14, 96);
  const orderDate = new Date(order.OrderTimestamp).toLocaleString();
  doc.text(`Order Timestamp: ${orderDate}`, 14, 101);

  // Items Table Section
  const startY = 110;
  

  doc.autoTable({
    startY,
    head: [["Item Name", "Quantity"]],
    body: [[order.ItemNames,order.Quantities]],
    styles: {
      fontSize: 10,
      halign: "center",
    },
    headStyles: {
      fillColor: [41, 128, 185], // Blue header
      textColor: 255,
      fontSize: 11,
      fontStyle: "bold",
    },
    margin: { top: 110 },
    tableWidth: pageWidth - 28,
    theme: "grid",
  });

  // Totals Section
  const totalsY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Summary", 14, totalsY);

  doc.setFont("helvetica", "normal");
  const summaryStartY = totalsY + 8;
  doc.text(`Sub Total: ${order.SubTotal.toFixed(2)}`, pageWidth - 14, summaryStartY, {
    align: "right",
  });
  doc.text(`Tax Amount: ${order.TaxAmount.toFixed(2)}`, pageWidth - 14, summaryStartY + 5, {
    align: "right",
  });

  doc.setFont("helvetica", "bold");
  doc.text(`Total Amount: ${order.TotalAmount.toFixed(2)}`, pageWidth - 14, summaryStartY + 10, {
    align: "right",
  });

  // Footer Section
  const footerY = doc.internal.pageSize.height - 15;
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.text("Thank you for your business!", pageWidth / 2, footerY, { align: "center" });

  // Save the PDF
  doc.save(`invoice_${order.OrderID}.pdf`);
};
