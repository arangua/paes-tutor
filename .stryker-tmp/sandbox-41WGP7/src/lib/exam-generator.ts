/**
 * Generador de Exámenes con IA
 *
 * Genera exámenes automáticamente basados en temarios y la malla curricular chilena
 */
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
import { getAIConfig, sendAIMessage, type AIMessage } from './ai-service';
import { prisma } from './prisma';
import { logger } from './logger';
import type { Prisma } from '@prisma/client';
import { LIMIT_CONSTANTS, EXAM_CONSTANTS } from './constants';
export interface ExamGenerationParams {
  subjectId: string;
  topicIds?: string[]; // Si no se especifica, usa todos los temas del subject
  numQuestions: number; // Número de preguntas a generar
  difficulty?: 'baja' | 'media' | 'alta' | 'mixta';
  tipo?: 'objetiva' | 'desarrollo' | 'mixta';
  userId?: string;
  includeAnswerKey?: boolean; // Si true, genera también el clavijero
}
export interface GeneratedQuestion {
  enunciado: string;
  opciones: Array<{
    letra: string;
    texto: string;
    esCorrecta: boolean;
  }>;
  explicacion: string;
  dificultad: number; // 1-5
  topicId?: string;
  ejeTematico?: string;
}
export interface GeneratedExam {
  titulo: string;
  descripcion: string;
  questions: GeneratedQuestion[];
  answerKey?: {
    [questionIndex: number]: string; // Índice de pregunta -> letra correcta
  };
}

/**
 * Obtiene información del temario para el contexto de generación
 */
async function getTopicContext(subjectId: string, topicIds?: string[]) {
  if (stryMutAct_9fa48("23934")) {
    {}
  } else {
    stryCov_9fa48("23934");
    const where: Prisma.TopicWhereInput = stryMutAct_9fa48("23935") ? {} : (stryCov_9fa48("23935"), {
      subjectId
    });
    // Solo filtrar por topicIds si está definido y no está vacío
    if (stryMutAct_9fa48("23938") ? topicIds && Array.isArray(topicIds) || topicIds.length > 0 : stryMutAct_9fa48("23937") ? false : stryMutAct_9fa48("23936") ? true : (stryCov_9fa48("23936", "23937", "23938"), (stryMutAct_9fa48("23940") ? topicIds || Array.isArray(topicIds) : stryMutAct_9fa48("23939") ? true : (stryCov_9fa48("23939", "23940"), topicIds && Array.isArray(topicIds))) && (stryMutAct_9fa48("23943") ? topicIds.length <= 0 : stryMutAct_9fa48("23942") ? topicIds.length >= 0 : stryMutAct_9fa48("23941") ? true : (stryCov_9fa48("23941", "23942", "23943"), topicIds.length > 0)))) {
      if (stryMutAct_9fa48("23944")) {
        {}
      } else {
        stryCov_9fa48("23944");
        where.id = stryMutAct_9fa48("23945") ? {} : (stryCov_9fa48("23945"), {
          in: topicIds
        });
      }
    }
    const topics = await prisma.topic.findMany(stryMutAct_9fa48("23946") ? {} : (stryCov_9fa48("23946"), {
      where,
      include: stryMutAct_9fa48("23947") ? {} : (stryCov_9fa48("23947"), {
        subject: stryMutAct_9fa48("23948") ? {} : (stryCov_9fa48("23948"), {
          select: stryMutAct_9fa48("23949") ? {} : (stryCov_9fa48("23949"), {
            nombre: stryMutAct_9fa48("23950") ? false : (stryCov_9fa48("23950"), true),
            codigo: stryMutAct_9fa48("23951") ? false : (stryCov_9fa48("23951"), true),
            tipo: stryMutAct_9fa48("23952") ? false : (stryCov_9fa48("23952"), true)
          })
        })
      }),
      orderBy: stryMutAct_9fa48("23953") ? [] : (stryCov_9fa48("23953"), [stryMutAct_9fa48("23954") ? {} : (stryCov_9fa48("23954"), {
        ejeTematico: stryMutAct_9fa48("23955") ? "" : (stryCov_9fa48("23955"), 'asc')
      }), stryMutAct_9fa48("23956") ? {} : (stryCov_9fa48("23956"), {
        nombre: stryMutAct_9fa48("23957") ? "" : (stryCov_9fa48("23957"), 'asc')
      })])
    }));

    // Obtener materiales de estudio relacionados
    const materials = await prisma.studyMaterial.findMany(stryMutAct_9fa48("23958") ? {} : (stryCov_9fa48("23958"), {
      where: stryMutAct_9fa48("23959") ? {} : (stryCov_9fa48("23959"), {
        subjectId,
        ...((stryMutAct_9fa48("23962") ? topicIds && Array.isArray(topicIds) || topicIds.length > 0 : stryMutAct_9fa48("23961") ? false : stryMutAct_9fa48("23960") ? true : (stryCov_9fa48("23960", "23961", "23962"), (stryMutAct_9fa48("23964") ? topicIds || Array.isArray(topicIds) : stryMutAct_9fa48("23963") ? true : (stryCov_9fa48("23963", "23964"), topicIds && Array.isArray(topicIds))) && (stryMutAct_9fa48("23967") ? topicIds.length <= 0 : stryMutAct_9fa48("23966") ? topicIds.length >= 0 : stryMutAct_9fa48("23965") ? true : (stryCov_9fa48("23965", "23966", "23967"), topicIds.length > 0)))) ? stryMutAct_9fa48("23968") ? {} : (stryCov_9fa48("23968"), {
          topicId: stryMutAct_9fa48("23969") ? {} : (stryCov_9fa48("23969"), {
            in: topicIds
          })
        }) : {})
      }),
      select: stryMutAct_9fa48("23970") ? {} : (stryCov_9fa48("23970"), {
        titulo: stryMutAct_9fa48("23971") ? false : (stryCov_9fa48("23971"), true),
        contenido: stryMutAct_9fa48("23972") ? false : (stryCov_9fa48("23972"), true),
        topic: stryMutAct_9fa48("23973") ? {} : (stryCov_9fa48("23973"), {
          select: stryMutAct_9fa48("23974") ? {} : (stryCov_9fa48("23974"), {
            ejeTematico: stryMutAct_9fa48("23975") ? false : (stryCov_9fa48("23975"), true)
          })
        })
      }),
      take: LIMIT_CONSTANTS.MAX_MATERIALS_CONTEXT // Limitar materiales más relevantes
    }));
    return stryMutAct_9fa48("23976") ? {} : (stryCov_9fa48("23976"), {
      topics,
      materials,
      subject: stryMutAct_9fa48("23977") ? topics[0].subject : (stryCov_9fa48("23977"), topics[0]?.subject)
    });
  }
}

