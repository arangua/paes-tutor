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
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUserWithStudent } from '@/lib/get-session';
import { withRateLimit } from '@/lib/rate-limit-middleware';
import { logger } from '@/lib/logger';
export const runtime = stryMutAct_9fa48("6296") ? "" : (stryCov_9fa48("6296"), 'nodejs');

// Tipos para procesamiento de respuestas
type AnswerWithTime = {
  tiempoSegundos: number | null;
  esCorrecta: boolean | null;
  question: {
    subject: {
      id: string;
      nombre: string;
      codigo: string;
    };
    topic: {
      id: string;
      nombre: string;
      ejeTematico: string;
    } | null;
    dificultad: number;
  };
};
type TimeStats = {
  totalTime: number;
  count: number;
  correctTime: number;
  correctCount: number;
  incorrectTime: number;
  incorrectCount: number;
};

// Helper para procesar respuestas y actualizar estadísticas
function processAnswerTime(answer: AnswerWithTime, timeBySubject: Map<string, TimeStats & {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
}>, timeByTopic: Map<string, TimeStats & {
  topicId: string;
  topicName: string;
  ejeTematico: string;
  subjectName: string;
  subjectCode: string;
}>, timeByDifficulty: Map<number, TimeStats & {
  difficulty: number;
}>) {
  if (stryMutAct_9fa48("6297")) {
    {}
  } else {
    stryCov_9fa48("6297");
    if (stryMutAct_9fa48("6300") ? false : stryMutAct_9fa48("6299") ? true : stryMutAct_9fa48("6298") ? answer.tiempoSegundos : (stryCov_9fa48("6298", "6299", "6300"), !answer.tiempoSegundos)) return;
    const subject = answer.question.subject;
    const topic = answer.question.topic;
    const difficulty = answer.question.dificultad;

    // Procesar por asignatura
    const subjectKey = subject.id;
    if (stryMutAct_9fa48("6303") ? false : stryMutAct_9fa48("6302") ? true : stryMutAct_9fa48("6301") ? timeBySubject.has(subjectKey) : (stryCov_9fa48("6301", "6302", "6303"), !timeBySubject.has(subjectKey))) {
      if (stryMutAct_9fa48("6304")) {
        {}
      } else {
        stryCov_9fa48("6304");
        timeBySubject.set(subjectKey, stryMutAct_9fa48("6305") ? {} : (stryCov_9fa48("6305"), {
          subjectId: subject.id,
          subjectName: subject.nombre,
          subjectCode: subject.codigo,
          totalTime: 0,
          count: 0,
          correctTime: 0,
          correctCount: 0,
          incorrectTime: 0,
          incorrectCount: 0
        }));
      }
    }
    const subjectData = timeBySubject.get(subjectKey)!;
    stryMutAct_9fa48("6306") ? subjectData.totalTime -= answer.tiempoSegundos : (stryCov_9fa48("6306"), subjectData.totalTime += answer.tiempoSegundos);
    stryMutAct_9fa48("6307") ? subjectData.count-- : (stryCov_9fa48("6307"), subjectData.count++);
    if (stryMutAct_9fa48("6310") ? answer.esCorrecta !== true : stryMutAct_9fa48("6309") ? false : stryMutAct_9fa48("6308") ? true : (stryCov_9fa48("6308", "6309", "6310"), answer.esCorrecta === (stryMutAct_9fa48("6311") ? false : (stryCov_9fa48("6311"), true)))) {
      if (stryMutAct_9fa48("6312")) {
        {}
      } else {
        stryCov_9fa48("6312");
        stryMutAct_9fa48("6313") ? subjectData.correctTime -= answer.tiempoSegundos : (stryCov_9fa48("6313"), subjectData.correctTime += answer.tiempoSegundos);
        stryMutAct_9fa48("6314") ? subjectData.correctCount-- : (stryCov_9fa48("6314"), subjectData.correctCount++);
      }
    } else if (stryMutAct_9fa48("6317") ? answer.esCorrecta !== false : stryMutAct_9fa48("6316") ? false : stryMutAct_9fa48("6315") ? true : (stryCov_9fa48("6315", "6316", "6317"), answer.esCorrecta === (stryMutAct_9fa48("6318") ? true : (stryCov_9fa48("6318"), false)))) {
      if (stryMutAct_9fa48("6319")) {
        {}
      } else {
        stryCov_9fa48("6319");
        stryMutAct_9fa48("6320") ? subjectData.incorrectTime -= answer.tiempoSegundos : (stryCov_9fa48("6320"), subjectData.incorrectTime += answer.tiempoSegundos);
        stryMutAct_9fa48("6321") ? subjectData.incorrectCount-- : (stryCov_9fa48("6321"), subjectData.incorrectCount++);
      }
    }

    // Procesar por tema
    if (stryMutAct_9fa48("6323") ? false : stryMutAct_9fa48("6322") ? true : (stryCov_9fa48("6322", "6323"), topic)) {
      if (stryMutAct_9fa48("6324")) {
        {}
      } else {
        stryCov_9fa48("6324");
        const topicKey = topic.id;
        if (stryMutAct_9fa48("6327") ? false : stryMutAct_9fa48("6326") ? true : stryMutAct_9fa48("6325") ? timeByTopic.has(topicKey) : (stryCov_9fa48("6325", "6326", "6327"), !timeByTopic.has(topicKey))) {
          if (stryMutAct_9fa48("6328")) {
            {}
          } else {
            stryCov_9fa48("6328");
            timeByTopic.set(topicKey, stryMutAct_9fa48("6329") ? {} : (stryCov_9fa48("6329"), {
              topicId: topic.id,
              topicName: topic.nombre,
              ejeTematico: topic.ejeTematico,
              subjectName: subject.nombre,
              subjectCode: subject.codigo,
              totalTime: 0,
              count: 0,
              correctTime: 0,
              correctCount: 0,
              incorrectTime: 0,
              incorrectCount: 0
            }));
          }
        }
        const topicData = timeByTopic.get(topicKey)!;
        stryMutAct_9fa48("6330") ? topicData.totalTime -= answer.tiempoSegundos : (stryCov_9fa48("6330"), topicData.totalTime += answer.tiempoSegundos);
        stryMutAct_9fa48("6331") ? topicData.count-- : (stryCov_9fa48("6331"), topicData.count++);
        if (stryMutAct_9fa48("6334") ? answer.esCorrecta !== true : stryMutAct_9fa48("6333") ? false : stryMutAct_9fa48("6332") ? true : (stryCov_9fa48("6332", "6333", "6334"), answer.esCorrecta === (stryMutAct_9fa48("6335") ? false : (stryCov_9fa48("6335"), true)))) {
          if (stryMutAct_9fa48("6336")) {
            {}
          } else {
            stryCov_9fa48("6336");
            stryMutAct_9fa48("6337") ? topicData.correctTime -= answer.tiempoSegundos : (stryCov_9fa48("6337"), topicData.correctTime += answer.tiempoSegundos);
            stryMutAct_9fa48("6338") ? topicData.correctCount-- : (stryCov_9fa48("6338"), topicData.correctCount++);
          }
        } else if (stryMutAct_9fa48("6341") ? answer.esCorrecta !== false : stryMutAct_9fa48("6340") ? false : stryMutAct_9fa48("6339") ? true : (stryCov_9fa48("6339", "6340", "6341"), answer.esCorrecta === (stryMutAct_9fa48("6342") ? true : (stryCov_9fa48("6342"), false)))) {
          if (stryMutAct_9fa48("6343")) {
            {}
          } else {
            stryCov_9fa48("6343");
            stryMutAct_9fa48("6344") ? topicData.incorrectTime -= answer.tiempoSegundos : (stryCov_9fa48("6344"), topicData.incorrectTime += answer.tiempoSegundos);
            stryMutAct_9fa48("6345") ? topicData.incorrectCount-- : (stryCov_9fa48("6345"), topicData.incorrectCount++);
          }
        }
      }
    }

    // Procesar por dificultad
    const difficultyKey = difficulty;
    if (stryMutAct_9fa48("6348") ? false : stryMutAct_9fa48("6347") ? true : stryMutAct_9fa48("6346") ? timeByDifficulty.has(difficultyKey) : (stryCov_9fa48("6346", "6347", "6348"), !timeByDifficulty.has(difficultyKey))) {
      if (stryMutAct_9fa48("6349")) {
        {}
      } else {
        stryCov_9fa48("6349");
        timeByDifficulty.set(difficultyKey, stryMutAct_9fa48("6350") ? {} : (stryCov_9fa48("6350"), {
          difficulty,
          totalTime: 0,
          count: 0,
          correctTime: 0,
          correctCount: 0,
          incorrectTime: 0,
          incorrectCount: 0
        }));
      }
    }
    const difficultyData = timeByDifficulty.get(difficultyKey)!;
    stryMutAct_9fa48("6351") ? difficultyData.totalTime -= answer.tiempoSegundos : (stryCov_9fa48("6351"), difficultyData.totalTime += answer.tiempoSegundos);
    stryMutAct_9fa48("6352") ? difficultyData.count-- : (stryCov_9fa48("6352"), difficultyData.count++);
    if (stryMutAct_9fa48("6355") ? answer.esCorrecta !== true : stryMutAct_9fa48("6354") ? false : stryMutAct_9fa48("6353") ? true : (stryCov_9fa48("6353", "6354", "6355"), answer.esCorrecta === (stryMutAct_9fa48("6356") ? false : (stryCov_9fa48("6356"), true)))) {
      if (stryMutAct_9fa48("6357")) {
        {}
      } else {
        stryCov_9fa48("6357");
        stryMutAct_9fa48("6358") ? difficultyData.correctTime -= answer.tiempoSegundos : (stryCov_9fa48("6358"), difficultyData.correctTime += answer.tiempoSegundos);
        stryMutAct_9fa48("6359") ? difficultyData.correctCount-- : (stryCov_9fa48("6359"), difficultyData.correctCount++);
      }
    } else if (stryMutAct_9fa48("6362") ? answer.esCorrecta !== false : stryMutAct_9fa48("6361") ? false : stryMutAct_9fa48("6360") ? true : (stryCov_9fa48("6360", "6361", "6362"), answer.esCorrecta === (stryMutAct_9fa48("6363") ? true : (stryCov_9fa48("6363"), false)))) {
      if (stryMutAct_9fa48("6364")) {
        {}
      } else {
        stryCov_9fa48("6364");
        stryMutAct_9fa48("6365") ? difficultyData.incorrectTime -= answer.tiempoSegundos : (stryCov_9fa48("6365"), difficultyData.incorrectTime += answer.tiempoSegundos);
        stryMutAct_9fa48("6366") ? difficultyData.incorrectCount-- : (stryCov_9fa48("6366"), difficultyData.incorrectCount++);
      }
    }
  }
}
export async function GET(request: NextRequest) {
  if (stryMutAct_9fa48("6367")) {
    {}
  } else {
    stryCov_9fa48("6367");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("6368")) {
        {}
      } else {
        stryCov_9fa48("6368");
        try {
          if (stryMutAct_9fa48("6369")) {
            {}
          } else {
            stryCov_9fa48("6369");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("6372") ? false : stryMutAct_9fa48("6371") ? true : stryMutAct_9fa48("6370") ? dbUser?.email : (stryCov_9fa48("6370", "6371", "6372"), !(stryMutAct_9fa48("6373") ? dbUser.email : (stryCov_9fa48("6373"), dbUser?.email)))) {
              if (stryMutAct_9fa48("6374")) {
                {}
              } else {
                stryCov_9fa48("6374");
                return NextResponse.json(stryMutAct_9fa48("6375") ? {} : (stryCov_9fa48("6375"), {
                  error: stryMutAct_9fa48("6376") ? "" : (stryCov_9fa48("6376"), 'No autorizado')
                }), stryMutAct_9fa48("6377") ? {} : (stryCov_9fa48("6377"), {
                  status: 401
                }));
              }
            }
            if (stryMutAct_9fa48("6380") ? false : stryMutAct_9fa48("6379") ? true : stryMutAct_9fa48("6378") ? dbUser.student : (stryCov_9fa48("6378", "6379", "6380"), !dbUser.student)) {
              if (stryMutAct_9fa48("6381")) {
                {}
              } else {
                stryCov_9fa48("6381");
                return NextResponse.json(stryMutAct_9fa48("6382") ? {} : (stryCov_9fa48("6382"), {
                  error: stryMutAct_9fa48("6383") ? "" : (stryCov_9fa48("6383"), 'Estudiante no encontrado')
                }), stryMutAct_9fa48("6384") ? {} : (stryCov_9fa48("6384"), {
                  status: 404
                }));
              }
            }

            // Obtener respuestas de exámenes con tiempo
            const examAnswers = await prisma.attemptAnswer.findMany(stryMutAct_9fa48("6385") ? {} : (stryCov_9fa48("6385"), {
              where: stryMutAct_9fa48("6386") ? {} : (stryCov_9fa48("6386"), {
                attempt: stryMutAct_9fa48("6387") ? {} : (stryCov_9fa48("6387"), {
                  studentId: dbUser.student.id,
                  estado: stryMutAct_9fa48("6388") ? "" : (stryCov_9fa48("6388"), 'completado')
                }),
                tiempoSegundos: stryMutAct_9fa48("6389") ? {} : (stryCov_9fa48("6389"), {
                  not: null
                })
              }),
              include: stryMutAct_9fa48("6390") ? {} : (stryCov_9fa48("6390"), {
                question: stryMutAct_9fa48("6391") ? {} : (stryCov_9fa48("6391"), {
                  include: stryMutAct_9fa48("6392") ? {} : (stryCov_9fa48("6392"), {
                    subject: stryMutAct_9fa48("6393") ? {} : (stryCov_9fa48("6393"), {
                      select: stryMutAct_9fa48("6394") ? {} : (stryCov_9fa48("6394"), {
                        id: stryMutAct_9fa48("6395") ? false : (stryCov_9fa48("6395"), true),
                        nombre: stryMutAct_9fa48("6396") ? false : (stryCov_9fa48("6396"), true),
                        codigo: stryMutAct_9fa48("6397") ? false : (stryCov_9fa48("6397"), true)
                      })
                    }),
                    topic: stryMutAct_9fa48("6398") ? {} : (stryCov_9fa48("6398"), {
                      select: stryMutAct_9fa48("6399") ? {} : (stryCov_9fa48("6399"), {
                        id: stryMutAct_9fa48("6400") ? false : (stryCov_9fa48("6400"), true),
                        nombre: stryMutAct_9fa48("6401") ? false : (stryCov_9fa48("6401"), true),
                        ejeTematico: stryMutAct_9fa48("6402") ? false : (stryCov_9fa48("6402"), true)
                      })
                    })
                  })
                })
              })
            }));

            // Obtener respuestas de práctica con tiempo
            const practiceAnswers = await prisma.practiceAnswer.findMany(stryMutAct_9fa48("6403") ? {} : (stryCov_9fa48("6403"), {
              where: stryMutAct_9fa48("6404") ? {} : (stryCov_9fa48("6404"), {
                practiceSession: stryMutAct_9fa48("6405") ? {} : (stryCov_9fa48("6405"), {
                  studentId: dbUser.student.id
                }),
                tiempoSegundos: stryMutAct_9fa48("6406") ? {} : (stryCov_9fa48("6406"), {
                  not: null
                })
              }),
              include: stryMutAct_9fa48("6407") ? {} : (stryCov_9fa48("6407"), {
                question: stryMutAct_9fa48("6408") ? {} : (stryCov_9fa48("6408"), {
                  include: stryMutAct_9fa48("6409") ? {} : (stryCov_9fa48("6409"), {
                    subject: stryMutAct_9fa48("6410") ? {} : (stryCov_9fa48("6410"), {
                      select: stryMutAct_9fa48("6411") ? {} : (stryCov_9fa48("6411"), {
                        id: stryMutAct_9fa48("6412") ? false : (stryCov_9fa48("6412"), true),
                        nombre: stryMutAct_9fa48("6413") ? false : (stryCov_9fa48("6413"), true),
                        codigo: stryMutAct_9fa48("6414") ? false : (stryCov_9fa48("6414"), true)
                      })
                    }),
                    topic: stryMutAct_9fa48("6415") ? {} : (stryCov_9fa48("6415"), {
                      select: stryMutAct_9fa48("6416") ? {} : (stryCov_9fa48("6416"), {
                        id: stryMutAct_9fa48("6417") ? false : (stryCov_9fa48("6417"), true),
                        nombre: stryMutAct_9fa48("6418") ? false : (stryCov_9fa48("6418"), true),
                        ejeTematico: stryMutAct_9fa48("6419") ? false : (stryCov_9fa48("6419"), true)
                      })
                    })
                  })
                })
              })
            }));

            // Calcular estadísticas por asignatura
            const timeBySubject = new Map<string, {
              subjectId: string;
              subjectName: string;
              subjectCode: string;
              totalTime: number;
              count: number;
              correctTime: number;
              correctCount: number;
              incorrectTime: number;
              incorrectCount: number;
            }>();

            // Calcular estadísticas por tema
            const timeByTopic = new Map<string, {
              topicId: string;
              topicName: string;
              ejeTematico: string;
              subjectName: string;
              subjectCode: string;
              totalTime: number;
              count: number;
              correctTime: number;
              correctCount: number;
              incorrectTime: number;
              incorrectCount: number;
            }>();

            // Calcular estadísticas por dificultad
            const timeByDifficulty = new Map<number, {
              difficulty: number;
              totalTime: number;
              count: number;
              correctTime: number;
              correctCount: number;
              incorrectTime: number;
              incorrectCount: number;
            }>();

            // Procesar todas las respuestas usando la función helper
            const allAnswers = stryMutAct_9fa48("6420") ? [] : (stryCov_9fa48("6420"), [...examAnswers, ...practiceAnswers]);
            allAnswers.forEach(answer => {
              if (stryMutAct_9fa48("6421")) {
                {}
              } else {
                stryCov_9fa48("6421");
                processAnswerTime(answer as AnswerWithTime, timeBySubject, timeByTopic, timeByDifficulty);
              }
            });

            // Calcular estadísticas por tipo (examen vs práctica)
            let examTotalTime = 0;
            let examCount = 0;
            let practiceTotalTime = 0;
            let practiceCount = 0;
            examAnswers.forEach(answer => {
              if (stryMutAct_9fa48("6422")) {
                {}
              } else {
                stryCov_9fa48("6422");
                if (stryMutAct_9fa48("6424") ? false : stryMutAct_9fa48("6423") ? true : (stryCov_9fa48("6423", "6424"), answer.tiempoSegundos)) {
                  if (stryMutAct_9fa48("6425")) {
                    {}
                  } else {
                    stryCov_9fa48("6425");
                    stryMutAct_9fa48("6426") ? examTotalTime -= answer.tiempoSegundos : (stryCov_9fa48("6426"), examTotalTime += answer.tiempoSegundos);
                    stryMutAct_9fa48("6427") ? examCount-- : (stryCov_9fa48("6427"), examCount++);
                  }
                }
              }
            });
            practiceAnswers.forEach(answer => {
              if (stryMutAct_9fa48("6428")) {
                {}
              } else {
                stryCov_9fa48("6428");
                if (stryMutAct_9fa48("6430") ? false : stryMutAct_9fa48("6429") ? true : (stryCov_9fa48("6429", "6430"), answer.tiempoSegundos)) {
                  if (stryMutAct_9fa48("6431")) {
                    {}
                  } else {
                    stryCov_9fa48("6431");
                    stryMutAct_9fa48("6432") ? practiceTotalTime -= answer.tiempoSegundos : (stryCov_9fa48("6432"), practiceTotalTime += answer.tiempoSegundos);
                    stryMutAct_9fa48("6433") ? practiceCount-- : (stryCov_9fa48("6433"), practiceCount++);
                  }
                }
              }
            });

            // Convertir a arrays y calcular promedios
            const subjectStats = stryMutAct_9fa48("6434") ? Array.from(timeBySubject.values()).map(data => ({
              ...data,
              averageTime: data.count > 0 ? data.totalTime / data.count : 0,
              averageCorrectTime: data.correctCount > 0 ? data.correctTime / data.correctCount : 0,
              averageIncorrectTime: data.incorrectCount > 0 ? data.incorrectTime / data.incorrectCount : 0
            })) : (stryCov_9fa48("6434"), Array.from(timeBySubject.values()).map(stryMutAct_9fa48("6435") ? () => undefined : (stryCov_9fa48("6435"), data => stryMutAct_9fa48("6436") ? {} : (stryCov_9fa48("6436"), {
              ...data,
              averageTime: (stryMutAct_9fa48("6440") ? data.count <= 0 : stryMutAct_9fa48("6439") ? data.count >= 0 : stryMutAct_9fa48("6438") ? false : stryMutAct_9fa48("6437") ? true : (stryCov_9fa48("6437", "6438", "6439", "6440"), data.count > 0)) ? stryMutAct_9fa48("6441") ? data.totalTime * data.count : (stryCov_9fa48("6441"), data.totalTime / data.count) : 0,
              averageCorrectTime: (stryMutAct_9fa48("6445") ? data.correctCount <= 0 : stryMutAct_9fa48("6444") ? data.correctCount >= 0 : stryMutAct_9fa48("6443") ? false : stryMutAct_9fa48("6442") ? true : (stryCov_9fa48("6442", "6443", "6444", "6445"), data.correctCount > 0)) ? stryMutAct_9fa48("6446") ? data.correctTime * data.correctCount : (stryCov_9fa48("6446"), data.correctTime / data.correctCount) : 0,
              averageIncorrectTime: (stryMutAct_9fa48("6450") ? data.incorrectCount <= 0 : stryMutAct_9fa48("6449") ? data.incorrectCount >= 0 : stryMutAct_9fa48("6448") ? false : stryMutAct_9fa48("6447") ? true : (stryCov_9fa48("6447", "6448", "6449", "6450"), data.incorrectCount > 0)) ? stryMutAct_9fa48("6451") ? data.incorrectTime * data.incorrectCount : (stryCov_9fa48("6451"), data.incorrectTime / data.incorrectCount) : 0
            }))).sort(stryMutAct_9fa48("6452") ? () => undefined : (stryCov_9fa48("6452"), (a, b) => stryMutAct_9fa48("6453") ? b.averageTime + a.averageTime : (stryCov_9fa48("6453"), b.averageTime - a.averageTime))));
            const topicStats = stryMutAct_9fa48("6454") ? Array.from(timeByTopic.values()).map(data => ({
              ...data,
              averageTime: data.count > 0 ? data.totalTime / data.count : 0,
              averageCorrectTime: data.correctCount > 0 ? data.correctTime / data.correctCount : 0,
              averageIncorrectTime: data.incorrectCount > 0 ? data.incorrectTime / data.incorrectCount : 0
            })) : (stryCov_9fa48("6454"), Array.from(timeByTopic.values()).map(stryMutAct_9fa48("6455") ? () => undefined : (stryCov_9fa48("6455"), data => stryMutAct_9fa48("6456") ? {} : (stryCov_9fa48("6456"), {
              ...data,
              averageTime: (stryMutAct_9fa48("6460") ? data.count <= 0 : stryMutAct_9fa48("6459") ? data.count >= 0 : stryMutAct_9fa48("6458") ? false : stryMutAct_9fa48("6457") ? true : (stryCov_9fa48("6457", "6458", "6459", "6460"), data.count > 0)) ? stryMutAct_9fa48("6461") ? data.totalTime * data.count : (stryCov_9fa48("6461"), data.totalTime / data.count) : 0,
              averageCorrectTime: (stryMutAct_9fa48("6465") ? data.correctCount <= 0 : stryMutAct_9fa48("6464") ? data.correctCount >= 0 : stryMutAct_9fa48("6463") ? false : stryMutAct_9fa48("6462") ? true : (stryCov_9fa48("6462", "6463", "6464", "6465"), data.correctCount > 0)) ? stryMutAct_9fa48("6466") ? data.correctTime * data.correctCount : (stryCov_9fa48("6466"), data.correctTime / data.correctCount) : 0,
              averageIncorrectTime: (stryMutAct_9fa48("6470") ? data.incorrectCount <= 0 : stryMutAct_9fa48("6469") ? data.incorrectCount >= 0 : stryMutAct_9fa48("6468") ? false : stryMutAct_9fa48("6467") ? true : (stryCov_9fa48("6467", "6468", "6469", "6470"), data.incorrectCount > 0)) ? stryMutAct_9fa48("6471") ? data.incorrectTime * data.incorrectCount : (stryCov_9fa48("6471"), data.incorrectTime / data.incorrectCount) : 0
            }))).sort(stryMutAct_9fa48("6472") ? () => undefined : (stryCov_9fa48("6472"), (a, b) => stryMutAct_9fa48("6473") ? b.averageTime + a.averageTime : (stryCov_9fa48("6473"), b.averageTime - a.averageTime))));
            const difficultyStats = stryMutAct_9fa48("6474") ? Array.from(timeByDifficulty.values()).map(data => ({
              ...data,
              averageTime: data.count > 0 ? data.totalTime / data.count : 0,
              averageCorrectTime: data.correctCount > 0 ? data.correctTime / data.correctCount : 0,
              averageIncorrectTime: data.incorrectCount > 0 ? data.incorrectTime / data.incorrectCount : 0
            })) : (stryCov_9fa48("6474"), Array.from(timeByDifficulty.values()).sort(stryMutAct_9fa48("6475") ? () => undefined : (stryCov_9fa48("6475"), (a, b) => stryMutAct_9fa48("6476") ? a.difficulty + b.difficulty : (stryCov_9fa48("6476"), a.difficulty - b.difficulty))).map(stryMutAct_9fa48("6477") ? () => undefined : (stryCov_9fa48("6477"), data => stryMutAct_9fa48("6478") ? {} : (stryCov_9fa48("6478"), {
              ...data,
              averageTime: (stryMutAct_9fa48("6482") ? data.count <= 0 : stryMutAct_9fa48("6481") ? data.count >= 0 : stryMutAct_9fa48("6480") ? false : stryMutAct_9fa48("6479") ? true : (stryCov_9fa48("6479", "6480", "6481", "6482"), data.count > 0)) ? stryMutAct_9fa48("6483") ? data.totalTime * data.count : (stryCov_9fa48("6483"), data.totalTime / data.count) : 0,
              averageCorrectTime: (stryMutAct_9fa48("6487") ? data.correctCount <= 0 : stryMutAct_9fa48("6486") ? data.correctCount >= 0 : stryMutAct_9fa48("6485") ? false : stryMutAct_9fa48("6484") ? true : (stryCov_9fa48("6484", "6485", "6486", "6487"), data.correctCount > 0)) ? stryMutAct_9fa48("6488") ? data.correctTime * data.correctCount : (stryCov_9fa48("6488"), data.correctTime / data.correctCount) : 0,
              averageIncorrectTime: (stryMutAct_9fa48("6492") ? data.incorrectCount <= 0 : stryMutAct_9fa48("6491") ? data.incorrectCount >= 0 : stryMutAct_9fa48("6490") ? false : stryMutAct_9fa48("6489") ? true : (stryCov_9fa48("6489", "6490", "6491", "6492"), data.incorrectCount > 0)) ? stryMutAct_9fa48("6493") ? data.incorrectTime * data.incorrectCount : (stryCov_9fa48("6493"), data.incorrectTime / data.incorrectCount) : 0
            }))));
            const typeStats = stryMutAct_9fa48("6494") ? {} : (stryCov_9fa48("6494"), {
              exam: stryMutAct_9fa48("6495") ? {} : (stryCov_9fa48("6495"), {
                totalTime: examTotalTime,
                count: examCount,
                averageTime: (stryMutAct_9fa48("6499") ? examCount <= 0 : stryMutAct_9fa48("6498") ? examCount >= 0 : stryMutAct_9fa48("6497") ? false : stryMutAct_9fa48("6496") ? true : (stryCov_9fa48("6496", "6497", "6498", "6499"), examCount > 0)) ? stryMutAct_9fa48("6500") ? examTotalTime * examCount : (stryCov_9fa48("6500"), examTotalTime / examCount) : 0
              }),
              practice: stryMutAct_9fa48("6501") ? {} : (stryCov_9fa48("6501"), {
                totalTime: practiceTotalTime,
                count: practiceCount,
                averageTime: (stryMutAct_9fa48("6505") ? practiceCount <= 0 : stryMutAct_9fa48("6504") ? practiceCount >= 0 : stryMutAct_9fa48("6503") ? false : stryMutAct_9fa48("6502") ? true : (stryCov_9fa48("6502", "6503", "6504", "6505"), practiceCount > 0)) ? stryMutAct_9fa48("6506") ? practiceTotalTime * practiceCount : (stryCov_9fa48("6506"), practiceTotalTime / practiceCount) : 0
              })
            });

            // Calcular estadísticas generales
            const allAnswersWithTime = stryMutAct_9fa48("6507") ? [] : (stryCov_9fa48("6507"), [...(stryMutAct_9fa48("6508") ? examAnswers : (stryCov_9fa48("6508"), examAnswers.filter(stryMutAct_9fa48("6509") ? () => undefined : (stryCov_9fa48("6509"), a => stryMutAct_9fa48("6512") ? a.tiempoSegundos === null : stryMutAct_9fa48("6511") ? false : stryMutAct_9fa48("6510") ? true : (stryCov_9fa48("6510", "6511", "6512"), a.tiempoSegundos !== null))))), ...(stryMutAct_9fa48("6513") ? practiceAnswers : (stryCov_9fa48("6513"), practiceAnswers.filter(stryMutAct_9fa48("6514") ? () => undefined : (stryCov_9fa48("6514"), a => stryMutAct_9fa48("6517") ? a.tiempoSegundos === null : stryMutAct_9fa48("6516") ? false : stryMutAct_9fa48("6515") ? true : (stryCov_9fa48("6515", "6516", "6517"), a.tiempoSegundos !== null)))))]);
            const totalTime = allAnswersWithTime.reduce((sum, a) => {
              if (stryMutAct_9fa48("6518")) {
                {}
              } else {
                stryCov_9fa48("6518");
                const time = a.tiempoSegundos;
                return stryMutAct_9fa48("6519") ? sum - (time !== null ? time : 0) : (stryCov_9fa48("6519"), sum + ((stryMutAct_9fa48("6522") ? time === null : stryMutAct_9fa48("6521") ? false : stryMutAct_9fa48("6520") ? true : (stryCov_9fa48("6520", "6521", "6522"), time !== null)) ? time : 0));
              }
            }, 0);
            const totalCount = allAnswersWithTime.length;
            const overallAverage = (stryMutAct_9fa48("6526") ? totalCount <= 0 : stryMutAct_9fa48("6525") ? totalCount >= 0 : stryMutAct_9fa48("6524") ? false : stryMutAct_9fa48("6523") ? true : (stryCov_9fa48("6523", "6524", "6525", "6526"), totalCount > 0)) ? stryMutAct_9fa48("6527") ? totalTime * totalCount : (stryCov_9fa48("6527"), totalTime / totalCount) : 0;
            return NextResponse.json(stryMutAct_9fa48("6528") ? {} : (stryCov_9fa48("6528"), {
              overall: stryMutAct_9fa48("6529") ? {} : (stryCov_9fa48("6529"), {
                totalTime,
                totalCount,
                averageTime: overallAverage
              }),
              bySubject: subjectStats,
              byTopic: topicStats,
              byDifficulty: difficultyStats,
              byType: typeStats
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("6530")) {
            {}
          } else {
            stryCov_9fa48("6530");
            logger.error(stryMutAct_9fa48("6531") ? {} : (stryCov_9fa48("6531"), {
              error,
              context: stryMutAct_9fa48("6532") ? "" : (stryCov_9fa48("6532"), 'analytics/time')
            }), stryMutAct_9fa48("6533") ? "" : (stryCov_9fa48("6533"), 'Error al calcular estadísticas de tiempo'));
            return NextResponse.json(stryMutAct_9fa48("6534") ? {} : (stryCov_9fa48("6534"), {
              error: stryMutAct_9fa48("6535") ? "" : (stryCov_9fa48("6535"), 'Error al calcular estadísticas de tiempo')
            }), stryMutAct_9fa48("6536") ? {} : (stryCov_9fa48("6536"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}