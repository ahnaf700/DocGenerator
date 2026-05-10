import { NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function POST(request: Request) {
  try {
    // 1. Tangkap data dari frontend
    const body = await request.json();
    const { nama_klien, layanan, harga } = body;

    // Validasi input
    if (!nama_klien || !layanan || !harga || typeof harga !== 'number' || harga <= 0) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    // 2. Buat dokumen PDF (Logika yang sama seperti sebelumnya)
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();
    
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Desain PDF minimalis
    const currentDate = new Date().toLocaleDateString('id-ID');
    const invoiceNumber = `INV-${Date.now()}`;

    page.drawText('INVOICE PROFESIONAL', { x: 50, y: height - 80, size: 20, font: helveticaBold });
    page.drawText(`Nomor Invoice: ${invoiceNumber}`, { x: 50, y: height - 110, size: 12, font: helvetica });
    page.drawText(`Tanggal: ${currentDate}`, { x: 400, y: height - 110, size: 12, font: helvetica });
    page.drawLine({ start: { x: 50, y: height - 120 }, end: { x: width - 50, y: height - 120 }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
    
    page.drawText(`Ditujukan kepada: ${nama_klien}`, { x: 50, y: height - 160, size: 12, font: helvetica });
    page.drawText(`Deskripsi Layanan: ${layanan}`, { x: 50, y: height - 190, size: 12, font: helvetica });
    page.drawText(`Total Tagihan: Rp ${harga.toLocaleString('id-ID')}`, { x: 50, y: height - 220, size: 14, font: helveticaBold });

    // 3. Ubah PDF menjadi format byte
    const pdfBytes = await pdfDoc.save();

    // 4. Kirim kembali ke browser pengguna sebagai file
    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="invoice_otomatis.pdf"',
      },
    });

  } catch (error) {
    console.error("Something wrong:", error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}