import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { InvoiceOrder } from "../components/admin/OrderInvoice";

const paymentLabel = (type?: string | null): string => {
  const normalized = (type || "").toLowerCase();
  if (normalized.includes("wallet") || normalized.includes("ewallet"))
    return "E-Wallet";
  if (normalized.includes("bank")) return "Bank Transfer";
  return "Cash on Delivery";
};

const money = (value: number | string | undefined): string =>
  `$${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/**
 * Generates and downloads a PDF invoice for the given order.
 * Built programmatically with jsPDF + autoTable (no DOM/canvas capture).
 */
export function generatePdfInvoice(order: InvoiceOrder): void {
  const doc = new jsPDF();

  // Header
  doc.setFillColor(0, 43, 154);
  doc.rect(0, 0, 210, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Lazapee", 14, 19);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Full-Stack E-Commerce - Official Invoice", 14, 25);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("INVOICE", 196, 14, { align: "right" });
  doc.setFontSize(10);
  doc.text(order.order_number, 196, 21, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(220, 220, 220);
  doc.text(
    order.created_at
      ? new Date(order.created_at).toLocaleString()
      : "—",
    196,
    26,
    { align: "right" },
  );

  // Bill To / Payment
  doc.setTextColor(90, 90, 90);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("BILLED TO", 14, 42);
  doc.text("PAYMENT METHOD", 128, 42);
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(11);
  doc.text(order.customer_name, 14, 49);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(paymentLabel(order.payment_type), 128, 49);
  doc.setTextColor(90, 90, 90);
  doc.setFontSize(9);
  let y = 55;
  if (order.customer_email) doc.text(order.customer_email, 14, y++);
  if (order.customer_phone) doc.text(order.customer_phone, 14, y);
  y += 4;
  if (order.delivery_address)
    doc.text(order.delivery_address, 14, y, { maxWidth: 108 });
  if (order.status) doc.text(`Status: ${order.status}`, 128, y);

  // Items table
  autoTable(doc, {
    startY: 72,
    head: [["Product", "SKU", "Price", "Qty", "Total"]],
    body: (Array.isArray(order.order_items) ? order.order_items : []).map(
      (item) => [
        item.name,
        item.sku || "—",
        money(item.price),
        String(item.quantity),
        money(Number(item.price || 0) * item.quantity),
      ],
    ),
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [0, 43, 154], textColor: 255, fontStyle: "bold" },
    columnStyles: {
      2: { halign: "right" },
      3: { halign: "center" },
      4: { halign: "right" },
    },
  });

  // Totals
  const afterTable = (doc as unknown as { lastAutoTable?: { finalY: number } })
    .lastAutoTable?.finalY ?? 72;
  const totalsX = 128;
  let yPos = afterTable + 10;
  const row = (label: string, value: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(90, 90, 90);
    doc.setFontSize(10);
    doc.text(label, totalsX, yPos);
    doc.setTextColor(20, 20, 20);
    doc.text(value, 196, yPos, { align: "right" });
    yPos += bold ? 7 : 6;
  };

  row("Subtotal", money(order.subtotal));
  row(
    "Shipping",
    Number(order.shipping) > 0 ? money(order.shipping) : "Free",
  );
  row("Tax", money(order.tax));
  doc.setDrawColor(0, 43, 154);
  doc.setLineWidth(0.6);
  doc.line(totalsX, yPos, 196, yPos);
  row("Total", money(order.total), true);

  // Notes
  const note =
    order.notes && typeof order.notes !== "string"
      ? order.notes?.notes
      : typeof order.notes === "string"
        ? order.notes
        : "";
  if (note) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(90, 90, 90);
    doc.setFontSize(9);
    doc.text("ORDER NOTES", 14, yPos + 10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    doc.text(note, 14, yPos + 16, { maxWidth: 182 });
  }

  doc.save(`Invoice-${order.order_number}.pdf`);
}
