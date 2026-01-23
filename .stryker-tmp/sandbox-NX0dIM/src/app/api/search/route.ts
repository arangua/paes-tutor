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
import { getCurrentStudentId } from '@/lib/get-session';
import { withRateLimit } from '@/lib/rate-limit-middleware';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { logger } from '@/lib/logger';
import { LIMIT_CONSTANTS, SEARCH_CONSTANTS, SEARCH_WEIGHT_PRESETS, SEARCH_TYPES, type SearchType } from '@/lib/constants';
export const runtime = stryMutAct_9fa48("9906") ? "" : (stryCov_9fa48("9906"), 'nodejs');
const searchQuerySchema = z.object(stryMutAct_9fa48("9907") ? {} : (stryCov_9fa48("9907"), {
  q: stryMutAct_9fa48("9909") ? z.string().max(1).max(200) : stryMutAct_9fa48("9908") ? z.string().min(1).min(200) : (stryCov_9fa48("9908", "9909"), z.string().min(1).max(200)),
  types: z.string().optional().transform(stryMutAct_9fa48("9910") ? () => undefined : (stryCov_9fa48("9910"), val => val ? val.split(stryMutAct_9fa48("9911") ? "" : (stryCov_9fa48("9911"), ',')) : undefined)),
  limit: z.string().optional().transform(stryMutAct_9fa48("9912") ? () => undefined : (stryCov_9fa48("9912"), val => val ? parseInt(val, 10) : 10)).pipe(stryMutAct_9fa48("9914") ? z.number().int().max(1).max(100) : stryMutAct_9fa48("9913") ? z.number().int().min(1).min(100) : (stryCov_9fa48("9913", "9914"), z.number().int().min(1).max(100))),
  offset: z.string().optional().transform(stryMutAct_9fa48("9915") ? () => undefined : (stryCov_9fa48("9915"), val => val ? parseInt(val, 10) : 0)).pipe(stryMutAct_9fa48("9916") ? z.number().int().max(0) : (stryCov_9fa48("9916"), z.number().int().min(0)))
}));

/**
 * Calcula la relevancia de un resultado de búsqueda
 */
function calculateRelevance(text: string, query: string, queryWords: string[], weights: {
  title?: number;
  content?: number;
  subject?: number;
  topic?: number;
} = {}): number {
  if (stryMutAct_9fa48("9917")) {
    {}
  } else {
    stryCov_9fa48("9917");
    const defaultWeights = stryMutAct_9fa48("9918") ? {} : (stryCov_9fa48("9918"), {
      title: SEARCH_CONSTANTS.RELEVANCE_WEIGHTS.TITLE,
      content: SEARCH_CONSTANTS.RELEVANCE_WEIGHTS.CONTENT,
      subject: SEARCH_CONSTANTS.RELEVANCE_WEIGHTS.SUBJECT,
      topic: SEARCH_CONSTANTS.RELEVANCE_WEIGHTS.TOPIC,
      ...weights
    });
    const lowerText = stryMutAct_9fa48("9919") ? text.toUpperCase() : (stryCov_9fa48("9919"), text.toLowerCase());
    let relevance = 0;

    // Búsqueda exacta (mayor peso)
    if (stryMutAct_9fa48("9921") ? false : stryMutAct_9fa48("9920") ? true : (stryCov_9fa48("9920", "9921"), lowerText.includes(stryMutAct_9fa48("9922") ? query.toUpperCase() : (stryCov_9fa48("9922"), query.toLowerCase())))) {
      if (stryMutAct_9fa48("9923")) {
        {}
      } else {
        stryCov_9fa48("9923");
        stryMutAct_9fa48("9924") ? relevance -= SEARCH_CONSTANTS.RELEVANCE_WEIGHTS.EXACT_MATCH : (stryCov_9fa48("9924"), relevance += SEARCH_CONSTANTS.RELEVANCE_WEIGHTS.EXACT_MATCH);
      }
    }

    // Búsqueda por palabras
    queryWords.forEach(word => {
      if (stryMutAct_9fa48("9925")) {
        {}
      } else {
        stryCov_9fa48("9925");
        if (stryMutAct_9fa48("9927") ? false : stryMutAct_9fa48("9926") ? true : (stryCov_9fa48("9926", "9927"), lowerText.includes(word))) {
          if (stryMutAct_9fa48("9928")) {
            {}
          } else {
            stryCov_9fa48("9928");
            // Peso según posición
            const index = lowerText.indexOf(word);
            // Validar que la palabra fue encontrada (indexOf retorna -1 si no encuentra)
            if (stryMutAct_9fa48("9931") ? index === -1 : stryMutAct_9fa48("9930") ? false : stryMutAct_9fa48("9929") ? true : (stryCov_9fa48("9929", "9930", "9931"), index !== (stryMutAct_9fa48("9932") ? +1 : (stryCov_9fa48("9932"), -1)))) {
              if (stryMutAct_9fa48("9933")) {
                {}
              } else {
                stryCov_9fa48("9933");
                const positionWeight = (stryMutAct_9fa48("9937") ? index >= SEARCH_CONSTANTS.POSITION_THRESHOLDS.NEAR_START : stryMutAct_9fa48("9936") ? index <= SEARCH_CONSTANTS.POSITION_THRESHOLDS.NEAR_START : stryMutAct_9fa48("9935") ? false : stryMutAct_9fa48("9934") ? true : (stryCov_9fa48("9934", "9935", "9936", "9937"), index < SEARCH_CONSTANTS.POSITION_THRESHOLDS.NEAR_START)) ? SEARCH_CONSTANTS.POSITION_WEIGHTS.NEAR_START : (stryMutAct_9fa48("9941") ? index >= SEARCH_CONSTANTS.POSITION_THRESHOLDS.MIDDLE : stryMutAct_9fa48("9940") ? index <= SEARCH_CONSTANTS.POSITION_THRESHOLDS.MIDDLE : stryMutAct_9fa48("9939") ? false : stryMutAct_9fa48("9938") ? true : (stryCov_9fa48("9938", "9939", "9940", "9941"), index < SEARCH_CONSTANTS.POSITION_THRESHOLDS.MIDDLE)) ? SEARCH_CONSTANTS.POSITION_WEIGHTS.MIDDLE : SEARCH_CONSTANTS.POSITION_WEIGHTS.FAR;
                stryMutAct_9fa48("9942") ? relevance -= positionWeight : (stryCov_9fa48("9942"), relevance += positionWeight);
              }
            }
          }
        }
      }
    });
    return relevance;
  }
}

/**
 * Busca exámenes
 */
