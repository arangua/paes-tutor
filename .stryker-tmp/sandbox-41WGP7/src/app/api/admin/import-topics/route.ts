// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/get-session';
import { withRateLimit } from '@/lib/rate-limit-middleware';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import fs from 'fs/promises';
import path from 'path';
export const runtime = stryMutAct_9fa48("4298") ? "" : (stryCov_9fa48("4298"), 'nodejs');

// Importación de pdf-parse v2
const {
  PDFParse
} = require('pdf-parse');

// Directorios
const PDFS_DIR = path.join(process.cwd(), stryMutAct_9fa48("4299") ? "" : (stryCov_9fa48("4299"), 'data'), stryMutAct_9fa48("4300") ? "" : (stryCov_9fa48("4300"), 'pdfs'));
async function ensureDirectories() {
  if (stryMutAct_9fa48("4301")) {
    {}
  } else {
    stryCov_9fa48("4301");
    await fs.mkdir(PDFS_DIR, stryMutAct_9fa48("4302") ? {} : (stryCov_9fa48("4302"), {
      recursive: stryMutAct_9fa48("4303") ? false : (stryCov_9fa48("4303"), true)
    }));
  }
}
async function extractTextFromPDF(pdfPath: string): Promise<string> {
  if (stryMutAct_9fa48("4304")) {
    {}
  } else {
    stryCov_9fa48("4304");
    let dataBuffer: Buffer;
    try {
      if (stryMutAct_9fa48("4305")) {
        {}
      } else {
        stryCov_9fa48("4305");
        dataBuffer = await fs.readFile(pdfPath);
      }
    } catch (error) {
      if (stryMutAct_9fa48("4306")) {
        {}
      } else {
        stryCov_9fa48("4306");
        throw new Error(stryMutAct_9fa48("4307") ? `` : (stryCov_9fa48("4307"), `Error al leer el archivo PDF: ${error instanceof Error ? error.message : stryMutAct_9fa48("4308") ? "" : (stryCov_9fa48("4308"), 'Error desconocido')}`));
      }
    }

    // Validar que el archivo no esté vacío
    if (stryMutAct_9fa48("4311") ? dataBuffer.length !== 0 : stryMutAct_9fa48("4310") ? false : stryMutAct_9fa48("4309") ? true : (stryCov_9fa48("4309", "4310", "4311"), dataBuffer.length === 0)) {
      if (stryMutAct_9fa48("4312")) {
        {}
      } else {
        stryCov_9fa48("4312");
        throw new Error(stryMutAct_9fa48("4313") ? "" : (stryCov_9fa48("4313"), 'El archivo PDF está vacío'));
      }
    }

    // Validar que el archivo comience con el header PDF (mínima validación)
    const pdfHeader = dataBuffer.subarray(0, 4).toString();
    if (stryMutAct_9fa48("4316") ? pdfHeader === '%PDF' : stryMutAct_9fa48("4315") ? false : stryMutAct_9fa48("4314") ? true : (stryCov_9fa48("4314", "4315", "4316"), pdfHeader !== (stryMutAct_9fa48("4317") ? "" : (stryCov_9fa48("4317"), '%PDF')))) {
      if (stryMutAct_9fa48("4318")) {
        {}
      } else {
        stryCov_9fa48("4318");
        throw new Error(stryMutAct_9fa48("4319") ? "" : (stryCov_9fa48("4319"), 'El archivo no parece ser un PDF válido (no contiene el header PDF)'));
      }
    }
    try {
      if (stryMutAct_9fa48("4320")) {
        {}
      } else {
        stryCov_9fa48("4320");
        const parser = new PDFParse(stryMutAct_9fa48("4321") ? {} : (stryCov_9fa48("4321"), {
          data: dataBuffer
        }));
        await parser.load();
        const result = await parser.getText();

        // Validar que se extrajo texto
        if (stryMutAct_9fa48("4324") ? (!result || !result.text) && result.text.trim().length === 0 : stryMutAct_9fa48("4323") ? false : stryMutAct_9fa48("4322") ? true : (stryCov_9fa48("4322", "4323", "4324"), (stryMutAct_9fa48("4326") ? !result && !result.text : stryMutAct_9fa48("4325") ? false : (stryCov_9fa48("4325", "4326"), (stryMutAct_9fa48("4327") ? result : (stryCov_9fa48("4327"), !result)) || (stryMutAct_9fa48("4328") ? result.text : (stryCov_9fa48("4328"), !result.text)))) || (stryMutAct_9fa48("4330") ? result.text.trim().length !== 0 : stryMutAct_9fa48("4329") ? false : (stryCov_9fa48("4329", "4330"), (stryMutAct_9fa48("4331") ? result.text.length : (stryCov_9fa48("4331"), result.text.trim().length)) === 0)))) {
          if (stryMutAct_9fa48("4332")) {
            {}
          } else {
            stryCov_9fa48("4332");
            throw new Error(stryMutAct_9fa48("4333") ? "" : (stryCov_9fa48("4333"), 'El PDF no contiene texto extraíble. Puede ser un PDF escaneado o protegido.'));
          }
        }
        return result.text;
      }
    } catch (error) {
      if (stryMutAct_9fa48("4334")) {
        {}
      } else {
        stryCov_9fa48("4334");
        if (stryMutAct_9fa48("4337") ? error instanceof Error || error.message.includes('no contiene texto') : stryMutAct_9fa48("4336") ? false : stryMutAct_9fa48("4335") ? true : (stryCov_9fa48("4335", "4336", "4337"), error instanceof Error && error.message.includes(stryMutAct_9fa48("4338") ? "" : (stryCov_9fa48("4338"), 'no contiene texto')))) {
          if (stryMutAct_9fa48("4339")) {
            {}
          } else {
            stryCov_9fa48("4339");
            throw error;
          }
        }
        throw new Error(stryMutAct_9fa48("4340") ? `` : (stryCov_9fa48("4340"), `Error al parsear PDF: ${error instanceof Error ? error.message : stryMutAct_9fa48("4341") ? "" : (stryCov_9fa48("4341"), 'Error desconocido')}`));
      }
    }
  }
}

// Mapeo de asignaturas (debe coincidir con el sistema)
const SUBJECT_MAPPING: Record<string, string> = stryMutAct_9fa48("4342") ? {} : (stryCov_9fa48("4342"), {
  'Competencia Lectora': stryMutAct_9fa48("4343") ? "" : (stryCov_9fa48("4343"), 'LECTORA'),
  'Matemática M1': stryMutAct_9fa48("4344") ? "" : (stryCov_9fa48("4344"), 'M1'),
  'Matemática M2': stryMutAct_9fa48("4345") ? "" : (stryCov_9fa48("4345"), 'M2'),
  'Ciencias - Biología': stryMutAct_9fa48("4346") ? "" : (stryCov_9fa48("4346"), 'BIO'),
  'Ciencias - Física': stryMutAct_9fa48("4347") ? "" : (stryCov_9fa48("4347"), 'FIS'),
  'Ciencias - Química': stryMutAct_9fa48("4348") ? "" : (stryCov_9fa48("4348"), 'QUI'),
  'Historia y Ciencias Sociales': stryMutAct_9fa48("4349") ? "" : (stryCov_9fa48("4349"), 'HIST')
});

// Schema para validar un tema individual
const topicSchema = z.object(stryMutAct_9fa48("4350") ? {} : (stryCov_9fa48("4350"), {
  asignatura: stryMutAct_9fa48("4351") ? z.string().max(1, 'La asignatura es requerida') : (stryCov_9fa48("4351"), z.string().min(1, stryMutAct_9fa48("4352") ? "" : (stryCov_9fa48("4352"), 'La asignatura es requerida'))),
  ejeTematico: stryMutAct_9fa48("4353") ? z.string().max(1, 'El eje temático es requerido') : (stryCov_9fa48("4353"), z.string().min(1, stryMutAct_9fa48("4354") ? "" : (stryCov_9fa48("4354"), 'El eje temático es requerido'))),
  nombre: stryMutAct_9fa48("4355") ? z.string().max(1, 'El nombre del tema es requerido') : (stryCov_9fa48("4355"), z.string().min(1, stryMutAct_9fa48("4356") ? "" : (stryCov_9fa48("4356"), 'El nombre del tema es requerido'))),
  descripcion: z.string().optional().nullable()
}));

// Schema para validar el array de temas
const topicsImportSchema = z.object(stryMutAct_9fa48("4357") ? {} : (stryCov_9fa48("4357"), {
  topics: stryMutAct_9fa48("4358") ? z.array(topicSchema).max(1, 'Debe haber al menos un tema') : (stryCov_9fa48("4358"), z.array(topicSchema).min(1, stryMutAct_9fa48("4359") ? "" : (stryCov_9fa48("4359"), 'Debe haber al menos un tema')))
}));

// Schema para validar el formato del request
const requestSchema = z.object(stryMutAct_9fa48("4360") ? {} : (stryCov_9fa48("4360"), {
  topics: stryMutAct_9fa48("4361") ? z.array(topicSchema).max(1) : (stryCov_9fa48("4361"), z.array(topicSchema).min(1))
}));
interface TopicImportData {
  asignatura: string;
  ejeTematico: string;
  nombre: string;
  descripcion?: string | null;
}
interface ImportResult {
  totalTopics: number;
  created: number;
  updated: number;
  skipped: number;
  errors: Array<{
    topic: string;
    error: string;
  }>;
  details: {
    bySubject: Record<string, {
      created: number;
      updated: number;
    }>;
  };
}

/**
 * Importa temarios desde un array de objetos
 * Maneja duplicados basándose en asignatura + eje temático + nombre
 */