/**
 * Construye el prompt para la generación de examen
 */
function buildPromptForExamGeneration(context: Awaited<ReturnType<typeof getTopicContext>>, params: ExamGenerationParams): AIMessage[] {
  if (stryMutAct_9fa48("23978")) {
    {}
  } else {
    stryCov_9fa48("23978");
    const {
      numQuestions,
      difficulty = stryMutAct_9fa48("23979") ? "" : (stryCov_9fa48("23979"), 'mixta'),
      tipo = stryMutAct_9fa48("23980") ? "" : (stryCov_9fa48("23980"), 'objetiva')
    } = params;
    const {
      subject,
      topics,
      materials
    } = context;
    if (stryMutAct_9fa48("23983") ? false : stryMutAct_9fa48("23982") ? true : stryMutAct_9fa48("23981") ? subject : (stryCov_9fa48("23981", "23982", "23983"), !subject)) {
      if (stryMutAct_9fa48("23984")) {
        {}
      } else {
        stryCov_9fa48("23984");
        throw new Error(stryMutAct_9fa48("23985") ? "" : (stryCov_9fa48("23985"), 'Subject no encontrado en el contexto'));
      }
    }
    const topicsText = topics.map(stryMutAct_9fa48("23986") ? () => undefined : (stryCov_9fa48("23986"), t => stryMutAct_9fa48("23987") ? `` : (stryCov_9fa48("23987"), `- ${t.nombre} (Eje: ${t.ejeTematico})${t.descripcion ? stryMutAct_9fa48("23988") ? `` : (stryCov_9fa48("23988"), `: ${t.descripcion}`) : stryMutAct_9fa48("23989") ? "Stryker was here!" : (stryCov_9fa48("23989"), '')}`))).join(stryMutAct_9fa48("23990") ? "" : (stryCov_9fa48("23990"), '\n'));
    const materialsText = materials.map(stryMutAct_9fa48("23991") ? () => undefined : (stryCov_9fa48("23991"), m => stryMutAct_9fa48("23992") ? `` : (stryCov_9fa48("23992"), `- ${m.titulo}${(stryMutAct_9fa48("23993") ? m.topic.ejeTematico : (stryCov_9fa48("23993"), m.topic?.ejeTematico)) ? stryMutAct_9fa48("23994") ? `` : (stryCov_9fa48("23994"), ` (Eje: ${m.topic.ejeTematico})`) : stryMutAct_9fa48("23995") ? "Stryker was here!" : (stryCov_9fa48("23995"), '')}: ${stryMutAct_9fa48("23996") ? m.contenido : (stryCov_9fa48("23996"), m.contenido.substring(0, 200))}...`))).join(stryMutAct_9fa48("23997") ? "" : (stryCov_9fa48("23997"), '\n'));
    const systemPrompt = stryMutAct_9fa48("23998") ? `` : (stryCov_9fa48("23998"), `Eres un experto en educación chilena especializado en la Prueba de Acceso a la Educación Superior (PAES) y la malla curricular establecida por el Ministerio de Educación de Chile (MINEDUC).

Tu tarea es generar exámenes de alta calidad que:
1. Estén alineados con la malla curricular vigente de Chile
2. Sigan el formato y estilo de la PAES
3. Cubran los temas y ejes temáticos especificados
4. Tengan preguntas claras, precisas y pedagógicamente válidas
5. Incluyan explicaciones educativas para cada respuesta

IMPORTANTE: Las preguntas deben ser apropiadas para estudiantes de 4° medio y estar alineadas con los Objetivos de Aprendizaje (OA) del MINEDUC.`);
    const userPrompt = stryMutAct_9fa48("23999") ? `` : (stryCov_9fa48("23999"), `Genera un examen de ${numQuestions} preguntas para la asignatura "${subject.nombre}" (${subject.codigo}).

TEMAS Y EJES TEMÁTICOS A CUBRIR:
${topicsText}

${(stryMutAct_9fa48("24003") ? materials.length <= 0 : stryMutAct_9fa48("24002") ? materials.length >= 0 : stryMutAct_9fa48("24001") ? false : stryMutAct_9fa48("24000") ? true : (stryCov_9fa48("24000", "24001", "24002", "24003"), materials.length > 0)) ? stryMutAct_9fa48("24004") ? `` : (stryCov_9fa48("24004"), `\nMATERIALES DE ESTUDIO DE REFERENCIA:\n${materialsText}`) : stryMutAct_9fa48("24005") ? "Stryker was here!" : (stryCov_9fa48("24005"), '')}

REQUISITOS:
- Tipo de examen: ${(stryMutAct_9fa48("24008") ? tipo !== 'objetiva' : stryMutAct_9fa48("24007") ? false : stryMutAct_9fa48("24006") ? true : (stryCov_9fa48("24006", "24007", "24008"), tipo === (stryMutAct_9fa48("24009") ? "" : (stryCov_9fa48("24009"), 'objetiva')))) ? stryMutAct_9fa48("24010") ? "" : (stryCov_9fa48("24010"), 'Preguntas de opción múltiple (4 opciones A, B, C, D)') : (stryMutAct_9fa48("24013") ? tipo !== 'desarrollo' : stryMutAct_9fa48("24012") ? false : stryMutAct_9fa48("24011") ? true : (stryCov_9fa48("24011", "24012", "24013"), tipo === (stryMutAct_9fa48("24014") ? "" : (stryCov_9fa48("24014"), 'desarrollo')))) ? stryMutAct_9fa48("24015") ? "" : (stryCov_9fa48("24015"), 'Preguntas de desarrollo (sin opciones múltiples)') : stryMutAct_9fa48("24016") ? "" : (stryCov_9fa48("24016"), 'Mixto (objetivas y desarrollo)')}
- Dificultad: ${(stryMutAct_9fa48("24019") ? difficulty !== 'baja' : stryMutAct_9fa48("24018") ? false : stryMutAct_9fa48("24017") ? true : (stryCov_9fa48("24017", "24018", "24019"), difficulty === (stryMutAct_9fa48("24020") ? "" : (stryCov_9fa48("24020"), 'baja')))) ? stryMutAct_9fa48("24021") ? "" : (stryCov_9fa48("24021"), 'Baja (nivel básico)') : (stryMutAct_9fa48("24024") ? difficulty !== 'media' : stryMutAct_9fa48("24023") ? false : stryMutAct_9fa48("24022") ? true : (stryCov_9fa48("24022", "24023", "24024"), difficulty === (stryMutAct_9fa48("24025") ? "" : (stryCov_9fa48("24025"), 'media')))) ? stryMutAct_9fa48("24026") ? "" : (stryCov_9fa48("24026"), 'Media (nivel intermedio)') : (stryMutAct_9fa48("24029") ? difficulty !== 'alta' : stryMutAct_9fa48("24028") ? false : stryMutAct_9fa48("24027") ? true : (stryCov_9fa48("24027", "24028", "24029"), difficulty === (stryMutAct_9fa48("24030") ? "" : (stryCov_9fa48("24030"), 'alta')))) ? stryMutAct_9fa48("24031") ? "" : (stryCov_9fa48("24031"), 'Alta (nivel avanzado)') : stryMutAct_9fa48("24032") ? "" : (stryCov_9fa48("24032"), 'Mixta (distribución equilibrada)')}
- Cada pregunta debe tener:
  * Un enunciado claro y conciso
  ${(stryMutAct_9fa48("24035") ? tipo === 'objetiva' && tipo === 'mixta' : stryMutAct_9fa48("24034") ? false : stryMutAct_9fa48("24033") ? true : (stryCov_9fa48("24033", "24034", "24035"), (stryMutAct_9fa48("24037") ? tipo !== 'objetiva' : stryMutAct_9fa48("24036") ? false : (stryCov_9fa48("24036", "24037"), tipo === (stryMutAct_9fa48("24038") ? "" : (stryCov_9fa48("24038"), 'objetiva')))) || (stryMutAct_9fa48("24040") ? tipo !== 'mixta' : stryMutAct_9fa48("24039") ? false : (stryCov_9fa48("24039", "24040"), tipo === (stryMutAct_9fa48("24041") ? "" : (stryCov_9fa48("24041"), 'mixta')))))) ? stryMutAct_9fa48("24042") ? "" : (stryCov_9fa48("24042"), '* 4 opciones (A, B, C, D) si es objetiva\n  * Una opción correcta claramente identificada') : stryMutAct_9fa48("24043") ? "" : (stryCov_9fa48("24043"), '* NO debe incluir opciones múltiples (es pregunta de desarrollo)')}
  * Una explicación educativa de por qué la respuesta es correcta
  * Nivel de dificultad (1-5)
  * Asociación a un tema específico del temario

FORMATO DE RESPUESTA (JSON):
{
  "titulo": "Título del examen",
  "descripcion": "Descripción breve del examen",
  "questions": [
    ${(stryMutAct_9fa48("24046") ? tipo === 'objetiva' && tipo === 'mixta' : stryMutAct_9fa48("24045") ? false : stryMutAct_9fa48("24044") ? true : (stryCov_9fa48("24044", "24045", "24046"), (stryMutAct_9fa48("24048") ? tipo !== 'objetiva' : stryMutAct_9fa48("24047") ? false : (stryCov_9fa48("24047", "24048"), tipo === (stryMutAct_9fa48("24049") ? "" : (stryCov_9fa48("24049"), 'objetiva')))) || (stryMutAct_9fa48("24051") ? tipo !== 'mixta' : stryMutAct_9fa48("24050") ? false : (stryCov_9fa48("24050", "24051"), tipo === (stryMutAct_9fa48("24052") ? "" : (stryCov_9fa48("24052"), 'mixta')))))) ? stryMutAct_9fa48("24053") ? `` : (stryCov_9fa48("24053"), `{
      "enunciado": "Texto de la pregunta",
      "opciones": [
        {"letra": "A", "texto": "Opción A", "esCorrecta": false},
        {"letra": "B", "texto": "Opción B", "esCorrecta": true},
        {"letra": "C", "texto": "Opción C", "esCorrecta": false},
        {"letra": "D", "texto": "Opción D", "esCorrecta": false}
      ],
      "explicacion": "Explicación detallada",
      "dificultad": 3,
      "ejeTematico": "Nombre del eje temático"
    }`) : (stryMutAct_9fa48("24056") ? tipo !== 'desarrollo' : stryMutAct_9fa48("24055") ? false : stryMutAct_9fa48("24054") ? true : (stryCov_9fa48("24054", "24055", "24056"), tipo === (stryMutAct_9fa48("24057") ? "" : (stryCov_9fa48("24057"), 'desarrollo')))) ? stryMutAct_9fa48("24058") ? `` : (stryCov_9fa48("24058"), `{
      "enunciado": "Texto de la pregunta de desarrollo",
      "opciones": [],
      "explicacion": "Explicación de la respuesta esperada",
      "dificultad": 3,
      "ejeTematico": "Nombre del eje temático"
    }`) : stryMutAct_9fa48("24059") ? `` : (stryCov_9fa48("24059"), `{
      "enunciado": "Texto de la pregunta",
      "opciones": [opciones solo si es objetiva, vacío [] si es desarrollo],
      "explicacion": "Explicación detallada",
      "dificultad": 3,
      "ejeTematico": "Nombre del eje temático"
    }`)}
  ]
}

IMPORTANTE:
- Las preguntas deben estar alineadas con la malla curricular chilena
- Deben ser apropiadas para estudiantes de 4° medio
- Debe haber exactamente ${numQuestions} preguntas
${(stryMutAct_9fa48("24062") ? tipo !== 'objetiva' : stryMutAct_9fa48("24061") ? false : stryMutAct_9fa48("24060") ? true : (stryCov_9fa48("24060", "24061", "24062"), tipo === (stryMutAct_9fa48("24063") ? "" : (stryCov_9fa48("24063"), 'objetiva')))) ? stryMutAct_9fa48("24064") ? "" : (stryCov_9fa48("24064"), '- Cada pregunta debe tener exactamente 4 opciones (A, B, C, D)\n- Solo una opción debe ser correcta por pregunta') : (stryMutAct_9fa48("24067") ? tipo !== 'desarrollo' : stryMutAct_9fa48("24066") ? false : stryMutAct_9fa48("24065") ? true : (stryCov_9fa48("24065", "24066", "24067"), tipo === (stryMutAct_9fa48("24068") ? "" : (stryCov_9fa48("24068"), 'desarrollo')))) ? stryMutAct_9fa48("24069") ? "" : (stryCov_9fa48("24069"), '- Las preguntas de desarrollo NO deben tener opciones múltiples\n- Deben requerir respuestas escritas o desarrolladas') : stryMutAct_9fa48("24070") ? "" : (stryCov_9fa48("24070"), '- Las preguntas objetivas deben tener 4 opciones (A, B, C, D)\n- Las preguntas de desarrollo NO deben tener opciones\n- Solo una opción debe ser correcta por pregunta objetiva')}
- Las explicaciones deben ser educativas y claras`);
    return stryMutAct_9fa48("24071") ? [] : (stryCov_9fa48("24071"), [stryMutAct_9fa48("24072") ? {} : (stryCov_9fa48("24072"), {
      role: stryMutAct_9fa48("24073") ? "" : (stryCov_9fa48("24073"), 'system'),
      content: systemPrompt
    }), stryMutAct_9fa48("24074") ? {} : (stryCov_9fa48("24074"), {
      role: stryMutAct_9fa48("24075") ? "" : (stryCov_9fa48("24075"), 'user'),
      content: userPrompt
    })]);
  }
}