async function searchExams(query: string, queryWords: string[], studentId: string, limit: number, offset: number) {
  if (stryMutAct_9fa48("9943")) {
    {}
  } else {
    stryCov_9fa48("9943");
    // SQLite no soporta mode: 'insensitive', usar contains sin mode
    const queryLower = stryMutAct_9fa48("9944") ? query.toUpperCase() : (stryCov_9fa48("9944"), query.toLowerCase());
    const exams = await prisma.exam.findMany(stryMutAct_9fa48("9945") ? {} : (stryCov_9fa48("9945"), {
      where: stryMutAct_9fa48("9946") ? {} : (stryCov_9fa48("9946"), {
        OR: stryMutAct_9fa48("9947") ? [] : (stryCov_9fa48("9947"), [stryMutAct_9fa48("9948") ? {} : (stryCov_9fa48("9948"), {
          titulo: stryMutAct_9fa48("9949") ? {} : (stryCov_9fa48("9949"), {
            contains: query
          })
        }), stryMutAct_9fa48("9950") ? {} : (stryCov_9fa48("9950"), {
          descripcion: stryMutAct_9fa48("9951") ? {} : (stryCov_9fa48("9951"), {
            contains: query
          })
        }), stryMutAct_9fa48("9952") ? {} : (stryCov_9fa48("9952"), {
          subject: stryMutAct_9fa48("9953") ? {} : (stryCov_9fa48("9953"), {
            nombre: stryMutAct_9fa48("9954") ? {} : (stryCov_9fa48("9954"), {
              contains: query
            })
          })
        })])
      }),
      include: stryMutAct_9fa48("9955") ? {} : (stryCov_9fa48("9955"), {
        subject: stryMutAct_9fa48("9956") ? {} : (stryCov_9fa48("9956"), {
          select: stryMutAct_9fa48("9957") ? {} : (stryCov_9fa48("9957"), {
            id: stryMutAct_9fa48("9958") ? false : (stryCov_9fa48("9958"), true),
            nombre: stryMutAct_9fa48("9959") ? false : (stryCov_9fa48("9959"), true),
            codigo: stryMutAct_9fa48("9960") ? false : (stryCov_9fa48("9960"), true)
          })
        }),
        _count: stryMutAct_9fa48("9961") ? {} : (stryCov_9fa48("9961"), {
          select: stryMutAct_9fa48("9962") ? {} : (stryCov_9fa48("9962"), {
            questions: stryMutAct_9fa48("9963") ? false : (stryCov_9fa48("9963"), true)
          })
        })
      }),
      take: limit,
      skip: offset,
      orderBy: stryMutAct_9fa48("9964") ? {} : (stryCov_9fa48("9964"), {
        createdAt: stryMutAct_9fa48("9965") ? "" : (stryCov_9fa48("9965"), 'desc')
      })
    }));
    return exams.map(stryMutAct_9fa48("9966") ? () => undefined : (stryCov_9fa48("9966"), exam => stryMutAct_9fa48("9967") ? {} : (stryCov_9fa48("9967"), {
      type: 'exam' as const,
      id: exam.id,
      title: exam.titulo,
      description: exam.descripcion,
      subject: exam.subject.nombre,
      subjectCode: exam.subject.codigo,
      tipo: exam.tipo,
      totalPreguntas: exam._count.questions,
      relevance: calculateRelevance(stryMutAct_9fa48("9968") ? `` : (stryCov_9fa48("9968"), `${exam.titulo} ${stryMutAct_9fa48("9971") ? exam.descripcion && '' : stryMutAct_9fa48("9970") ? false : stryMutAct_9fa48("9969") ? true : (stryCov_9fa48("9969", "9970", "9971"), exam.descripcion || (stryMutAct_9fa48("9972") ? "Stryker was here!" : (stryCov_9fa48("9972"), '')))} ${exam.subject.nombre}`), query, queryWords, SEARCH_WEIGHT_PRESETS.EXAM),
      url: stryMutAct_9fa48("9973") ? `` : (stryCov_9fa48("9973"), `/exams/${exam.id}/take`)
    })));
  }
}

/**
 * Busca materiales
 */
async function searchMaterials(query: string, queryWords: string[], studentId: string, limit: number, offset: number) {
  if (stryMutAct_9fa48("9974")) {
    {}
  } else {
    stryCov_9fa48("9974");
    // SQLite no soporta mode: 'insensitive', usar contains sin mode
    const materials = await prisma.studyMaterial.findMany(stryMutAct_9fa48("9975") ? {} : (stryCov_9fa48("9975"), {
      where: stryMutAct_9fa48("9976") ? {} : (stryCov_9fa48("9976"), {
        OR: stryMutAct_9fa48("9977") ? [] : (stryCov_9fa48("9977"), [stryMutAct_9fa48("9978") ? {} : (stryCov_9fa48("9978"), {
          titulo: stryMutAct_9fa48("9979") ? {} : (stryCov_9fa48("9979"), {
            contains: query
          })
        }), stryMutAct_9fa48("9980") ? {} : (stryCov_9fa48("9980"), {
          contenido: stryMutAct_9fa48("9981") ? {} : (stryCov_9fa48("9981"), {
            contains: query
          })
        }), stryMutAct_9fa48("9982") ? {} : (stryCov_9fa48("9982"), {
          subject: stryMutAct_9fa48("9983") ? {} : (stryCov_9fa48("9983"), {
            nombre: stryMutAct_9fa48("9984") ? {} : (stryCov_9fa48("9984"), {
              contains: query
            })
          })
        }), stryMutAct_9fa48("9985") ? {} : (stryCov_9fa48("9985"), {
          topic: stryMutAct_9fa48("9986") ? {} : (stryCov_9fa48("9986"), {
            nombre: stryMutAct_9fa48("9987") ? {} : (stryCov_9fa48("9987"), {
              contains: query
            })
          })
        }), stryMutAct_9fa48("9988") ? {} : (stryCov_9fa48("9988"), {
          topic: stryMutAct_9fa48("9989") ? {} : (stryCov_9fa48("9989"), {
            ejeTematico: stryMutAct_9fa48("9990") ? {} : (stryCov_9fa48("9990"), {
              contains: query
            })
          })
        })])
      }),
      include: stryMutAct_9fa48("9991") ? {} : (stryCov_9fa48("9991"), {
        subject: stryMutAct_9fa48("9992") ? {} : (stryCov_9fa48("9992"), {
          select: stryMutAct_9fa48("9993") ? {} : (stryCov_9fa48("9993"), {
            id: stryMutAct_9fa48("9994") ? false : (stryCov_9fa48("9994"), true),
            nombre: stryMutAct_9fa48("9995") ? false : (stryCov_9fa48("9995"), true),
            codigo: stryMutAct_9fa48("9996") ? false : (stryCov_9fa48("9996"), true)
          })
        }),
        topic: stryMutAct_9fa48("9997") ? {} : (stryCov_9fa48("9997"), {
          select: stryMutAct_9fa48("9998") ? {} : (stryCov_9fa48("9998"), {
            id: stryMutAct_9fa48("9999") ? false : (stryCov_9fa48("9999"), true),
            nombre: stryMutAct_9fa48("10000") ? false : (stryCov_9fa48("10000"), true),
            ejeTematico: stryMutAct_9fa48("10001") ? false : (stryCov_9fa48("10001"), true)
          })
        })
      }),
      take: limit,
      skip: offset,
      orderBy: stryMutAct_9fa48("10002") ? {} : (stryCov_9fa48("10002"), {
        createdAt: stryMutAct_9fa48("10003") ? "" : (stryCov_9fa48("10003"), 'desc')
      })
    }));
    return materials.map(stryMutAct_9fa48("10004") ? () => undefined : (stryCov_9fa48("10004"), material => stryMutAct_9fa48("10005") ? {} : (stryCov_9fa48("10005"), {
      type: 'material' as const,
      id: material.id,
      title: material.titulo,
      description: stryMutAct_9fa48("10006") ? material.contenido : (stryCov_9fa48("10006"), material.contenido.substring(0, LIMIT_CONSTANTS.MAX_SEARCH_DESCRIPTION_LENGTH)),
      subject: material.subject.nombre,
      subjectCode: material.subject.codigo,
      topic: stryMutAct_9fa48("10007") ? material.topic.nombre : (stryCov_9fa48("10007"), material.topic?.nombre),
      ejeTematico: stryMutAct_9fa48("10008") ? material.topic.ejeTematico : (stryCov_9fa48("10008"), material.topic?.ejeTematico),
      tipo: material.tipo,
      relevance: calculateRelevance(stryMutAct_9fa48("10009") ? `` : (stryCov_9fa48("10009"), `${material.titulo} ${material.contenido} ${material.subject.nombre} ${stryMutAct_9fa48("10012") ? material.topic?.nombre && '' : stryMutAct_9fa48("10011") ? false : stryMutAct_9fa48("10010") ? true : (stryCov_9fa48("10010", "10011", "10012"), (stryMutAct_9fa48("10013") ? material.topic.nombre : (stryCov_9fa48("10013"), material.topic?.nombre)) || (stryMutAct_9fa48("10014") ? "Stryker was here!" : (stryCov_9fa48("10014"), '')))} ${stryMutAct_9fa48("10017") ? material.topic?.ejeTematico && '' : stryMutAct_9fa48("10016") ? false : stryMutAct_9fa48("10015") ? true : (stryCov_9fa48("10015", "10016", "10017"), (stryMutAct_9fa48("10018") ? material.topic.ejeTematico : (stryCov_9fa48("10018"), material.topic?.ejeTematico)) || (stryMutAct_9fa48("10019") ? "Stryker was here!" : (stryCov_9fa48("10019"), '')))}`), query, queryWords, SEARCH_WEIGHT_PRESETS.MATERIAL),
      url: stryMutAct_9fa48("10020") ? `` : (stryCov_9fa48("10020"), `/materials/${material.id}`)
    })));
  }
}

