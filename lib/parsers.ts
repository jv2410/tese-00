import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import fs from 'fs/promises';
import path from 'path';

export type ParseResult = {
  text: string;
  pages: number;
};

export async function parsePDF(filePath: string): Promise<ParseResult> {
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdf(dataBuffer);

  return {
    text: data.text,
    pages: data.numpages
  };
}

export async function parseDOCX(filePath: string): Promise<ParseResult> {
  const result = await mammoth.extractRawText({ path: filePath });
  const text = result.value;

  // Estimativa de páginas (aproximadamente 500 palavras por página)
  const wordCount = text.split(/\s+/).length;
  const estimatedPages = Math.max(1, Math.ceil(wordCount / 500));

  return {
    text,
    pages: estimatedPages
  };
}

export async function parseTXT(filePath: string): Promise<ParseResult> {
  const text = await fs.readFile(filePath, 'utf-8');

  // Estimativa de páginas (aproximadamente 500 palavras por página)
  const wordCount = text.split(/\s+/).length;
  const estimatedPages = Math.max(1, Math.ceil(wordCount / 500));

  return {
    text,
    pages: estimatedPages
  };
}

export async function parseDocument(filePath: string): Promise<ParseResult> {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case '.pdf':
      return parsePDF(filePath);
    case '.docx':
      return parseDOCX(filePath);
    case '.txt':
      return parseTXT(filePath);
    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }
}
