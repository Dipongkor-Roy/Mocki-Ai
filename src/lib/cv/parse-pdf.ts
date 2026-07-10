import mammoth from "mammoth";

export async function parseCVFile(
  buffer: Buffer,
  mimeType: string,
): Promise<string> {
  if (mimeType === "application/pdf") {
    const mod = eval("require")("pdf-parse");
    const parser = new mod.PDFParse(new Uint8Array(buffer));
    await parser.load();
    const text = await parser.getText();
    // console.log("TEXT TYPE:", typeof text);
    // console.log("TEXT VALUE:", text);
    return typeof text === "string" ? text : JSON.stringify(text);
  }

  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/msword"
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new Error("Unsupported file type. Upload a PDF or DOCX.");
}
