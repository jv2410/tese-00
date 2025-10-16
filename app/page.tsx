'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UploadDialog } from '@/components/upload-dialog';
import { FileText, Upload, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

type Document = {
  id: string;
  title: string;
  pages: number;
  chunksCount: number;
};

export default function HomePage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const loadDocuments = async () => {
    try {
      const res = await fetch('/api/documents');
      if (!res.ok) throw new Error('Falha ao carregar documentos');
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao carregar documentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Documentos</h1>
          <p className="text-muted-foreground">
            Gerencie seus documentos e faça perguntas com IA
          </p>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Novo Upload
        </Button>
      </div>

      <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-gray-300">
          <p className="font-semibold mb-1 text-red-400">⚠️ Ambiente Local - Apenas para Testes</p>
          <p>
            Os dados são armazenados apenas na memória do servidor.
            Se reiniciar o servidor, todos os documentos e configurações serão perdidos.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando documentos...</p>
        </div>
      ) : documents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum documento</h3>
            <p className="text-muted-foreground mb-4">
              Faça upload do seu primeiro documento para começar
            </p>
            <Button onClick={() => setUploadDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Fazer Upload
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <Link key={doc.id} href={`/documents/${doc.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <FileText className="h-8 w-8 text-primary" />
                    <Badge variant="secondary">{doc.pages} páginas</Badge>
                  </div>
                  <CardTitle className="line-clamp-2">{doc.title}</CardTitle>
                  <CardDescription>
                    {doc.chunksCount} chunks processados
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUploadComplete={loadDocuments}
      />
    </div>
  );
}