/**
 * Parsea la respuesta de la IA y extrae el JSON del examen
 */
function parseAIResponse(response: {
  content: string;
  service: string;
  model: string;
}): GeneratedExam {
  if (stryMutAct_9fa48("24076")) {
    {}
  } else {
    stryCov_9fa48("24076");
    try {
      if (stryMutAct_9fa48("24077")) {
        {}
      } else {
        stryCov_9fa48("24077");
        // Intentar extraer JSON de la respuesta
        const jsonMatch = response.content.match(stryMutAct_9fa48("24081") ? /\{[\s\s]*\}/ : stryMutAct_9fa48("24080") ? /\{[\S\S]*\}/ : stryMutAct_9fa48("24079") ? /\{[^\s\S]*\}/ : stryMutAct_9fa48("24078") ? /\{[\s\S]\}/ : (stryCov_9fa48("24078", "24079", "24080", "24081"), /\{[\s\S]*\}/));
        if (stryMutAct_9fa48("24083") ? false : stryMutAct_9fa48("24082") ? true : (stryCov_9fa48("24082", "24083"), jsonMatch)) {
          if (stryMutAct_9fa48("24084")) {
            {}
          } else {
            stryCov_9fa48("24084");
            return JSON.parse(jsonMatch[0]);
          }
        } else {
          if (stryMutAct_9fa48("24085")) {
            {}
          } else {
            stryCov_9fa48("24085");
            throw new Error(stryMutAct_9fa48("24086") ? "" : (stryCov_9fa48("24086"), 'No se encontró JSON en la respuesta'));
          }
        }
      }
    } catch (parseError) {
      if (stryMutAct_9fa48("24087")) {
        {}
      } else {
        stryCov_9fa48("24087");
        logger.error(stryMutAct_9fa48("24088") ? {} : (stryCov_9fa48("24088"), {
          error: parseError instanceof Error ? parseError.message : String(parseError),
          responseLength: response.content.length,
          responsePreview: stryMutAct_9fa48("24089") ? response.content : (stryCov_9fa48("24089"), response.content.substring(0, 500)),
          service: response.service,
          model: response.model
        }), stryMutAct_9fa48("24090") ? "" : (stryCov_9fa48("24090"), 'Error al parsear respuesta de IA'));
        throw new Error(stryMutAct_9fa48("24091") ? "" : (stryCov_9fa48("24091"), 'La IA no generó un formato válido. Intenta nuevamente.'));
      }
    }
  }
}

