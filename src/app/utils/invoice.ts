/* eslint-disable @typescript-eslint/no-explicit-any */
import PDFDocument from "pdfkit";
import AppError from "../errorHelpers/AppError";

export interface IInvoiceData {
  transactionId: string;
  bookingDate: Date;
  userName: string;
  tourTitle: string;
  guestCount: number;
  totalAmount: number;
}

export const generatePDF = async (InvoiceData: IInvoiceData):Promise<Buffer<ArrayBufferLike>> => {
  try {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
      });

      const buffer: Uint8Array[] = [];

      doc.on("data", (chunk) => buffer.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffer)));
      doc.on("error", (err) => reject(err));

      //PDF content

      doc.fontSize(20).text("Invoice", { align: "center" });
      doc.moveDown();
      doc.fontSize(14).text(`Transaction ID :${InvoiceData.transactionId}`);
      doc.text(`Booking Date : ${InvoiceData.bookingDate}`);
      doc.text(`Customer : ${InvoiceData.userName}`);
      doc.moveDown();

      doc.text(`Tour : ${InvoiceData.tourTitle}`);
      doc.text(`Guests : ${InvoiceData.guestCount}`);
      doc.text(`Guests : ${InvoiceData.totalAmount.toFixed(2)}`);
      doc.moveDown();
      doc.text("Thank you for booking with us!", { align: "center" });
      doc.end();
    });
  } catch (error: any) {
    throw new AppError(401, "PDF creation faild", error.message);
  }
};