/**
 * Busca temas
 */
async function searchTopics(query: string, queryWords: string[], limit: number, offset: number) {
  if (stryMutAct_9fa48("10021")) {
    {}
  } else {
    stryCov_9fa48("10021");
    // SQLite no soporta mode: 'insensitive', usar contains sin mode
    const topics = await prisma.topic.findMany(stryMutAct_9fa48("10022") ? {} : (stryCov_9fa48("10022"), {
      where: stryMutAct_9fa48("10023") ? {} : (stryCov_9fa48("10023"), {
        OR: stryMutAct_9fa48("10024") ? [] : (stryCov_9fa48("10024"), [stryMutAct_9fa48("10025") ? {} : (stryCov_9fa48("10025"), {
          nombre: stryMutAct_9fa48("10026") ? {} : (stryCov_9fa48("10026"), {
            contains: query
          })
        }), stryMutAct_9fa48("10027") ? {} : (stryCov_9fa48("10027"), {
          descripcion: stryMutAct_9fa48("10028") ? {} : (stryCov_9fa48("10028"), {
            contains: query
          })
        }), stryMutAct_9fa48("10029") ? {} : (stryCov_9fa48("10029"), {
          ejeTematico: stryMutAct_9fa48("10030") ? {} : (stryCov_9fa48("10030"), {
            contains: query
          })
        }), stryMutAct_9fa48("10031") ? {} : (stryCov_9fa48("10031"), {
          subject: stryMutAct_9fa48("10032") ? {} : (stryCov_9fa48("10032"), {
            nombre: stryMutAct_9fa48("10033") ? {} : (stryCov_9fa48("10033"), {
              contains: query
            })
          })
        })])
      }),
      include: stryMutAct_9fa48("10034") ? {} : (stryCov_9fa48("10034"), {
        subject: stryMutAct_9fa48("10035") ? {} : (stryCov_9fa48("10035"), {
          select: stryMutAct_9fa48("10036") ? {} : (stryCov_9fa48("10036"), {
            id: stryMutAct_9fa48("10037") ? false : (stryCov_9fa48("10037"), true),
            nombre: stryMutAct_9fa48("10038") ? false : (stryCov_9fa48("10038"), true),
            codigo: stryMutAct_9fa48("10039") ? false : (stryCov_9fa48("10039"), true)
          })
        })
      }),
      take: limit,
      skip: offset,
      orderBy: stryMutAct_9fa48("10040") ? {} : (stryCov_9fa48("10040"), {
        nombre: stryMutAct_9fa48("10041") ? "" : (stryCov_9fa48("10041"), 'asc')
      })
    }));
    return topics.map(stryMutAct_9fa48("10042") ? () => undefined : (stryCov_9fa48("10042"), topic => stryMutAct_9fa48("10043") ? {} : (stryCov_9fa48("10043"), {
      type: 'topic' as const,
      id: topic.id,
      title: topic.nombre,
      description: topic.descripcion,
      ejeTematico: topic.ejeTematico,
      subject: topic.subject.nombre,
      subjectCode: topic.subject.codigo,
      relevance: calculateRelevance(stryMutAct_9fa48("10044") ? `` : (stryCov_9fa48("10044"), `${topic.nombre} ${stryMutAct_9fa48("10047") ? topic.descripcion && '' : stryMutAct_9fa48("10046") ? false : stryMutAct_9fa48("10045") ? true : (stryCov_9fa48("10045", "10046", "10047"), topic.descripcion || (stryMutAct_9fa48("10048") ? "Stryker was here!" : (stryCov_9fa48("10048"), '')))} ${topic.ejeTematico} ${topic.subject.nombre}`), query, queryWords, SEARCH_WEIGHT_PRESETS.TOPIC),
      url: stryMutAct_9fa48("10049") ? `` : (stryCov_9fa48("10049"), `/materials?topicId=${topic.id}`)
    })));
  }
}

/**
 * Busca intentos del estudiante
 */