/**
 * Valida y corrige las preguntas del examen generado
 */
function validateAndFixQuestions(questions: GeneratedQuestion[], tipo: ExamGenerationParams['tipo'], numQuestions: number, context: Awaited<ReturnType<typeof getTopicContext>>): GeneratedQuestion[] {
  if (stryMutAct_9fa48("24092")) {
    {}
  } else {
    stryCov_9fa48("24092");
    // Validar número de preguntas
    if (stryMutAct_9fa48("24095") ? questions.length === numQuestions : stryMutAct_9fa48("24094") ? false : stryMutAct_9fa48("24093") ? true : (stryCov_9fa48("24093", "24094", "24095"), questions.length !== numQuestions)) {
      if (stryMutAct_9fa48("24096")) {
        {}
      } else {
        stryCov_9fa48("24096");
        logger.warn(stryMutAct_9fa48("24097") ? {} : (stryCov_9fa48("24097"), {
          expected: numQuestions,
          actual: questions.length,
          tipo
        }), stryMutAct_9fa48("24098") ? `` : (stryCov_9fa48("24098"), `Se generaron ${questions.length} preguntas en lugar de ${numQuestions}`));
      }
    }
    return questions.map((q, index) => {
      if (stryMutAct_9fa48("24099")) {
        {}
      } else {
        stryCov_9fa48("24099");
        // Para tipo mixta, algunas preguntas pueden ser de desarrollo (sin opciones)
        // Para tipo objetiva, todas deben tener opciones
        // Para tipo desarrollo, ninguna debe tener opciones

        if (stryMutAct_9fa48("24102") ? tipo !== 'objetiva' : stryMutAct_9fa48("24101") ? false : stryMutAct_9fa48("24100") ? true : (stryCov_9fa48("24100", "24101", "24102"), tipo === (stryMutAct_9fa48("24103") ? "" : (stryCov_9fa48("24103"), 'objetiva')))) {
          if (stryMutAct_9fa48("24104")) {
            {}
          } else {
            stryCov_9fa48("24104");
            // Todas las preguntas objetivas deben tener 4 opciones
            if (stryMutAct_9fa48("24107") ? !q.opciones && q.opciones.length !== EXAM_CONSTANTS.REQUIRED_OPTIONS_COUNT : stryMutAct_9fa48("24106") ? false : stryMutAct_9fa48("24105") ? true : (stryCov_9fa48("24105", "24106", "24107"), (stryMutAct_9fa48("24108") ? q.opciones : (stryCov_9fa48("24108"), !q.opciones)) || (stryMutAct_9fa48("24110") ? q.opciones.length === EXAM_CONSTANTS.REQUIRED_OPTIONS_COUNT : stryMutAct_9fa48("24109") ? false : (stryCov_9fa48("24109", "24110"), q.opciones.length !== EXAM_CONSTANTS.REQUIRED_OPTIONS_COUNT)))) {
              if (stryMutAct_9fa48("24111")) {
                {}
              } else {
                stryCov_9fa48("24111");
                throw new Error(stryMutAct_9fa48("24112") ? `` : (stryCov_9fa48("24112"), `La pregunta ${stryMutAct_9fa48("24113") ? index - 1 : (stryCov_9fa48("24113"), index + 1)} no tiene ${EXAM_CONSTANTS.REQUIRED_OPTIONS_COUNT} opciones (tipo objetiva requiere opciones)`));
              }
            }

            // Asegurar que hay exactamente una opción correcta
            const correctCount = stryMutAct_9fa48("24114") ? q.opciones.length : (stryCov_9fa48("24114"), q.opciones.filter(stryMutAct_9fa48("24115") ? () => undefined : (stryCov_9fa48("24115"), o => o.esCorrecta)).length);
            if (stryMutAct_9fa48("24118") ? correctCount === 1 : stryMutAct_9fa48("24117") ? false : stryMutAct_9fa48("24116") ? true : (stryCov_9fa48("24116", "24117", "24118"), correctCount !== 1)) {
              if (stryMutAct_9fa48("24119")) {
                {}
              } else {
                stryCov_9fa48("24119");
                // Si no hay ninguna correcta o hay más de una, marcar la primera como correcta
                q.opciones.forEach((opt, i) => {
                  if (stryMutAct_9fa48("24120")) {
                    {}
                  } else {
                    stryCov_9fa48("24120");
                    opt.esCorrecta = stryMutAct_9fa48("24123") ? i !== 0 : stryMutAct_9fa48("24122") ? false : stryMutAct_9fa48("24121") ? true : (stryCov_9fa48("24121", "24122", "24123"), i === 0);
                  }
                });
              }
            }

            // Asegurar que las letras sean A, B, C, D
            q.opciones = q.opciones.map(stryMutAct_9fa48("24124") ? () => undefined : (stryCov_9fa48("24124"), (opt, i) => stryMutAct_9fa48("24125") ? {} : (stryCov_9fa48("24125"), {
              ...opt,
              letra: EXAM_CONSTANTS.OPTION_LETTERS[i]
            })));
          }
        } else if (stryMutAct_9fa48("24128") ? tipo !== 'mixta' : stryMutAct_9fa48("24127") ? false : stryMutAct_9fa48("24126") ? true : (stryCov_9fa48("24126", "24127", "24128"), tipo === (stryMutAct_9fa48("24129") ? "" : (stryCov_9fa48("24129"), 'mixta')))) {
          if (stryMutAct_9fa48("24130")) {
            {}
          } else {
            stryCov_9fa48("24130");
            // Para tipo mixta, validar si tiene opciones (es objetiva) o no (es desarrollo)
            if (stryMutAct_9fa48("24133") ? q.opciones || q.opciones.length > 0 : stryMutAct_9fa48("24132") ? false : stryMutAct_9fa48("24131") ? true : (stryCov_9fa48("24131", "24132", "24133"), q.opciones && (stryMutAct_9fa48("24136") ? q.opciones.length <= 0 : stryMutAct_9fa48("24135") ? q.opciones.length >= 0 : stryMutAct_9fa48("24134") ? true : (stryCov_9fa48("24134", "24135", "24136"), q.opciones.length > 0)))) {
              if (stryMutAct_9fa48("24137")) {
                {}
              } else {
                stryCov_9fa48("24137");
                // Es pregunta objetiva, debe tener 4 opciones
                if (stryMutAct_9fa48("24140") ? q.opciones.length === EXAM_CONSTANTS.REQUIRED_OPTIONS_COUNT : stryMutAct_9fa48("24139") ? false : stryMutAct_9fa48("24138") ? true : (stryCov_9fa48("24138", "24139", "24140"), q.opciones.length !== EXAM_CONSTANTS.REQUIRED_OPTIONS_COUNT)) {
                  if (stryMutAct_9fa48("24141")) {
                    {}
                  } else {
                    stryCov_9fa48("24141");
                    // Si no tiene 4, intentar corregir o eliminar opciones
                    if (stryMutAct_9fa48("24145") ? q.opciones.length >= EXAM_CONSTANTS.REQUIRED_OPTIONS_COUNT : stryMutAct_9fa48("24144") ? q.opciones.length <= EXAM_CONSTANTS.REQUIRED_OPTIONS_COUNT : stryMutAct_9fa48("24143") ? false : stryMutAct_9fa48("24142") ? true : (stryCov_9fa48("24142", "24143", "24144", "24145"), q.opciones.length < EXAM_CONSTANTS.REQUIRED_OPTIONS_COUNT)) {
                      if (stryMutAct_9fa48("24146")) {
                        {}
                      } else {
                        stryCov_9fa48("24146");
                        // No tiene suficientes opciones, convertir a desarrollo
                        q.opciones = stryMutAct_9fa48("24147") ? ["Stryker was here"] : (stryCov_9fa48("24147"), []);
                      }
                    } else {
                      if (stryMutAct_9fa48("24148")) {
                        {}
                      } else {
                        stryCov_9fa48("24148");
                        // Tiene más de 4, tomar las primeras 4
                        q.opciones = stryMutAct_9fa48("24149") ? q.opciones : (stryCov_9fa48("24149"), q.opciones.slice(0, EXAM_CONSTANTS.REQUIRED_OPTIONS_COUNT));
                      }
                    }
                  }
                }

                // Asegurar que hay exactamente una opción correcta
                const correctCount = stryMutAct_9fa48("24150") ? q.opciones.length : (stryCov_9fa48("24150"), q.opciones.filter(stryMutAct_9fa48("24151") ? () => undefined : (stryCov_9fa48("24151"), o => o.esCorrecta)).length);
                if (stryMutAct_9fa48("24154") ? correctCount !== 1 || q.opciones.length > 0 : stryMutAct_9fa48("24153") ? false : stryMutAct_9fa48("24152") ? true : (stryCov_9fa48("24152", "24153", "24154"), (stryMutAct_9fa48("24156") ? correctCount === 1 : stryMutAct_9fa48("24155") ? true : (stryCov_9fa48("24155", "24156"), correctCount !== 1)) && (stryMutAct_9fa48("24159") ? q.opciones.length <= 0 : stryMutAct_9fa48("24158") ? q.opciones.length >= 0 : stryMutAct_9fa48("24157") ? true : (stryCov_9fa48("24157", "24158", "24159"), q.opciones.length > 0)))) {
                  if (stryMutAct_9fa48("24160")) {
                    {}
                  } else {
                    stryCov_9fa48("24160");
                    q.opciones.forEach((opt, i) => {
                      if (stryMutAct_9fa48("24161")) {
                        {}
                      } else {
                        stryCov_9fa48("24161");
                        opt.esCorrecta = stryMutAct_9fa48("24164") ? i !== 0 : stryMutAct_9fa48("24163") ? false : stryMutAct_9fa48("24162") ? true : (stryCov_9fa48("24162", "24163", "24164"), i === 0);
                      }
                    });
                  }
                }

                // Asegurar que las letras sean A, B, C, D
                q.opciones = q.opciones.map(stryMutAct_9fa48("24165") ? () => undefined : (stryCov_9fa48("24165"), (opt, i) => stryMutAct_9fa48("24166") ? {} : (stryCov_9fa48("24166"), {
                  ...opt,
                  letra: EXAM_CONSTANTS.OPTION_LETTERS[i]
                })));
              }
            } else {
              if (stryMutAct_9fa48("24167")) {
                {}
              } else {
                stryCov_9fa48("24167");
                // Es pregunta de desarrollo, no requiere opciones
                q.opciones = stryMutAct_9fa48("24168") ? ["Stryker was here"] : (stryCov_9fa48("24168"), []);
              }
            }
          }
        } else {
          if (stryMutAct_9fa48("24169")) {
            {}
          } else {
            stryCov_9fa48("24169");
            // Para preguntas de desarrollo, no se requieren opciones
            q.opciones = stryMutAct_9fa48("24170") ? ["Stryker was here"] : (stryCov_9fa48("24170"), []);
          }
        }

        // Asociar con tema si no está asociado
        if (stryMutAct_9fa48("24173") ? !q.topicId || context.topics.length > 0 : stryMutAct_9fa48("24172") ? false : stryMutAct_9fa48("24171") ? true : (stryCov_9fa48("24171", "24172", "24173"), (stryMutAct_9fa48("24174") ? q.topicId : (stryCov_9fa48("24174"), !q.topicId)) && (stryMutAct_9fa48("24177") ? context.topics.length <= 0 : stryMutAct_9fa48("24176") ? context.topics.length >= 0 : stryMutAct_9fa48("24175") ? true : (stryCov_9fa48("24175", "24176", "24177"), context.topics.length > 0)))) {
          if (stryMutAct_9fa48("24178")) {
            {}
          } else {
            stryCov_9fa48("24178");
            // Buscar tema por nombre o eje temático
            const matchingTopic = context.topics.find(stryMutAct_9fa48("24179") ? () => undefined : (stryCov_9fa48("24179"), t => stryMutAct_9fa48("24182") ? t.nombre.toLowerCase().includes(q.ejeTematico?.toLowerCase() || '') && q.ejeTematico?.toLowerCase().includes(t.nombre.toLowerCase()) : stryMutAct_9fa48("24181") ? false : stryMutAct_9fa48("24180") ? true : (stryCov_9fa48("24180", "24181", "24182"), (stryMutAct_9fa48("24183") ? t.nombre.toUpperCase().includes(q.ejeTematico?.toLowerCase() || '') : (stryCov_9fa48("24183"), t.nombre.toLowerCase().includes(stryMutAct_9fa48("24186") ? q.ejeTematico?.toLowerCase() && '' : stryMutAct_9fa48("24185") ? false : stryMutAct_9fa48("24184") ? true : (stryCov_9fa48("24184", "24185", "24186"), (stryMutAct_9fa48("24188") ? q.ejeTematico.toLowerCase() : stryMutAct_9fa48("24187") ? q.ejeTematico?.toUpperCase() : (stryCov_9fa48("24187", "24188"), q.ejeTematico?.toLowerCase())) || (stryMutAct_9fa48("24189") ? "Stryker was here!" : (stryCov_9fa48("24189"), '')))))) || (stryMutAct_9fa48("24191") ? q.ejeTematico.toLowerCase().includes(t.nombre.toLowerCase()) : stryMutAct_9fa48("24190") ? q.ejeTematico?.toUpperCase().includes(t.nombre.toLowerCase()) : (stryCov_9fa48("24190", "24191"), q.ejeTematico?.toLowerCase().includes(stryMutAct_9fa48("24192") ? t.nombre.toUpperCase() : (stryCov_9fa48("24192"), t.nombre.toLowerCase())))))));
            if (stryMutAct_9fa48("24194") ? false : stryMutAct_9fa48("24193") ? true : (stryCov_9fa48("24193", "24194"), matchingTopic)) {
              if (stryMutAct_9fa48("24195")) {
                {}
              } else {
                stryCov_9fa48("24195");
                q.topicId = matchingTopic.id;
                q.ejeTematico = matchingTopic.ejeTematico;
              }
            } else {
              if (stryMutAct_9fa48("24196")) {
                {}
              } else {
                stryCov_9fa48("24196");
                // Asignar tema aleatorio si no hay coincidencia
                const randomTopic = context.topics[Math.floor(stryMutAct_9fa48("24197") ? Math.random() / context.topics.length : (stryCov_9fa48("24197"), Math.random() * context.topics.length))];
                q.topicId = randomTopic.id;
                q.ejeTematico = randomTopic.ejeTematico;
              }
            }
          }
        }
        return q;
      }
    });
  }
}

