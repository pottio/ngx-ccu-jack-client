import * as fs from 'fs';
const fsPromises = fs.promises;

interface MethodParam {
  name: string;
  description: string;
}

interface MethodDocumentation {
  title: string;
  head: string;
  description: string;
  returns?: string;
  params: MethodParam[];
  remarks?: string;
  typeParam?: string;
}

const cleanStringFromLineBreaksAndMultiWhitespace = (text: string): string => {
  return text
    .replace(/\r?\n|\r/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const getMethodDocumentations = async (filePath: string): Promise<MethodDocumentation[]> => {
  const file = (await fsPromises.readFile(filePath))?.toString() ?? '';
  const re = / \/\*\*\s*\n([^*]|(\*(?!\/)))*\*\//gm;
  const docs = file.match(re) ?? [];

  const methodDocs: MethodDocumentation[] = [];

  docs.forEach((doc: string) => {
    console.log(doc);
    const methodHeadStartIndex = file.indexOf(doc) + doc.length;
    const methodHeadPlain = file.substring(methodHeadStartIndex, methodHeadStartIndex + 500);
    const methodHeadRegex = / public ([a-zA-Z][a-zA-Z0-9()<>:[\] |\n\r,=]+) {/gm;
    const methodHead = cleanStringFromLineBreaksAndMultiWhitespace(
      (methodHeadRegex.exec(methodHeadPlain) ?? [])[1] ?? ''
    )
      .replace('( ', '(')
      .replace(' )', ')');

    const docSplit = doc.split('\n') ?? [];
    const description = docSplit[1].replace('*', '').trim();

    const titleIndex =
      methodHead.indexOf('<') < 0
        ? methodHead.indexOf('(')
        : methodHead.indexOf('<') < methodHead.indexOf('(')
        ? methodHead.indexOf('<')
        : methodHead.indexOf('(');

    const methodDoc: MethodDocumentation = {
      title: methodHead.substring(0, titleIndex),
      head: methodHead,
      description: description,
      params: []
    };

    docSplit.forEach((d) => {
      if (d.startsWith('   * @returns ')) {
        methodDoc.returns = cleanStringFromLineBreaksAndMultiWhitespace(d.replace('   * @returns ', ''));
      }
      if (d.startsWith('   * @param ')) {
        const paramWithoutPrefix = d.replace('   * @param ', '');
        if (d.endsWith('>\r')) {
          methodDoc.params.push({
            name: cleanStringFromLineBreaksAndMultiWhitespace(paramWithoutPrefix.replace('>', '')),
            description: ''
          });
        } else {
          methodDoc.params.push({
            name: cleanStringFromLineBreaksAndMultiWhitespace(
              paramWithoutPrefix.substring(0, paramWithoutPrefix.indexOf(' '))
            ),
            description: cleanStringFromLineBreaksAndMultiWhitespace(
              paramWithoutPrefix.substring(paramWithoutPrefix.indexOf(' '))
            )
          });
        }
      }
      if (d.startsWith('   *  - ')) {
        const paramDescriptionWithoutPrefix = d.replace('   *  - ', '');
        const paramDescription = cleanStringFromLineBreaksAndMultiWhitespace(paramDescriptionWithoutPrefix);
        methodDoc.params[methodDoc.params.length - 1].description += paramDescription;
        if (paramDescription.endsWith('or')) {
          methodDoc.params[methodDoc.params.length - 1].description += ' ';
        }
      }
      if (d.startsWith('   * @remarks ')) {
        methodDoc.remarks = cleanStringFromLineBreaksAndMultiWhitespace(
          d
            .replace('   * @remarks ', '')
            .replace(/{@link/g, '')
            .replace(/}/g, '')
        );
      }
      if (d.startsWith('   * @typeParam ')) {
        methodDoc.typeParam = cleanStringFromLineBreaksAndMultiWhitespace(d.replace('   * @typeParam ', ''));
      }
    });
    methodDocs.push(methodDoc);
  });
  return methodDocs;
};

const generateMarkdownFile = (docs: MethodDocumentation[], pageTitle: string): string => {
  let result = `# ${pageTitle}\n\n`;
  docs.forEach((doc) => {
    result += `### ${doc.title}\n`;
    result += '```\n' + doc.head + '\n```\n\n' + doc.description + '\n\n';
    if (doc.remarks) {
      result += `- *${doc.remarks}*\n`;
    }
    if (doc.typeParam) {
      result += `- **Type Parameter:** ${doc.typeParam}\n`;
    }
    if (doc.params.length > 0) {
      result += `- **Parameters:**\n`;
      doc.params.forEach((param) => {
        result += `  - **${param.name}:** ${param.description}\n`;
      });
    }
    if (doc.returns) {
      result += `- **Returns:** ${doc.returns}\n`;
    }
    result += '\n';
  });
  result += '[Back to the ngx-ccu-jack-client documentation](README.md)';
  return result;
};

const writeFile = async (fileContent: string, filePath: string): Promise<void> => {
  return fsPromises.writeFile(filePath, fileContent);
};

const main = async (): Promise<void> => {
  const methodDocsApi = await getMethodDocumentations(
    './projects/ngx-ccu-jack-client/src/lib/api-service/ccu-jack-api.service.ts'
  );
  const markdownFileContentApi = generateMarkdownFile(methodDocsApi, 'CcuJackApiService Documentation');
  await writeFile(markdownFileContentApi, './projects/ngx-ccu-jack-client/documentation-ccu-jack-api.md');

  const methodDocsMqtt = await getMethodDocumentations(
    './projects/ngx-ccu-jack-client/src/lib/mqtt-service/ccu-jack-mqtt.service.ts'
  );
  const markdownFileContentMqtt = generateMarkdownFile(methodDocsMqtt, 'CcuJackMqttService Documentation');
  await writeFile(markdownFileContentMqtt, './projects/ngx-ccu-jack-client/documentation-ccu-jack-mqtt.md');
};

main();