async function importTopics(data: TopicImportData[]): Promise<ImportResult> {
  if (stryMutAct_9fa48("4362")) {
    {}
  } else {
    stryCov_9fa48("4362");
    const result: ImportResult = stryMutAct_9fa48("4363") ? {} : (stryCov_9fa48("4363"), {
      totalTopics: data.length,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: stryMutAct_9fa48("4364") ? ["Stryker was here"] : (stryCov_9fa48("4364"), []),
      details: stryMutAct_9fa48("4365") ? {} : (stryCov_9fa48("4365"), {
        bySubject: {}
      })
    });

    // Validar y normalizar datos
    const validatedTopics: Array<TopicImportData & {
      subjectCode: string;
    }> = stryMutAct_9fa48("4366") ? ["Stryker was here"] : (stryCov_9fa48("4366"), []);
    for (const topic of data) {
      if (stryMutAct_9fa48("4367")) {
        {}
      } else {
        stryCov_9fa48("4367");
        try {
          if (stryMutAct_9fa48("4368")) {
            {}
          } else {
            stryCov_9fa48("4368");
            // Validar con Zod
            const validated = topicSchema.parse(topic);

            // Obtener código de asignatura
            const subjectCode = SUBJECT_MAPPING[validated.asignatura];
            if (stryMutAct_9fa48("4371") ? false : stryMutAct_9fa48("4370") ? true : stryMutAct_9fa48("4369") ? subjectCode : (stryCov_9fa48("4369", "4370", "4371"), !subjectCode)) {
              if (stryMutAct_9fa48("4372")) {
                {}
              } else {
                stryCov_9fa48("4372");
                result.errors.push(stryMutAct_9fa48("4373") ? {} : (stryCov_9fa48("4373"), {
                  topic: stryMutAct_9fa48("4374") ? `` : (stryCov_9fa48("4374"), `${validated.asignatura} - ${validated.nombre}`),
                  error: stryMutAct_9fa48("4375") ? `` : (stryCov_9fa48("4375"), `Asignatura no encontrada: ${validated.asignatura}`)
                }));
                stryMutAct_9fa48("4376") ? result.skipped-- : (stryCov_9fa48("4376"), result.skipped++);
                continue;
              }
            }
            validatedTopics.push(stryMutAct_9fa48("4377") ? {} : (stryCov_9fa48("4377"), {
              ...validated,
              subjectCode
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("4378")) {
            {}
          } else {
            stryCov_9fa48("4378");
            result.errors.push(stryMutAct_9fa48("4379") ? {} : (stryCov_9fa48("4379"), {
              topic: stryMutAct_9fa48("4380") ? `` : (stryCov_9fa48("4380"), `${stryMutAct_9fa48("4383") ? topic.asignatura && 'Desconocido' : stryMutAct_9fa48("4382") ? false : stryMutAct_9fa48("4381") ? true : (stryCov_9fa48("4381", "4382", "4383"), topic.asignatura || (stryMutAct_9fa48("4384") ? "" : (stryCov_9fa48("4384"), 'Desconocido')))} - ${stryMutAct_9fa48("4387") ? topic.nombre && 'Desconocido' : stryMutAct_9fa48("4386") ? false : stryMutAct_9fa48("4385") ? true : (stryCov_9fa48("4385", "4386", "4387"), topic.nombre || (stryMutAct_9fa48("4388") ? "" : (stryCov_9fa48("4388"), 'Desconocido')))}`),
              error: error instanceof Error ? error.message : stryMutAct_9fa48("4389") ? "" : (stryCov_9fa48("4389"), 'Error de validación')
            }));
            stryMutAct_9fa48("4390") ? result.skipped-- : (stryCov_9fa48("4390"), result.skipped++);
          }
        }
      }
    }

    // Agrupar por asignatura para optimizar consultas
    const topicsBySubject = new Map<string, typeof validatedTopics>();
    for (const topic of validatedTopics) {
      if (stryMutAct_9fa48("4391")) {
        {}
      } else {
        stryCov_9fa48("4391");
        if (stryMutAct_9fa48("4394") ? false : stryMutAct_9fa48("4393") ? true : stryMutAct_9fa48("4392") ? topicsBySubject.has(topic.subjectCode) : (stryCov_9fa48("4392", "4393", "4394"), !topicsBySubject.has(topic.subjectCode))) {
          if (stryMutAct_9fa48("4395")) {
            {}
          } else {
            stryCov_9fa48("4395");
            topicsBySubject.set(topic.subjectCode, stryMutAct_9fa48("4396") ? ["Stryker was here"] : (stryCov_9fa48("4396"), []));
          }
        }
        topicsBySubject.get(topic.subjectCode)!.push(topic);
      }
    }

    // Procesar en transacción
    await prisma.$transaction(async tx => {
      if (stryMutAct_9fa48("4397")) {
        {}
      } else {
        stryCov_9fa48("4397");
        for (const [subjectCode, topics] of topicsBySubject.entries()) {
          if (stryMutAct_9fa48("4398")) {
            {}
          } else {
            stryCov_9fa48("4398");
            // Obtener o crear asignatura
            let subject = await tx.subject.findUnique(stryMutAct_9fa48("4399") ? {} : (stryCov_9fa48("4399"), {
              where: stryMutAct_9fa48("4400") ? {} : (stryCov_9fa48("4400"), {
                codigo: subjectCode
              })
            }));
            if (stryMutAct_9fa48("4403") ? false : stryMutAct_9fa48("4402") ? true : stryMutAct_9fa48("4401") ? subject : (stryCov_9fa48("4401", "4402", "4403"), !subject)) {
              if (stryMutAct_9fa48("4404")) {
                {}
              } else {
                stryCov_9fa48("4404");
                // Buscar el nombre de la asignatura desde el mapeo inverso
                const subjectName = stryMutAct_9fa48("4407") ? Object.entries(SUBJECT_MAPPING).find(([_, code]) => code === subjectCode)?.[0] && subjectCode : stryMutAct_9fa48("4406") ? false : stryMutAct_9fa48("4405") ? true : (stryCov_9fa48("4405", "4406", "4407"), (stryMutAct_9fa48("4408") ? Object.entries(SUBJECT_MAPPING).find(([_, code]) => code === subjectCode)[0] : (stryCov_9fa48("4408"), Object.entries(SUBJECT_MAPPING).find(stryMutAct_9fa48("4409") ? () => undefined : (stryCov_9fa48("4409"), ([_, code]) => stryMutAct_9fa48("4412") ? code !== subjectCode : stryMutAct_9fa48("4411") ? false : stryMutAct_9fa48("4410") ? true : (stryCov_9fa48("4410", "4411", "4412"), code === subjectCode)))?.[0])) || subjectCode);
                subject = await tx.subject.create(stryMutAct_9fa48("4413") ? {} : (stryCov_9fa48("4413"), {
                  data: stryMutAct_9fa48("4414") ? {} : (stryCov_9fa48("4414"), {
                    codigo: subjectCode,
                    nombre: subjectName,
                    tipo: stryMutAct_9fa48("4415") ? "" : (stryCov_9fa48("4415"), 'PAES')
                  })
                }));
              }
            }

            // Inicializar contadores para esta asignatura
            if (stryMutAct_9fa48("4418") ? false : stryMutAct_9fa48("4417") ? true : stryMutAct_9fa48("4416") ? result.details.bySubject[subjectCode] : (stryCov_9fa48("4416", "4417", "4418"), !result.details.bySubject[subjectCode])) {
              if (stryMutAct_9fa48("4419")) {
                {}
              } else {
                stryCov_9fa48("4419");
                result.details.bySubject[subjectCode] = stryMutAct_9fa48("4420") ? {} : (stryCov_9fa48("4420"), {
                  created: 0,
                  updated: 0
                });
              }
            }

            // Procesar cada tema
            for (const topic of topics) {
              if (stryMutAct_9fa48("4421")) {
                {}
              } else {
                stryCov_9fa48("4421");
                try {
                  if (stryMutAct_9fa48("4422")) {
                    {}
                  } else {
                    stryCov_9fa48("4422");
                    // Buscar tema existente (mismo nombre, mismo eje temático, misma asignatura)
                    const existingTopic = await tx.topic.findFirst(stryMutAct_9fa48("4423") ? {} : (stryCov_9fa48("4423"), {
                      where: stryMutAct_9fa48("4424") ? {} : (stryCov_9fa48("4424"), {
                        subjectId: subject.id,
                        nombre: stryMutAct_9fa48("4425") ? topic.nombre : (stryCov_9fa48("4425"), topic.nombre.trim()),
                        ejeTematico: stryMutAct_9fa48("4426") ? topic.ejeTematico : (stryCov_9fa48("4426"), topic.ejeTematico.trim())
                      })
                    }));
                    if (stryMutAct_9fa48("4428") ? false : stryMutAct_9fa48("4427") ? true : (stryCov_9fa48("4427", "4428"), existingTopic)) {
                      if (stryMutAct_9fa48("4429")) {
                        {}
                      } else {
                        stryCov_9fa48("4429");
                        // Actualizar tema existente
                        await tx.topic.update(stryMutAct_9fa48("4430") ? {} : (stryCov_9fa48("4430"), {
                          where: stryMutAct_9fa48("4431") ? {} : (stryCov_9fa48("4431"), {
                            id: existingTopic.id
                          }),
                          data: stryMutAct_9fa48("4432") ? {} : (stryCov_9fa48("4432"), {
                            descripcion: stryMutAct_9fa48("4435") ? topic.descripcion?.trim() && null : stryMutAct_9fa48("4434") ? false : stryMutAct_9fa48("4433") ? true : (stryCov_9fa48("4433", "4434", "4435"), (stryMutAct_9fa48("4437") ? topic.descripcion.trim() : stryMutAct_9fa48("4436") ? topic.descripcion : (stryCov_9fa48("4436", "4437"), topic.descripcion?.trim())) || null)
                          })
                        }));
                        stryMutAct_9fa48("4438") ? result.updated-- : (stryCov_9fa48("4438"), result.updated++);
                        stryMutAct_9fa48("4439") ? result.details.bySubject[subjectCode].updated-- : (stryCov_9fa48("4439"), result.details.bySubject[subjectCode].updated++);
                      }
                    } else {
                      if (stryMutAct_9fa48("4440")) {
                        {}
                      } else {
                        stryCov_9fa48("4440");
                        // Crear nuevo tema
                        await tx.topic.create(stryMutAct_9fa48("4441") ? {} : (stryCov_9fa48("4441"), {
                          data: stryMutAct_9fa48("4442") ? {} : (stryCov_9fa48("4442"), {
                            subjectId: subject.id,
                            nombre: stryMutAct_9fa48("4443") ? topic.nombre : (stryCov_9fa48("4443"), topic.nombre.trim()),
                            ejeTematico: stryMutAct_9fa48("4444") ? topic.ejeTematico : (stryCov_9fa48("4444"), topic.ejeTematico.trim()),
                            descripcion: stryMutAct_9fa48("4447") ? topic.descripcion?.trim() && null : stryMutAct_9fa48("4446") ? false : stryMutAct_9fa48("4445") ? true : (stryCov_9fa48("4445", "4446", "4447"), (stryMutAct_9fa48("4449") ? topic.descripcion.trim() : stryMutAct_9fa48("4448") ? topic.descripcion : (stryCov_9fa48("4448", "4449"), topic.descripcion?.trim())) || null)
                          })
                        }));
                        stryMutAct_9fa48("4450") ? result.created-- : (stryCov_9fa48("4450"), result.created++);
                        stryMutAct_9fa48("4451") ? result.details.bySubject[subjectCode].created-- : (stryCov_9fa48("4451"), result.details.bySubject[subjectCode].created++);
                      }
                    }
                  }
                } catch (error) {
                  if (stryMutAct_9fa48("4452")) {
                    {}
                  } else {
                    stryCov_9fa48("4452");
                    result.errors.push(stryMutAct_9fa48("4453") ? {} : (stryCov_9fa48("4453"), {
                      topic: stryMutAct_9fa48("4454") ? `` : (stryCov_9fa48("4454"), `${topic.asignatura} - ${topic.nombre}`),
                      error: error instanceof Error ? error.message : stryMutAct_9fa48("4455") ? "" : (stryCov_9fa48("4455"), 'Error al procesar tema')
                    }));
                    stryMutAct_9fa48("4456") ? result.skipped-- : (stryCov_9fa48("4456"), result.skipped++);
                  }
                }
              }
            }
          }
        }
      }
    });
    return result;
  }
}

/**
 * Parsea un valor CSV, manejando comillas y espacios
 */
function parseCSVValue(value: string): string {
  if (stryMutAct_9fa48("4457")) {
    {}
  } else {
    stryCov_9fa48("4457");
    // Remover comillas dobles al inicio y final si existen
    let cleaned = stryMutAct_9fa48("4458") ? value : (stryCov_9fa48("4458"), value.trim());
    if (stryMutAct_9fa48("4461") ? cleaned.startsWith('"') || cleaned.endsWith('"') : stryMutAct_9fa48("4460") ? false : stryMutAct_9fa48("4459") ? true : (stryCov_9fa48("4459", "4460", "4461"), (stryMutAct_9fa48("4462") ? cleaned.endsWith('"') : (stryCov_9fa48("4462"), cleaned.startsWith(stryMutAct_9fa48("4463") ? "" : (stryCov_9fa48("4463"), '"')))) && (stryMutAct_9fa48("4464") ? cleaned.startsWith('"') : (stryCov_9fa48("4464"), cleaned.endsWith(stryMutAct_9fa48("4465") ? "" : (stryCov_9fa48("4465"), '"')))))) {
      if (stryMutAct_9fa48("4466")) {
        {}
      } else {
        stryCov_9fa48("4466");
        cleaned = stryMutAct_9fa48("4467") ? cleaned : (stryCov_9fa48("4467"), cleaned.slice(1, stryMutAct_9fa48("4468") ? +1 : (stryCov_9fa48("4468"), -1)));
      }
    }
    // Reemplazar comillas dobles escapadas
    cleaned = cleaned.replace(/""/g, stryMutAct_9fa48("4469") ? "" : (stryCov_9fa48("4469"), '"'));
    return stryMutAct_9fa48("4470") ? cleaned : (stryCov_9fa48("4470"), cleaned.trim());
  }
}

/**
 * Parsea una línea CSV considerando comillas
 */
function parseCSVLine(line: string): string[] {
  if (stryMutAct_9fa48("4471")) {
    {}
  } else {
    stryCov_9fa48("4471");
    const values: string[] = stryMutAct_9fa48("4472") ? ["Stryker was here"] : (stryCov_9fa48("4472"), []);
    let current = stryMutAct_9fa48("4473") ? "Stryker was here!" : (stryCov_9fa48("4473"), '');
    let inQuotes = stryMutAct_9fa48("4474") ? true : (stryCov_9fa48("4474"), false);
    for (let i = 0; stryMutAct_9fa48("4477") ? i >= line.length : stryMutAct_9fa48("4476") ? i <= line.length : stryMutAct_9fa48("4475") ? false : (stryCov_9fa48("4475", "4476", "4477"), i < line.length); stryMutAct_9fa48("4478") ? i-- : (stryCov_9fa48("4478"), i++)) {
      if (stryMutAct_9fa48("4479")) {
        {}
      } else {
        stryCov_9fa48("4479");
        const char = line[i];
        if (stryMutAct_9fa48("4482") ? char !== '"' : stryMutAct_9fa48("4481") ? false : stryMutAct_9fa48("4480") ? true : (stryCov_9fa48("4480", "4481", "4482"), char === (stryMutAct_9fa48("4483") ? "" : (stryCov_9fa48("4483"), '"')))) {
          if (stryMutAct_9fa48("4484")) {
            {}
          } else {
            stryCov_9fa48("4484");
            if (stryMutAct_9fa48("4487") ? inQuotes || line[i + 1] === '"' : stryMutAct_9fa48("4486") ? false : stryMutAct_9fa48("4485") ? true : (stryCov_9fa48("4485", "4486", "4487"), inQuotes && (stryMutAct_9fa48("4489") ? line[i + 1] !== '"' : stryMutAct_9fa48("4488") ? true : (stryCov_9fa48("4488", "4489"), line[stryMutAct_9fa48("4490") ? i - 1 : (stryCov_9fa48("4490"), i + 1)] === (stryMutAct_9fa48("4491") ? "" : (stryCov_9fa48("4491"), '"')))))) {
              if (stryMutAct_9fa48("4492")) {
                {}
              } else {
                stryCov_9fa48("4492");
                // Comilla escapada
                current += stryMutAct_9fa48("4493") ? "" : (stryCov_9fa48("4493"), '"');
                stryMutAct_9fa48("4494") ? i-- : (stryCov_9fa48("4494"), i++); // Saltar la siguiente comilla
              }
            } else {
              if (stryMutAct_9fa48("4495")) {
                {}
              } else {
                stryCov_9fa48("4495");
                // Toggle de comillas
                inQuotes = stryMutAct_9fa48("4496") ? inQuotes : (stryCov_9fa48("4496"), !inQuotes);
              }
            }
          }
        } else if (stryMutAct_9fa48("4499") ? char === ',' || !inQuotes : stryMutAct_9fa48("4498") ? false : stryMutAct_9fa48("4497") ? true : (stryCov_9fa48("4497", "4498", "4499"), (stryMutAct_9fa48("4501") ? char !== ',' : stryMutAct_9fa48("4500") ? true : (stryCov_9fa48("4500", "4501"), char === (stryMutAct_9fa48("4502") ? "" : (stryCov_9fa48("4502"), ',')))) && (stryMutAct_9fa48("4503") ? inQuotes : (stryCov_9fa48("4503"), !inQuotes)))) {
          if (stryMutAct_9fa48("4504")) {
            {}
          } else {
            stryCov_9fa48("4504");
            // Separador de columna
            values.push(parseCSVValue(current));
            current = stryMutAct_9fa48("4505") ? "Stryker was here!" : (stryCov_9fa48("4505"), '');
          }
        } else {
          if (stryMutAct_9fa48("4506")) {
            {}
          } else {
            stryCov_9fa48("4506");
            stryMutAct_9fa48("4507") ? current -= char : (stryCov_9fa48("4507"), current += char);
          }
        }
      }
    }

    // Agregar último valor
    values.push(parseCSVValue(current));
    return values;
  }
}

/**
 * Parsea un archivo CSV a array de temas
 */
function parseCSV(csvText: string): TopicImportData[] {
  if (stryMutAct_9fa48("4508")) {
    {}
  } else {
    stryCov_9fa48("4508");
    // Normalizar saltos de línea
    const normalizedText = csvText.replace(/\r\n/g, stryMutAct_9fa48("4509") ? "" : (stryCov_9fa48("4509"), '\n')).replace(/\r/g, stryMutAct_9fa48("4510") ? "" : (stryCov_9fa48("4510"), '\n'));
    const lines = stryMutAct_9fa48("4511") ? normalizedText.split('\n') : (stryCov_9fa48("4511"), normalizedText.split(stryMutAct_9fa48("4512") ? "" : (stryCov_9fa48("4512"), '\n')).filter(stryMutAct_9fa48("4513") ? () => undefined : (stryCov_9fa48("4513"), line => stryMutAct_9fa48("4514") ? line : (stryCov_9fa48("4514"), line.trim()))));
    if (stryMutAct_9fa48("4518") ? lines.length >= 2 : stryMutAct_9fa48("4517") ? lines.length <= 2 : stryMutAct_9fa48("4516") ? false : stryMutAct_9fa48("4515") ? true : (stryCov_9fa48("4515", "4516", "4517", "4518"), lines.length < 2)) {
      if (stryMutAct_9fa48("4519")) {
        {}
      } else {
        stryCov_9fa48("4519");
        throw new Error(stryMutAct_9fa48("4520") ? "" : (stryCov_9fa48("4520"), 'El CSV debe tener al menos una fila de encabezados y una fila de datos'));
      }
    }

    // Parsear encabezados
    const headers = parseCSVLine(lines[0]).map(stryMutAct_9fa48("4521") ? () => undefined : (stryCov_9fa48("4521"), h => stryMutAct_9fa48("4523") ? h.toLowerCase() : stryMutAct_9fa48("4522") ? h.trim().toUpperCase() : (stryCov_9fa48("4522", "4523"), h.trim().toLowerCase())));

    // Encontrar índices de columnas (búsqueda flexible)
    const asignaturaIdx = headers.findIndex(stryMutAct_9fa48("4524") ? () => undefined : (stryCov_9fa48("4524"), h => stryMutAct_9fa48("4527") ? h === 'asignatura' && h.includes('asignatura') : stryMutAct_9fa48("4526") ? false : stryMutAct_9fa48("4525") ? true : (stryCov_9fa48("4525", "4526", "4527"), (stryMutAct_9fa48("4529") ? h !== 'asignatura' : stryMutAct_9fa48("4528") ? false : (stryCov_9fa48("4528", "4529"), h === (stryMutAct_9fa48("4530") ? "" : (stryCov_9fa48("4530"), 'asignatura')))) || h.includes(stryMutAct_9fa48("4531") ? "" : (stryCov_9fa48("4531"), 'asignatura')))));
    const ejeTematicoIdx = headers.findIndex(stryMutAct_9fa48("4532") ? () => undefined : (stryCov_9fa48("4532"), h => stryMutAct_9fa48("4535") ? (h === 'eje tematico' || h === 'eje_tematico' || h === 'ejetematico' || h.includes('eje') && h.includes('tematico')) && h.includes('eje') : stryMutAct_9fa48("4534") ? false : stryMutAct_9fa48("4533") ? true : (stryCov_9fa48("4533", "4534", "4535"), (stryMutAct_9fa48("4537") ? (h === 'eje tematico' || h === 'eje_tematico' || h === 'ejetematico') && h.includes('eje') && h.includes('tematico') : stryMutAct_9fa48("4536") ? false : (stryCov_9fa48("4536", "4537"), (stryMutAct_9fa48("4539") ? (h === 'eje tematico' || h === 'eje_tematico') && h === 'ejetematico' : stryMutAct_9fa48("4538") ? false : (stryCov_9fa48("4538", "4539"), (stryMutAct_9fa48("4541") ? h === 'eje tematico' && h === 'eje_tematico' : stryMutAct_9fa48("4540") ? false : (stryCov_9fa48("4540", "4541"), (stryMutAct_9fa48("4543") ? h !== 'eje tematico' : stryMutAct_9fa48("4542") ? false : (stryCov_9fa48("4542", "4543"), h === (stryMutAct_9fa48("4544") ? "" : (stryCov_9fa48("4544"), 'eje tematico')))) || (stryMutAct_9fa48("4546") ? h !== 'eje_tematico' : stryMutAct_9fa48("4545") ? false : (stryCov_9fa48("4545", "4546"), h === (stryMutAct_9fa48("4547") ? "" : (stryCov_9fa48("4547"), 'eje_tematico')))))) || (stryMutAct_9fa48("4549") ? h !== 'ejetematico' : stryMutAct_9fa48("4548") ? false : (stryCov_9fa48("4548", "4549"), h === (stryMutAct_9fa48("4550") ? "" : (stryCov_9fa48("4550"), 'ejetematico')))))) || (stryMutAct_9fa48("4552") ? h.includes('eje') || h.includes('tematico') : stryMutAct_9fa48("4551") ? false : (stryCov_9fa48("4551", "4552"), h.includes(stryMutAct_9fa48("4553") ? "" : (stryCov_9fa48("4553"), 'eje')) && h.includes(stryMutAct_9fa48("4554") ? "" : (stryCov_9fa48("4554"), 'tematico')))))) || h.includes(stryMutAct_9fa48("4555") ? "" : (stryCov_9fa48("4555"), 'eje')))));
    const nombreIdx = headers.findIndex(stryMutAct_9fa48("4556") ? () => undefined : (stryCov_9fa48("4556"), h => stryMutAct_9fa48("4559") ? (h === 'nombre' || h === 'tema' || h.includes('nombre')) && h.includes('tema') : stryMutAct_9fa48("4558") ? false : stryMutAct_9fa48("4557") ? true : (stryCov_9fa48("4557", "4558", "4559"), (stryMutAct_9fa48("4561") ? (h === 'nombre' || h === 'tema') && h.includes('nombre') : stryMutAct_9fa48("4560") ? false : (stryCov_9fa48("4560", "4561"), (stryMutAct_9fa48("4563") ? h === 'nombre' && h === 'tema' : stryMutAct_9fa48("4562") ? false : (stryCov_9fa48("4562", "4563"), (stryMutAct_9fa48("4565") ? h !== 'nombre' : stryMutAct_9fa48("4564") ? false : (stryCov_9fa48("4564", "4565"), h === (stryMutAct_9fa48("4566") ? "" : (stryCov_9fa48("4566"), 'nombre')))) || (stryMutAct_9fa48("4568") ? h !== 'tema' : stryMutAct_9fa48("4567") ? false : (stryCov_9fa48("4567", "4568"), h === (stryMutAct_9fa48("4569") ? "" : (stryCov_9fa48("4569"), 'tema')))))) || h.includes(stryMutAct_9fa48("4570") ? "" : (stryCov_9fa48("4570"), 'nombre')))) || h.includes(stryMutAct_9fa48("4571") ? "" : (stryCov_9fa48("4571"), 'tema')))));
    const descripcionIdx = headers.findIndex(stryMutAct_9fa48("4572") ? () => undefined : (stryCov_9fa48("4572"), h => stryMutAct_9fa48("4575") ? (h === 'descripcion' || h === 'descripción') && h.includes('descripcion') : stryMutAct_9fa48("4574") ? false : stryMutAct_9fa48("4573") ? true : (stryCov_9fa48("4573", "4574", "4575"), (stryMutAct_9fa48("4577") ? h === 'descripcion' && h === 'descripción' : stryMutAct_9fa48("4576") ? false : (stryCov_9fa48("4576", "4577"), (stryMutAct_9fa48("4579") ? h !== 'descripcion' : stryMutAct_9fa48("4578") ? false : (stryCov_9fa48("4578", "4579"), h === (stryMutAct_9fa48("4580") ? "" : (stryCov_9fa48("4580"), 'descripcion')))) || (stryMutAct_9fa48("4582") ? h !== 'descripción' : stryMutAct_9fa48("4581") ? false : (stryCov_9fa48("4581", "4582"), h === (stryMutAct_9fa48("4583") ? "" : (stryCov_9fa48("4583"), 'descripción')))))) || h.includes(stryMutAct_9fa48("4584") ? "" : (stryCov_9fa48("4584"), 'descripcion')))));
    if (stryMutAct_9fa48("4587") ? (asignaturaIdx === -1 || ejeTematicoIdx === -1) && nombreIdx === -1 : stryMutAct_9fa48("4586") ? false : stryMutAct_9fa48("4585") ? true : (stryCov_9fa48("4585", "4586", "4587"), (stryMutAct_9fa48("4589") ? asignaturaIdx === -1 && ejeTematicoIdx === -1 : stryMutAct_9fa48("4588") ? false : (stryCov_9fa48("4588", "4589"), (stryMutAct_9fa48("4591") ? asignaturaIdx !== -1 : stryMutAct_9fa48("4590") ? false : (stryCov_9fa48("4590", "4591"), asignaturaIdx === (stryMutAct_9fa48("4592") ? +1 : (stryCov_9fa48("4592"), -1)))) || (stryMutAct_9fa48("4594") ? ejeTematicoIdx !== -1 : stryMutAct_9fa48("4593") ? false : (stryCov_9fa48("4593", "4594"), ejeTematicoIdx === (stryMutAct_9fa48("4595") ? +1 : (stryCov_9fa48("4595"), -1)))))) || (stryMutAct_9fa48("4597") ? nombreIdx !== -1 : stryMutAct_9fa48("4596") ? false : (stryCov_9fa48("4596", "4597"), nombreIdx === (stryMutAct_9fa48("4598") ? +1 : (stryCov_9fa48("4598"), -1)))))) {
      if (stryMutAct_9fa48("4599")) {
        {}
      } else {
        stryCov_9fa48("4599");
        throw new Error((stryMutAct_9fa48("4600") ? `` : (stryCov_9fa48("4600"), `El CSV debe contener columnas: asignatura, eje temático, nombre. `)) + (stryMutAct_9fa48("4601") ? `` : (stryCov_9fa48("4601"), `Columnas encontradas: ${headers.join(stryMutAct_9fa48("4602") ? "" : (stryCov_9fa48("4602"), ', '))}`)));
      }
    }

    // Parsear datos
    const topics: TopicImportData[] = stryMutAct_9fa48("4603") ? ["Stryker was here"] : (stryCov_9fa48("4603"), []);
    for (let i = 1; stryMutAct_9fa48("4606") ? i >= lines.length : stryMutAct_9fa48("4605") ? i <= lines.length : stryMutAct_9fa48("4604") ? false : (stryCov_9fa48("4604", "4605", "4606"), i < lines.length); stryMutAct_9fa48("4607") ? i-- : (stryCov_9fa48("4607"), i++)) {
      if (stryMutAct_9fa48("4608")) {
        {}
      } else {
        stryCov_9fa48("4608");
        const values = parseCSVLine(lines[i]);
        if (stryMutAct_9fa48("4612") ? values.length > Math.max(asignaturaIdx, ejeTematicoIdx, nombreIdx) : stryMutAct_9fa48("4611") ? values.length < Math.max(asignaturaIdx, ejeTematicoIdx, nombreIdx) : stryMutAct_9fa48("4610") ? false : stryMutAct_9fa48("4609") ? true : (stryCov_9fa48("4609", "4610", "4611", "4612"), values.length <= (stryMutAct_9fa48("4613") ? Math.min(asignaturaIdx, ejeTematicoIdx, nombreIdx) : (stryCov_9fa48("4613"), Math.max(asignaturaIdx, ejeTematicoIdx, nombreIdx))))) {
          if (stryMutAct_9fa48("4614")) {
            {}
          } else {
            stryCov_9fa48("4614");
            // Fila incompleta, saltar
            continue;
          }
        }
        const asignatura = stryMutAct_9fa48("4616") ? values[asignaturaIdx].trim() : stryMutAct_9fa48("4615") ? values[asignaturaIdx] : (stryCov_9fa48("4615", "4616"), values[asignaturaIdx]?.trim());
        const ejeTematico = stryMutAct_9fa48("4618") ? values[ejeTematicoIdx].trim() : stryMutAct_9fa48("4617") ? values[ejeTematicoIdx] : (stryCov_9fa48("4617", "4618"), values[ejeTematicoIdx]?.trim());
        const nombre = stryMutAct_9fa48("4620") ? values[nombreIdx].trim() : stryMutAct_9fa48("4619") ? values[nombreIdx] : (stryCov_9fa48("4619", "4620"), values[nombreIdx]?.trim());
        if (stryMutAct_9fa48("4623") ? asignatura && ejeTematico || nombre : stryMutAct_9fa48("4622") ? false : stryMutAct_9fa48("4621") ? true : (stryCov_9fa48("4621", "4622", "4623"), (stryMutAct_9fa48("4625") ? asignatura || ejeTematico : stryMutAct_9fa48("4624") ? true : (stryCov_9fa48("4624", "4625"), asignatura && ejeTematico)) && nombre)) {
          if (stryMutAct_9fa48("4626")) {
            {}
          } else {
            stryCov_9fa48("4626");
            topics.push(stryMutAct_9fa48("4627") ? {} : (stryCov_9fa48("4627"), {
              asignatura,
              ejeTematico,
              nombre,
              descripcion: (stryMutAct_9fa48("4630") ? descripcionIdx !== -1 || values[descripcionIdx] : stryMutAct_9fa48("4629") ? false : stryMutAct_9fa48("4628") ? true : (stryCov_9fa48("4628", "4629", "4630"), (stryMutAct_9fa48("4632") ? descripcionIdx === -1 : stryMutAct_9fa48("4631") ? true : (stryCov_9fa48("4631", "4632"), descripcionIdx !== (stryMutAct_9fa48("4633") ? +1 : (stryCov_9fa48("4633"), -1)))) && values[descripcionIdx])) ? stryMutAct_9fa48("4636") ? values[descripcionIdx].trim() && null : stryMutAct_9fa48("4635") ? false : stryMutAct_9fa48("4634") ? true : (stryCov_9fa48("4634", "4635", "4636"), (stryMutAct_9fa48("4637") ? values[descripcionIdx] : (stryCov_9fa48("4637"), values[descripcionIdx].trim())) || null) : null
            }));
          }
        }
      }
    }
    if (stryMutAct_9fa48("4640") ? topics.length !== 0 : stryMutAct_9fa48("4639") ? false : stryMutAct_9fa48("4638") ? true : (stryCov_9fa48("4638", "4639", "4640"), topics.length === 0)) {
      if (stryMutAct_9fa48("4641")) {
        {}
      } else {
        stryCov_9fa48("4641");
        throw new Error(stryMutAct_9fa48("4642") ? "" : (stryCov_9fa48("4642"), 'No se encontraron temas válidos en el CSV'));
      }
    }
    return topics;
  }
}

/**
 * Detecta y extrae temarios desde el texto de un PDF
 * Busca patrones comunes de estructura de temarios PAES
 */
function parseTopicsFromPDF(text: string): TopicImportData[] {
  if (stryMutAct_9fa48("4643")) {
    {}
  } else {
    stryCov_9fa48("4643");
    const topics: TopicImportData[] = stryMutAct_9fa48("4644") ? ["Stryker was here"] : (stryCov_9fa48("4644"), []);

    // Buscar asignaturas conocidas en el texto
    const subjectPatterns = Object.keys(SUBJECT_MAPPING).map(stryMutAct_9fa48("4645") ? () => undefined : (stryCov_9fa48("4645"), subject => stryMutAct_9fa48("4646") ? {} : (stryCov_9fa48("4646"), {
      name: subject,
      code: SUBJECT_MAPPING[subject],
      pattern: new RegExp(subject.replace(stryMutAct_9fa48("4647") ? /[^.*+?^${}()|[\]\\]/g : (stryCov_9fa48("4647"), /[.*+?^${}()|[\]\\]/g), stryMutAct_9fa48("4648") ? "" : (stryCov_9fa48("4648"), '\\$&')), stryMutAct_9fa48("4649") ? "" : (stryCov_9fa48("4649"), 'i'))
    })));

    // Normalizar saltos de línea pero preservar estructura
    // NO reemplazar todos los espacios por uno solo, ya que perdemos la estructura del documento
    const normalizedText = text.replace(/\r\n/g, stryMutAct_9fa48("4650") ? "" : (stryCov_9fa48("4650"), '\n')).replace(/\r/g, stryMutAct_9fa48("4651") ? "" : (stryCov_9fa48("4651"), '\n'))
    // Normalizar múltiples espacios en la misma línea, pero mantener saltos de línea
    .replace(stryMutAct_9fa48("4653") ? /[^ \t]+/g : stryMutAct_9fa48("4652") ? /[ \t]/g : (stryCov_9fa48("4652", "4653"), /[ \t]+/g), stryMutAct_9fa48("4654") ? "" : (stryCov_9fa48("4654"), ' ')).replace(stryMutAct_9fa48("4656") ? /\n[^ \t]+/g : stryMutAct_9fa48("4655") ? /\n[ \t]/g : (stryCov_9fa48("4655", "4656"), /\n[ \t]+/g), stryMutAct_9fa48("4657") ? "" : (stryCov_9fa48("4657"), '\n')).replace(stryMutAct_9fa48("4659") ? /[^ \t]+\n/g : stryMutAct_9fa48("4658") ? /[ \t]\n/g : (stryCov_9fa48("4658", "4659"), /[ \t]+\n/g), stryMutAct_9fa48("4660") ? "" : (stryCov_9fa48("4660"), '\n'));

    // Dividir el texto en secciones por asignatura
    const sections: Array<{
      subject: string;
      text: string;
    }> = stryMutAct_9fa48("4661") ? ["Stryker was here"] : (stryCov_9fa48("4661"), []);
    let currentSubject = stryMutAct_9fa48("4662") ? "Stryker was here!" : (stryCov_9fa48("4662"), '');
    let currentText = stryMutAct_9fa48("4663") ? "Stryker was here!" : (stryCov_9fa48("4663"), '');
    const lines = normalizedText.split(stryMutAct_9fa48("4664") ? "" : (stryCov_9fa48("4664"), '\n'));
    for (let i = 0; stryMutAct_9fa48("4667") ? i >= lines.length : stryMutAct_9fa48("4666") ? i <= lines.length : stryMutAct_9fa48("4665") ? false : (stryCov_9fa48("4665", "4666", "4667"), i < lines.length); stryMutAct_9fa48("4668") ? i-- : (stryCov_9fa48("4668"), i++)) {
      if (stryMutAct_9fa48("4669")) {
        {}
      } else {
        stryCov_9fa48("4669");
        const line = stryMutAct_9fa48("4670") ? lines[i] : (stryCov_9fa48("4670"), lines[i].trim());

        // Buscar si esta línea contiene una asignatura
        const foundSubject = subjectPatterns.find(stryMutAct_9fa48("4671") ? () => undefined : (stryCov_9fa48("4671"), sp => sp.pattern.test(line)));
        if (stryMutAct_9fa48("4673") ? false : stryMutAct_9fa48("4672") ? true : (stryCov_9fa48("4672", "4673"), foundSubject)) {
          if (stryMutAct_9fa48("4674")) {
            {}
          } else {
            stryCov_9fa48("4674");
            // Guardar sección anterior si existe
            if (stryMutAct_9fa48("4677") ? currentSubject || currentText.trim() : stryMutAct_9fa48("4676") ? false : stryMutAct_9fa48("4675") ? true : (stryCov_9fa48("4675", "4676", "4677"), currentSubject && (stryMutAct_9fa48("4678") ? currentText : (stryCov_9fa48("4678"), currentText.trim())))) {
              if (stryMutAct_9fa48("4679")) {
                {}
              } else {
                stryCov_9fa48("4679");
                sections.push(stryMutAct_9fa48("4680") ? {} : (stryCov_9fa48("4680"), {
                  subject: currentSubject,
                  text: stryMutAct_9fa48("4681") ? currentText : (stryCov_9fa48("4681"), currentText.trim())
                }));
              }
            }
            // Iniciar nueva sección
            currentSubject = foundSubject.name;
            currentText = stryMutAct_9fa48("4682") ? "Stryker was here!" : (stryCov_9fa48("4682"), '');
          }
        } else if (stryMutAct_9fa48("4684") ? false : stryMutAct_9fa48("4683") ? true : (stryCov_9fa48("4683", "4684"), currentSubject)) {
          if (stryMutAct_9fa48("4685")) {
            {}
          } else {
            stryCov_9fa48("4685");
            stryMutAct_9fa48("4686") ? currentText -= line + '\n' : (stryCov_9fa48("4686"), currentText += line + (stryMutAct_9fa48("4687") ? "" : (stryCov_9fa48("4687"), '\n')));
          }
        }
      }
    }

    // Agregar última sección
    if (stryMutAct_9fa48("4690") ? currentSubject || currentText.trim() : stryMutAct_9fa48("4689") ? false : stryMutAct_9fa48("4688") ? true : (stryCov_9fa48("4688", "4689", "4690"), currentSubject && (stryMutAct_9fa48("4691") ? currentText : (stryCov_9fa48("4691"), currentText.trim())))) {
      if (stryMutAct_9fa48("4692")) {
        {}
      } else {
        stryCov_9fa48("4692");
        sections.push(stryMutAct_9fa48("4693") ? {} : (stryCov_9fa48("4693"), {
          subject: currentSubject,
          text: stryMutAct_9fa48("4694") ? currentText : (stryCov_9fa48("4694"), currentText.trim())
        }));
      }
    }

    // Si no se encontraron secciones por asignatura, intentar parsear todo el texto
    if (stryMutAct_9fa48("4697") ? sections.length !== 0 : stryMutAct_9fa48("4696") ? false : stryMutAct_9fa48("4695") ? true : (stryCov_9fa48("4695", "4696", "4697"), sections.length === 0)) {
      if (stryMutAct_9fa48("4698")) {
        {}
      } else {
        stryCov_9fa48("4698");
        // Buscar patrones de estructura de temario sin asignatura explícita
        // Asumir que el usuario especificará la asignatura o se detectará después
        sections.push(stryMutAct_9fa48("4699") ? {} : (stryCov_9fa48("4699"), {
          subject: stryMutAct_9fa48("4700") ? "Stryker was here!" : (stryCov_9fa48("4700"), ''),
          text: normalizedText
        }));
      }
    }

    // Parsear cada sección para extraer ejes temáticos y temas
    for (const section of sections) {
      if (stryMutAct_9fa48("4701")) {
        {}
      } else {
        stryCov_9fa48("4701");
        const sectionText = section.text;

        // Patrones para detectar ejes temáticos (títulos en mayúsculas, numerados, etc.)
        const ejePatterns = stryMutAct_9fa48("4702") ? [] : (stryCov_9fa48("4702"), [// Patrón 1: "EJE TEMÁTICO", "ÁREA TEMÁTICA", etc.
        stryMutAct_9fa48("4712") ? /(?:^|\n)\s*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s]+(?:TEMÁTICO|TEMATICO|EJE|ÁREA|AREA)[A-ZÁÉÍÓÚÑ\S]*)/i : stryMutAct_9fa48("4711") ? /(?:^|\n)\s*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s]+(?:TEMÁTICO|TEMATICO|EJE|ÁREA|AREA)[^A-ZÁÉÍÓÚÑ\s]*)/i : stryMutAct_9fa48("4710") ? /(?:^|\n)\s*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s]+(?:TEMÁTICO|TEMATICO|EJE|ÁREA|AREA)[A-ZÁÉÍÓÚÑ\s])/i : stryMutAct_9fa48("4709") ? /(?:^|\n)\s*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\S]+(?:TEMÁTICO|TEMATICO|EJE|ÁREA|AREA)[A-ZÁÉÍÓÚÑ\s]*)/i : stryMutAct_9fa48("4708") ? /(?:^|\n)\s*([A-ZÁÉÍÓÚÑ][^A-ZÁÉÍÓÚÑ\s]+(?:TEMÁTICO|TEMATICO|EJE|ÁREA|AREA)[A-ZÁÉÍÓÚÑ\s]*)/i : stryMutAct_9fa48("4707") ? /(?:^|\n)\s*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s](?:TEMÁTICO|TEMATICO|EJE|ÁREA|AREA)[A-ZÁÉÍÓÚÑ\s]*)/i : stryMutAct_9fa48("4706") ? /(?:^|\n)\s*([^A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s]+(?:TEMÁTICO|TEMATICO|EJE|ÁREA|AREA)[A-ZÁÉÍÓÚÑ\s]*)/i : stryMutAct_9fa48("4705") ? /(?:^|\n)\S*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s]+(?:TEMÁTICO|TEMATICO|EJE|ÁREA|AREA)[A-ZÁÉÍÓÚÑ\s]*)/i : stryMutAct_9fa48("4704") ? /(?:^|\n)\s([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s]+(?:TEMÁTICO|TEMATICO|EJE|ÁREA|AREA)[A-ZÁÉÍÓÚÑ\s]*)/i : stryMutAct_9fa48("4703") ? /(?:\n)\s*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s]+(?:TEMÁTICO|TEMATICO|EJE|ÁREA|AREA)[A-ZÁÉÍÓÚÑ\s]*)/i : (stryCov_9fa48("4703", "4704", "4705", "4706", "4707", "4708", "4709", "4710", "4711", "4712"), /(?:^|\n)\s*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s]+(?:TEMÁTICO|TEMATICO|EJE|ÁREA|AREA)[A-ZÁÉÍÓÚÑ\s]*)/i), // Patrón 2: Numeración seguida de título en mayúsculas (ej: "1. ÁLGEBRA Y FUNCIONES")
        stryMutAct_9fa48("4724") ? /(?:^|\n)\s*(\d+[\.\)]\s*[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\S]{10,80})/ : stryMutAct_9fa48("4723") ? /(?:^|\n)\s*(\d+[\.\)]\s*[A-ZÁÉÍÓÚÑ][^A-ZÁÉÍÓÚÑa-záéíóúñ\s]{10,80})/ : stryMutAct_9fa48("4722") ? /(?:^|\n)\s*(\d+[\.\)]\s*[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s])/ : stryMutAct_9fa48("4721") ? /(?:^|\n)\s*(\d+[\.\)]\s*[^A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{10,80})/ : stryMutAct_9fa48("4720") ? /(?:^|\n)\s*(\d+[\.\)]\S*[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{10,80})/ : stryMutAct_9fa48("4719") ? /(?:^|\n)\s*(\d+[\.\)]\s[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{10,80})/ : stryMutAct_9fa48("4718") ? /(?:^|\n)\s*(\d+[^\.\)]\s*[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{10,80})/ : stryMutAct_9fa48("4717") ? /(?:^|\n)\s*(\D+[\.\)]\s*[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{10,80})/ : stryMutAct_9fa48("4716") ? /(?:^|\n)\s*(\d[\.\)]\s*[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{10,80})/ : stryMutAct_9fa48("4715") ? /(?:^|\n)\S*(\d+[\.\)]\s*[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{10,80})/ : stryMutAct_9fa48("4714") ? /(?:^|\n)\s(\d+[\.\)]\s*[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{10,80})/ : stryMutAct_9fa48("4713") ? /(?:\n)\s*(\d+[\.\)]\s*[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{10,80})/ : (stryCov_9fa48("4713", "4714", "4715", "4716", "4717", "4718", "4719", "4720", "4721", "4722", "4723", "4724"), /(?:^|\n)\s*(\d+[\.\)]\s*[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{10,80})/), // Patrón 3: Títulos en mayúsculas al inicio de línea (mínimo 15 caracteres)
        stryMutAct_9fa48("4733") ? /(?:^|\n)\s*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{15,80})(?=\n)/ : stryMutAct_9fa48("4732") ? /(?:^|\n)\s*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{15,80})(?!\n|$)/ : stryMutAct_9fa48("4731") ? /(?:^|\n)\s*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\S]{15,80})(?=\n|$)/ : stryMutAct_9fa48("4730") ? /(?:^|\n)\s*([A-ZÁÉÍÓÚÑ][^A-ZÁÉÍÓÚÑa-záéíóúñ\s]{15,80})(?=\n|$)/ : stryMutAct_9fa48("4729") ? /(?:^|\n)\s*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s])(?=\n|$)/ : stryMutAct_9fa48("4728") ? /(?:^|\n)\s*([^A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{15,80})(?=\n|$)/ : stryMutAct_9fa48("4727") ? /(?:^|\n)\S*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{15,80})(?=\n|$)/ : stryMutAct_9fa48("4726") ? /(?:^|\n)\s([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{15,80})(?=\n|$)/ : stryMutAct_9fa48("4725") ? /(?:\n)\s*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{15,80})(?=\n|$)/ : (stryCov_9fa48("4725", "4726", "4727", "4728", "4729", "4730", "4731", "4732", "4733"), /(?:^|\n)\s*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{15,80})(?=\n|$)/), // Patrón 4: Títulos con formato especial (ej: "--- ÁLGEBRA ---")
        stryMutAct_9fa48("4748") ? /(?:^|\n)\s*[-=]+\s*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{10,60})\s*[^-=]+/i : stryMutAct_9fa48("4747") ? /(?:^|\n)\s*[-=]+\s*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{10,60})\s*[-=]/i : stryMutAct_9fa48("4746") ? /(?:^|\n)\s*[-=]+\s*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{10,60})\S*[-=]+/i : stryMutAct_9fa48("4745") ? /(?:^|\n)\s*[-=]+\s*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{10,60})\s[-=]+/i : stryMutAct_9fa48("4744") ? /(?:^|\n)\s*[-=]+\s*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\S]{10,60})\s*[-=]+/i : stryMutAct_9fa48("4743") ? /(?:^|\n)\s*[-=]+\s*([A-ZÁÉÍÓÚÑ][^A-ZÁÉÍÓÚÑa-záéíóúñ\s]{10,60})\s*[-=]+/i : stryMutAct_9fa48("4742") ? /(?:^|\n)\s*[-=]+\s*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s])\s*[-=]+/i : stryMutAct_9fa48("4741") ? /(?:^|\n)\s*[-=]+\s*([^A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{10,60})\s*[-=]+/i : stryMutAct_9fa48("4740") ? /(?:^|\n)\s*[-=]+\S*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{10,60})\s*[-=]+/i : stryMutAct_9fa48("4739") ? /(?:^|\n)\s*[-=]+\s([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{10,60})\s*[-=]+/i : stryMutAct_9fa48("4738") ? /(?:^|\n)\s*[^-=]+\s*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{10,60})\s*[-=]+/i : stryMutAct_9fa48("4737") ? /(?:^|\n)\s*[-=]\s*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{10,60})\s*[-=]+/i : stryMutAct_9fa48("4736") ? /(?:^|\n)\S*[-=]+\s*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{10,60})\s*[-=]+/i : stryMutAct_9fa48("4735") ? /(?:^|\n)\s[-=]+\s*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{10,60})\s*[-=]+/i : stryMutAct_9fa48("4734") ? /(?:\n)\s*[-=]+\s*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{10,60})\s*[-=]+/i : (stryCov_9fa48("4734", "4735", "4736", "4737", "4738", "4739", "4740", "4741", "4742", "4743", "4744", "4745", "4746", "4747", "4748"), /(?:^|\n)\s*[-=]+\s*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{10,60})\s*[-=]+/i)]);
        let currentEje = stryMutAct_9fa48("4749") ? "Stryker was here!" : (stryCov_9fa48("4749"), '');
        const ejeMatches: Array<{
          eje: string;
          startIndex: number;
        }> = stryMutAct_9fa48("4750") ? ["Stryker was here"] : (stryCov_9fa48("4750"), []);
        for (const pattern of ejePatterns) {
          if (stryMutAct_9fa48("4751")) {
            {}
          } else {
            stryCov_9fa48("4751");
            try {
              if (stryMutAct_9fa48("4752")) {
                {}
              } else {
                stryCov_9fa48("4752");
                const matches = Array.from(sectionText.matchAll(new RegExp(pattern.source, stryMutAct_9fa48("4753") ? "" : (stryCov_9fa48("4753"), 'gm'))));
                for (const match of matches) {
                  if (stryMutAct_9fa48("4754")) {
                    {}
                  } else {
                    stryCov_9fa48("4754");
                    if (stryMutAct_9fa48("4756") ? false : stryMutAct_9fa48("4755") ? true : (stryCov_9fa48("4755", "4756"), match[1])) {
                      if (stryMutAct_9fa48("4757")) {
                        {}
                      } else {
                        stryCov_9fa48("4757");
                        let eje = stryMutAct_9fa48("4759") ? match[1].replace(/^\d+[\.\)]\s+/, '').replace(/^[-=]+\s+/, '').replace(/\s+[-=]+$/, '')
                        // Normalizar espacios múltiples pero mantener estructura
                        .replace(/[ \t]+/g, ' ').trim() : stryMutAct_9fa48("4758") ? match[1].trim().replace(/^\d+[\.\)]\s+/, '').replace(/^[-=]+\s+/, '').replace(/\s+[-=]+$/, '')
                        // Normalizar espacios múltiples pero mantener estructura
                        .replace(/[ \t]+/g, ' ') : (stryCov_9fa48("4758", "4759"), match[1].trim().replace(stryMutAct_9fa48("4765") ? /^\d+[\.\)]\S+/ : stryMutAct_9fa48("4764") ? /^\d+[\.\)]\s/ : stryMutAct_9fa48("4763") ? /^\d+[^\.\)]\s+/ : stryMutAct_9fa48("4762") ? /^\D+[\.\)]\s+/ : stryMutAct_9fa48("4761") ? /^\d[\.\)]\s+/ : stryMutAct_9fa48("4760") ? /\d+[\.\)]\s+/ : (stryCov_9fa48("4760", "4761", "4762", "4763", "4764", "4765"), /^\d+[\.\)]\s+/), stryMutAct_9fa48("4766") ? "Stryker was here!" : (stryCov_9fa48("4766"), '')).replace(stryMutAct_9fa48("4771") ? /^[-=]+\S+/ : stryMutAct_9fa48("4770") ? /^[-=]+\s/ : stryMutAct_9fa48("4769") ? /^[^-=]+\s+/ : stryMutAct_9fa48("4768") ? /^[-=]\s+/ : stryMutAct_9fa48("4767") ? /[-=]+\s+/ : (stryCov_9fa48("4767", "4768", "4769", "4770", "4771"), /^[-=]+\s+/), stryMutAct_9fa48("4772") ? "Stryker was here!" : (stryCov_9fa48("4772"), '')).replace(stryMutAct_9fa48("4777") ? /\s+[^-=]+$/ : stryMutAct_9fa48("4776") ? /\s+[-=]$/ : stryMutAct_9fa48("4775") ? /\S+[-=]+$/ : stryMutAct_9fa48("4774") ? /\s[-=]+$/ : stryMutAct_9fa48("4773") ? /\s+[-=]+/ : (stryCov_9fa48("4773", "4774", "4775", "4776", "4777"), /\s+[-=]+$/), stryMutAct_9fa48("4778") ? "Stryker was here!" : (stryCov_9fa48("4778"), ''))
                        // Normalizar espacios múltiples pero mantener estructura
                        .replace(stryMutAct_9fa48("4780") ? /[^ \t]+/g : stryMutAct_9fa48("4779") ? /[ \t]/g : (stryCov_9fa48("4779", "4780"), /[ \t]+/g), stryMutAct_9fa48("4781") ? "" : (stryCov_9fa48("4781"), ' ')).trim());

                        // Validar que el eje no sea solo números o caracteres especiales
                        if (stryMutAct_9fa48("4784") ? eje.length > 5 && eje.length < 100 || !eje.match(/^[\d\s\-=\.]+$/) : stryMutAct_9fa48("4783") ? false : stryMutAct_9fa48("4782") ? true : (stryCov_9fa48("4782", "4783", "4784"), (stryMutAct_9fa48("4786") ? eje.length > 5 || eje.length < 100 : stryMutAct_9fa48("4785") ? true : (stryCov_9fa48("4785", "4786"), (stryMutAct_9fa48("4789") ? eje.length <= 5 : stryMutAct_9fa48("4788") ? eje.length >= 5 : stryMutAct_9fa48("4787") ? true : (stryCov_9fa48("4787", "4788", "4789"), eje.length > 5)) && (stryMutAct_9fa48("4792") ? eje.length >= 100 : stryMutAct_9fa48("4791") ? eje.length <= 100 : stryMutAct_9fa48("4790") ? true : (stryCov_9fa48("4790", "4791", "4792"), eje.length < 100)))) && (stryMutAct_9fa48("4793") ? eje.match(/^[\d\s\-=\.]+$/) : (stryCov_9fa48("4793"), !eje.match(stryMutAct_9fa48("4799") ? /^[\d\S\-=\.]+$/ : stryMutAct_9fa48("4798") ? /^[\D\s\-=\.]+$/ : stryMutAct_9fa48("4797") ? /^[^\d\s\-=\.]+$/ : stryMutAct_9fa48("4796") ? /^[\d\s\-=\.]$/ : stryMutAct_9fa48("4795") ? /^[\d\s\-=\.]+/ : stryMutAct_9fa48("4794") ? /[\d\s\-=\.]+$/ : (stryCov_9fa48("4794", "4795", "4796", "4797", "4798", "4799"), /^[\d\s\-=\.]+$/)))))) {
                          if (stryMutAct_9fa48("4800")) {
                            {}
                          } else {
                            stryCov_9fa48("4800");
                            // Evitar duplicados (comparar sin considerar mayúsculas/minúsculas)
                            const ejeLower = stryMutAct_9fa48("4801") ? eje.toUpperCase() : (stryCov_9fa48("4801"), eje.toLowerCase());
                            if (stryMutAct_9fa48("4804") ? false : stryMutAct_9fa48("4803") ? true : stryMutAct_9fa48("4802") ? ejeMatches.some(e => e.eje.toLowerCase() === ejeLower) : (stryCov_9fa48("4802", "4803", "4804"), !(stryMutAct_9fa48("4805") ? ejeMatches.every(e => e.eje.toLowerCase() === ejeLower) : (stryCov_9fa48("4805"), ejeMatches.some(stryMutAct_9fa48("4806") ? () => undefined : (stryCov_9fa48("4806"), e => stryMutAct_9fa48("4809") ? e.eje.toLowerCase() !== ejeLower : stryMutAct_9fa48("4808") ? false : stryMutAct_9fa48("4807") ? true : (stryCov_9fa48("4807", "4808", "4809"), (stryMutAct_9fa48("4810") ? e.eje.toUpperCase() : (stryCov_9fa48("4810"), e.eje.toLowerCase())) === ejeLower))))))) {
                              if (stryMutAct_9fa48("4811")) {
                                {}
                              } else {
                                stryCov_9fa48("4811");
                                ejeMatches.push(stryMutAct_9fa48("4812") ? {} : (stryCov_9fa48("4812"), {
                                  eje,
                                  startIndex: stryMutAct_9fa48("4815") ? match.index && 0 : stryMutAct_9fa48("4814") ? false : stryMutAct_9fa48("4813") ? true : (stryCov_9fa48("4813", "4814", "4815"), match.index || 0)
                                }));
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            } catch (error) {
              if (stryMutAct_9fa48("4816")) {
                {}
              } else {
                stryCov_9fa48("4816");
                // Si hay un error con el regex, continuar con el siguiente patrón
                logger.warn(stryMutAct_9fa48("4817") ? {} : (stryCov_9fa48("4817"), {
                  type: stryMutAct_9fa48("4818") ? "" : (stryCov_9fa48("4818"), 'import_topics_error'),
                  error: error instanceof Error ? error.message : String(error),
                  path: stryMutAct_9fa48("4819") ? "" : (stryCov_9fa48("4819"), '/api/admin/import-topics'),
                  action: stryMutAct_9fa48("4820") ? "" : (stryCov_9fa48("4820"), 'process_eje_tematico_pattern')
                }), stryMutAct_9fa48("4821") ? "" : (stryCov_9fa48("4821"), 'Error al procesar patrón de eje temático'));
                continue;
              }
            }
          }
        }

        // Ordenar por posición en el texto
        stryMutAct_9fa48("4822") ? ejeMatches : (stryCov_9fa48("4822"), ejeMatches.sort(stryMutAct_9fa48("4823") ? () => undefined : (stryCov_9fa48("4823"), (a, b) => stryMutAct_9fa48("4824") ? a.startIndex + b.startIndex : (stryCov_9fa48("4824"), a.startIndex - b.startIndex))));

        // Si no se encontraron ejes temáticos, usar el texto completo como un eje
        if (stryMutAct_9fa48("4827") ? ejeMatches.length !== 0 : stryMutAct_9fa48("4826") ? false : stryMutAct_9fa48("4825") ? true : (stryCov_9fa48("4825", "4826", "4827"), ejeMatches.length === 0)) {
          if (stryMutAct_9fa48("4828")) {
            {}
          } else {
            stryCov_9fa48("4828");
            currentEje = stryMutAct_9fa48("4829") ? "" : (stryCov_9fa48("4829"), 'General');
            ejeMatches.push(stryMutAct_9fa48("4830") ? {} : (stryCov_9fa48("4830"), {
              eje: stryMutAct_9fa48("4831") ? "" : (stryCov_9fa48("4831"), 'General'),
              startIndex: 0
            }));
          }
        }

        // Para cada eje temático, buscar temas
        for (let i = 0; stryMutAct_9fa48("4834") ? i >= ejeMatches.length : stryMutAct_9fa48("4833") ? i <= ejeMatches.length : stryMutAct_9fa48("4832") ? false : (stryCov_9fa48("4832", "4833", "4834"), i < ejeMatches.length); stryMutAct_9fa48("4835") ? i-- : (stryCov_9fa48("4835"), i++)) {
          if (stryMutAct_9fa48("4836")) {
            {}
          } else {
            stryCov_9fa48("4836");
            const ejeMatch = ejeMatches[i];
            const nextEjeIndex = (stryMutAct_9fa48("4840") ? i >= ejeMatches.length - 1 : stryMutAct_9fa48("4839") ? i <= ejeMatches.length - 1 : stryMutAct_9fa48("4838") ? false : stryMutAct_9fa48("4837") ? true : (stryCov_9fa48("4837", "4838", "4839", "4840"), i < (stryMutAct_9fa48("4841") ? ejeMatches.length + 1 : (stryCov_9fa48("4841"), ejeMatches.length - 1)))) ? ejeMatches[stryMutAct_9fa48("4842") ? i - 1 : (stryCov_9fa48("4842"), i + 1)].startIndex : sectionText.length;
            const ejeText = stryMutAct_9fa48("4843") ? sectionText : (stryCov_9fa48("4843"), sectionText.substring(ejeMatch.startIndex, nextEjeIndex));
            currentEje = ejeMatch.eje;

            // Patrones para detectar temas (viñetas, números, guiones, etc.)
            const temaPatterns = stryMutAct_9fa48("4844") ? [] : (stryCov_9fa48("4844"), [// Patrón 1: Viñetas (-, •, ▪, ▫, o, etc.)
            stryMutAct_9fa48("4852") ? /(?:^|\n)\s*[-•▪▫o]\s+([\n]{5,150})/g : stryMutAct_9fa48("4851") ? /(?:^|\n)\s*[-•▪▫o]\s+([^\n])/g : stryMutAct_9fa48("4850") ? /(?:^|\n)\s*[-•▪▫o]\S+([^\n]{5,150})/g : stryMutAct_9fa48("4849") ? /(?:^|\n)\s*[-•▪▫o]\s([^\n]{5,150})/g : stryMutAct_9fa48("4848") ? /(?:^|\n)\s*[^-•▪▫o]\s+([^\n]{5,150})/g : stryMutAct_9fa48("4847") ? /(?:^|\n)\S*[-•▪▫o]\s+([^\n]{5,150})/g : stryMutAct_9fa48("4846") ? /(?:^|\n)\s[-•▪▫o]\s+([^\n]{5,150})/g : stryMutAct_9fa48("4845") ? /(?:\n)\s*[-•▪▫o]\s+([^\n]{5,150})/g : (stryCov_9fa48("4845", "4846", "4847", "4848", "4849", "4850", "4851", "4852"), /(?:^|\n)\s*[-•▪▫o]\s+([^\n]{5,150})/g), // Patrón 2: Numeración (1., 2), a), etc.)
            stryMutAct_9fa48("4862") ? /(?:^|\n)\s*\d+[\.\)]\s+([\n]{5,150})/g : stryMutAct_9fa48("4861") ? /(?:^|\n)\s*\d+[\.\)]\s+([^\n])/g : stryMutAct_9fa48("4860") ? /(?:^|\n)\s*\d+[\.\)]\S+([^\n]{5,150})/g : stryMutAct_9fa48("4859") ? /(?:^|\n)\s*\d+[\.\)]\s([^\n]{5,150})/g : stryMutAct_9fa48("4858") ? /(?:^|\n)\s*\d+[^\.\)]\s+([^\n]{5,150})/g : stryMutAct_9fa48("4857") ? /(?:^|\n)\s*\D+[\.\)]\s+([^\n]{5,150})/g : stryMutAct_9fa48("4856") ? /(?:^|\n)\s*\d[\.\)]\s+([^\n]{5,150})/g : stryMutAct_9fa48("4855") ? /(?:^|\n)\S*\d+[\.\)]\s+([^\n]{5,150})/g : stryMutAct_9fa48("4854") ? /(?:^|\n)\s\d+[\.\)]\s+([^\n]{5,150})/g : stryMutAct_9fa48("4853") ? /(?:\n)\s*\d+[\.\)]\s+([^\n]{5,150})/g : (stryCov_9fa48("4853", "4854", "4855", "4856", "4857", "4858", "4859", "4860", "4861", "4862"), /(?:^|\n)\s*\d+[\.\)]\s+([^\n]{5,150})/g), // Patrón 3: Letras seguidas de punto o paréntesis (a., b), etc.)
            stryMutAct_9fa48("4871") ? /(?:^|\n)\s*[a-z][\.\)]\s+([\n]{5,150})/g : stryMutAct_9fa48("4870") ? /(?:^|\n)\s*[a-z][\.\)]\s+([^\n])/g : stryMutAct_9fa48("4869") ? /(?:^|\n)\s*[a-z][\.\)]\S+([^\n]{5,150})/g : stryMutAct_9fa48("4868") ? /(?:^|\n)\s*[a-z][\.\)]\s([^\n]{5,150})/g : stryMutAct_9fa48("4867") ? /(?:^|\n)\s*[a-z][^\.\)]\s+([^\n]{5,150})/g : stryMutAct_9fa48("4866") ? /(?:^|\n)\s*[^a-z][\.\)]\s+([^\n]{5,150})/g : stryMutAct_9fa48("4865") ? /(?:^|\n)\S*[a-z][\.\)]\s+([^\n]{5,150})/g : stryMutAct_9fa48("4864") ? /(?:^|\n)\s[a-z][\.\)]\s+([^\n]{5,150})/g : stryMutAct_9fa48("4863") ? /(?:\n)\s*[a-z][\.\)]\s+([^\n]{5,150})/g : (stryCov_9fa48("4863", "4864", "4865", "4866", "4867", "4868", "4869", "4870", "4871"), /(?:^|\n)\s*[a-z][\.\)]\s+([^\n]{5,150})/g), // Patrón 4: Líneas que empiezan con mayúscula (títulos de temas)
            stryMutAct_9fa48("4880") ? /(?:^|\n)\s*([A-ZÁÉÍÓÚÑ][a-záéíóúñ][^\n]{5,150})(?=\n)/g : stryMutAct_9fa48("4879") ? /(?:^|\n)\s*([A-ZÁÉÍÓÚÑ][a-záéíóúñ][^\n]{5,150})(?!\n|$)/g : stryMutAct_9fa48("4878") ? /(?:^|\n)\s*([A-ZÁÉÍÓÚÑ][a-záéíóúñ][\n]{5,150})(?=\n|$)/g : stryMutAct_9fa48("4877") ? /(?:^|\n)\s*([A-ZÁÉÍÓÚÑ][a-záéíóúñ][^\n])(?=\n|$)/g : stryMutAct_9fa48("4876") ? /(?:^|\n)\s*([A-ZÁÉÍÓÚÑ][^a-záéíóúñ][^\n]{5,150})(?=\n|$)/g : stryMutAct_9fa48("4875") ? /(?:^|\n)\s*([^A-ZÁÉÍÓÚÑ][a-záéíóúñ][^\n]{5,150})(?=\n|$)/g : stryMutAct_9fa48("4874") ? /(?:^|\n)\S*([A-ZÁÉÍÓÚÑ][a-záéíóúñ][^\n]{5,150})(?=\n|$)/g : stryMutAct_9fa48("4873") ? /(?:^|\n)\s([A-ZÁÉÍÓÚÑ][a-záéíóúñ][^\n]{5,150})(?=\n|$)/g : stryMutAct_9fa48("4872") ? /(?:\n)\s*([A-ZÁÉÍÓÚÑ][a-záéíóúñ][^\n]{5,150})(?=\n|$)/g : (stryCov_9fa48("4872", "4873", "4874", "4875", "4876", "4877", "4878", "4879", "4880"), /(?:^|\n)\s*([A-ZÁÉÍÓÚÑ][a-záéíóúñ][^\n]{5,150})(?=\n|$)/g)]);
            const temas: string[] = stryMutAct_9fa48("4881") ? ["Stryker was here"] : (stryCov_9fa48("4881"), []);
            for (const pattern of temaPatterns) {
              if (stryMutAct_9fa48("4882")) {
                {}
              } else {
                stryCov_9fa48("4882");
                try {
                  if (stryMutAct_9fa48("4883")) {
                    {}
                  } else {
                    stryCov_9fa48("4883");
                    const matches = Array.from(ejeText.matchAll(pattern));
                    for (const match of matches) {
                      if (stryMutAct_9fa48("4884")) {
                        {}
                      } else {
                        stryCov_9fa48("4884");
                        if (stryMutAct_9fa48("4886") ? false : stryMutAct_9fa48("4885") ? true : (stryCov_9fa48("4885", "4886"), match[1])) {
                          if (stryMutAct_9fa48("4887")) {
                            {}
                          } else {
                            stryCov_9fa48("4887");
                            let tema = stryMutAct_9fa48("4889") ? match[1].replace(/^[-•▪▫o]\s+/, '').replace(/^\d+[\.\)]\s+/, '').replace(/^[a-z][\.\)]\s+/, '')
                            // Normalizar espacios múltiples pero mantener estructura
                            .replace(/[ \t]+/g, ' ').trim() : stryMutAct_9fa48("4888") ? match[1].trim().replace(/^[-•▪▫o]\s+/, '').replace(/^\d+[\.\)]\s+/, '').replace(/^[a-z][\.\)]\s+/, '')
                            // Normalizar espacios múltiples pero mantener estructura
                            .replace(/[ \t]+/g, ' ') : (stryCov_9fa48("4888", "4889"), match[1].trim().replace(stryMutAct_9fa48("4893") ? /^[-•▪▫o]\S+/ : stryMutAct_9fa48("4892") ? /^[-•▪▫o]\s/ : stryMutAct_9fa48("4891") ? /^[^-•▪▫o]\s+/ : stryMutAct_9fa48("4890") ? /[-•▪▫o]\s+/ : (stryCov_9fa48("4890", "4891", "4892", "4893"), /^[-•▪▫o]\s+/), stryMutAct_9fa48("4894") ? "Stryker was here!" : (stryCov_9fa48("4894"), '')).replace(stryMutAct_9fa48("4900") ? /^\d+[\.\)]\S+/ : stryMutAct_9fa48("4899") ? /^\d+[\.\)]\s/ : stryMutAct_9fa48("4898") ? /^\d+[^\.\)]\s+/ : stryMutAct_9fa48("4897") ? /^\D+[\.\)]\s+/ : stryMutAct_9fa48("4896") ? /^\d[\.\)]\s+/ : stryMutAct_9fa48("4895") ? /\d+[\.\)]\s+/ : (stryCov_9fa48("4895", "4896", "4897", "4898", "4899", "4900"), /^\d+[\.\)]\s+/), stryMutAct_9fa48("4901") ? "Stryker was here!" : (stryCov_9fa48("4901"), '')).replace(stryMutAct_9fa48("4906") ? /^[a-z][\.\)]\S+/ : stryMutAct_9fa48("4905") ? /^[a-z][\.\)]\s/ : stryMutAct_9fa48("4904") ? /^[a-z][^\.\)]\s+/ : stryMutAct_9fa48("4903") ? /^[^a-z][\.\)]\s+/ : stryMutAct_9fa48("4902") ? /[a-z][\.\)]\s+/ : (stryCov_9fa48("4902", "4903", "4904", "4905", "4906"), /^[a-z][\.\)]\s+/), stryMutAct_9fa48("4907") ? "Stryker was here!" : (stryCov_9fa48("4907"), ''))
                            // Normalizar espacios múltiples pero mantener estructura
                            .replace(stryMutAct_9fa48("4909") ? /[^ \t]+/g : stryMutAct_9fa48("4908") ? /[ \t]/g : (stryCov_9fa48("4908", "4909"), /[ \t]+/g), stryMutAct_9fa48("4910") ? "" : (stryCov_9fa48("4910"), ' ')).trim());

                            // Validar que sea un tema válido
                            // - No muy corto (mínimo 5 caracteres)
                            // - No muy largo (máximo 150 caracteres)
                            // - No solo mayúsculas (probablemente un título de sección)
                            // - No solo números o caracteres especiales
                            if (stryMutAct_9fa48("4913") ? tema.length >= 5 && tema.length <= 150 && !tema.match(/^[A-Z\s]{20,}$/) ||
                            // No títulos largos solo en mayúsculas
                            !tema.match(/^[\d\s\-=\.]+$/) : stryMutAct_9fa48("4912") ? false : stryMutAct_9fa48("4911") ? true : (stryCov_9fa48("4911", "4912", "4913"), (stryMutAct_9fa48("4915") ? tema.length >= 5 && tema.length <= 150 || !tema.match(/^[A-Z\s]{20,}$/) : stryMutAct_9fa48("4914") ? true : (stryCov_9fa48("4914", "4915"), (stryMutAct_9fa48("4917") ? tema.length >= 5 || tema.length <= 150 : stryMutAct_9fa48("4916") ? true : (stryCov_9fa48("4916", "4917"), (stryMutAct_9fa48("4920") ? tema.length < 5 : stryMutAct_9fa48("4919") ? tema.length > 5 : stryMutAct_9fa48("4918") ? true : (stryCov_9fa48("4918", "4919", "4920"), tema.length >= 5)) && (stryMutAct_9fa48("4923") ? tema.length > 150 : stryMutAct_9fa48("4922") ? tema.length < 150 : stryMutAct_9fa48("4921") ? true : (stryCov_9fa48("4921", "4922", "4923"), tema.length <= 150)))) && (stryMutAct_9fa48("4924") ? tema.match(/^[A-Z\s]{20,}$/) : (stryCov_9fa48("4924"), !tema.match(stryMutAct_9fa48("4929") ? /^[A-Z\S]{20,}$/ : stryMutAct_9fa48("4928") ? /^[^A-Z\s]{20,}$/ : stryMutAct_9fa48("4927") ? /^[A-Z\s]$/ : stryMutAct_9fa48("4926") ? /^[A-Z\s]{20,}/ : stryMutAct_9fa48("4925") ? /[A-Z\s]{20,}$/ : (stryCov_9fa48("4925", "4926", "4927", "4928", "4929"), /^[A-Z\s]{20,}$/)))))) && (// No títulos largos solo en mayúsculas
                            stryMutAct_9fa48("4930") ? tema.match(/^[\d\s\-=\.]+$/) : (stryCov_9fa48("4930"), !tema.match(stryMutAct_9fa48("4936") ? /^[\d\S\-=\.]+$/ : stryMutAct_9fa48("4935") ? /^[\D\s\-=\.]+$/ : stryMutAct_9fa48("4934") ? /^[^\d\s\-=\.]+$/ : stryMutAct_9fa48("4933") ? /^[\d\s\-=\.]$/ : stryMutAct_9fa48("4932") ? /^[\d\s\-=\.]+/ : stryMutAct_9fa48("4931") ? /[\d\s\-=\.]+$/ : (stryCov_9fa48("4931", "4932", "4933", "4934", "4935", "4936"), /^[\d\s\-=\.]+$/)))))) {
                              if (stryMutAct_9fa48("4937")) {
                                {}
                              } else {
                                stryCov_9fa48("4937");
                                // No solo números o separadores
                                // Evitar duplicados (comparar sin considerar mayúsculas/minúsculas)
                                const temaLower = stryMutAct_9fa48("4938") ? tema.toUpperCase() : (stryCov_9fa48("4938"), tema.toLowerCase());
                                if (stryMutAct_9fa48("4941") ? false : stryMutAct_9fa48("4940") ? true : stryMutAct_9fa48("4939") ? temas.some(t => t.toLowerCase() === temaLower) : (stryCov_9fa48("4939", "4940", "4941"), !(stryMutAct_9fa48("4942") ? temas.every(t => t.toLowerCase() === temaLower) : (stryCov_9fa48("4942"), temas.some(stryMutAct_9fa48("4943") ? () => undefined : (stryCov_9fa48("4943"), t => stryMutAct_9fa48("4946") ? t.toLowerCase() !== temaLower : stryMutAct_9fa48("4945") ? false : stryMutAct_9fa48("4944") ? true : (stryCov_9fa48("4944", "4945", "4946"), (stryMutAct_9fa48("4947") ? t.toUpperCase() : (stryCov_9fa48("4947"), t.toLowerCase())) === temaLower))))))) {
                                  if (stryMutAct_9fa48("4948")) {
                                    {}
                                  } else {
                                    stryCov_9fa48("4948");
                                    temas.push(tema);
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                } catch (error) {
                  if (stryMutAct_9fa48("4949")) {
                    {}
                  } else {
                    stryCov_9fa48("4949");
                    // Si hay un error con el regex, continuar con el siguiente patrón
                    logger.warn(stryMutAct_9fa48("4950") ? {} : (stryCov_9fa48("4950"), {
                      type: stryMutAct_9fa48("4951") ? "" : (stryCov_9fa48("4951"), 'import_topics_error'),
                      error: error instanceof Error ? error.message : String(error),
                      path: stryMutAct_9fa48("4952") ? "" : (stryCov_9fa48("4952"), '/api/admin/import-topics'),
                      action: stryMutAct_9fa48("4953") ? "" : (stryCov_9fa48("4953"), 'process_topic_pattern')
                    }), stryMutAct_9fa48("4954") ? "" : (stryCov_9fa48("4954"), 'Error al procesar patrón de tema'));
                    continue;
                  }
                }
              }
            }

            // Si no se encontraron temas con patrones, dividir por líneas
            if (stryMutAct_9fa48("4957") ? temas.length !== 0 : stryMutAct_9fa48("4956") ? false : stryMutAct_9fa48("4955") ? true : (stryCov_9fa48("4955", "4956", "4957"), temas.length === 0)) {
              if (stryMutAct_9fa48("4958")) {
                {}
              } else {
                stryCov_9fa48("4958");
                const lines = stryMutAct_9fa48("4959") ? ejeText.split('\n') : (stryCov_9fa48("4959"), ejeText.split(stryMutAct_9fa48("4960") ? "" : (stryCov_9fa48("4960"), '\n')).filter(l => {
                  if (stryMutAct_9fa48("4961")) {
                    {}
                  } else {
                    stryCov_9fa48("4961");
                    const trimmed = stryMutAct_9fa48("4962") ? l : (stryCov_9fa48("4962"), l.trim());
                    // Filtrar líneas vacías, muy cortas, o que parezcan títulos de sección
                    return stryMutAct_9fa48("4965") ? trimmed.length >= 5 && trimmed.length <= 150 && !trimmed.match(/^[A-Z\s]{20,}$/) ||
                    // No líneas solo en mayúsculas muy largas
                    !trimmed.match(/^[-=]+\s*$/) : stryMutAct_9fa48("4964") ? false : stryMutAct_9fa48("4963") ? true : (stryCov_9fa48("4963", "4964", "4965"), (stryMutAct_9fa48("4967") ? trimmed.length >= 5 && trimmed.length <= 150 || !trimmed.match(/^[A-Z\s]{20,}$/) : stryMutAct_9fa48("4966") ? true : (stryCov_9fa48("4966", "4967"), (stryMutAct_9fa48("4969") ? trimmed.length >= 5 || trimmed.length <= 150 : stryMutAct_9fa48("4968") ? true : (stryCov_9fa48("4968", "4969"), (stryMutAct_9fa48("4972") ? trimmed.length < 5 : stryMutAct_9fa48("4971") ? trimmed.length > 5 : stryMutAct_9fa48("4970") ? true : (stryCov_9fa48("4970", "4971", "4972"), trimmed.length >= 5)) && (stryMutAct_9fa48("4975") ? trimmed.length > 150 : stryMutAct_9fa48("4974") ? trimmed.length < 150 : stryMutAct_9fa48("4973") ? true : (stryCov_9fa48("4973", "4974", "4975"), trimmed.length <= 150)))) && (stryMutAct_9fa48("4976") ? trimmed.match(/^[A-Z\s]{20,}$/) : (stryCov_9fa48("4976"), !trimmed.match(stryMutAct_9fa48("4981") ? /^[A-Z\S]{20,}$/ : stryMutAct_9fa48("4980") ? /^[^A-Z\s]{20,}$/ : stryMutAct_9fa48("4979") ? /^[A-Z\s]$/ : stryMutAct_9fa48("4978") ? /^[A-Z\s]{20,}/ : stryMutAct_9fa48("4977") ? /[A-Z\s]{20,}$/ : (stryCov_9fa48("4977", "4978", "4979", "4980", "4981"), /^[A-Z\s]{20,}$/)))))) && (// No líneas solo en mayúsculas muy largas
                    stryMutAct_9fa48("4982") ? trimmed.match(/^[-=]+\s*$/) : (stryCov_9fa48("4982"), !trimmed.match(stryMutAct_9fa48("4988") ? /^[-=]+\S*$/ : stryMutAct_9fa48("4987") ? /^[-=]+\s$/ : stryMutAct_9fa48("4986") ? /^[^-=]+\s*$/ : stryMutAct_9fa48("4985") ? /^[-=]\s*$/ : stryMutAct_9fa48("4984") ? /^[-=]+\s*/ : stryMutAct_9fa48("4983") ? /[-=]+\s*$/ : (stryCov_9fa48("4983", "4984", "4985", "4986", "4987", "4988"), /^[-=]+\s*$/))))); // No líneas de separadores
                  }
                }));

                // Saltar primera línea si parece ser el título del eje temático
                const startIndex = (stryMutAct_9fa48("4991") ? lines[0] || lines[0].trim().length > 20 : stryMutAct_9fa48("4990") ? false : stryMutAct_9fa48("4989") ? true : (stryCov_9fa48("4989", "4990", "4991"), lines[0] && (stryMutAct_9fa48("4994") ? lines[0].trim().length <= 20 : stryMutAct_9fa48("4993") ? lines[0].trim().length >= 20 : stryMutAct_9fa48("4992") ? true : (stryCov_9fa48("4992", "4993", "4994"), (stryMutAct_9fa48("4995") ? lines[0].length : (stryCov_9fa48("4995"), lines[0].trim().length)) > 20)))) ? 1 : 0;
                for (let i = startIndex; stryMutAct_9fa48("4998") ? i >= lines.length : stryMutAct_9fa48("4997") ? i <= lines.length : stryMutAct_9fa48("4996") ? false : (stryCov_9fa48("4996", "4997", "4998"), i < lines.length); stryMutAct_9fa48("4999") ? i-- : (stryCov_9fa48("4999"), i++)) {
                  if (stryMutAct_9fa48("5000")) {
                    {}
                  } else {
                    stryCov_9fa48("5000");
                    const tema = stryMutAct_9fa48("5002") ? lines[i].replace(/^[-•▪▫o\d\)\.]+\s*/, '').trim() : stryMutAct_9fa48("5001") ? lines[i].trim().replace(/^[-•▪▫o\d\)\.]+\s*/, '') : (stryCov_9fa48("5001", "5002"), lines[i].trim().replace(stryMutAct_9fa48("5008") ? /^[-•▪▫o\d\)\.]+\S*/ : stryMutAct_9fa48("5007") ? /^[-•▪▫o\d\)\.]+\s/ : stryMutAct_9fa48("5006") ? /^[-•▪▫o\D\)\.]+\s*/ : stryMutAct_9fa48("5005") ? /^[^-•▪▫o\d\)\.]+\s*/ : stryMutAct_9fa48("5004") ? /^[-•▪▫o\d\)\.]\s*/ : stryMutAct_9fa48("5003") ? /[-•▪▫o\d\)\.]+\s*/ : (stryCov_9fa48("5003", "5004", "5005", "5006", "5007", "5008"), /^[-•▪▫o\d\)\.]+\s*/), stryMutAct_9fa48("5009") ? "Stryker was here!" : (stryCov_9fa48("5009"), '')).trim());
                    if (stryMutAct_9fa48("5012") ? tema.length >= 5 || tema.length <= 150 : stryMutAct_9fa48("5011") ? false : stryMutAct_9fa48("5010") ? true : (stryCov_9fa48("5010", "5011", "5012"), (stryMutAct_9fa48("5015") ? tema.length < 5 : stryMutAct_9fa48("5014") ? tema.length > 5 : stryMutAct_9fa48("5013") ? true : (stryCov_9fa48("5013", "5014", "5015"), tema.length >= 5)) && (stryMutAct_9fa48("5018") ? tema.length > 150 : stryMutAct_9fa48("5017") ? tema.length < 150 : stryMutAct_9fa48("5016") ? true : (stryCov_9fa48("5016", "5017", "5018"), tema.length <= 150)))) {
                      if (stryMutAct_9fa48("5019")) {
                        {}
                      } else {
                        stryCov_9fa48("5019");
                        // Evitar duplicados
                        if (stryMutAct_9fa48("5022") ? false : stryMutAct_9fa48("5021") ? true : stryMutAct_9fa48("5020") ? temas.some(t => t.toLowerCase() === tema.toLowerCase()) : (stryCov_9fa48("5020", "5021", "5022"), !(stryMutAct_9fa48("5023") ? temas.every(t => t.toLowerCase() === tema.toLowerCase()) : (stryCov_9fa48("5023"), temas.some(stryMutAct_9fa48("5024") ? () => undefined : (stryCov_9fa48("5024"), t => stryMutAct_9fa48("5027") ? t.toLowerCase() !== tema.toLowerCase() : stryMutAct_9fa48("5026") ? false : stryMutAct_9fa48("5025") ? true : (stryCov_9fa48("5025", "5026", "5027"), (stryMutAct_9fa48("5028") ? t.toUpperCase() : (stryCov_9fa48("5028"), t.toLowerCase())) === (stryMutAct_9fa48("5029") ? tema.toUpperCase() : (stryCov_9fa48("5029"), tema.toLowerCase()))))))))) {
                          if (stryMutAct_9fa48("5030")) {
                            {}
                          } else {
                            stryCov_9fa48("5030");
                            temas.push(tema);
                          }
                        }
                      }
                    }
                  }
                }
              }
            }

            // Crear temas para esta asignatura y eje
            for (const temaNombre of temas) {
              if (stryMutAct_9fa48("5031")) {
                {}
              } else {
                stryCov_9fa48("5031");
                if (stryMutAct_9fa48("5033") ? false : stryMutAct_9fa48("5032") ? true : (stryCov_9fa48("5032", "5033"), section.subject)) {
                  if (stryMutAct_9fa48("5034")) {
                    {}
                  } else {
                    stryCov_9fa48("5034");
                    topics.push(stryMutAct_9fa48("5035") ? {} : (stryCov_9fa48("5035"), {
                      asignatura: section.subject,
                      ejeTematico: currentEje,
                      nombre: temaNombre,
                      descripcion: null
                    }));
                  }
                }
              }
            }
          }
        }
      }
    }

    // Si no se encontró ninguna asignatura pero hay temas, intentar detectar asignatura del contexto
    if (stryMutAct_9fa48("5038") ? topics.length > 0 || topics.some(t => !t.asignatura) : stryMutAct_9fa48("5037") ? false : stryMutAct_9fa48("5036") ? true : (stryCov_9fa48("5036", "5037", "5038"), (stryMutAct_9fa48("5041") ? topics.length <= 0 : stryMutAct_9fa48("5040") ? topics.length >= 0 : stryMutAct_9fa48("5039") ? true : (stryCov_9fa48("5039", "5040", "5041"), topics.length > 0)) && (stryMutAct_9fa48("5042") ? topics.every(t => !t.asignatura) : (stryCov_9fa48("5042"), topics.some(stryMutAct_9fa48("5043") ? () => undefined : (stryCov_9fa48("5043"), t => stryMutAct_9fa48("5044") ? t.asignatura : (stryCov_9fa48("5044"), !t.asignatura))))))) {
      if (stryMutAct_9fa48("5045")) {
        {}
      } else {
        stryCov_9fa48("5045");
        // Buscar asignatura en el texto completo
        for (const subjectPattern of subjectPatterns) {
          if (stryMutAct_9fa48("5046")) {
            {}
          } else {
            stryCov_9fa48("5046");
            if (stryMutAct_9fa48("5048") ? false : stryMutAct_9fa48("5047") ? true : (stryCov_9fa48("5047", "5048"), subjectPattern.pattern.test(text))) {
              if (stryMutAct_9fa48("5049")) {
                {}
              } else {
                stryCov_9fa48("5049");
                topics.forEach(topic => {
                  if (stryMutAct_9fa48("5050")) {
                    {}
                  } else {
                    stryCov_9fa48("5050");
                    if (stryMutAct_9fa48("5053") ? false : stryMutAct_9fa48("5052") ? true : stryMutAct_9fa48("5051") ? topic.asignatura : (stryCov_9fa48("5051", "5052", "5053"), !topic.asignatura)) {
                      if (stryMutAct_9fa48("5054")) {
                        {}
                      } else {
                        stryCov_9fa48("5054");
                        topic.asignatura = subjectPattern.name;
                      }
                    }
                  }
                });
                break;
              }
            }
          }
        }
      }
    }

    // Filtrar temas sin asignatura
    return stryMutAct_9fa48("5055") ? topics : (stryCov_9fa48("5055"), topics.filter(stryMutAct_9fa48("5056") ? () => undefined : (stryCov_9fa48("5056"), t => stryMutAct_9fa48("5059") ? t.asignatura && t.nombre || t.ejeTematico : stryMutAct_9fa48("5058") ? false : stryMutAct_9fa48("5057") ? true : (stryCov_9fa48("5057", "5058", "5059"), (stryMutAct_9fa48("5061") ? t.asignatura || t.nombre : stryMutAct_9fa48("5060") ? true : (stryCov_9fa48("5060", "5061"), t.asignatura && t.nombre)) && t.ejeTematico))));
  }
}
export async function POST(request: NextRequest) {
  if (stryMutAct_9fa48("5062")) {
    {}
  } else {
    stryCov_9fa48("5062");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("5063")) {
        {}
      } else {
        stryCov_9fa48("5063");
        try {
          if (stryMutAct_9fa48("5064")) {
            {}
          } else {
            stryCov_9fa48("5064");
            // Verificar autenticación
            const user = await getCurrentUser();
            if (stryMutAct_9fa48("5067") ? false : stryMutAct_9fa48("5066") ? true : stryMutAct_9fa48("5065") ? user : (stryCov_9fa48("5065", "5066", "5067"), !user)) {
              if (stryMutAct_9fa48("5068")) {
                {}
              } else {
                stryCov_9fa48("5068");
                return NextResponse.json(stryMutAct_9fa48("5069") ? {} : (stryCov_9fa48("5069"), {
                  error: stryMutAct_9fa48("5070") ? "" : (stryCov_9fa48("5070"), 'No autorizado')
                }), stryMutAct_9fa48("5071") ? {} : (stryCov_9fa48("5071"), {
                  status: 401
                }));
              }
            }

            // Obtener datos del request
            const contentType = stryMutAct_9fa48("5074") ? request.headers.get('content-type') && '' : stryMutAct_9fa48("5073") ? false : stryMutAct_9fa48("5072") ? true : (stryCov_9fa48("5072", "5073", "5074"), request.headers.get(stryMutAct_9fa48("5075") ? "" : (stryCov_9fa48("5075"), 'content-type')) || (stryMutAct_9fa48("5076") ? "Stryker was here!" : (stryCov_9fa48("5076"), '')));
            let topicsData: TopicImportData[] = stryMutAct_9fa48("5077") ? ["Stryker was here"] : (stryCov_9fa48("5077"), []);
            if (stryMutAct_9fa48("5079") ? false : stryMutAct_9fa48("5078") ? true : (stryCov_9fa48("5078", "5079"), contentType.includes(stryMutAct_9fa48("5080") ? "" : (stryCov_9fa48("5080"), 'application/json')))) {
              if (stryMutAct_9fa48("5081")) {
                {}
              } else {
                stryCov_9fa48("5081");
                // Formato JSON
                const body = await request.json();
                const validation = requestSchema.safeParse(body);
                if (stryMutAct_9fa48("5084") ? false : stryMutAct_9fa48("5083") ? true : stryMutAct_9fa48("5082") ? validation.success : (stryCov_9fa48("5082", "5083", "5084"), !validation.success)) {
                  if (stryMutAct_9fa48("5085")) {
                    {}
                  } else {
                    stryCov_9fa48("5085");
                    return NextResponse.json(stryMutAct_9fa48("5086") ? {} : (stryCov_9fa48("5086"), {
                      error: stryMutAct_9fa48("5087") ? "" : (stryCov_9fa48("5087"), 'Datos inválidos'),
                      details: validation.error.issues
                    }), stryMutAct_9fa48("5088") ? {} : (stryCov_9fa48("5088"), {
                      status: 400
                    }));
                  }
                }
                topicsData = validation.data.topics;
              }
            } else if (stryMutAct_9fa48("5091") ? contentType.includes('multipart/form-data') && contentType.includes('text/csv') : stryMutAct_9fa48("5090") ? false : stryMutAct_9fa48("5089") ? true : (stryCov_9fa48("5089", "5090", "5091"), contentType.includes(stryMutAct_9fa48("5092") ? "" : (stryCov_9fa48("5092"), 'multipart/form-data')) || contentType.includes(stryMutAct_9fa48("5093") ? "" : (stryCov_9fa48("5093"), 'text/csv')))) {
              if (stryMutAct_9fa48("5094")) {
                {}
              } else {
                stryCov_9fa48("5094");
                // Formato CSV o PDF desde FormData
                const formData = await request.formData();
                const csvFile = formData.get('csvFile') as File | null;
                const pdfFile = formData.get('pdfFile') as File | null;
                const csvText = formData.get('csvText') as string | null;
                const subjectName = formData.get('subjectName') as string | null; // Para PDFs sin asignatura detectada

                if (stryMutAct_9fa48("5096") ? false : stryMutAct_9fa48("5095") ? true : (stryCov_9fa48("5095", "5096"), pdfFile)) {
                  if (stryMutAct_9fa48("5097")) {
                    {}
                  } else {
                    stryCov_9fa48("5097");
                    // Procesar PDF
                    let pdfPath: string | null = null;
                    try {
                      if (stryMutAct_9fa48("5098")) {
                        {}
                      } else {
                        stryCov_9fa48("5098");
                        // Validar tipo de archivo
                        if (stryMutAct_9fa48("5101") ? pdfFile.type || pdfFile.type !== 'application/pdf' : stryMutAct_9fa48("5100") ? false : stryMutAct_9fa48("5099") ? true : (stryCov_9fa48("5099", "5100", "5101"), pdfFile.type && (stryMutAct_9fa48("5103") ? pdfFile.type === 'application/pdf' : stryMutAct_9fa48("5102") ? true : (stryCov_9fa48("5102", "5103"), pdfFile.type !== (stryMutAct_9fa48("5104") ? "" : (stryCov_9fa48("5104"), 'application/pdf')))))) {
                          if (stryMutAct_9fa48("5105")) {
                            {}
                          } else {
                            stryCov_9fa48("5105");
                            throw new Error(stryMutAct_9fa48("5106") ? "" : (stryCov_9fa48("5106"), 'El archivo debe ser un PDF válido'));
                          }
                        }

                        // Validar extensión
                        const fileName = stryMutAct_9fa48("5107") ? pdfFile.name.toUpperCase() : (stryCov_9fa48("5107"), pdfFile.name.toLowerCase());
                        if (stryMutAct_9fa48("5110") ? false : stryMutAct_9fa48("5109") ? true : stryMutAct_9fa48("5108") ? fileName.endsWith('.pdf') : (stryCov_9fa48("5108", "5109", "5110"), !(stryMutAct_9fa48("5111") ? fileName.startsWith('.pdf') : (stryCov_9fa48("5111"), fileName.endsWith(stryMutAct_9fa48("5112") ? "" : (stryCov_9fa48("5112"), '.pdf')))))) {
                          if (stryMutAct_9fa48("5113")) {
                            {}
                          } else {
                            stryCov_9fa48("5113");
                            throw new Error(stryMutAct_9fa48("5114") ? "" : (stryCov_9fa48("5114"), 'El archivo debe tener extensión .pdf'));
                          }
                        }

                        // Validar tamaño (máximo 50 MB)
                        const MAX_FILE_SIZE = stryMutAct_9fa48("5115") ? 50 * 1024 / 1024 : (stryCov_9fa48("5115"), (stryMutAct_9fa48("5116") ? 50 / 1024 : (stryCov_9fa48("5116"), 50 * 1024)) * 1024); // 50 MB
                        if (stryMutAct_9fa48("5120") ? pdfFile.size <= MAX_FILE_SIZE : stryMutAct_9fa48("5119") ? pdfFile.size >= MAX_FILE_SIZE : stryMutAct_9fa48("5118") ? false : stryMutAct_9fa48("5117") ? true : (stryCov_9fa48("5117", "5118", "5119", "5120"), pdfFile.size > MAX_FILE_SIZE)) {
                          if (stryMutAct_9fa48("5121")) {
                            {}
                          } else {
                            stryCov_9fa48("5121");
                            throw new Error(stryMutAct_9fa48("5122") ? `` : (stryCov_9fa48("5122"), `El archivo es demasiado grande. Tamaño máximo: ${stryMutAct_9fa48("5123") ? MAX_FILE_SIZE / 1024 * 1024 : (stryCov_9fa48("5123"), (stryMutAct_9fa48("5124") ? MAX_FILE_SIZE * 1024 : (stryCov_9fa48("5124"), MAX_FILE_SIZE / 1024)) / 1024)} MB`));
                          }
                        }

                        // Guardar PDF temporalmente
                        await ensureDirectories();
                        const pdfFileName = stryMutAct_9fa48("5125") ? `` : (stryCov_9fa48("5125"), `topics_${Date.now()}.pdf`);
                        pdfPath = path.join(PDFS_DIR, pdfFileName);
                        const arrayBuffer = await pdfFile.arrayBuffer();
                        const buffer = Buffer.from(arrayBuffer);
                        await fs.writeFile(pdfPath, buffer);

                        // Extraer texto del PDF
                        const text = await extractTextFromPDF(pdfPath);

                        // Parsear temarios desde el texto
                        topicsData = parseTopicsFromPDF(text);

                        // Si se proporcionó una asignatura y hay temas sin asignatura, asignarla
                        if (stryMutAct_9fa48("5128") ? subjectName || topicsData.length > 0 : stryMutAct_9fa48("5127") ? false : stryMutAct_9fa48("5126") ? true : (stryCov_9fa48("5126", "5127", "5128"), subjectName && (stryMutAct_9fa48("5131") ? topicsData.length <= 0 : stryMutAct_9fa48("5130") ? topicsData.length >= 0 : stryMutAct_9fa48("5129") ? true : (stryCov_9fa48("5129", "5130", "5131"), topicsData.length > 0)))) {
                          if (stryMutAct_9fa48("5132")) {
                            {}
                          } else {
                            stryCov_9fa48("5132");
                            const subjectCode = SUBJECT_MAPPING[subjectName];
                            if (stryMutAct_9fa48("5134") ? false : stryMutAct_9fa48("5133") ? true : (stryCov_9fa48("5133", "5134"), subjectCode)) {
                              if (stryMutAct_9fa48("5135")) {
                                {}
                              } else {
                                stryCov_9fa48("5135");
                                topicsData.forEach(topic => {
                                  if (stryMutAct_9fa48("5136")) {
                                    {}
                                  } else {
                                    stryCov_9fa48("5136");
                                    if (stryMutAct_9fa48("5139") ? false : stryMutAct_9fa48("5138") ? true : stryMutAct_9fa48("5137") ? topic.asignatura : (stryCov_9fa48("5137", "5138", "5139"), !topic.asignatura)) {
                                      if (stryMutAct_9fa48("5140")) {
                                        {}
                                      } else {
                                        stryCov_9fa48("5140");
                                        topic.asignatura = subjectName;
                                      }
                                    }
                                  }
                                });
                              }
                            }
                          }
                        }

                        // Limpiar PDF después de procesar
                        if (stryMutAct_9fa48("5142") ? false : stryMutAct_9fa48("5141") ? true : (stryCov_9fa48("5141", "5142"), pdfPath)) {
                          if (stryMutAct_9fa48("5143")) {
                            {}
                          } else {
                            stryCov_9fa48("5143");
                            await fs.unlink(pdfPath).catch(() => {
                              // Ignorar errores al eliminar
                            });
                          }
                        }
                        if (stryMutAct_9fa48("5146") ? topicsData.length !== 0 : stryMutAct_9fa48("5145") ? false : stryMutAct_9fa48("5144") ? true : (stryCov_9fa48("5144", "5145", "5146"), topicsData.length === 0)) {
                          if (stryMutAct_9fa48("5147")) {
                            {}
                          } else {
                            stryCov_9fa48("5147");
                            throw new Error((stryMutAct_9fa48("5148") ? "" : (stryCov_9fa48("5148"), 'No se pudieron detectar temarios en el PDF. ')) + (stryMutAct_9fa48("5149") ? "" : (stryCov_9fa48("5149"), 'Verifica que el formato sea correcto y que contenga asignaturas, ejes temáticos y temas.')));
                          }
                        }
                      }
                    } catch (error) {
                      if (stryMutAct_9fa48("5150")) {
                        {}
                      } else {
                        stryCov_9fa48("5150");
                        // Limpiar PDF en caso de error
                        if (stryMutAct_9fa48("5152") ? false : stryMutAct_9fa48("5151") ? true : (stryCov_9fa48("5151", "5152"), pdfPath)) {
                          if (stryMutAct_9fa48("5153")) {
                            {}
                          } else {
                            stryCov_9fa48("5153");
                            await fs.unlink(pdfPath).catch(() => {
                              // Ignorar errores al eliminar
                            });
                          }
                        }
                        throw error;
                      }
                    }
                  }
                } else if (stryMutAct_9fa48("5155") ? false : stryMutAct_9fa48("5154") ? true : (stryCov_9fa48("5154", "5155"), csvFile)) {
                  if (stryMutAct_9fa48("5156")) {
                    {}
                  } else {
                    stryCov_9fa48("5156");
                    const text = await csvFile.text();
                    topicsData = parseCSV(text);
                  }
                } else if (stryMutAct_9fa48("5158") ? false : stryMutAct_9fa48("5157") ? true : (stryCov_9fa48("5157", "5158"), csvText)) {
                  if (stryMutAct_9fa48("5159")) {
                    {}
                  } else {
                    stryCov_9fa48("5159");
                    topicsData = parseCSV(csvText);
                  }
                } else {
                  if (stryMutAct_9fa48("5160")) {
                    {}
                  } else {
                    stryCov_9fa48("5160");
                    return NextResponse.json(stryMutAct_9fa48("5161") ? {} : (stryCov_9fa48("5161"), {
                      error: stryMutAct_9fa48("5162") ? "" : (stryCov_9fa48("5162"), 'Debe proporcionar un archivo PDF, CSV o texto CSV')
                    }), stryMutAct_9fa48("5163") ? {} : (stryCov_9fa48("5163"), {
                      status: 400
                    }));
                  }
                }
              }
            } else {
              if (stryMutAct_9fa48("5164")) {
                {}
              } else {
                stryCov_9fa48("5164");
                // Intentar parsear como JSON por defecto
                try {
                  if (stryMutAct_9fa48("5165")) {
                    {}
                  } else {
                    stryCov_9fa48("5165");
                    const body = await request.json();
                    const validation = requestSchema.safeParse(body);
                    if (stryMutAct_9fa48("5168") ? false : stryMutAct_9fa48("5167") ? true : stryMutAct_9fa48("5166") ? validation.success : (stryCov_9fa48("5166", "5167", "5168"), !validation.success)) {
                      if (stryMutAct_9fa48("5169")) {
                        {}
                      } else {
                        stryCov_9fa48("5169");
                        return NextResponse.json(stryMutAct_9fa48("5170") ? {} : (stryCov_9fa48("5170"), {
                          error: stryMutAct_9fa48("5171") ? "" : (stryCov_9fa48("5171"), 'Formato no soportado. Use JSON o CSV'),
                          details: validation.error.issues
                        }), stryMutAct_9fa48("5172") ? {} : (stryCov_9fa48("5172"), {
                          status: 400
                        }));
                      }
                    }
                    topicsData = validation.data.topics;
                  }
                } catch {
                  if (stryMutAct_9fa48("5173")) {
                    {}
                  } else {
                    stryCov_9fa48("5173");
                    return NextResponse.json(stryMutAct_9fa48("5174") ? {} : (stryCov_9fa48("5174"), {
                      error: stryMutAct_9fa48("5175") ? "" : (stryCov_9fa48("5175"), 'Formato no soportado. Use JSON o CSV')
                    }), stryMutAct_9fa48("5176") ? {} : (stryCov_9fa48("5176"), {
                      status: 400
                    }));
                  }
                }
              }
            }
            if (stryMutAct_9fa48("5179") ? topicsData.length !== 0 : stryMutAct_9fa48("5178") ? false : stryMutAct_9fa48("5177") ? true : (stryCov_9fa48("5177", "5178", "5179"), topicsData.length === 0)) {
              if (stryMutAct_9fa48("5180")) {
                {}
              } else {
                stryCov_9fa48("5180");
                return NextResponse.json(stryMutAct_9fa48("5181") ? {} : (stryCov_9fa48("5181"), {
                  error: stryMutAct_9fa48("5182") ? "" : (stryCov_9fa48("5182"), 'No se encontraron temas para importar')
                }), stryMutAct_9fa48("5183") ? {} : (stryCov_9fa48("5183"), {
                  status: 400
                }));
              }
            }

            // Importar temas
            const result = await importTopics(topicsData);

            // Construir mensaje de respuesta
            const successMessage = stryMutAct_9fa48("5184") ? `` : (stryCov_9fa48("5184"), `Importación completada: ${result.created} creados, ${result.updated} actualizados, ${result.skipped} omitidos`);
            const detailsBySubject = Object.entries(result.details.bySubject).map(([code, stats]) => {
              if (stryMutAct_9fa48("5185")) {
                {}
              } else {
                stryCov_9fa48("5185");
                const subjectName = stryMutAct_9fa48("5188") ? Object.entries(SUBJECT_MAPPING).find(([_, c]) => c === code)?.[0] && code : stryMutAct_9fa48("5187") ? false : stryMutAct_9fa48("5186") ? true : (stryCov_9fa48("5186", "5187", "5188"), (stryMutAct_9fa48("5189") ? Object.entries(SUBJECT_MAPPING).find(([_, c]) => c === code)[0] : (stryCov_9fa48("5189"), Object.entries(SUBJECT_MAPPING).find(stryMutAct_9fa48("5190") ? () => undefined : (stryCov_9fa48("5190"), ([_, c]) => stryMutAct_9fa48("5193") ? c !== code : stryMutAct_9fa48("5192") ? false : stryMutAct_9fa48("5191") ? true : (stryCov_9fa48("5191", "5192", "5193"), c === code)))?.[0])) || code);
                return stryMutAct_9fa48("5194") ? `` : (stryCov_9fa48("5194"), `${subjectName}: ${stats.created} creados, ${stats.updated} actualizados`);
              }
            }).join(stryMutAct_9fa48("5195") ? "" : (stryCov_9fa48("5195"), '\n'));
            return NextResponse.json(stryMutAct_9fa48("5196") ? {} : (stryCov_9fa48("5196"), {
              success: stryMutAct_9fa48("5197") ? false : (stryCov_9fa48("5197"), true),
              message: successMessage,
              details: stryMutAct_9fa48("5198") ? `Total procesados: ${result.totalTopics}\n` + `Creados: ${result.created}\n` + `Actualizados: ${result.updated}\n` + `Omitidos: ${result.skipped}\n\n` + (detailsBySubject ? `Por asignatura:\n${detailsBySubject}` : '') - (result.errors.length > 0 ? `\n\nErrores (${result.errors.length}):\n${result.errors.map(e => `- ${e.topic}: ${e.error}`).join('\n')}` : '') : (stryCov_9fa48("5198"), (stryMutAct_9fa48("5199") ? `` : (stryCov_9fa48("5199"), `Total procesados: ${result.totalTopics}\n`)) + (stryMutAct_9fa48("5200") ? `` : (stryCov_9fa48("5200"), `Creados: ${result.created}\n`)) + (stryMutAct_9fa48("5201") ? `` : (stryCov_9fa48("5201"), `Actualizados: ${result.updated}\n`)) + (stryMutAct_9fa48("5202") ? `` : (stryCov_9fa48("5202"), `Omitidos: ${result.skipped}\n\n`)) + (detailsBySubject ? stryMutAct_9fa48("5203") ? `` : (stryCov_9fa48("5203"), `Por asignatura:\n${detailsBySubject}`) : stryMutAct_9fa48("5204") ? "Stryker was here!" : (stryCov_9fa48("5204"), '')) + ((stryMutAct_9fa48("5208") ? result.errors.length <= 0 : stryMutAct_9fa48("5207") ? result.errors.length >= 0 : stryMutAct_9fa48("5206") ? false : stryMutAct_9fa48("5205") ? true : (stryCov_9fa48("5205", "5206", "5207", "5208"), result.errors.length > 0)) ? stryMutAct_9fa48("5209") ? `` : (stryCov_9fa48("5209"), `\n\nErrores (${result.errors.length}):\n${result.errors.map(stryMutAct_9fa48("5210") ? () => undefined : (stryCov_9fa48("5210"), e => stryMutAct_9fa48("5211") ? `` : (stryCov_9fa48("5211"), `- ${e.topic}: ${e.error}`))).join(stryMutAct_9fa48("5212") ? "" : (stryCov_9fa48("5212"), '\n'))}`) : stryMutAct_9fa48("5213") ? "Stryker was here!" : (stryCov_9fa48("5213"), ''))),
              result: stryMutAct_9fa48("5214") ? {} : (stryCov_9fa48("5214"), {
                total: result.totalTopics,
                created: result.created,
                updated: result.updated,
                skipped: result.skipped,
                errors: result.errors
              })
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("5215")) {
            {}
          } else {
            stryCov_9fa48("5215");
            return NextResponse.json(stryMutAct_9fa48("5216") ? {} : (stryCov_9fa48("5216"), {
              error: stryMutAct_9fa48("5217") ? "" : (stryCov_9fa48("5217"), 'Error al importar temarios'),
              details: error instanceof Error ? error.message : stryMutAct_9fa48("5218") ? "" : (stryCov_9fa48("5218"), 'Error desconocido')
            }), stryMutAct_9fa48("5219") ? {} : (stryCov_9fa48("5219"), {
              status: 500
            }));
          }
        }
      }
    }, stryMutAct_9fa48("5220") ? "" : (stryCov_9fa48("5220"), 'write'));
  }
}