/**
 * Genera el clavijero (answer key) para las preguntas objetivas
 */
function generateAnswerKey(questions: GeneratedQuestion[]): Record<number, string> {
  if (stryMutAct_9fa48("24198")) {
    {}
  } else {
    stryCov_9fa48("24198");
    const answerKey: Record<number, string> = {};
    questions.forEach((q, index) => {
      if (stryMutAct_9fa48("24199")) {
        {}
      } else {
        stryCov_9fa48("24199");
        // Solo agregar al clavijero si tiene opciones (preguntas objetivas)
        if (stryMutAct_9fa48("24202") ? q.opciones || q.opciones.length > 0 : stryMutAct_9fa48("24201") ? false : stryMutAct_9fa48("24200") ? true : (stryCov_9fa48("24200", "24201", "24202"), q.opciones && (stryMutAct_9fa48("24205") ? q.opciones.length <= 0 : stryMutAct_9fa48("24204") ? q.opciones.length >= 0 : stryMutAct_9fa48("24203") ? true : (stryCov_9fa48("24203", "24204", "24205"), q.opciones.length > 0)))) {
          if (stryMutAct_9fa48("24206")) {
            {}
          } else {
            stryCov_9fa48("24206");
            const correctOption = q.opciones.find(stryMutAct_9fa48("24207") ? () => undefined : (stryCov_9fa48("24207"), o => o.esCorrecta));
            if (stryMutAct_9fa48("24209") ? false : stryMutAct_9fa48("24208") ? true : (stryCov_9fa48("24208", "24209"), correctOption)) {
              if (stryMutAct_9fa48("24210")) {
                {}
              } else {
                stryCov_9fa48("24210");
                answerKey[index] = correctOption.letra;
              }
            }
          }
        }
        // Las preguntas de desarrollo no se incluyen en el clavijero
      }
    });
    return answerKey;
  }
}