async function searchAttempts(query: string, queryWords: string[], studentId: string, limit: number, offset: number) {
  if (stryMutAct_9fa48("10050")) {
    {}
  } else {
    stryCov_9fa48("10050");
    // SQLite no soporta mode: 'insensitive', usar contains sin mode
    const attempts = await prisma.attempt.findMany(stryMutAct_9fa48("10051") ? {} : (stryCov_9fa48("10051"), {
      where: stryMutAct_9fa48("10052") ? {} : (stryCov_9fa48("10052"), {
        studentId,
        OR: stryMutAct_9fa48("10053") ? [] : (stryCov_9fa48("10053"), [stryMutAct_9fa48("10054") ? {} : (stryCov_9fa48("10054"), {
          exam: stryMutAct_9fa48("10055") ? {} : (stryCov_9fa48("10055"), {
            titulo: stryMutAct_9fa48("10056") ? {} : (stryCov_9fa48("10056"), {
              contains: query
            })
          })
        }), stryMutAct_9fa48("10057") ? {} : (stryCov_9fa48("10057"), {
          exam: stryMutAct_9fa48("10058") ? {} : (stryCov_9fa48("10058"), {
            descripcion: stryMutAct_9fa48("10059") ? {} : (stryCov_9fa48("10059"), {
              contains: query
            })
          })
        }), stryMutAct_9fa48("10060") ? {} : (stryCov_9fa48("10060"), {
          exam: stryMutAct_9fa48("10061") ? {} : (stryCov_9fa48("10061"), {
            subject: stryMutAct_9fa48("10062") ? {} : (stryCov_9fa48("10062"), {
              nombre: stryMutAct_9fa48("10063") ? {} : (stryCov_9fa48("10063"), {
                contains: query
              })
            })
          })
        })])
      }),
      include: stryMutAct_9fa48("10064") ? {} : (stryCov_9fa48("10064"), {
        exam: stryMutAct_9fa48("10065") ? {} : (stryCov_9fa48("10065"), {
          include: stryMutAct_9fa48("10066") ? {} : (stryCov_9fa48("10066"), {
            subject: stryMutAct_9fa48("10067") ? {} : (stryCov_9fa48("10067"), {
              select: stryMutAct_9fa48("10068") ? {} : (stryCov_9fa48("10068"), {
                id: stryMutAct_9fa48("10069") ? false : (stryCov_9fa48("10069"), true),
                nombre: stryMutAct_9fa48("10070") ? false : (stryCov_9fa48("10070"), true),
                codigo: stryMutAct_9fa48("10071") ? false : (stryCov_9fa48("10071"), true)
              })
            })
          })
        })
      }),
      take: limit,
      skip: offset,
      orderBy: stryMutAct_9fa48("10072") ? {} : (stryCov_9fa48("10072"), {
        startedAt: stryMutAct_9fa48("10073") ? "" : (stryCov_9fa48("10073"), 'desc')
      })
    }));
    return attempts.map(stryMutAct_9fa48("10074") ? () => undefined : (stryCov_9fa48("10074"), attempt => stryMutAct_9fa48("10075") ? {} : (stryCov_9fa48("10075"), {
      type: 'attempt' as const,
      id: attempt.id,
      title: stryMutAct_9fa48("10076") ? `` : (stryCov_9fa48("10076"), `Intento: ${attempt.exam.titulo}`),
      description: stryMutAct_9fa48("10077") ? `` : (stryCov_9fa48("10077"), `Estado: ${attempt.estado} | Puntaje: ${stryMutAct_9fa48("10080") ? attempt.puntaje && 'N/A' : stryMutAct_9fa48("10079") ? false : stryMutAct_9fa48("10078") ? true : (stryCov_9fa48("10078", "10079", "10080"), attempt.puntaje || (stryMutAct_9fa48("10081") ? "" : (stryCov_9fa48("10081"), 'N/A')))}`),
      subject: attempt.exam.subject.nombre,
      subjectCode: attempt.exam.subject.codigo,
      estado: attempt.estado,
      puntaje: attempt.puntaje,
      porcentaje: attempt.porcentaje,
      relevance: calculateRelevance(stryMutAct_9fa48("10082") ? `` : (stryCov_9fa48("10082"), `${attempt.exam.titulo} ${stryMutAct_9fa48("10085") ? attempt.exam.descripcion && '' : stryMutAct_9fa48("10084") ? false : stryMutAct_9fa48("10083") ? true : (stryCov_9fa48("10083", "10084", "10085"), attempt.exam.descripcion || (stryMutAct_9fa48("10086") ? "Stryker was here!" : (stryCov_9fa48("10086"), '')))} ${attempt.exam.subject.nombre}`), query, queryWords, SEARCH_WEIGHT_PRESETS.EXAM),
      url: (stryMutAct_9fa48("10089") ? attempt.estado !== 'completado' : stryMutAct_9fa48("10088") ? false : stryMutAct_9fa48("10087") ? true : (stryCov_9fa48("10087", "10088", "10089"), attempt.estado === (stryMutAct_9fa48("10090") ? "" : (stryCov_9fa48("10090"), 'completado')))) ? stryMutAct_9fa48("10091") ? `` : (stryCov_9fa48("10091"), `/exams/${attempt.examId}/results?attemptId=${attempt.id}`) : stryMutAct_9fa48("10092") ? `` : (stryCov_9fa48("10092"), `/exams/${attempt.examId}/take`)
    })));
  }
}

/**
 * Interfaz para metadata de sugerencias de búsqueda
 */
interface SuggestionMetadata {
  codigo?: string;
  ejeTematico?: string;
  examId?: string;
  materialId?: string;
  topicId?: string;
}

/**
 * Interfaz para sugerencias de búsqueda
 */
interface SearchSuggestion {
  text: string;
  type: string;
  relevance: number;
  metadata?: SuggestionMetadata;
}

/**
 * Obtiene sugerencias de búsqueda basadas en el query
 * Mejorado con ranking por relevancia y contexto del usuario
 */
