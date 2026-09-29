import fs from 'node:fs';
import path from 'node:path';
import extractZip from 'extract-zip';
import { Client } from '@crowdin/crowdin-api-client';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Retorna o diretório resolvido para que o Plugin do Docusaurus saiba o que copiar
export function getDomainTranslationsPath(domainName: string): string {
  return path.resolve(__dirname, `../domains/${domainName}/translations`);
}

function getDomainConfig(domainName: string) {
  // In a real FSD scenario, this could read a crowdin.config.ts from the domain folder.
  // For now, we use the env vars from .env
  return {
    projectId: Number(process.env.CROWDIN_PROJECT_ID),
    outputDir: getDomainTranslationsPath(domainName),
  };
}

export async function downloadDomainTranslations(domainName: string) {
  const token = process.env.CROWDIN_PERSONAL_TOKEN;
  if (!token) {
    console.warn(`[Crowdin SDK] CROWDIN_PERSONAL_TOKEN não encontrado. Sincronização ignorada.`);
    return;
  }

  const client = new Client({ token });
  const { projectId, outputDir } = getDomainConfig(domainName);

  if (!projectId || isNaN(projectId)) {
    throw new Error(`[Crowdin SDK] CROWDIN_PROJECT_ID inválido (${projectId}).`);
  }

  console.log(`[Crowdin SDK] Solicitando build de traduções para o domínio '${domainName}'...`);

  try {
    // 1. Inicia o Job de Compilação na Nuvem do Crowdin
    const build = await client.translationsApi.buildProject(projectId, {
      skipUntranslatedStrings: false,
      skipUntranslatedFiles: false,
      exportApprovedOnly: false,
    });

    const buildId = build.data.id;
    console.log(`[Crowdin SDK] Build iniciado. ID: ${buildId}. Aguardando conclusão...`);

    // 2. Poll: Aguarda a conclusão do Job
    let status = 'inProgress';
    while (status === 'inProgress') {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const check = await client.translationsApi.checkBuildStatus(projectId, buildId);
      status = check.data.status;
      if (status === 'failed') throw new Error('Falha no build do Crowdin.');
    }

    // 3. Resgata a URL Segura de Download do ZIP gerado
    const downloadLink = await client.translationsApi.downloadTranslations(projectId, buildId);

    // 4. Download do Arquivo
    const zipPath = path.join(__dirname, 'temp_translations.zip');
    console.log('[Crowdin SDK] Fazendo download do ZIP...');
    const response = await fetch(downloadLink.data.url);
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(zipPath, Buffer.from(buffer));

    // 5. Descompactação na pasta do domínio (ex: domains/portal/translations)
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    console.log(`[Crowdin SDK] Descompactando para ${outputDir}...`);

    await extractZip(zipPath, { dir: outputDir });
    fs.unlinkSync(zipPath); // Limpa o ZIP temporário

    console.log('[Crowdin SDK] Sincronização concluída com sucesso!');
  } catch (error) {
    console.error(`[Crowdin SDK] Erro na sincronização:`, error);
    throw error;
  }
}