/**
 * Valida que el contexto del temario sea válido para generar el examen
 */
function validateTopicContext(context: Awaited<ReturnType<typeof getTopicContext>>, subjectId: string): void {
  if (stryMutAct_9fa48("24211")) {
    {}
  } else {
    stryCov_9fa48("24211");
    if (stryMutAct_9fa48("24214") ? false : stryMutAct_9fa48("24213") ? true : stryMutAct_9fa48("24212") ? context.subject : (stryCov_9fa48("24212", "24213", "24214"), !context.subject)) {
      if (stryMutAct_9fa48("24215")) {
        {}
      } else {
        stryCov_9fa48("24215");
        throw new Error(stryMutAct_9fa48("24216") ? `` : (stryCov_9fa48("24216"), `No se encontró la asignatura con ID: ${subjectId}`));
      }
    }
    if (stryMutAct_9fa48("24219") ? context.topics.length !== 0 : stryMutAct_9fa48("24218") ? false : stryMutAct_9fa48("24217") ? true : (stryCov_9fa48("24217", "24218", "24219"), context.topics.length === 0)) {
      if (stryMutAct_9fa48("24220")) {
        {}
      } else {
        stryCov_9fa48("24220");
        throw new Error(stryMutAct_9fa48("24221") ? `` : (stryCov_9fa48("24221"), `No se encontraron temas para la asignatura "${context.subject.nombre}". Por favor, importa un temario primero.`));
      }
    }
  }
}