async function getSuggestions(query: string, studentId: string) {
  if (stryMutAct_9fa48("10093")) {
    {}
  } else {
    stryCov_9fa48("10093");
    if (stryMutAct_9fa48("10097") ? query.length >= 2 : stryMutAct_9fa48("10096") ? query.length <= 2 : stryMutAct_9fa48("10095") ? false : stryMutAct_9fa48("10094") ? true : (stryCov_9fa48("10094", "10095", "10096", "10097"), query.length < 2)) return stryMutAct_9fa48("10098") ? ["Stryker was here"] : (stryCov_9fa48("10098"), []);
    const suggestions: SearchSuggestion[] = stryMutAct_9fa48("10099") ? ["Stryker was here"] : (stryCov_9fa48("10099"), []);
    const queryLower = stryMutAct_9fa48("10100") ? query.toUpperCase() : (stryCov_9fa48("10100"), query.toLowerCase());
    const queryWords = stryMutAct_9fa48("10101") ? queryLower.split(/\s+/) : (stryCov_9fa48("10101"), queryLower.split(stryMutAct_9fa48("10103") ? /\S+/ : stryMutAct_9fa48("10102") ? /\s/ : (stryCov_9fa48("10102", "10103"), /\s+/)).filter(stryMutAct_9fa48("10104") ? () => undefined : (stryCov_9fa48("10104"), w => stryMutAct_9fa48("10108") ? w.length <= 0 : stryMutAct_9fa48("10107") ? w.length >= 0 : stryMutAct_9fa48("10106") ? false : stryMutAct_9fa48("10105") ? true : (stryCov_9fa48("10105", "10106", "10107", "10108"), w.length > 0))));

    // Sugerencias de asignaturas (mayor relevancia si coincide al inicio)
    // SQLite no soporta mode: 'insensitive', usar contains sin mode
    const subjects = await prisma.subject.findMany(stryMutAct_9fa48("10109") ? {} : (stryCov_9fa48("10109"), {
      where: stryMutAct_9fa48("10110") ? {} : (stryCov_9fa48("10110"), {
        OR: stryMutAct_9fa48("10111") ? [] : (stryCov_9fa48("10111"), [stryMutAct_9fa48("10112") ? {} : (stryCov_9fa48("10112"), {
          nombre: stryMutAct_9fa48("10113") ? {} : (stryCov_9fa48("10113"), {
            contains: query
          })
        }), stryMutAct_9fa48("10114") ? {} : (stryCov_9fa48("10114"), {
          codigo: stryMutAct_9fa48("10115") ? {} : (stryCov_9fa48("10115"), {
            contains: query
          })
        })])
      }),
      take: SEARCH_CONSTANTS.SUGGESTION_LIMITS.SUBJECTS_TAKE
    }));
    subjects.forEach(subject => {
      if (stryMutAct_9fa48("10116")) {
        {}
      } else {
        stryCov_9fa48("10116");
        const nombreLower = stryMutAct_9fa48("10117") ? subject.nombre.toUpperCase() : (stryCov_9fa48("10117"), subject.nombre.toLowerCase());
        const codigoLower = stryMutAct_9fa48("10118") ? subject.codigo.toUpperCase() : (stryCov_9fa48("10118"), subject.codigo.toLowerCase());
        let relevance = SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.SUBJECT_DEFAULT;

        // Mayor relevancia si coincide al inicio
        if (stryMutAct_9fa48("10121") ? nombreLower.startsWith(queryLower) && codigoLower.startsWith(queryLower) : stryMutAct_9fa48("10120") ? false : stryMutAct_9fa48("10119") ? true : (stryCov_9fa48("10119", "10120", "10121"), (stryMutAct_9fa48("10122") ? nombreLower.endsWith(queryLower) : (stryCov_9fa48("10122"), nombreLower.startsWith(queryLower))) || (stryMutAct_9fa48("10123") ? codigoLower.endsWith(queryLower) : (stryCov_9fa48("10123"), codigoLower.startsWith(queryLower))))) {
          if (stryMutAct_9fa48("10124")) {
            {}
          } else {
            stryCov_9fa48("10124");
            relevance = SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.SUBJECT_STARTS_WITH;
          }
        } else if (stryMutAct_9fa48("10127") ? nombreLower.includes(queryLower) && codigoLower.includes(queryLower) : stryMutAct_9fa48("10126") ? false : stryMutAct_9fa48("10125") ? true : (stryCov_9fa48("10125", "10126", "10127"), nombreLower.includes(queryLower) || codigoLower.includes(queryLower))) {
          if (stryMutAct_9fa48("10128")) {
            {}
          } else {
            stryCov_9fa48("10128");
            relevance = SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.SUBJECT_INCLUDES;
          }
        }

        // Verificar si no existe ya
        if (stryMutAct_9fa48("10131") ? false : stryMutAct_9fa48("10130") ? true : stryMutAct_9fa48("10129") ? suggestions.some(s => s.text === subject.nombre) : (stryCov_9fa48("10129", "10130", "10131"), !(stryMutAct_9fa48("10132") ? suggestions.every(s => s.text === subject.nombre) : (stryCov_9fa48("10132"), suggestions.some(stryMutAct_9fa48("10133") ? () => undefined : (stryCov_9fa48("10133"), s => stryMutAct_9fa48("10136") ? s.text !== subject.nombre : stryMutAct_9fa48("10135") ? false : stryMutAct_9fa48("10134") ? true : (stryCov_9fa48("10134", "10135", "10136"), s.text === subject.nombre))))))) {
          if (stryMutAct_9fa48("10137")) {
            {}
          } else {
            stryCov_9fa48("10137");
            suggestions.push(stryMutAct_9fa48("10138") ? {} : (stryCov_9fa48("10138"), {
              text: subject.nombre,
              type: stryMutAct_9fa48("10139") ? "" : (stryCov_9fa48("10139"), 'subject'),
              relevance,
              metadata: stryMutAct_9fa48("10140") ? {} : (stryCov_9fa48("10140"), {
                codigo: subject.codigo
              })
            }));
          }
        }
      }
    });

    // Sugerencias de temas (con ranking por relevancia)
    // SQLite no soporta mode: 'insensitive', usar contains sin mode
    const topics = await prisma.topic.findMany(stryMutAct_9fa48("10141") ? {} : (stryCov_9fa48("10141"), {
      where: stryMutAct_9fa48("10142") ? {} : (stryCov_9fa48("10142"), {
        OR: stryMutAct_9fa48("10143") ? [] : (stryCov_9fa48("10143"), [stryMutAct_9fa48("10144") ? {} : (stryCov_9fa48("10144"), {
          nombre: stryMutAct_9fa48("10145") ? {} : (stryCov_9fa48("10145"), {
            contains: query
          })
        }), stryMutAct_9fa48("10146") ? {} : (stryCov_9fa48("10146"), {
          ejeTematico: stryMutAct_9fa48("10147") ? {} : (stryCov_9fa48("10147"), {
            contains: query
          })
        })])
      }),
      take: SEARCH_CONSTANTS.SUGGESTION_LIMITS.TOPICS_TAKE
    }));
    topics.forEach(topic => {
      if (stryMutAct_9fa48("10148")) {
        {}
      } else {
        stryCov_9fa48("10148");
        const nombreLower = stryMutAct_9fa48("10149") ? topic.nombre.toUpperCase() : (stryCov_9fa48("10149"), topic.nombre.toLowerCase());
        const ejeLower = stryMutAct_9fa48("10150") ? topic.ejeTematico.toUpperCase() : (stryCov_9fa48("10150"), topic.ejeTematico.toLowerCase());
        let relevance = SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.TOPIC_DEFAULT;
        if (stryMutAct_9fa48("10153") ? nombreLower.endsWith(queryLower) : stryMutAct_9fa48("10152") ? false : stryMutAct_9fa48("10151") ? true : (stryCov_9fa48("10151", "10152", "10153"), nombreLower.startsWith(queryLower))) {
          if (stryMutAct_9fa48("10154")) {
            {}
          } else {
            stryCov_9fa48("10154");
            relevance = SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.TOPIC_STARTS_WITH;
          }
        } else if (stryMutAct_9fa48("10156") ? false : stryMutAct_9fa48("10155") ? true : (stryCov_9fa48("10155", "10156"), nombreLower.includes(queryLower))) {
          if (stryMutAct_9fa48("10157")) {
            {}
          } else {
            stryCov_9fa48("10157");
            relevance = SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.TOPIC_INCLUDES;
          }
        } else if (stryMutAct_9fa48("10159") ? false : stryMutAct_9fa48("10158") ? true : (stryCov_9fa48("10158", "10159"), ejeLower.includes(queryLower))) {
          if (stryMutAct_9fa48("10160")) {
            {}
          } else {
            stryCov_9fa48("10160");
            relevance = SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.TOPIC_EJE_INCLUDES;
          }
        }
        if (stryMutAct_9fa48("10163") ? false : stryMutAct_9fa48("10162") ? true : stryMutAct_9fa48("10161") ? suggestions.some(s => s.text === topic.nombre) : (stryCov_9fa48("10161", "10162", "10163"), !(stryMutAct_9fa48("10164") ? suggestions.every(s => s.text === topic.nombre) : (stryCov_9fa48("10164"), suggestions.some(stryMutAct_9fa48("10165") ? () => undefined : (stryCov_9fa48("10165"), s => stryMutAct_9fa48("10168") ? s.text !== topic.nombre : stryMutAct_9fa48("10167") ? false : stryMutAct_9fa48("10166") ? true : (stryCov_9fa48("10166", "10167", "10168"), s.text === topic.nombre))))))) {
          if (stryMutAct_9fa48("10169")) {
            {}
          } else {
            stryCov_9fa48("10169");
            suggestions.push(stryMutAct_9fa48("10170") ? {} : (stryCov_9fa48("10170"), {
              text: topic.nombre,
              type: stryMutAct_9fa48("10171") ? "" : (stryCov_9fa48("10171"), 'topic'),
              relevance,
              metadata: stryMutAct_9fa48("10172") ? {} : (stryCov_9fa48("10172"), {
                ejeTematico: topic.ejeTematico
              })
            }));
          }
        }
      }
    });

    // Sugerencias de títulos de exámenes (con contexto del estudiante)
    // SQLite no soporta mode: 'insensitive', usar contains sin mode
    const examTitles = await prisma.exam.findMany(stryMutAct_9fa48("10173") ? {} : (stryCov_9fa48("10173"), {
      where: stryMutAct_9fa48("10174") ? {} : (stryCov_9fa48("10174"), {
        titulo: stryMutAct_9fa48("10175") ? {} : (stryCov_9fa48("10175"), {
          contains: query
        })
      }),
      select: stryMutAct_9fa48("10176") ? {} : (stryCov_9fa48("10176"), {
        titulo: stryMutAct_9fa48("10177") ? false : (stryCov_9fa48("10177"), true),
        id: stryMutAct_9fa48("10178") ? false : (stryCov_9fa48("10178"), true)
      }),
      take: SEARCH_CONSTANTS.SUGGESTION_LIMITS.EXAMS_TAKE
    }));

    // Obtener intentos del estudiante para priorizar exámenes que ha visto
    const studentAttempts = studentId ? await prisma.attempt.findMany(stryMutAct_9fa48("10179") ? {} : (stryCov_9fa48("10179"), {
      where: stryMutAct_9fa48("10180") ? {} : (stryCov_9fa48("10180"), {
        studentId
      }),
      select: stryMutAct_9fa48("10181") ? {} : (stryCov_9fa48("10181"), {
        examId: stryMutAct_9fa48("10182") ? false : (stryCov_9fa48("10182"), true)
      }),
      distinct: stryMutAct_9fa48("10183") ? [] : (stryCov_9fa48("10183"), [stryMutAct_9fa48("10184") ? "" : (stryCov_9fa48("10184"), 'examId')])
    })) : stryMutAct_9fa48("10185") ? ["Stryker was here"] : (stryCov_9fa48("10185"), []);
    const attemptedExamIds = new Set(studentAttempts.map(stryMutAct_9fa48("10186") ? () => undefined : (stryCov_9fa48("10186"), a => a.examId)));
    examTitles.forEach(exam => {
      if (stryMutAct_9fa48("10187")) {
        {}
      } else {
        stryCov_9fa48("10187");
        const tituloLower = stryMutAct_9fa48("10188") ? exam.titulo.toUpperCase() : (stryCov_9fa48("10188"), exam.titulo.toLowerCase());
        let relevance = SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.EXAM_DEFAULT;
        if (stryMutAct_9fa48("10191") ? tituloLower.endsWith(queryLower) : stryMutAct_9fa48("10190") ? false : stryMutAct_9fa48("10189") ? true : (stryCov_9fa48("10189", "10190", "10191"), tituloLower.startsWith(queryLower))) {
          if (stryMutAct_9fa48("10192")) {
            {}
          } else {
            stryCov_9fa48("10192");
            relevance = SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.EXAM_STARTS_WITH;
          }
        } else if (stryMutAct_9fa48("10194") ? false : stryMutAct_9fa48("10193") ? true : (stryCov_9fa48("10193", "10194"), tituloLower.includes(queryLower))) {
          if (stryMutAct_9fa48("10195")) {
            {}
          } else {
            stryCov_9fa48("10195");
            relevance = SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.EXAM_INCLUDES;
          }
        }

        // Priorizar exámenes que el estudiante ya ha intentado
        if (stryMutAct_9fa48("10197") ? false : stryMutAct_9fa48("10196") ? true : (stryCov_9fa48("10196", "10197"), attemptedExamIds.has(exam.id))) {
          if (stryMutAct_9fa48("10198")) {
            {}
          } else {
            stryCov_9fa48("10198");
            stryMutAct_9fa48("10199") ? relevance -= SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.EXAM_ATTEMPTED_BONUS : (stryCov_9fa48("10199"), relevance += SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.EXAM_ATTEMPTED_BONUS);
          }
        }
        if (stryMutAct_9fa48("10202") ? false : stryMutAct_9fa48("10201") ? true : stryMutAct_9fa48("10200") ? suggestions.some(s => s.text === exam.titulo) : (stryCov_9fa48("10200", "10201", "10202"), !(stryMutAct_9fa48("10203") ? suggestions.every(s => s.text === exam.titulo) : (stryCov_9fa48("10203"), suggestions.some(stryMutAct_9fa48("10204") ? () => undefined : (stryCov_9fa48("10204"), s => stryMutAct_9fa48("10207") ? s.text !== exam.titulo : stryMutAct_9fa48("10206") ? false : stryMutAct_9fa48("10205") ? true : (stryCov_9fa48("10205", "10206", "10207"), s.text === exam.titulo))))))) {
          if (stryMutAct_9fa48("10208")) {
            {}
          } else {
            stryCov_9fa48("10208");
            suggestions.push(stryMutAct_9fa48("10209") ? {} : (stryCov_9fa48("10209"), {
              text: exam.titulo,
              type: stryMutAct_9fa48("10210") ? "" : (stryCov_9fa48("10210"), 'exam'),
              relevance
            }));
          }
        }
      }
    });

    // Ordenar por relevancia y retornar top N sugerencias
    return stryMutAct_9fa48("10212") ? suggestions.slice(0, SEARCH_CONSTANTS.SUGGESTION_LIMITS.MAX_SUGGESTIONS).map(s => s.text) : stryMutAct_9fa48("10211") ? suggestions.sort((a, b) => b.relevance - a.relevance).map(s => s.text) : (stryCov_9fa48("10211", "10212"), suggestions.sort(stryMutAct_9fa48("10213") ? () => undefined : (stryCov_9fa48("10213"), (a, b) => stryMutAct_9fa48("10214") ? b.relevance + a.relevance : (stryCov_9fa48("10214"), b.relevance - a.relevance))).slice(0, SEARCH_CONSTANTS.SUGGESTION_LIMITS.MAX_SUGGESTIONS).map(stryMutAct_9fa48("10215") ? () => undefined : (stryCov_9fa48("10215"), s => s.text)));
  }
}
export async function GET(request: NextRequest) {
  if (stryMutAct_9fa48("10216")) {
    {}
  } else {
    stryCov_9fa48("10216");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("10217")) {
        {}
      } else {
        stryCov_9fa48("10217");
        try {
          if (stryMutAct_9fa48("10218")) {
            {}
          } else {
            stryCov_9fa48("10218");
            const studentId = await getCurrentStudentId();
            if (stryMutAct_9fa48("10221") ? false : stryMutAct_9fa48("10220") ? true : stryMutAct_9fa48("10219") ? studentId : (stryCov_9fa48("10219", "10220", "10221"), !studentId)) {
              if (stryMutAct_9fa48("10222")) {
                {}
              } else {
                stryCov_9fa48("10222");
                return NextResponse.json(stryMutAct_9fa48("10223") ? {} : (stryCov_9fa48("10223"), {
                  error: stryMutAct_9fa48("10224") ? "" : (stryCov_9fa48("10224"), 'No autorizado')
                }), stryMutAct_9fa48("10225") ? {} : (stryCov_9fa48("10225"), {
                  status: 401
                }));
              }
            }
            const {
              searchParams
            } = new URL(request.url);
            const queryParams = Object.fromEntries(searchParams.entries());

            // Validar query parameters
            const searchQuerySchema = z.object(stryMutAct_9fa48("10226") ? {} : (stryCov_9fa48("10226"), {
              q: stryMutAct_9fa48("10228") ? z.string().max(1).max(200) : stryMutAct_9fa48("10227") ? z.string().min(1).min(200) : (stryCov_9fa48("10227", "10228"), z.string().min(1).max(200)),
              types: z.string().optional().transform((val): string[] | undefined => {
                if (stryMutAct_9fa48("10229")) {
                  {}
                } else {
                  stryCov_9fa48("10229");
                  if (stryMutAct_9fa48("10232") ? false : stryMutAct_9fa48("10231") ? true : stryMutAct_9fa48("10230") ? val : (stryCov_9fa48("10230", "10231", "10232"), !val)) return undefined;
                  const split = val.split(stryMutAct_9fa48("10233") ? "" : (stryCov_9fa48("10233"), ','));
                  // Validar que todos los valores sean strings válidos
                  return stryMutAct_9fa48("10234") ? split : (stryCov_9fa48("10234"), split.filter(stryMutAct_9fa48("10235") ? () => undefined : (stryCov_9fa48("10235"), t => stryMutAct_9fa48("10238") ? typeof t === 'string' || t.trim().length > 0 : stryMutAct_9fa48("10237") ? false : stryMutAct_9fa48("10236") ? true : (stryCov_9fa48("10236", "10237", "10238"), (stryMutAct_9fa48("10240") ? typeof t !== 'string' : stryMutAct_9fa48("10239") ? true : (stryCov_9fa48("10239", "10240"), typeof t === (stryMutAct_9fa48("10241") ? "" : (stryCov_9fa48("10241"), 'string')))) && (stryMutAct_9fa48("10244") ? t.trim().length <= 0 : stryMutAct_9fa48("10243") ? t.trim().length >= 0 : stryMutAct_9fa48("10242") ? true : (stryCov_9fa48("10242", "10243", "10244"), (stryMutAct_9fa48("10245") ? t.length : (stryCov_9fa48("10245"), t.trim().length)) > 0))))));
                }
              }).pipe(z.array(z.string()).optional()),
              limit: z.string().optional().transform((val): number => {
                if (stryMutAct_9fa48("10246")) {
                  {}
                } else {
                  stryCov_9fa48("10246");
                  if (stryMutAct_9fa48("10249") ? false : stryMutAct_9fa48("10248") ? true : stryMutAct_9fa48("10247") ? val : (stryCov_9fa48("10247", "10248", "10249"), !val)) return 10;
                  const parsed = parseInt(val, 10);
                  // Validar que el parseo fue exitoso
                  if (stryMutAct_9fa48("10251") ? false : stryMutAct_9fa48("10250") ? true : (stryCov_9fa48("10250", "10251"), isNaN(parsed))) return 10;
                  return parsed;
                }
              }).pipe(stryMutAct_9fa48("10253") ? z.number().int().max(1).max(100) : stryMutAct_9fa48("10252") ? z.number().int().min(1).min(100) : (stryCov_9fa48("10252", "10253"), z.number().int().min(1).max(100))),
              offset: z.string().optional().transform((val): number => {
                if (stryMutAct_9fa48("10254")) {
                  {}
                } else {
                  stryCov_9fa48("10254");
                  if (stryMutAct_9fa48("10257") ? false : stryMutAct_9fa48("10256") ? true : stryMutAct_9fa48("10255") ? val : (stryCov_9fa48("10255", "10256", "10257"), !val)) return 0;
                  const parsed = parseInt(val, 10);
                  // Validar que el parseo fue exitoso
                  if (stryMutAct_9fa48("10259") ? false : stryMutAct_9fa48("10258") ? true : (stryCov_9fa48("10258", "10259"), isNaN(parsed))) return 0;
                  return parsed;
                }
              }).pipe(stryMutAct_9fa48("10260") ? z.number().int().max(0) : (stryCov_9fa48("10260"), z.number().int().min(0)))
            }));
            const queryValidation = searchQuerySchema.safeParse(queryParams);
            if (stryMutAct_9fa48("10263") ? false : stryMutAct_9fa48("10262") ? true : stryMutAct_9fa48("10261") ? queryValidation.success : (stryCov_9fa48("10261", "10262", "10263"), !queryValidation.success)) {
              if (stryMutAct_9fa48("10264")) {
                {}
              } else {
                stryCov_9fa48("10264");
                return NextResponse.json(stryMutAct_9fa48("10265") ? {} : (stryCov_9fa48("10265"), {
                  error: stryMutAct_9fa48("10266") ? "" : (stryCov_9fa48("10266"), 'Parámetros de consulta inválidos'),
                  details: queryValidation.error.errors
                }), stryMutAct_9fa48("10267") ? {} : (stryCov_9fa48("10267"), {
                  status: 400
                }));
              }
            }
            const {
              q: query,
              types: typesParam,
              limit,
              offset
            } = queryValidation.data;
            if (stryMutAct_9fa48("10270") ? !query && query.trim().length < 1 : stryMutAct_9fa48("10269") ? false : stryMutAct_9fa48("10268") ? true : (stryCov_9fa48("10268", "10269", "10270"), (stryMutAct_9fa48("10271") ? query : (stryCov_9fa48("10271"), !query)) || (stryMutAct_9fa48("10274") ? query.trim().length >= 1 : stryMutAct_9fa48("10273") ? query.trim().length <= 1 : stryMutAct_9fa48("10272") ? false : (stryCov_9fa48("10272", "10273", "10274"), (stryMutAct_9fa48("10275") ? query.length : (stryCov_9fa48("10275"), query.trim().length)) < 1)))) {
              if (stryMutAct_9fa48("10276")) {
                {}
              } else {
                stryCov_9fa48("10276");
                return NextResponse.json(stryMutAct_9fa48("10277") ? {} : (stryCov_9fa48("10277"), {
                  results: stryMutAct_9fa48("10278") ? ["Stryker was here"] : (stryCov_9fa48("10278"), []),
                  suggestions: stryMutAct_9fa48("10279") ? ["Stryker was here"] : (stryCov_9fa48("10279"), []),
                  total: 0
                }));
              }
            }
            const types: SearchType[] = (stryMutAct_9fa48("10282") ? typesParam || typesParam.length > 0 : stryMutAct_9fa48("10281") ? false : stryMutAct_9fa48("10280") ? true : (stryCov_9fa48("10280", "10281", "10282"), typesParam && (stryMutAct_9fa48("10285") ? typesParam.length <= 0 : stryMutAct_9fa48("10284") ? typesParam.length >= 0 : stryMutAct_9fa48("10283") ? true : (stryCov_9fa48("10283", "10284", "10285"), typesParam.length > 0)))) ? typesParam.filter(t => SEARCH_TYPES.includes(t as SearchType)) as SearchType[] : [...SEARCH_TYPES] as SearchType[];
            const queryWords = stryMutAct_9fa48("10287") ? query.toUpperCase().split(/\s+/).filter(w => w.length > 0) : stryMutAct_9fa48("10286") ? query.toLowerCase().split(/\s+/) : (stryCov_9fa48("10286", "10287"), query.toLowerCase().split(stryMutAct_9fa48("10289") ? /\S+/ : stryMutAct_9fa48("10288") ? /\s/ : (stryCov_9fa48("10288", "10289"), /\s+/)).filter(stryMutAct_9fa48("10290") ? () => undefined : (stryCov_9fa48("10290"), w => stryMutAct_9fa48("10294") ? w.length <= 0 : stryMutAct_9fa48("10293") ? w.length >= 0 : stryMutAct_9fa48("10292") ? false : stryMutAct_9fa48("10291") ? true : (stryCov_9fa48("10291", "10292", "10293", "10294"), w.length > 0))));

            // Buscar en paralelo (usar limit * 2 para tener más resultados para ordenar por relevancia)
            // Limitar a MAX_SEARCH_RESULTS para prevenir problemas de performance
            const searchLimit = stryMutAct_9fa48("10295") ? Math.max(limit * 2, LIMIT_CONSTANTS.MAX_SEARCH_RESULTS) : (stryCov_9fa48("10295"), Math.min(stryMutAct_9fa48("10296") ? limit / 2 : (stryCov_9fa48("10296"), limit * 2), LIMIT_CONSTANTS.MAX_SEARCH_RESULTS));
            const [exams, materials, topics, attempts] = await Promise.all(stryMutAct_9fa48("10297") ? [] : (stryCov_9fa48("10297"), [types.includes(stryMutAct_9fa48("10298") ? "" : (stryCov_9fa48("10298"), 'exams')) ? searchExams(query, queryWords, studentId, searchLimit, 0) : Promise.resolve(stryMutAct_9fa48("10299") ? ["Stryker was here"] : (stryCov_9fa48("10299"), [])), types.includes(stryMutAct_9fa48("10300") ? "" : (stryCov_9fa48("10300"), 'materials')) ? searchMaterials(query, queryWords, studentId, searchLimit, 0) : Promise.resolve(stryMutAct_9fa48("10301") ? ["Stryker was here"] : (stryCov_9fa48("10301"), [])), types.includes(stryMutAct_9fa48("10302") ? "" : (stryCov_9fa48("10302"), 'topics')) ? searchTopics(query, queryWords, searchLimit, 0) : Promise.resolve(stryMutAct_9fa48("10303") ? ["Stryker was here"] : (stryCov_9fa48("10303"), [])), types.includes(stryMutAct_9fa48("10304") ? "" : (stryCov_9fa48("10304"), 'attempts')) ? searchAttempts(query, queryWords, studentId, searchLimit, 0) : Promise.resolve(stryMutAct_9fa48("10305") ? ["Stryker was here"] : (stryCov_9fa48("10305"), []))]));

            // Combinar y ordenar por relevancia
            const allResultsUnsliced = stryMutAct_9fa48("10306") ? [...exams, ...materials, ...topics, ...attempts] : (stryCov_9fa48("10306"), (stryMutAct_9fa48("10307") ? [] : (stryCov_9fa48("10307"), [...exams, ...materials, ...topics, ...attempts])).sort(stryMutAct_9fa48("10308") ? () => undefined : (stryCov_9fa48("10308"), (a, b) => stryMutAct_9fa48("10309") ? b.relevance + a.relevance : (stryCov_9fa48("10309"), b.relevance - a.relevance))));

            // Calcular total antes del slice para paginación correcta
            const totalResults = allResultsUnsliced.length;
            const allResults = stryMutAct_9fa48("10310") ? allResultsUnsliced : (stryCov_9fa48("10310"), allResultsUnsliced.slice(offset, stryMutAct_9fa48("10311") ? offset - limit : (stryCov_9fa48("10311"), offset + limit)));

            // Obtener sugerencias
            const suggestions = await getSuggestions(query, studentId);
            return NextResponse.json(stryMutAct_9fa48("10312") ? {} : (stryCov_9fa48("10312"), {
              results: allResults,
              suggestions,
              total: totalResults,
              query
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("10313")) {
            {}
          } else {
            stryCov_9fa48("10313");
            logger.error(stryMutAct_9fa48("10314") ? {} : (stryCov_9fa48("10314"), {
              type: stryMutAct_9fa48("10315") ? "" : (stryCov_9fa48("10315"), 'search_error'),
              error: error instanceof Error ? error.message : String(error)
            }), stryMutAct_9fa48("10316") ? "" : (stryCov_9fa48("10316"), 'Error en búsqueda'));
            return NextResponse.json(stryMutAct_9fa48("10317") ? {} : (stryCov_9fa48("10317"), {
              error: stryMutAct_9fa48("10318") ? "" : (stryCov_9fa48("10318"), 'Error al realizar la búsqueda')
            }), stryMutAct_9fa48("10319") ? {} : (stryCov_9fa48("10319"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}