/**
 * Valida y obtiene la configuración de IA del usuario
 */
async function validateAndGetAIConfig(userId?: string) {
  if (stryMutAct_9fa48("24222")) {
    {}
  } else {
    stryCov_9fa48("24222");
    const aiConfig = await getAIConfig(userId);
    if (stryMutAct_9fa48("24225") ? false : stryMutAct_9fa48("24224") ? true : stryMutAct_9fa48("24223") ? aiConfig : (stryCov_9fa48("24223", "24224", "24225"), !aiConfig)) {
      if (stryMutAct_9fa48("24226")) {
        {}
      } else {
        stryCov_9fa48("24226");
        throw new Error(stryMutAct_9fa48("24227") ? "" : (stryCov_9fa48("24227"), 'No hay configuración de IA disponible. Por favor, configura tus API keys en tu perfil.'));
      }
    }
    return aiConfig;
  }
}

/**
 * Valida la estructura básica del examen generado
 */
function validateExamStructure(examData: GeneratedExam): void {
  if (stryMutAct_9fa48("24228")) {
    {}
  } else {
    stryCov_9fa48("24228");
    if (stryMutAct_9fa48("24231") ? !examData.questions && !Array.isArray(examData.questions) : stryMutAct_9fa48("24230") ? false : stryMutAct_9fa48("24229") ? true : (stryCov_9fa48("24229", "24230", "24231"), (stryMutAct_9fa48("24232") ? examData.questions : (stryCov_9fa48("24232"), !examData.questions)) || (stryMutAct_9fa48("24233") ? Array.isArray(examData.questions) : (stryCov_9fa48("24233"), !Array.isArray(examData.questions))))) {
      if (stryMutAct_9fa48("24234")) {
        {}
      } else {
        stryCov_9fa48("24234");
        throw new Error(stryMutAct_9fa48("24235") ? "" : (stryCov_9fa48("24235"), 'El examen generado no tiene preguntas válidas'));
      }
    }
    if (stryMutAct_9fa48("24238") ? examData.questions.length !== 0 : stryMutAct_9fa48("24237") ? false : stryMutAct_9fa48("24236") ? true : (stryCov_9fa48("24236", "24237", "24238"), examData.questions.length === 0)) {
      if (stryMutAct_9fa48("24239")) {
        {}
      } else {
        stryCov_9fa48("24239");
        throw new Error(stryMutAct_9fa48("24240") ? "" : (stryCov_9fa48("24240"), 'El examen generado no contiene preguntas'));
      }
    }
  }
}

/**
 * Procesa el examen generado: valida, corrige y genera clavijero si es necesario
 */
function processGeneratedExam(examData: GeneratedExam, params: ExamGenerationParams, context: Awaited<ReturnType<typeof getTopicContext>>): GeneratedExam {
  if (stryMutAct_9fa48("24241")) {
    {}
  } else {
    stryCov_9fa48("24241");
    // Validar estructura básica
    validateExamStructure(examData);

    // Validar y corregir preguntas
    examData.questions = validateAndFixQuestions(examData.questions, params.tipo, params.numQuestions, context);

    // Generar clavijero si se solicita
    if (stryMutAct_9fa48("24243") ? false : stryMutAct_9fa48("24242") ? true : (stryCov_9fa48("24242", "24243"), params.includeAnswerKey)) {
      if (stryMutAct_9fa48("24244")) {
        {}
      } else {
        stryCov_9fa48("24244");
        examData.answerKey = generateAnswerKey(examData.questions);
      }
    }
    return examData;
  }
}

/**
 * Genera un examen usando IA basado en temarios
 *
 * Esta función orquesta todo el proceso de generación:
 * 1. Obtiene y valida el contexto del temario
 * 2. Obtiene y valida la configuración de IA
 * 3. Construye el prompt y genera el examen con IA
 * 4. Parsea, valida y procesa el examen generado
 */
export async function generateExamWithAI(params: ExamGenerationParams): Promise<GeneratedExam> {
  if (stryMutAct_9fa48("24245")) {
    {}
  } else {
    stryCov_9fa48("24245");
    const {
      subjectId,
      topicIds,
      userId
    } = params;
    try {
      if (stryMutAct_9fa48("24246")) {
        {}
      } else {
        stryCov_9fa48("24246");
        // 1. Obtener y validar contexto del temario
        const context = await getTopicContext(subjectId, topicIds);
        validateTopicContext(context, subjectId);

        // 2. Obtener y validar configuración de IA
        const aiConfig = await validateAndGetAIConfig(userId);

        // 3. Construir prompt y generar examen con IA
        const messages = buildPromptForExamGeneration(context, params);
        const response = await sendAIMessage(messages, aiConfig, userId);

        // 4. Parsear respuesta JSON
        const examData = parseAIResponse(response);

        // 5. Procesar examen (validar, corregir, generar clavijero)
        return processGeneratedExam(examData, params, context);
      }
    } catch (error) {
      if (stryMutAct_9fa48("24247")) {
        {}
      } else {
        stryCov_9fa48("24247");
        logger.error(stryMutAct_9fa48("24248") ? {} : (stryCov_9fa48("24248"), {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          subjectId,
          numQuestions: params.numQuestions,
          tipo: params.tipo,
          difficulty: params.difficulty,
          userId
        }), stryMutAct_9fa48("24249") ? "" : (stryCov_9fa48("24249"), 'Error al generar examen con IA'));
        throw error instanceof Error ? error : new Error(stryMutAct_9fa48("24250") ? "" : (stryCov_9fa48("24250"), 'Error desconocido al generar examen'));
      }
    }
  }
}