/**
 * Utilidades para exportar datos a diferentes formatos
 * PDF, Excel, Word
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType } from 'docx';

/**
 * Helper para obtener la posición Y después de una tabla autoTable
 */
function getTableFinalY(doc: jsPDF, currentY: number, spacing: number = 15): number {
  if (stryMutAct_9fa48("24251")) {
    {}
  } else {
    stryCov_9fa48("24251");
    const finalY = stryMutAct_9fa48("24252") ? (doc as unknown as {
      lastAutoTable?: {
        finalY: number;
      };
    }).lastAutoTable.finalY : (stryCov_9fa48("24252"), (doc as unknown as {
      lastAutoTable?: {
        finalY: number;
      };
    }).lastAutoTable?.finalY);
    return finalY ? stryMutAct_9fa48("24253") ? finalY - spacing : (stryCov_9fa48("24253"), finalY + spacing) : stryMutAct_9fa48("24254") ? currentY - 30 : (stryCov_9fa48("24254"), currentY + 30);
  }
}

// Tipos para exportación
export interface ExamResultData {
  examTitle: string;
  subjectName: string;
  percentage: number;
  correctas: number;
  incorrectas: number;
  omitidas: number;
  totalPreguntas: number;
  puntajePaes: number | null;
  duracionSegundos: number | null;
  startedAt: string;
  finishedAt: string | null;
  answers: Array<{
    questionNumber: number;
    enunciado: string;
    selectedOption?: string;
    correctOption: string;
    isCorrect: boolean;
    isOmitted: boolean;
    explicacion?: string;
    options: Array<{
      letra: string;
      texto: string;
      esCorrecta: boolean;
    }>;
  }>;
}
export interface AnalyticsData {
  studentAverage: number;
  overallAverage: number;
  percentile: number;
  paesPrediction: {
    predictedScore: number;
    confidence: 'high' | 'medium' | 'low';
    estimatedRange: {
      min: number;
      max: number;
    };
  };
  trends: Array<{
    date: string;
    percentage: number;
    examTitle: string;
  }>;
  strengths: Array<{
    topic: string;
    percentage: number;
  }>;
  weaknesses: Array<{
    topic: string;
    percentage: number;
  }>;
  subjectBreakdown: Array<{
    subject: string;
    average: number;
    attempts: number;
    trend: 'improving' | 'declining' | 'stable';
  }>;
}

/**
 * Exporta resultados de examen a PDF
 */
export async function exportExamResultsToPDF(data: ExamResultData, onProgress?: (progress: number, current: number, total: number, message: string) => void): Promise<void> {
  if (stryMutAct_9fa48("24255")) {
    {}
  } else {
    stryCov_9fa48("24255");
    const doc = new jsPDF();
    const totalSteps = stryMutAct_9fa48("24256") ? 3 - data.answers.length : (stryCov_9fa48("24256"), 3 + data.answers.length); // Configuración + Resumen + Título sección + cada pregunta
    let currentStep = 0;
    const updateProgress = (message: string) => {
      if (stryMutAct_9fa48("24257")) {
        {}
      } else {
        stryCov_9fa48("24257");
        stryMutAct_9fa48("24258") ? currentStep-- : (stryCov_9fa48("24258"), currentStep++);
        if (stryMutAct_9fa48("24260") ? false : stryMutAct_9fa48("24259") ? true : (stryCov_9fa48("24259", "24260"), onProgress)) {
          if (stryMutAct_9fa48("24261")) {
            {}
          } else {
            stryCov_9fa48("24261");
            onProgress(Math.round(stryMutAct_9fa48("24262") ? currentStep / totalSteps / 100 : (stryCov_9fa48("24262"), (stryMutAct_9fa48("24263") ? currentStep * totalSteps : (stryCov_9fa48("24263"), currentStep / totalSteps)) * 100)), currentStep, totalSteps, message);
          }
        }
      }
    };

    // Configuración
    updateProgress(stryMutAct_9fa48("24264") ? "" : (stryCov_9fa48("24264"), 'Configurando documento PDF...'));
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let yPos = margin;

    // Título
    doc.setFontSize(18);
    doc.setFont(stryMutAct_9fa48("24265") ? "" : (stryCov_9fa48("24265"), 'helvetica'), stryMutAct_9fa48("24266") ? "" : (stryCov_9fa48("24266"), 'bold'));
    doc.text(data.examTitle, margin, yPos);
    stryMutAct_9fa48("24267") ? yPos -= 10 : (stryCov_9fa48("24267"), yPos += 10);
    doc.setFontSize(12);
    doc.setFont(stryMutAct_9fa48("24268") ? "" : (stryCov_9fa48("24268"), 'helvetica'), stryMutAct_9fa48("24269") ? "" : (stryCov_9fa48("24269"), 'normal'));
    doc.text(data.subjectName, margin, yPos);
    stryMutAct_9fa48("24270") ? yPos -= 15 : (stryCov_9fa48("24270"), yPos += 15);

    // Resumen
    updateProgress(stryMutAct_9fa48("24271") ? "" : (stryCov_9fa48("24271"), 'Generando resumen del examen...'));
    doc.setFontSize(14);
    doc.setFont(stryMutAct_9fa48("24272") ? "" : (stryCov_9fa48("24272"), 'helvetica'), stryMutAct_9fa48("24273") ? "" : (stryCov_9fa48("24273"), 'bold'));
    doc.text(stryMutAct_9fa48("24274") ? "" : (stryCov_9fa48("24274"), 'Resumen del Examen'), margin, yPos);
    stryMutAct_9fa48("24275") ? yPos -= 10 : (stryCov_9fa48("24275"), yPos += 10);
    doc.setFontSize(10);
    doc.setFont(stryMutAct_9fa48("24276") ? "" : (stryCov_9fa48("24276"), 'helvetica'), stryMutAct_9fa48("24277") ? "" : (stryCov_9fa48("24277"), 'normal'));
    const summaryData = stryMutAct_9fa48("24278") ? [] : (stryCov_9fa48("24278"), [stryMutAct_9fa48("24279") ? [] : (stryCov_9fa48("24279"), [stryMutAct_9fa48("24280") ? "" : (stryCov_9fa48("24280"), 'Puntaje'), stryMutAct_9fa48("24281") ? `` : (stryCov_9fa48("24281"), `${data.percentage.toFixed(1)}%`)]), stryMutAct_9fa48("24282") ? [] : (stryCov_9fa48("24282"), [stryMutAct_9fa48("24283") ? "" : (stryCov_9fa48("24283"), 'Correctas'), stryMutAct_9fa48("24284") ? `` : (stryCov_9fa48("24284"), `${data.correctas} / ${data.totalPreguntas}`)]), stryMutAct_9fa48("24285") ? [] : (stryCov_9fa48("24285"), [stryMutAct_9fa48("24286") ? "" : (stryCov_9fa48("24286"), 'Incorrectas'), data.incorrectas.toString()]), stryMutAct_9fa48("24287") ? [] : (stryCov_9fa48("24287"), [stryMutAct_9fa48("24288") ? "" : (stryCov_9fa48("24288"), 'Omitidas'), data.omitidas.toString()]), ...(data.puntajePaes ? stryMutAct_9fa48("24289") ? [] : (stryCov_9fa48("24289"), [stryMutAct_9fa48("24290") ? [] : (stryCov_9fa48("24290"), [stryMutAct_9fa48("24291") ? "" : (stryCov_9fa48("24291"), 'Puntaje PAES'), data.puntajePaes.toString()])]) : stryMutAct_9fa48("24292") ? ["Stryker was here"] : (stryCov_9fa48("24292"), [])), stryMutAct_9fa48("24293") ? [] : (stryCov_9fa48("24293"), [stryMutAct_9fa48("24294") ? "" : (stryCov_9fa48("24294"), 'Fecha'), new Date(data.startedAt).toLocaleDateString(stryMutAct_9fa48("24295") ? "" : (stryCov_9fa48("24295"), 'es-CL'))])]);
    autoTable(doc, stryMutAct_9fa48("24296") ? {} : (stryCov_9fa48("24296"), {
      startY: yPos,
      head: stryMutAct_9fa48("24297") ? [] : (stryCov_9fa48("24297"), [stryMutAct_9fa48("24298") ? [] : (stryCov_9fa48("24298"), [stryMutAct_9fa48("24299") ? "" : (stryCov_9fa48("24299"), 'Métrica'), stryMutAct_9fa48("24300") ? "" : (stryCov_9fa48("24300"), 'Valor')])]),
      body: summaryData,
      theme: stryMutAct_9fa48("24301") ? "" : (stryCov_9fa48("24301"), 'striped'),
      headStyles: stryMutAct_9fa48("24302") ? {} : (stryCov_9fa48("24302"), {
        fillColor: stryMutAct_9fa48("24303") ? [] : (stryCov_9fa48("24303"), [59, 130, 246])
      }),
      margin: stryMutAct_9fa48("24304") ? {} : (stryCov_9fa48("24304"), {
        left: margin,
        right: margin
      })
    }));

    // Obtener posición Y después de la tabla
    yPos = getTableFinalY(doc, yPos);

    // Preguntas y respuestas
    doc.setFontSize(14);
    doc.setFont(stryMutAct_9fa48("24305") ? "" : (stryCov_9fa48("24305"), 'helvetica'), stryMutAct_9fa48("24306") ? "" : (stryCov_9fa48("24306"), 'bold'));
    doc.text(stryMutAct_9fa48("24307") ? "" : (stryCov_9fa48("24307"), 'Revisión de Respuestas'), margin, yPos);
    stryMutAct_9fa48("24308") ? yPos -= 10 : (stryCov_9fa48("24308"), yPos += 10);
    doc.setFontSize(10);
    doc.setFont(stryMutAct_9fa48("24309") ? "" : (stryCov_9fa48("24309"), 'helvetica'), stryMutAct_9fa48("24310") ? "" : (stryCov_9fa48("24310"), 'normal'));
    data.answers.forEach((answer, index) => {
      if (stryMutAct_9fa48("24311")) {
        {}
      } else {
        stryCov_9fa48("24311");
        updateProgress(stryMutAct_9fa48("24312") ? `` : (stryCov_9fa48("24312"), `Procesando pregunta ${stryMutAct_9fa48("24313") ? index - 1 : (stryCov_9fa48("24313"), index + 1)} de ${data.answers.length}...`));
        // Verificar si necesitamos nueva página
        if (stryMutAct_9fa48("24317") ? yPos <= doc.internal.pageSize.getHeight() - 60 : stryMutAct_9fa48("24316") ? yPos >= doc.internal.pageSize.getHeight() - 60 : stryMutAct_9fa48("24315") ? false : stryMutAct_9fa48("24314") ? true : (stryCov_9fa48("24314", "24315", "24316", "24317"), yPos > (stryMutAct_9fa48("24318") ? doc.internal.pageSize.getHeight() + 60 : (stryCov_9fa48("24318"), doc.internal.pageSize.getHeight() - 60)))) {
          if (stryMutAct_9fa48("24319")) {
            {}
          } else {
            stryCov_9fa48("24319");
            doc.addPage();
            yPos = margin;
          }
        }

        // Estado de la pregunta
        const status = answer.isCorrect ? stryMutAct_9fa48("24320") ? "" : (stryCov_9fa48("24320"), '✓ Correcta') : answer.isOmitted ? stryMutAct_9fa48("24321") ? "" : (stryCov_9fa48("24321"), '○ Omitida') : stryMutAct_9fa48("24322") ? "" : (stryCov_9fa48("24322"), '✗ Incorrecta');
        const statusColor = answer.isCorrect ? stryMutAct_9fa48("24323") ? [] : (stryCov_9fa48("24323"), [34, 197, 94]) : answer.isOmitted ? stryMutAct_9fa48("24324") ? [] : (stryCov_9fa48("24324"), [234, 179, 8]) : stryMutAct_9fa48("24325") ? [] : (stryCov_9fa48("24325"), [239, 68, 68]);
        doc.setFontSize(11);
        doc.setFont(stryMutAct_9fa48("24326") ? "" : (stryCov_9fa48("24326"), 'helvetica'), stryMutAct_9fa48("24327") ? "" : (stryCov_9fa48("24327"), 'bold'));
        doc.setTextColor(...statusColor);
        doc.text(stryMutAct_9fa48("24328") ? `` : (stryCov_9fa48("24328"), `Pregunta ${answer.questionNumber} - ${status}`), margin, yPos);
        stryMutAct_9fa48("24329") ? yPos -= 7 : (stryCov_9fa48("24329"), yPos += 7);
        doc.setFontSize(10);
        doc.setFont(stryMutAct_9fa48("24330") ? "" : (stryCov_9fa48("24330"), 'helvetica'), stryMutAct_9fa48("24331") ? "" : (stryCov_9fa48("24331"), 'normal'));
        doc.setTextColor(0, 0, 0);

        // Enunciado (puede ser largo, dividir en líneas)
        const enunciadoLines = doc.splitTextToSize(answer.enunciado, stryMutAct_9fa48("24332") ? pageWidth + 2 * margin : (stryCov_9fa48("24332"), pageWidth - (stryMutAct_9fa48("24333") ? 2 / margin : (stryCov_9fa48("24333"), 2 * margin))));
        enunciadoLines.forEach((line: string) => {
          if (stryMutAct_9fa48("24334")) {
            {}
          } else {
            stryCov_9fa48("24334");
            doc.text(line, stryMutAct_9fa48("24335") ? margin - 5 : (stryCov_9fa48("24335"), margin + 5), yPos);
            stryMutAct_9fa48("24336") ? yPos -= 5 : (stryCov_9fa48("24336"), yPos += 5);
          }
        });
        stryMutAct_9fa48("24337") ? yPos -= 3 : (stryCov_9fa48("24337"), yPos += 3);

        // Opciones
        answer.options.forEach(option => {
          if (stryMutAct_9fa48("24338")) {
            {}
          } else {
            stryCov_9fa48("24338");
            const prefix = option.esCorrecta ? stryMutAct_9fa48("24339") ? "" : (stryCov_9fa48("24339"), '✓ ') : (stryMutAct_9fa48("24342") ? option.letra !== answer.selectedOption : stryMutAct_9fa48("24341") ? false : stryMutAct_9fa48("24340") ? true : (stryCov_9fa48("24340", "24341", "24342"), option.letra === answer.selectedOption)) ? stryMutAct_9fa48("24343") ? "" : (stryCov_9fa48("24343"), '→ ') : stryMutAct_9fa48("24344") ? "" : (stryCov_9fa48("24344"), '  ');
            const text = stryMutAct_9fa48("24345") ? `` : (stryCov_9fa48("24345"), `${prefix}${option.letra}. ${option.texto}`);
            const lines = doc.splitTextToSize(text, stryMutAct_9fa48("24346") ? pageWidth - 2 * margin + 10 : (stryCov_9fa48("24346"), (stryMutAct_9fa48("24347") ? pageWidth + 2 * margin : (stryCov_9fa48("24347"), pageWidth - (stryMutAct_9fa48("24348") ? 2 / margin : (stryCov_9fa48("24348"), 2 * margin)))) - 10));
            lines.forEach((line: string) => {
              if (stryMutAct_9fa48("24349")) {
                {}
              } else {
                stryCov_9fa48("24349");
                doc.text(line, stryMutAct_9fa48("24350") ? margin - 10 : (stryCov_9fa48("24350"), margin + 10), yPos);
                stryMutAct_9fa48("24351") ? yPos -= 5 : (stryCov_9fa48("24351"), yPos += 5);
              }
            });
          }
        });
        stryMutAct_9fa48("24352") ? yPos -= 3 : (stryCov_9fa48("24352"), yPos += 3);

        // Explicación si existe
        if (stryMutAct_9fa48("24354") ? false : stryMutAct_9fa48("24353") ? true : (stryCov_9fa48("24353", "24354"), answer.explicacion)) {
          if (stryMutAct_9fa48("24355")) {
            {}
          } else {
            stryCov_9fa48("24355");
            doc.setFont(stryMutAct_9fa48("24356") ? "" : (stryCov_9fa48("24356"), 'helvetica'), stryMutAct_9fa48("24357") ? "" : (stryCov_9fa48("24357"), 'italic'));
            doc.setTextColor(100, 100, 100);
            const explicacionLines = doc.splitTextToSize(stryMutAct_9fa48("24358") ? `` : (stryCov_9fa48("24358"), `Explicación: ${answer.explicacion}`), stryMutAct_9fa48("24359") ? pageWidth - 2 * margin + 10 : (stryCov_9fa48("24359"), (stryMutAct_9fa48("24360") ? pageWidth + 2 * margin : (stryCov_9fa48("24360"), pageWidth - (stryMutAct_9fa48("24361") ? 2 / margin : (stryCov_9fa48("24361"), 2 * margin)))) - 10));
            explicacionLines.forEach((line: string) => {
              if (stryMutAct_9fa48("24362")) {
                {}
              } else {
                stryCov_9fa48("24362");
                doc.text(line, stryMutAct_9fa48("24363") ? margin - 10 : (stryCov_9fa48("24363"), margin + 10), yPos);
                stryMutAct_9fa48("24364") ? yPos -= 5 : (stryCov_9fa48("24364"), yPos += 5);
              }
            });
            doc.setFont(stryMutAct_9fa48("24365") ? "" : (stryCov_9fa48("24365"), 'helvetica'), stryMutAct_9fa48("24366") ? "" : (stryCov_9fa48("24366"), 'normal'));
            doc.setTextColor(0, 0, 0);
            stryMutAct_9fa48("24367") ? yPos -= 5 : (stryCov_9fa48("24367"), yPos += 5);
          }
        }
        stryMutAct_9fa48("24368") ? yPos -= 5 : (stryCov_9fa48("24368"), yPos += 5);
      }
    });

    // Pie de página
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; stryMutAct_9fa48("24371") ? i > totalPages : stryMutAct_9fa48("24370") ? i < totalPages : stryMutAct_9fa48("24369") ? false : (stryCov_9fa48("24369", "24370", "24371"), i <= totalPages); stryMutAct_9fa48("24372") ? i-- : (stryCov_9fa48("24372"), i++)) {
      if (stryMutAct_9fa48("24373")) {
        {}
      } else {
        stryCov_9fa48("24373");
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(stryMutAct_9fa48("24374") ? `` : (stryCov_9fa48("24374"), `PAES Tutor - Página ${i} de ${totalPages}`), stryMutAct_9fa48("24375") ? pageWidth * 2 : (stryCov_9fa48("24375"), pageWidth / 2), stryMutAct_9fa48("24376") ? doc.internal.pageSize.getHeight() + 10 : (stryCov_9fa48("24376"), doc.internal.pageSize.getHeight() - 10), stryMutAct_9fa48("24377") ? {} : (stryCov_9fa48("24377"), {
          align: stryMutAct_9fa48("24378") ? "" : (stryCov_9fa48("24378"), 'center')
        }));
      }
    }

    // Guardar
    updateProgress(stryMutAct_9fa48("24379") ? "" : (stryCov_9fa48("24379"), 'Guardando archivo PDF...'));
    doc.save(stryMutAct_9fa48("24380") ? `` : (stryCov_9fa48("24380"), `Resultados_${data.examTitle.replace(stryMutAct_9fa48("24381") ? /[a-z0-9]/gi : (stryCov_9fa48("24381"), /[^a-z0-9]/gi), stryMutAct_9fa48("24382") ? "" : (stryCov_9fa48("24382"), '_'))}_${new Date().toISOString().split(stryMutAct_9fa48("24383") ? "" : (stryCov_9fa48("24383"), 'T'))[0]}.pdf`));
  }
}

/**
 * Exporta resultados de examen a Excel
 */
export async function exportExamResultsToExcel(data: ExamResultData, onProgress?: (progress: number, current: number, total: number, message: string) => void): Promise<void> {
  if (stryMutAct_9fa48("24384")) {
    {}
  } else {
    stryCov_9fa48("24384");
    const workbook = XLSX.utils.book_new();
    const totalSteps = 4; // Resumen + Respuestas + Ajustes + Guardar
    let currentStep = 0;
    const updateProgress = (message: string) => {
      if (stryMutAct_9fa48("24385")) {
        {}
      } else {
        stryCov_9fa48("24385");
        stryMutAct_9fa48("24386") ? currentStep-- : (stryCov_9fa48("24386"), currentStep++);
        if (stryMutAct_9fa48("24388") ? false : stryMutAct_9fa48("24387") ? true : (stryCov_9fa48("24387", "24388"), onProgress)) {
          if (stryMutAct_9fa48("24389")) {
            {}
          } else {
            stryCov_9fa48("24389");
            onProgress(Math.round(stryMutAct_9fa48("24390") ? currentStep / totalSteps / 100 : (stryCov_9fa48("24390"), (stryMutAct_9fa48("24391") ? currentStep * totalSteps : (stryCov_9fa48("24391"), currentStep / totalSteps)) * 100)), currentStep, totalSteps, message);
          }
        }
      }
    };

    // Hoja 1: Resumen
    updateProgress(stryMutAct_9fa48("24392") ? "" : (stryCov_9fa48("24392"), 'Generando hoja de resumen...'));
    const summaryData = stryMutAct_9fa48("24393") ? [] : (stryCov_9fa48("24393"), [stryMutAct_9fa48("24394") ? [] : (stryCov_9fa48("24394"), [stryMutAct_9fa48("24395") ? "" : (stryCov_9fa48("24395"), 'Resumen del Examen')]), stryMutAct_9fa48("24396") ? ["Stryker was here"] : (stryCov_9fa48("24396"), []), stryMutAct_9fa48("24397") ? [] : (stryCov_9fa48("24397"), [stryMutAct_9fa48("24398") ? "" : (stryCov_9fa48("24398"), 'Título'), data.examTitle]), stryMutAct_9fa48("24399") ? [] : (stryCov_9fa48("24399"), [stryMutAct_9fa48("24400") ? "" : (stryCov_9fa48("24400"), 'Asignatura'), data.subjectName]), stryMutAct_9fa48("24401") ? [] : (stryCov_9fa48("24401"), [stryMutAct_9fa48("24402") ? "" : (stryCov_9fa48("24402"), 'Puntaje'), stryMutAct_9fa48("24403") ? `` : (stryCov_9fa48("24403"), `${data.percentage.toFixed(1)}%`)]), stryMutAct_9fa48("24404") ? [] : (stryCov_9fa48("24404"), [stryMutAct_9fa48("24405") ? "" : (stryCov_9fa48("24405"), 'Correctas'), data.correctas]), stryMutAct_9fa48("24406") ? [] : (stryCov_9fa48("24406"), [stryMutAct_9fa48("24407") ? "" : (stryCov_9fa48("24407"), 'Incorrectas'), data.incorrectas]), stryMutAct_9fa48("24408") ? [] : (stryCov_9fa48("24408"), [stryMutAct_9fa48("24409") ? "" : (stryCov_9fa48("24409"), 'Omitidas'), data.omitidas]), stryMutAct_9fa48("24410") ? [] : (stryCov_9fa48("24410"), [stryMutAct_9fa48("24411") ? "" : (stryCov_9fa48("24411"), 'Total Preguntas'), data.totalPreguntas]), ...(data.puntajePaes ? stryMutAct_9fa48("24412") ? [] : (stryCov_9fa48("24412"), [stryMutAct_9fa48("24413") ? [] : (stryCov_9fa48("24413"), [stryMutAct_9fa48("24414") ? "" : (stryCov_9fa48("24414"), 'Puntaje PAES'), data.puntajePaes])]) : stryMutAct_9fa48("24415") ? ["Stryker was here"] : (stryCov_9fa48("24415"), [])), stryMutAct_9fa48("24416") ? [] : (stryCov_9fa48("24416"), [stryMutAct_9fa48("24417") ? "" : (stryCov_9fa48("24417"), 'Fecha Inicio'), new Date(data.startedAt).toLocaleString(stryMutAct_9fa48("24418") ? "" : (stryCov_9fa48("24418"), 'es-CL'))]), stryMutAct_9fa48("24419") ? [] : (stryCov_9fa48("24419"), [stryMutAct_9fa48("24420") ? "" : (stryCov_9fa48("24420"), 'Fecha Fin'), data.finishedAt ? new Date(data.finishedAt).toLocaleString(stryMutAct_9fa48("24421") ? "" : (stryCov_9fa48("24421"), 'es-CL')) : stryMutAct_9fa48("24422") ? "" : (stryCov_9fa48("24422"), 'N/A')])]);
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, stryMutAct_9fa48("24423") ? "" : (stryCov_9fa48("24423"), 'Resumen'));

    // Hoja 2: Respuestas detalladas
    const answersData = stryMutAct_9fa48("24424") ? [] : (stryCov_9fa48("24424"), [stryMutAct_9fa48("24425") ? [] : (stryCov_9fa48("24425"), [stryMutAct_9fa48("24426") ? "" : (stryCov_9fa48("24426"), '#'), stryMutAct_9fa48("24427") ? "" : (stryCov_9fa48("24427"), 'Pregunta'), stryMutAct_9fa48("24428") ? "" : (stryCov_9fa48("24428"), 'Tu Respuesta'), stryMutAct_9fa48("24429") ? "" : (stryCov_9fa48("24429"), 'Respuesta Correcta'), stryMutAct_9fa48("24430") ? "" : (stryCov_9fa48("24430"), 'Estado'), stryMutAct_9fa48("24431") ? "" : (stryCov_9fa48("24431"), 'Explicación')]), ...data.answers.map(stryMutAct_9fa48("24432") ? () => undefined : (stryCov_9fa48("24432"), answer => stryMutAct_9fa48("24433") ? [] : (stryCov_9fa48("24433"), [answer.questionNumber, answer.enunciado, stryMutAct_9fa48("24436") ? answer.selectedOption && 'Omitida' : stryMutAct_9fa48("24435") ? false : stryMutAct_9fa48("24434") ? true : (stryCov_9fa48("24434", "24435", "24436"), answer.selectedOption || (stryMutAct_9fa48("24437") ? "" : (stryCov_9fa48("24437"), 'Omitida'))), stryMutAct_9fa48("24440") ? answer.options.find(o => o.esCorrecta)?.letra && 'N/A' : stryMutAct_9fa48("24439") ? false : stryMutAct_9fa48("24438") ? true : (stryCov_9fa48("24438", "24439", "24440"), (stryMutAct_9fa48("24441") ? answer.options.find(o => o.esCorrecta).letra : (stryCov_9fa48("24441"), answer.options.find(stryMutAct_9fa48("24442") ? () => undefined : (stryCov_9fa48("24442"), o => o.esCorrecta))?.letra)) || (stryMutAct_9fa48("24443") ? "" : (stryCov_9fa48("24443"), 'N/A'))), answer.isCorrect ? stryMutAct_9fa48("24444") ? "" : (stryCov_9fa48("24444"), 'Correcta') : answer.isOmitted ? stryMutAct_9fa48("24445") ? "" : (stryCov_9fa48("24445"), 'Omitida') : stryMutAct_9fa48("24446") ? "" : (stryCov_9fa48("24446"), 'Incorrecta'), stryMutAct_9fa48("24449") ? answer.explicacion && '' : stryMutAct_9fa48("24448") ? false : stryMutAct_9fa48("24447") ? true : (stryCov_9fa48("24447", "24448", "24449"), answer.explicacion || (stryMutAct_9fa48("24450") ? "Stryker was here!" : (stryCov_9fa48("24450"), '')))])))]);
    const answersSheet = XLSX.utils.aoa_to_sheet(answersData);

    // Ajustar ancho de columnas
    answersSheet[stryMutAct_9fa48("24451") ? "" : (stryCov_9fa48("24451"), '!cols')] = stryMutAct_9fa48("24452") ? [] : (stryCov_9fa48("24452"), [stryMutAct_9fa48("24453") ? {} : (stryCov_9fa48("24453"), {
      wch: 5
    }), // #
    stryMutAct_9fa48("24454") ? {} : (stryCov_9fa48("24454"), {
      wch: 60
    }), // Pregunta
    stryMutAct_9fa48("24455") ? {} : (stryCov_9fa48("24455"), {
      wch: 15
    }), // Tu Respuesta
    stryMutAct_9fa48("24456") ? {} : (stryCov_9fa48("24456"), {
      wch: 15
    }), // Respuesta Correcta
    stryMutAct_9fa48("24457") ? {} : (stryCov_9fa48("24457"), {
      wch: 12
    }), // Estado
    stryMutAct_9fa48("24458") ? {} : (stryCov_9fa48("24458"), {
      wch: 50
    }) // Explicación
    ]);
    XLSX.utils.book_append_sheet(workbook, answersSheet, stryMutAct_9fa48("24459") ? "" : (stryCov_9fa48("24459"), 'Respuestas'));

    // Guardar
    updateProgress(stryMutAct_9fa48("24460") ? "" : (stryCov_9fa48("24460"), 'Guardando archivo Excel...'));
    const excelBuffer = XLSX.write(workbook, stryMutAct_9fa48("24461") ? {} : (stryCov_9fa48("24461"), {
      bookType: stryMutAct_9fa48("24462") ? "" : (stryCov_9fa48("24462"), 'xlsx'),
      type: stryMutAct_9fa48("24463") ? "" : (stryCov_9fa48("24463"), 'array')
    }));
    const blob = new Blob(stryMutAct_9fa48("24464") ? [] : (stryCov_9fa48("24464"), [excelBuffer]), stryMutAct_9fa48("24465") ? {} : (stryCov_9fa48("24465"), {
      type: stryMutAct_9fa48("24466") ? "" : (stryCov_9fa48("24466"), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    }));
    saveAs(blob, stryMutAct_9fa48("24467") ? `` : (stryCov_9fa48("24467"), `Resultados_${data.examTitle.replace(stryMutAct_9fa48("24468") ? /[a-z0-9]/gi : (stryCov_9fa48("24468"), /[^a-z0-9]/gi), stryMutAct_9fa48("24469") ? "" : (stryCov_9fa48("24469"), '_'))}_${new Date().toISOString().split(stryMutAct_9fa48("24470") ? "" : (stryCov_9fa48("24470"), 'T'))[0]}.xlsx`));
  }
}

/**
 * Exporta analytics a PDF
 */
export async function exportAnalyticsToPDF(data: AnalyticsData, studentName?: string): Promise<void> {
  if (stryMutAct_9fa48("24471")) {
    {}
  } else {
    stryCov_9fa48("24471");
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let yPos = margin;

    // Título
    doc.setFontSize(18);
    doc.setFont(stryMutAct_9fa48("24472") ? "" : (stryCov_9fa48("24472"), 'helvetica'), stryMutAct_9fa48("24473") ? "" : (stryCov_9fa48("24473"), 'bold'));
    doc.text(stryMutAct_9fa48("24474") ? "" : (stryCov_9fa48("24474"), 'Estadísticas Avanzadas'), stryMutAct_9fa48("24475") ? pageWidth * 2 : (stryCov_9fa48("24475"), pageWidth / 2), yPos, stryMutAct_9fa48("24476") ? {} : (stryCov_9fa48("24476"), {
      align: stryMutAct_9fa48("24477") ? "" : (stryCov_9fa48("24477"), 'center')
    }));
    stryMutAct_9fa48("24478") ? yPos -= 10 : (stryCov_9fa48("24478"), yPos += 10);
    if (stryMutAct_9fa48("24480") ? false : stryMutAct_9fa48("24479") ? true : (stryCov_9fa48("24479", "24480"), studentName)) {
      if (stryMutAct_9fa48("24481")) {
        {}
      } else {
        stryCov_9fa48("24481");
        doc.setFontSize(12);
        doc.setFont(stryMutAct_9fa48("24482") ? "" : (stryCov_9fa48("24482"), 'helvetica'), stryMutAct_9fa48("24483") ? "" : (stryCov_9fa48("24483"), 'normal'));
        doc.text(stryMutAct_9fa48("24484") ? `` : (stryCov_9fa48("24484"), `Estudiante: ${studentName}`), stryMutAct_9fa48("24485") ? pageWidth * 2 : (stryCov_9fa48("24485"), pageWidth / 2), yPos, stryMutAct_9fa48("24486") ? {} : (stryCov_9fa48("24486"), {
          align: stryMutAct_9fa48("24487") ? "" : (stryCov_9fa48("24487"), 'center')
        }));
        stryMutAct_9fa48("24488") ? yPos -= 10 : (stryCov_9fa48("24488"), yPos += 10);
      }
    }
    doc.setFontSize(10);
    doc.text(stryMutAct_9fa48("24489") ? `` : (stryCov_9fa48("24489"), `Generado el ${new Date().toLocaleDateString(stryMutAct_9fa48("24490") ? "" : (stryCov_9fa48("24490"), 'es-CL'))}`), stryMutAct_9fa48("24491") ? pageWidth * 2 : (stryCov_9fa48("24491"), pageWidth / 2), yPos, stryMutAct_9fa48("24492") ? {} : (stryCov_9fa48("24492"), {
      align: stryMutAct_9fa48("24493") ? "" : (stryCov_9fa48("24493"), 'center')
    }));
    stryMutAct_9fa48("24494") ? yPos -= 15 : (stryCov_9fa48("24494"), yPos += 15);

    // Comparación
    doc.setFontSize(14);
    doc.setFont(stryMutAct_9fa48("24495") ? "" : (stryCov_9fa48("24495"), 'helvetica'), stryMutAct_9fa48("24496") ? "" : (stryCov_9fa48("24496"), 'bold'));
    doc.text(stryMutAct_9fa48("24497") ? "" : (stryCov_9fa48("24497"), 'Comparación de Rendimiento'), margin, yPos);
    stryMutAct_9fa48("24498") ? yPos -= 10 : (stryCov_9fa48("24498"), yPos += 10);
    const comparisonData = stryMutAct_9fa48("24499") ? [] : (stryCov_9fa48("24499"), [stryMutAct_9fa48("24500") ? [] : (stryCov_9fa48("24500"), [stryMutAct_9fa48("24501") ? "" : (stryCov_9fa48("24501"), 'Tu Promedio'), stryMutAct_9fa48("24502") ? `` : (stryCov_9fa48("24502"), `${data.studentAverage.toFixed(1)}%`)]), stryMutAct_9fa48("24503") ? [] : (stryCov_9fa48("24503"), [stryMutAct_9fa48("24504") ? "" : (stryCov_9fa48("24504"), 'Promedio General'), stryMutAct_9fa48("24505") ? `` : (stryCov_9fa48("24505"), `${data.overallAverage}%`)]), stryMutAct_9fa48("24506") ? [] : (stryCov_9fa48("24506"), [stryMutAct_9fa48("24507") ? "" : (stryCov_9fa48("24507"), 'Percentil'), stryMutAct_9fa48("24508") ? `` : (stryCov_9fa48("24508"), `${data.percentile}º`)])]);
    autoTable(doc, stryMutAct_9fa48("24509") ? {} : (stryCov_9fa48("24509"), {
      startY: yPos,
      head: stryMutAct_9fa48("24510") ? [] : (stryCov_9fa48("24510"), [stryMutAct_9fa48("24511") ? [] : (stryCov_9fa48("24511"), [stryMutAct_9fa48("24512") ? "" : (stryCov_9fa48("24512"), 'Métrica'), stryMutAct_9fa48("24513") ? "" : (stryCov_9fa48("24513"), 'Valor')])]),
      body: comparisonData,
      theme: stryMutAct_9fa48("24514") ? "" : (stryCov_9fa48("24514"), 'striped'),
      headStyles: stryMutAct_9fa48("24515") ? {} : (stryCov_9fa48("24515"), {
        fillColor: stryMutAct_9fa48("24516") ? [] : (stryCov_9fa48("24516"), [59, 130, 246])
      }),
      margin: stryMutAct_9fa48("24517") ? {} : (stryCov_9fa48("24517"), {
        left: margin,
        right: margin
      })
    }));

    // Obtener posición Y después de la tabla
    yPos = getTableFinalY(doc, yPos);

    // Predicción PAES
    doc.setFontSize(14);
    doc.setFont(stryMutAct_9fa48("24518") ? "" : (stryCov_9fa48("24518"), 'helvetica'), stryMutAct_9fa48("24519") ? "" : (stryCov_9fa48("24519"), 'bold'));
    doc.text(stryMutAct_9fa48("24520") ? "" : (stryCov_9fa48("24520"), 'Predicción de Puntaje PAES'), margin, yPos);
    stryMutAct_9fa48("24521") ? yPos -= 10 : (stryCov_9fa48("24521"), yPos += 10);
    const predictionData = stryMutAct_9fa48("24522") ? [] : (stryCov_9fa48("24522"), [stryMutAct_9fa48("24523") ? [] : (stryCov_9fa48("24523"), [stryMutAct_9fa48("24524") ? "" : (stryCov_9fa48("24524"), 'Puntaje Predicho'), data.paesPrediction.predictedScore.toString()]), stryMutAct_9fa48("24525") ? [] : (stryCov_9fa48("24525"), [stryMutAct_9fa48("24526") ? "" : (stryCov_9fa48("24526"), 'Rango Estimado'), stryMutAct_9fa48("24527") ? `` : (stryCov_9fa48("24527"), `${data.paesPrediction.estimatedRange.min} - ${data.paesPrediction.estimatedRange.max}`)]), stryMutAct_9fa48("24528") ? [] : (stryCov_9fa48("24528"), [stryMutAct_9fa48("24529") ? "" : (stryCov_9fa48("24529"), 'Confianza'), data.paesPrediction.confidence])]);
    autoTable(doc, stryMutAct_9fa48("24530") ? {} : (stryCov_9fa48("24530"), {
      startY: yPos,
      head: stryMutAct_9fa48("24531") ? [] : (stryCov_9fa48("24531"), [stryMutAct_9fa48("24532") ? [] : (stryCov_9fa48("24532"), [stryMutAct_9fa48("24533") ? "" : (stryCov_9fa48("24533"), 'Métrica'), stryMutAct_9fa48("24534") ? "" : (stryCov_9fa48("24534"), 'Valor')])]),
      body: predictionData,
      theme: stryMutAct_9fa48("24535") ? "" : (stryCov_9fa48("24535"), 'striped'),
      headStyles: stryMutAct_9fa48("24536") ? {} : (stryCov_9fa48("24536"), {
        fillColor: stryMutAct_9fa48("24537") ? [] : (stryCov_9fa48("24537"), [34, 197, 94])
      }),
      margin: stryMutAct_9fa48("24538") ? {} : (stryCov_9fa48("24538"), {
        left: margin,
        right: margin
      })
    }));

    // Obtener posición Y después de la tabla
    yPos = getTableFinalY(doc, yPos);

    // Fortalezas y Debilidades
    if (stryMutAct_9fa48("24541") ? data.strengths.length > 0 && data.weaknesses.length > 0 : stryMutAct_9fa48("24540") ? false : stryMutAct_9fa48("24539") ? true : (stryCov_9fa48("24539", "24540", "24541"), (stryMutAct_9fa48("24544") ? data.strengths.length <= 0 : stryMutAct_9fa48("24543") ? data.strengths.length >= 0 : stryMutAct_9fa48("24542") ? false : (stryCov_9fa48("24542", "24543", "24544"), data.strengths.length > 0)) || (stryMutAct_9fa48("24547") ? data.weaknesses.length <= 0 : stryMutAct_9fa48("24546") ? data.weaknesses.length >= 0 : stryMutAct_9fa48("24545") ? false : (stryCov_9fa48("24545", "24546", "24547"), data.weaknesses.length > 0)))) {
      if (stryMutAct_9fa48("24548")) {
        {}
      } else {
        stryCov_9fa48("24548");
        doc.addPage();
        yPos = margin;
        if (stryMutAct_9fa48("24552") ? data.strengths.length <= 0 : stryMutAct_9fa48("24551") ? data.strengths.length >= 0 : stryMutAct_9fa48("24550") ? false : stryMutAct_9fa48("24549") ? true : (stryCov_9fa48("24549", "24550", "24551", "24552"), data.strengths.length > 0)) {
          if (stryMutAct_9fa48("24553")) {
            {}
          } else {
            stryCov_9fa48("24553");
            doc.setFontSize(14);
            doc.setFont(stryMutAct_9fa48("24554") ? "" : (stryCov_9fa48("24554"), 'helvetica'), stryMutAct_9fa48("24555") ? "" : (stryCov_9fa48("24555"), 'bold'));
            doc.setTextColor(34, 197, 94);
            doc.text(stryMutAct_9fa48("24556") ? "" : (stryCov_9fa48("24556"), 'Fortalezas'), margin, yPos);
            stryMutAct_9fa48("24557") ? yPos -= 10 : (stryCov_9fa48("24557"), yPos += 10);
            const strengthsData = data.strengths.map(stryMutAct_9fa48("24558") ? () => undefined : (stryCov_9fa48("24558"), s => stryMutAct_9fa48("24559") ? [] : (stryCov_9fa48("24559"), [s.topic, stryMutAct_9fa48("24560") ? `` : (stryCov_9fa48("24560"), `${s.percentage.toFixed(1)}%`)])));
            autoTable(doc, stryMutAct_9fa48("24561") ? {} : (stryCov_9fa48("24561"), {
              startY: yPos,
              head: stryMutAct_9fa48("24562") ? [] : (stryCov_9fa48("24562"), [stryMutAct_9fa48("24563") ? [] : (stryCov_9fa48("24563"), [stryMutAct_9fa48("24564") ? "" : (stryCov_9fa48("24564"), 'Tema'), stryMutAct_9fa48("24565") ? "" : (stryCov_9fa48("24565"), 'Rendimiento')])]),
              body: strengthsData,
              theme: stryMutAct_9fa48("24566") ? "" : (stryCov_9fa48("24566"), 'striped'),
              headStyles: stryMutAct_9fa48("24567") ? {} : (stryCov_9fa48("24567"), {
                fillColor: stryMutAct_9fa48("24568") ? [] : (stryCov_9fa48("24568"), [34, 197, 94])
              }),
              margin: stryMutAct_9fa48("24569") ? {} : (stryCov_9fa48("24569"), {
                left: margin,
                right: margin
              })
            }));

            // Obtener posición Y después de la tabla
            yPos = getTableFinalY(doc, yPos);
          }
        }
        if (stryMutAct_9fa48("24573") ? data.weaknesses.length <= 0 : stryMutAct_9fa48("24572") ? data.weaknesses.length >= 0 : stryMutAct_9fa48("24571") ? false : stryMutAct_9fa48("24570") ? true : (stryCov_9fa48("24570", "24571", "24572", "24573"), data.weaknesses.length > 0)) {
          if (stryMutAct_9fa48("24574")) {
            {}
          } else {
            stryCov_9fa48("24574");
            doc.setFontSize(14);
            doc.setFont(stryMutAct_9fa48("24575") ? "" : (stryCov_9fa48("24575"), 'helvetica'), stryMutAct_9fa48("24576") ? "" : (stryCov_9fa48("24576"), 'bold'));
            doc.setTextColor(239, 68, 68);
            doc.text(stryMutAct_9fa48("24577") ? "" : (stryCov_9fa48("24577"), 'Debilidades'), margin, yPos);
            stryMutAct_9fa48("24578") ? yPos -= 10 : (stryCov_9fa48("24578"), yPos += 10);
            const weaknessesData = data.weaknesses.map(stryMutAct_9fa48("24579") ? () => undefined : (stryCov_9fa48("24579"), w => stryMutAct_9fa48("24580") ? [] : (stryCov_9fa48("24580"), [w.topic, stryMutAct_9fa48("24581") ? `` : (stryCov_9fa48("24581"), `${w.percentage.toFixed(1)}%`)])));
            autoTable(doc, stryMutAct_9fa48("24582") ? {} : (stryCov_9fa48("24582"), {
              startY: yPos,
              head: stryMutAct_9fa48("24583") ? [] : (stryCov_9fa48("24583"), [stryMutAct_9fa48("24584") ? [] : (stryCov_9fa48("24584"), [stryMutAct_9fa48("24585") ? "" : (stryCov_9fa48("24585"), 'Tema'), stryMutAct_9fa48("24586") ? "" : (stryCov_9fa48("24586"), 'Rendimiento')])]),
              body: weaknessesData,
              theme: stryMutAct_9fa48("24587") ? "" : (stryCov_9fa48("24587"), 'striped'),
              headStyles: stryMutAct_9fa48("24588") ? {} : (stryCov_9fa48("24588"), {
                fillColor: stryMutAct_9fa48("24589") ? [] : (stryCov_9fa48("24589"), [239, 68, 68])
              }),
              margin: stryMutAct_9fa48("24590") ? {} : (stryCov_9fa48("24590"), {
                left: margin,
                right: margin
              })
            }));

            // Obtener posición Y después de la tabla
            yPos = getTableFinalY(doc, yPos);
          }
        }
      }
    }

    // Desglose por asignatura
    if (stryMutAct_9fa48("24594") ? data.subjectBreakdown.length <= 0 : stryMutAct_9fa48("24593") ? data.subjectBreakdown.length >= 0 : stryMutAct_9fa48("24592") ? false : stryMutAct_9fa48("24591") ? true : (stryCov_9fa48("24591", "24592", "24593", "24594"), data.subjectBreakdown.length > 0)) {
      if (stryMutAct_9fa48("24595")) {
        {}
      } else {
        stryCov_9fa48("24595");
        if (stryMutAct_9fa48("24599") ? yPos <= doc.internal.pageSize.getHeight() - 80 : stryMutAct_9fa48("24598") ? yPos >= doc.internal.pageSize.getHeight() - 80 : stryMutAct_9fa48("24597") ? false : stryMutAct_9fa48("24596") ? true : (stryCov_9fa48("24596", "24597", "24598", "24599"), yPos > (stryMutAct_9fa48("24600") ? doc.internal.pageSize.getHeight() + 80 : (stryCov_9fa48("24600"), doc.internal.pageSize.getHeight() - 80)))) {
          if (stryMutAct_9fa48("24601")) {
            {}
          } else {
            stryCov_9fa48("24601");
            doc.addPage();
            yPos = margin;
          }
        }
        doc.setFontSize(14);
        doc.setFont(stryMutAct_9fa48("24602") ? "" : (stryCov_9fa48("24602"), 'helvetica'), stryMutAct_9fa48("24603") ? "" : (stryCov_9fa48("24603"), 'bold'));
        doc.setTextColor(0, 0, 0);
        doc.text(stryMutAct_9fa48("24604") ? "" : (stryCov_9fa48("24604"), 'Desglose por Asignatura'), margin, yPos);
        stryMutAct_9fa48("24605") ? yPos -= 10 : (stryCov_9fa48("24605"), yPos += 10);
        const subjectData = data.subjectBreakdown.map(stryMutAct_9fa48("24606") ? () => undefined : (stryCov_9fa48("24606"), s => stryMutAct_9fa48("24607") ? [] : (stryCov_9fa48("24607"), [s.subject, stryMutAct_9fa48("24608") ? `` : (stryCov_9fa48("24608"), `${s.average.toFixed(1)}%`), s.attempts.toString(), (stryMutAct_9fa48("24611") ? s.trend !== 'improving' : stryMutAct_9fa48("24610") ? false : stryMutAct_9fa48("24609") ? true : (stryCov_9fa48("24609", "24610", "24611"), s.trend === (stryMutAct_9fa48("24612") ? "" : (stryCov_9fa48("24612"), 'improving')))) ? stryMutAct_9fa48("24613") ? "" : (stryCov_9fa48("24613"), 'Mejorando') : (stryMutAct_9fa48("24616") ? s.trend !== 'declining' : stryMutAct_9fa48("24615") ? false : stryMutAct_9fa48("24614") ? true : (stryCov_9fa48("24614", "24615", "24616"), s.trend === (stryMutAct_9fa48("24617") ? "" : (stryCov_9fa48("24617"), 'declining')))) ? stryMutAct_9fa48("24618") ? "" : (stryCov_9fa48("24618"), 'En declive') : stryMutAct_9fa48("24619") ? "" : (stryCov_9fa48("24619"), 'Estable')])));
        autoTable(doc, stryMutAct_9fa48("24620") ? {} : (stryCov_9fa48("24620"), {
          startY: yPos,
          head: stryMutAct_9fa48("24621") ? [] : (stryCov_9fa48("24621"), [stryMutAct_9fa48("24622") ? [] : (stryCov_9fa48("24622"), [stryMutAct_9fa48("24623") ? "" : (stryCov_9fa48("24623"), 'Asignatura'), stryMutAct_9fa48("24624") ? "" : (stryCov_9fa48("24624"), 'Promedio'), stryMutAct_9fa48("24625") ? "" : (stryCov_9fa48("24625"), 'Intentos'), stryMutAct_9fa48("24626") ? "" : (stryCov_9fa48("24626"), 'Tendencia')])]),
          body: subjectData,
          theme: stryMutAct_9fa48("24627") ? "" : (stryCov_9fa48("24627"), 'striped'),
          headStyles: stryMutAct_9fa48("24628") ? {} : (stryCov_9fa48("24628"), {
            fillColor: stryMutAct_9fa48("24629") ? [] : (stryCov_9fa48("24629"), [59, 130, 246])
          }),
          margin: stryMutAct_9fa48("24630") ? {} : (stryCov_9fa48("24630"), {
            left: margin,
            right: margin
          })
        }));
      }
    }

    // Pie de página
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; stryMutAct_9fa48("24633") ? i > totalPages : stryMutAct_9fa48("24632") ? i < totalPages : stryMutAct_9fa48("24631") ? false : (stryCov_9fa48("24631", "24632", "24633"), i <= totalPages); stryMutAct_9fa48("24634") ? i-- : (stryCov_9fa48("24634"), i++)) {
      if (stryMutAct_9fa48("24635")) {
        {}
      } else {
        stryCov_9fa48("24635");
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(stryMutAct_9fa48("24636") ? `` : (stryCov_9fa48("24636"), `PAES Tutor - Página ${i} de ${totalPages}`), stryMutAct_9fa48("24637") ? pageWidth * 2 : (stryCov_9fa48("24637"), pageWidth / 2), stryMutAct_9fa48("24638") ? doc.internal.pageSize.getHeight() + 10 : (stryCov_9fa48("24638"), doc.internal.pageSize.getHeight() - 10), stryMutAct_9fa48("24639") ? {} : (stryCov_9fa48("24639"), {
          align: stryMutAct_9fa48("24640") ? "" : (stryCov_9fa48("24640"), 'center')
        }));
      }
    }

    // Guardar
    doc.save(stryMutAct_9fa48("24641") ? `` : (stryCov_9fa48("24641"), `Estadisticas_${new Date().toISOString().split(stryMutAct_9fa48("24642") ? "" : (stryCov_9fa48("24642"), 'T'))[0]}.pdf`));
  }
}

/**
 * Exporta analytics a Excel
 */
export async function exportAnalyticsToExcel(data: AnalyticsData, studentName?: string): Promise<void> {
  if (stryMutAct_9fa48("24643")) {
    {}
  } else {
    stryCov_9fa48("24643");
    const workbook = XLSX.utils.book_new();

    // Hoja 1: Resumen
    const summaryData = stryMutAct_9fa48("24644") ? [] : (stryCov_9fa48("24644"), [stryMutAct_9fa48("24645") ? [] : (stryCov_9fa48("24645"), [stryMutAct_9fa48("24646") ? "" : (stryCov_9fa48("24646"), 'Estadísticas Avanzadas')]), studentName ? stryMutAct_9fa48("24647") ? [] : (stryCov_9fa48("24647"), [stryMutAct_9fa48("24648") ? "" : (stryCov_9fa48("24648"), 'Estudiante'), studentName]) : stryMutAct_9fa48("24649") ? ["Stryker was here"] : (stryCov_9fa48("24649"), []), stryMutAct_9fa48("24650") ? [] : (stryCov_9fa48("24650"), [stryMutAct_9fa48("24651") ? "" : (stryCov_9fa48("24651"), 'Fecha'), new Date().toLocaleDateString(stryMutAct_9fa48("24652") ? "" : (stryCov_9fa48("24652"), 'es-CL'))]), stryMutAct_9fa48("24653") ? ["Stryker was here"] : (stryCov_9fa48("24653"), []), stryMutAct_9fa48("24654") ? [] : (stryCov_9fa48("24654"), [stryMutAct_9fa48("24655") ? "" : (stryCov_9fa48("24655"), 'Comparación de Rendimiento')]), stryMutAct_9fa48("24656") ? [] : (stryCov_9fa48("24656"), [stryMutAct_9fa48("24657") ? "" : (stryCov_9fa48("24657"), 'Tu Promedio'), data.studentAverage]), stryMutAct_9fa48("24658") ? [] : (stryCov_9fa48("24658"), [stryMutAct_9fa48("24659") ? "" : (stryCov_9fa48("24659"), 'Promedio General'), data.overallAverage]), stryMutAct_9fa48("24660") ? [] : (stryCov_9fa48("24660"), [stryMutAct_9fa48("24661") ? "" : (stryCov_9fa48("24661"), 'Percentil'), data.percentile]), stryMutAct_9fa48("24662") ? ["Stryker was here"] : (stryCov_9fa48("24662"), []), stryMutAct_9fa48("24663") ? [] : (stryCov_9fa48("24663"), [stryMutAct_9fa48("24664") ? "" : (stryCov_9fa48("24664"), 'Predicción PAES')]), stryMutAct_9fa48("24665") ? [] : (stryCov_9fa48("24665"), [stryMutAct_9fa48("24666") ? "" : (stryCov_9fa48("24666"), 'Puntaje Predicho'), data.paesPrediction.predictedScore]), stryMutAct_9fa48("24667") ? [] : (stryCov_9fa48("24667"), [stryMutAct_9fa48("24668") ? "" : (stryCov_9fa48("24668"), 'Rango Mínimo'), data.paesPrediction.estimatedRange.min]), stryMutAct_9fa48("24669") ? [] : (stryCov_9fa48("24669"), [stryMutAct_9fa48("24670") ? "" : (stryCov_9fa48("24670"), 'Rango Máximo'), data.paesPrediction.estimatedRange.max]), stryMutAct_9fa48("24671") ? [] : (stryCov_9fa48("24671"), [stryMutAct_9fa48("24672") ? "" : (stryCov_9fa48("24672"), 'Confianza'), data.paesPrediction.confidence])]);
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, stryMutAct_9fa48("24673") ? "" : (stryCov_9fa48("24673"), 'Resumen'));

    // Hoja 2: Tendencias
    if (stryMutAct_9fa48("24677") ? data.trends.length <= 0 : stryMutAct_9fa48("24676") ? data.trends.length >= 0 : stryMutAct_9fa48("24675") ? false : stryMutAct_9fa48("24674") ? true : (stryCov_9fa48("24674", "24675", "24676", "24677"), data.trends.length > 0)) {
      if (stryMutAct_9fa48("24678")) {
        {}
      } else {
        stryCov_9fa48("24678");
        const trendsData = stryMutAct_9fa48("24679") ? [] : (stryCov_9fa48("24679"), [stryMutAct_9fa48("24680") ? [] : (stryCov_9fa48("24680"), [stryMutAct_9fa48("24681") ? "" : (stryCov_9fa48("24681"), 'Fecha'), stryMutAct_9fa48("24682") ? "" : (stryCov_9fa48("24682"), 'Examen'), stryMutAct_9fa48("24683") ? "" : (stryCov_9fa48("24683"), 'Puntaje (%)')]), ...data.trends.map(stryMutAct_9fa48("24684") ? () => undefined : (stryCov_9fa48("24684"), t => stryMutAct_9fa48("24685") ? [] : (stryCov_9fa48("24685"), [new Date(t.date).toLocaleDateString(stryMutAct_9fa48("24686") ? "" : (stryCov_9fa48("24686"), 'es-CL')), t.examTitle, t.percentage])))]);
        const trendsSheet = XLSX.utils.aoa_to_sheet(trendsData);
        trendsSheet[stryMutAct_9fa48("24687") ? "" : (stryCov_9fa48("24687"), '!cols')] = stryMutAct_9fa48("24688") ? [] : (stryCov_9fa48("24688"), [stryMutAct_9fa48("24689") ? {} : (stryCov_9fa48("24689"), {
          wch: 12
        }), stryMutAct_9fa48("24690") ? {} : (stryCov_9fa48("24690"), {
          wch: 40
        }), stryMutAct_9fa48("24691") ? {} : (stryCov_9fa48("24691"), {
          wch: 12
        })]);
        XLSX.utils.book_append_sheet(workbook, trendsSheet, stryMutAct_9fa48("24692") ? "" : (stryCov_9fa48("24692"), 'Tendencias'));
      }
    }

    // Hoja 3: Fortalezas
    if (stryMutAct_9fa48("24696") ? data.strengths.length <= 0 : stryMutAct_9fa48("24695") ? data.strengths.length >= 0 : stryMutAct_9fa48("24694") ? false : stryMutAct_9fa48("24693") ? true : (stryCov_9fa48("24693", "24694", "24695", "24696"), data.strengths.length > 0)) {
      if (stryMutAct_9fa48("24697")) {
        {}
      } else {
        stryCov_9fa48("24697");
        const strengthsData = stryMutAct_9fa48("24698") ? [] : (stryCov_9fa48("24698"), [stryMutAct_9fa48("24699") ? [] : (stryCov_9fa48("24699"), [stryMutAct_9fa48("24700") ? "" : (stryCov_9fa48("24700"), 'Tema'), stryMutAct_9fa48("24701") ? "" : (stryCov_9fa48("24701"), 'Rendimiento (%)')]), ...data.strengths.map(stryMutAct_9fa48("24702") ? () => undefined : (stryCov_9fa48("24702"), s => stryMutAct_9fa48("24703") ? [] : (stryCov_9fa48("24703"), [s.topic, s.percentage])))]);
        const strengthsSheet = XLSX.utils.aoa_to_sheet(strengthsData);
        strengthsSheet[stryMutAct_9fa48("24704") ? "" : (stryCov_9fa48("24704"), '!cols')] = stryMutAct_9fa48("24705") ? [] : (stryCov_9fa48("24705"), [stryMutAct_9fa48("24706") ? {} : (stryCov_9fa48("24706"), {
          wch: 40
        }), stryMutAct_9fa48("24707") ? {} : (stryCov_9fa48("24707"), {
          wch: 15
        })]);
        XLSX.utils.book_append_sheet(workbook, strengthsSheet, stryMutAct_9fa48("24708") ? "" : (stryCov_9fa48("24708"), 'Fortalezas'));
      }
    }

    // Hoja 4: Debilidades
    if (stryMutAct_9fa48("24712") ? data.weaknesses.length <= 0 : stryMutAct_9fa48("24711") ? data.weaknesses.length >= 0 : stryMutAct_9fa48("24710") ? false : stryMutAct_9fa48("24709") ? true : (stryCov_9fa48("24709", "24710", "24711", "24712"), data.weaknesses.length > 0)) {
      if (stryMutAct_9fa48("24713")) {
        {}
      } else {
        stryCov_9fa48("24713");
        const weaknessesData = stryMutAct_9fa48("24714") ? [] : (stryCov_9fa48("24714"), [stryMutAct_9fa48("24715") ? [] : (stryCov_9fa48("24715"), [stryMutAct_9fa48("24716") ? "" : (stryCov_9fa48("24716"), 'Tema'), stryMutAct_9fa48("24717") ? "" : (stryCov_9fa48("24717"), 'Rendimiento (%)')]), ...data.weaknesses.map(stryMutAct_9fa48("24718") ? () => undefined : (stryCov_9fa48("24718"), w => stryMutAct_9fa48("24719") ? [] : (stryCov_9fa48("24719"), [w.topic, w.percentage])))]);
        const weaknessesSheet = XLSX.utils.aoa_to_sheet(weaknessesData);
        weaknessesSheet[stryMutAct_9fa48("24720") ? "" : (stryCov_9fa48("24720"), '!cols')] = stryMutAct_9fa48("24721") ? [] : (stryCov_9fa48("24721"), [stryMutAct_9fa48("24722") ? {} : (stryCov_9fa48("24722"), {
          wch: 40
        }), stryMutAct_9fa48("24723") ? {} : (stryCov_9fa48("24723"), {
          wch: 15
        })]);
        XLSX.utils.book_append_sheet(workbook, weaknessesSheet, stryMutAct_9fa48("24724") ? "" : (stryCov_9fa48("24724"), 'Debilidades'));
      }
    }

    // Hoja 5: Desglose por asignatura
    if (stryMutAct_9fa48("24728") ? data.subjectBreakdown.length <= 0 : stryMutAct_9fa48("24727") ? data.subjectBreakdown.length >= 0 : stryMutAct_9fa48("24726") ? false : stryMutAct_9fa48("24725") ? true : (stryCov_9fa48("24725", "24726", "24727", "24728"), data.subjectBreakdown.length > 0)) {
      if (stryMutAct_9fa48("24729")) {
        {}
      } else {
        stryCov_9fa48("24729");
        const subjectData = stryMutAct_9fa48("24730") ? [] : (stryCov_9fa48("24730"), [stryMutAct_9fa48("24731") ? [] : (stryCov_9fa48("24731"), [stryMutAct_9fa48("24732") ? "" : (stryCov_9fa48("24732"), 'Asignatura'), stryMutAct_9fa48("24733") ? "" : (stryCov_9fa48("24733"), 'Promedio (%)'), stryMutAct_9fa48("24734") ? "" : (stryCov_9fa48("24734"), 'Intentos'), stryMutAct_9fa48("24735") ? "" : (stryCov_9fa48("24735"), 'Tendencia')]), ...data.subjectBreakdown.map(stryMutAct_9fa48("24736") ? () => undefined : (stryCov_9fa48("24736"), s => stryMutAct_9fa48("24737") ? [] : (stryCov_9fa48("24737"), [s.subject, s.average, s.attempts, (stryMutAct_9fa48("24740") ? s.trend !== 'improving' : stryMutAct_9fa48("24739") ? false : stryMutAct_9fa48("24738") ? true : (stryCov_9fa48("24738", "24739", "24740"), s.trend === (stryMutAct_9fa48("24741") ? "" : (stryCov_9fa48("24741"), 'improving')))) ? stryMutAct_9fa48("24742") ? "" : (stryCov_9fa48("24742"), 'Mejorando') : (stryMutAct_9fa48("24745") ? s.trend !== 'declining' : stryMutAct_9fa48("24744") ? false : stryMutAct_9fa48("24743") ? true : (stryCov_9fa48("24743", "24744", "24745"), s.trend === (stryMutAct_9fa48("24746") ? "" : (stryCov_9fa48("24746"), 'declining')))) ? stryMutAct_9fa48("24747") ? "" : (stryCov_9fa48("24747"), 'En declive') : stryMutAct_9fa48("24748") ? "" : (stryCov_9fa48("24748"), 'Estable')])))]);
        const subjectSheet = XLSX.utils.aoa_to_sheet(subjectData);
        subjectSheet[stryMutAct_9fa48("24749") ? "" : (stryCov_9fa48("24749"), '!cols')] = stryMutAct_9fa48("24750") ? [] : (stryCov_9fa48("24750"), [stryMutAct_9fa48("24751") ? {} : (stryCov_9fa48("24751"), {
          wch: 30
        }), stryMutAct_9fa48("24752") ? {} : (stryCov_9fa48("24752"), {
          wch: 12
        }), stryMutAct_9fa48("24753") ? {} : (stryCov_9fa48("24753"), {
          wch: 10
        }), stryMutAct_9fa48("24754") ? {} : (stryCov_9fa48("24754"), {
          wch: 12
        })]);
        XLSX.utils.book_append_sheet(workbook, subjectSheet, stryMutAct_9fa48("24755") ? "" : (stryCov_9fa48("24755"), 'Por Asignatura'));
      }
    }

    // Guardar
    const excelBuffer = XLSX.write(workbook, stryMutAct_9fa48("24756") ? {} : (stryCov_9fa48("24756"), {
      bookType: stryMutAct_9fa48("24757") ? "" : (stryCov_9fa48("24757"), 'xlsx'),
      type: stryMutAct_9fa48("24758") ? "" : (stryCov_9fa48("24758"), 'array')
    }));
    const blob = new Blob(stryMutAct_9fa48("24759") ? [] : (stryCov_9fa48("24759"), [excelBuffer]), stryMutAct_9fa48("24760") ? {} : (stryCov_9fa48("24760"), {
      type: stryMutAct_9fa48("24761") ? "" : (stryCov_9fa48("24761"), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    }));
    saveAs(blob, stryMutAct_9fa48("24762") ? `` : (stryCov_9fa48("24762"), `Estadisticas_${new Date().toISOString().split(stryMutAct_9fa48("24763") ? "" : (stryCov_9fa48("24763"), 'T'))[0]}.xlsx`));
  }
}

/**
 * Exporta resultados de examen a Word
 */
export async function exportExamResultsToWord(data: ExamResultData, onProgress?: (progress: number, current: number, total: number, message: string) => void): Promise<void> {
  if (stryMutAct_9fa48("24764")) {
    {}
  } else {
    stryCov_9fa48("24764");
    const children: (Paragraph | Table)[] = stryMutAct_9fa48("24765") ? ["Stryker was here"] : (stryCov_9fa48("24765"), []);
    const totalSteps = stryMutAct_9fa48("24766") ? 3 - data.answers.length : (stryCov_9fa48("24766"), 3 + data.answers.length); // Título + Resumen + Título sección + cada pregunta
    let currentStep = 0;
    const updateProgress = (message: string) => {
      if (stryMutAct_9fa48("24767")) {
        {}
      } else {
        stryCov_9fa48("24767");
        stryMutAct_9fa48("24768") ? currentStep-- : (stryCov_9fa48("24768"), currentStep++);
        if (stryMutAct_9fa48("24770") ? false : stryMutAct_9fa48("24769") ? true : (stryCov_9fa48("24769", "24770"), onProgress)) {
          if (stryMutAct_9fa48("24771")) {
            {}
          } else {
            stryCov_9fa48("24771");
            onProgress(Math.round(stryMutAct_9fa48("24772") ? currentStep / totalSteps / 100 : (stryCov_9fa48("24772"), (stryMutAct_9fa48("24773") ? currentStep * totalSteps : (stryCov_9fa48("24773"), currentStep / totalSteps)) * 100)), currentStep, totalSteps, message);
          }
        }
      }
    };

    // Título
    updateProgress(stryMutAct_9fa48("24774") ? "" : (stryCov_9fa48("24774"), 'Configurando documento Word...'));
    children.push(new Paragraph(stryMutAct_9fa48("24775") ? {} : (stryCov_9fa48("24775"), {
      text: data.examTitle,
      heading: HeadingLevel.HEADING_1
    })));
    children.push(new Paragraph(stryMutAct_9fa48("24776") ? {} : (stryCov_9fa48("24776"), {
      text: data.subjectName,
      heading: HeadingLevel.HEADING_2
    })));
    children.push(new Paragraph(stryMutAct_9fa48("24777") ? {} : (stryCov_9fa48("24777"), {
      text: stryMutAct_9fa48("24778") ? "Stryker was here!" : (stryCov_9fa48("24778"), '')
    })));

    // Resumen
    children.push(new Paragraph(stryMutAct_9fa48("24779") ? {} : (stryCov_9fa48("24779"), {
      text: stryMutAct_9fa48("24780") ? "" : (stryCov_9fa48("24780"), 'Resumen del Examen'),
      heading: HeadingLevel.HEADING_2
    })));
    const summaryTable = new Table(stryMutAct_9fa48("24781") ? {} : (stryCov_9fa48("24781"), {
      rows: stryMutAct_9fa48("24782") ? [] : (stryCov_9fa48("24782"), [new TableRow(stryMutAct_9fa48("24783") ? {} : (stryCov_9fa48("24783"), {
        children: stryMutAct_9fa48("24784") ? [] : (stryCov_9fa48("24784"), [new TableCell(stryMutAct_9fa48("24785") ? {} : (stryCov_9fa48("24785"), {
          children: stryMutAct_9fa48("24786") ? [] : (stryCov_9fa48("24786"), [new Paragraph(stryMutAct_9fa48("24787") ? "" : (stryCov_9fa48("24787"), 'Métrica'))])
        })), new TableCell(stryMutAct_9fa48("24788") ? {} : (stryCov_9fa48("24788"), {
          children: stryMutAct_9fa48("24789") ? [] : (stryCov_9fa48("24789"), [new Paragraph(stryMutAct_9fa48("24790") ? "" : (stryCov_9fa48("24790"), 'Valor'))])
        }))])
      })), new TableRow(stryMutAct_9fa48("24791") ? {} : (stryCov_9fa48("24791"), {
        children: stryMutAct_9fa48("24792") ? [] : (stryCov_9fa48("24792"), [new TableCell(stryMutAct_9fa48("24793") ? {} : (stryCov_9fa48("24793"), {
          children: stryMutAct_9fa48("24794") ? [] : (stryCov_9fa48("24794"), [new Paragraph(stryMutAct_9fa48("24795") ? "" : (stryCov_9fa48("24795"), 'Puntaje'))])
        })), new TableCell(stryMutAct_9fa48("24796") ? {} : (stryCov_9fa48("24796"), {
          children: stryMutAct_9fa48("24797") ? [] : (stryCov_9fa48("24797"), [new Paragraph(stryMutAct_9fa48("24798") ? `` : (stryCov_9fa48("24798"), `${data.percentage.toFixed(1)}%`))])
        }))])
      })), new TableRow(stryMutAct_9fa48("24799") ? {} : (stryCov_9fa48("24799"), {
        children: stryMutAct_9fa48("24800") ? [] : (stryCov_9fa48("24800"), [new TableCell(stryMutAct_9fa48("24801") ? {} : (stryCov_9fa48("24801"), {
          children: stryMutAct_9fa48("24802") ? [] : (stryCov_9fa48("24802"), [new Paragraph(stryMutAct_9fa48("24803") ? "" : (stryCov_9fa48("24803"), 'Correctas'))])
        })), new TableCell(stryMutAct_9fa48("24804") ? {} : (stryCov_9fa48("24804"), {
          children: stryMutAct_9fa48("24805") ? [] : (stryCov_9fa48("24805"), [new Paragraph(stryMutAct_9fa48("24806") ? `` : (stryCov_9fa48("24806"), `${data.correctas} / ${data.totalPreguntas}`))])
        }))])
      })), new TableRow(stryMutAct_9fa48("24807") ? {} : (stryCov_9fa48("24807"), {
        children: stryMutAct_9fa48("24808") ? [] : (stryCov_9fa48("24808"), [new TableCell(stryMutAct_9fa48("24809") ? {} : (stryCov_9fa48("24809"), {
          children: stryMutAct_9fa48("24810") ? [] : (stryCov_9fa48("24810"), [new Paragraph(stryMutAct_9fa48("24811") ? "" : (stryCov_9fa48("24811"), 'Incorrectas'))])
        })), new TableCell(stryMutAct_9fa48("24812") ? {} : (stryCov_9fa48("24812"), {
          children: stryMutAct_9fa48("24813") ? [] : (stryCov_9fa48("24813"), [new Paragraph(data.incorrectas.toString())])
        }))])
      })), new TableRow(stryMutAct_9fa48("24814") ? {} : (stryCov_9fa48("24814"), {
        children: stryMutAct_9fa48("24815") ? [] : (stryCov_9fa48("24815"), [new TableCell(stryMutAct_9fa48("24816") ? {} : (stryCov_9fa48("24816"), {
          children: stryMutAct_9fa48("24817") ? [] : (stryCov_9fa48("24817"), [new Paragraph(stryMutAct_9fa48("24818") ? "" : (stryCov_9fa48("24818"), 'Omitidas'))])
        })), new TableCell(stryMutAct_9fa48("24819") ? {} : (stryCov_9fa48("24819"), {
          children: stryMutAct_9fa48("24820") ? [] : (stryCov_9fa48("24820"), [new Paragraph(data.omitidas.toString())])
        }))])
      })), ...(data.puntajePaes ? stryMutAct_9fa48("24821") ? [] : (stryCov_9fa48("24821"), [new TableRow(stryMutAct_9fa48("24822") ? {} : (stryCov_9fa48("24822"), {
        children: stryMutAct_9fa48("24823") ? [] : (stryCov_9fa48("24823"), [new TableCell(stryMutAct_9fa48("24824") ? {} : (stryCov_9fa48("24824"), {
          children: stryMutAct_9fa48("24825") ? [] : (stryCov_9fa48("24825"), [new Paragraph(stryMutAct_9fa48("24826") ? "" : (stryCov_9fa48("24826"), 'Puntaje PAES'))])
        })), new TableCell(stryMutAct_9fa48("24827") ? {} : (stryCov_9fa48("24827"), {
          children: stryMutAct_9fa48("24828") ? [] : (stryCov_9fa48("24828"), [new Paragraph(data.puntajePaes.toString())])
        }))])
      }))]) : stryMutAct_9fa48("24829") ? ["Stryker was here"] : (stryCov_9fa48("24829"), []))]),
      width: stryMutAct_9fa48("24830") ? {} : (stryCov_9fa48("24830"), {
        size: 100,
        type: WidthType.PERCENTAGE
      })
    }));
    children.push(summaryTable);
    children.push(new Paragraph(stryMutAct_9fa48("24831") ? {} : (stryCov_9fa48("24831"), {
      text: stryMutAct_9fa48("24832") ? "Stryker was here!" : (stryCov_9fa48("24832"), '')
    })));

    // Preguntas
    updateProgress(stryMutAct_9fa48("24833") ? "" : (stryCov_9fa48("24833"), 'Generando sección de respuestas...'));
    children.push(new Paragraph(stryMutAct_9fa48("24834") ? {} : (stryCov_9fa48("24834"), {
      text: stryMutAct_9fa48("24835") ? "" : (stryCov_9fa48("24835"), 'Revisión de Respuestas'),
      heading: HeadingLevel.HEADING_2
    })));
    data.answers.forEach((answer, index) => {
      if (stryMutAct_9fa48("24836")) {
        {}
      } else {
        stryCov_9fa48("24836");
        updateProgress(stryMutAct_9fa48("24837") ? `` : (stryCov_9fa48("24837"), `Procesando pregunta ${stryMutAct_9fa48("24838") ? index - 1 : (stryCov_9fa48("24838"), index + 1)} de ${data.answers.length}...`));
        const status = answer.isCorrect ? stryMutAct_9fa48("24839") ? "" : (stryCov_9fa48("24839"), '✓ Correcta') : answer.isOmitted ? stryMutAct_9fa48("24840") ? "" : (stryCov_9fa48("24840"), '○ Omitida') : stryMutAct_9fa48("24841") ? "" : (stryCov_9fa48("24841"), '✗ Incorrecta');
        const statusColor = answer.isCorrect ? stryMutAct_9fa48("24842") ? "" : (stryCov_9fa48("24842"), '00C853') : answer.isOmitted ? stryMutAct_9fa48("24843") ? "" : (stryCov_9fa48("24843"), 'FFB300') : stryMutAct_9fa48("24844") ? "" : (stryCov_9fa48("24844"), 'EF4444');
        children.push(new Paragraph(stryMutAct_9fa48("24845") ? {} : (stryCov_9fa48("24845"), {
          children: stryMutAct_9fa48("24846") ? [] : (stryCov_9fa48("24846"), [new TextRun(stryMutAct_9fa48("24847") ? {} : (stryCov_9fa48("24847"), {
            text: stryMutAct_9fa48("24848") ? `` : (stryCov_9fa48("24848"), `Pregunta ${answer.questionNumber} - ${status}`),
            bold: stryMutAct_9fa48("24849") ? false : (stryCov_9fa48("24849"), true),
            color: statusColor
          }))])
        })));
        children.push(new Paragraph(stryMutAct_9fa48("24850") ? {} : (stryCov_9fa48("24850"), {
          text: answer.enunciado
        })));
        answer.options.forEach(option => {
          if (stryMutAct_9fa48("24851")) {
            {}
          } else {
            stryCov_9fa48("24851");
            const prefix = option.esCorrecta ? stryMutAct_9fa48("24852") ? "" : (stryCov_9fa48("24852"), '✓ ') : (stryMutAct_9fa48("24855") ? option.letra !== answer.selectedOption : stryMutAct_9fa48("24854") ? false : stryMutAct_9fa48("24853") ? true : (stryCov_9fa48("24853", "24854", "24855"), option.letra === answer.selectedOption)) ? stryMutAct_9fa48("24856") ? "" : (stryCov_9fa48("24856"), '→ ') : stryMutAct_9fa48("24857") ? "" : (stryCov_9fa48("24857"), '  ');
            children.push(new Paragraph(stryMutAct_9fa48("24858") ? {} : (stryCov_9fa48("24858"), {
              text: stryMutAct_9fa48("24859") ? `` : (stryCov_9fa48("24859"), `${prefix}${option.letra}. ${option.texto}`),
              indent: stryMutAct_9fa48("24860") ? {} : (stryCov_9fa48("24860"), {
                left: 400
              })
            })));
          }
        });
        if (stryMutAct_9fa48("24862") ? false : stryMutAct_9fa48("24861") ? true : (stryCov_9fa48("24861", "24862"), answer.explicacion)) {
          if (stryMutAct_9fa48("24863")) {
            {}
          } else {
            stryCov_9fa48("24863");
            children.push(new Paragraph(stryMutAct_9fa48("24864") ? {} : (stryCov_9fa48("24864"), {
              children: stryMutAct_9fa48("24865") ? [] : (stryCov_9fa48("24865"), [new TextRun(stryMutAct_9fa48("24866") ? {} : (stryCov_9fa48("24866"), {
                text: stryMutAct_9fa48("24867") ? "" : (stryCov_9fa48("24867"), 'Explicación: '),
                bold: stryMutAct_9fa48("24868") ? false : (stryCov_9fa48("24868"), true),
                italics: stryMutAct_9fa48("24869") ? false : (stryCov_9fa48("24869"), true)
              })), new TextRun(stryMutAct_9fa48("24870") ? {} : (stryCov_9fa48("24870"), {
                text: answer.explicacion,
                italics: stryMutAct_9fa48("24871") ? false : (stryCov_9fa48("24871"), true)
              }))]),
              indent: stryMutAct_9fa48("24872") ? {} : (stryCov_9fa48("24872"), {
                left: 400
              })
            })));
          }
        }
        children.push(new Paragraph(stryMutAct_9fa48("24873") ? {} : (stryCov_9fa48("24873"), {
          text: stryMutAct_9fa48("24874") ? "Stryker was here!" : (stryCov_9fa48("24874"), '')
        })));
      }
    });

    // Crear documento
    const doc = new Document(stryMutAct_9fa48("24875") ? {} : (stryCov_9fa48("24875"), {
      sections: stryMutAct_9fa48("24876") ? [] : (stryCov_9fa48("24876"), [stryMutAct_9fa48("24877") ? {} : (stryCov_9fa48("24877"), {
        children
      })])
    }));

    // Generar y descargar
    const blob = await Packer.toBlob(doc);
    saveAs(blob, stryMutAct_9fa48("24878") ? `` : (stryCov_9fa48("24878"), `Resultados_${data.examTitle.replace(stryMutAct_9fa48("24879") ? /[a-z0-9]/gi : (stryCov_9fa48("24879"), /[^a-z0-9]/gi), stryMutAct_9fa48("24880") ? "" : (stryCov_9fa48("24880"), '_'))}_${new Date().toISOString().split(stryMutAct_9fa48("24881") ? "" : (stryCov_9fa48("24881"), 'T'))[0]}.docx`));
  }
}

/**
 * Exporta lista de exámenes a Excel
 */
export async function exportExamsListToExcel(exams: Array<{
  id: string;
  titulo: string;
  descripcion: string | null;
  tipo: string;
  totalPreguntas: number;
  tiempoLimiteMin: number | null;
  subject: {
    nombre: string;
    codigo: string;
  };
  createdAt: string;
}>): Promise<void> {
  if (stryMutAct_9fa48("24882")) {
    {}
  } else {
    stryCov_9fa48("24882");
    const workbook = XLSX.utils.book_new();
    const examsData = stryMutAct_9fa48("24883") ? [] : (stryCov_9fa48("24883"), [stryMutAct_9fa48("24884") ? [] : (stryCov_9fa48("24884"), [stryMutAct_9fa48("24885") ? "" : (stryCov_9fa48("24885"), 'ID'), stryMutAct_9fa48("24886") ? "" : (stryCov_9fa48("24886"), 'Título'), stryMutAct_9fa48("24887") ? "" : (stryCov_9fa48("24887"), 'Asignatura'), stryMutAct_9fa48("24888") ? "" : (stryCov_9fa48("24888"), 'Código'), stryMutAct_9fa48("24889") ? "" : (stryCov_9fa48("24889"), 'Tipo'), stryMutAct_9fa48("24890") ? "" : (stryCov_9fa48("24890"), 'Preguntas'), stryMutAct_9fa48("24891") ? "" : (stryCov_9fa48("24891"), 'Tiempo (min)'), stryMutAct_9fa48("24892") ? "" : (stryCov_9fa48("24892"), 'Fecha Creación')]), ...exams.map(stryMutAct_9fa48("24893") ? () => undefined : (stryCov_9fa48("24893"), exam => stryMutAct_9fa48("24894") ? [] : (stryCov_9fa48("24894"), [exam.id, exam.titulo, exam.subject.nombre, exam.subject.codigo, exam.tipo, exam.totalPreguntas, stryMutAct_9fa48("24897") ? exam.tiempoLimiteMin && 'N/A' : stryMutAct_9fa48("24896") ? false : stryMutAct_9fa48("24895") ? true : (stryCov_9fa48("24895", "24896", "24897"), exam.tiempoLimiteMin || (stryMutAct_9fa48("24898") ? "" : (stryCov_9fa48("24898"), 'N/A'))), new Date(exam.createdAt).toLocaleDateString(stryMutAct_9fa48("24899") ? "" : (stryCov_9fa48("24899"), 'es-CL'))])))]);
    const sheet = XLSX.utils.aoa_to_sheet(examsData);
    sheet[stryMutAct_9fa48("24900") ? "" : (stryCov_9fa48("24900"), '!cols')] = stryMutAct_9fa48("24901") ? [] : (stryCov_9fa48("24901"), [stryMutAct_9fa48("24902") ? {} : (stryCov_9fa48("24902"), {
      wch: 25
    }), // ID
    stryMutAct_9fa48("24903") ? {} : (stryCov_9fa48("24903"), {
      wch: 40
    }), // Título
    stryMutAct_9fa48("24904") ? {} : (stryCov_9fa48("24904"), {
      wch: 25
    }), // Asignatura
    stryMutAct_9fa48("24905") ? {} : (stryCov_9fa48("24905"), {
      wch: 10
    }), // Código
    stryMutAct_9fa48("24906") ? {} : (stryCov_9fa48("24906"), {
      wch: 15
    }), // Tipo
    stryMutAct_9fa48("24907") ? {} : (stryCov_9fa48("24907"), {
      wch: 10
    }), // Preguntas
    stryMutAct_9fa48("24908") ? {} : (stryCov_9fa48("24908"), {
      wch: 12
    }), // Tiempo
    stryMutAct_9fa48("24909") ? {} : (stryCov_9fa48("24909"), {
      wch: 15
    }) // Fecha
    ]);
    XLSX.utils.book_append_sheet(workbook, sheet, stryMutAct_9fa48("24910") ? "" : (stryCov_9fa48("24910"), 'Exámenes'));
    updateProgress(stryMutAct_9fa48("24911") ? "" : (stryCov_9fa48("24911"), 'Ajustando formato...'));
    const excelBuffer = XLSX.write(workbook, stryMutAct_9fa48("24912") ? {} : (stryCov_9fa48("24912"), {
      bookType: stryMutAct_9fa48("24913") ? "" : (stryCov_9fa48("24913"), 'xlsx'),
      type: stryMutAct_9fa48("24914") ? "" : (stryCov_9fa48("24914"), 'array')
    }));
    const blob = new Blob(stryMutAct_9fa48("24915") ? [] : (stryCov_9fa48("24915"), [excelBuffer]), stryMutAct_9fa48("24916") ? {} : (stryCov_9fa48("24916"), {
      type: stryMutAct_9fa48("24917") ? "" : (stryCov_9fa48("24917"), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    }));
    updateProgress(stryMutAct_9fa48("24918") ? "" : (stryCov_9fa48("24918"), 'Guardando archivo Excel...'));
    saveAs(blob, stryMutAct_9fa48("24919") ? `` : (stryCov_9fa48("24919"), `Lista_Examenes_${new Date().toISOString().split(stryMutAct_9fa48("24920") ? "" : (stryCov_9fa48("24920"), 'T'))[0]}.xlsx`));
  }
}

/**
 * Exporta estadísticas del dashboard a Excel
 */
export async function exportDashboardToExcel(data: {
  studentName: string;
  totalAttempts: number;
  completedAttempts: number;
  avgScore: number;
  attempts: Array<{
    id: string;
    estado: string;
    porcentaje: number;
    correctas: number;
    totalPreguntas: number;
    puntajePaes: number | null;
    createdAt: string;
    exam: {
      titulo: string;
      subject: {
        nombre: string;
        codigo: string;
      };
    };
  }>;
  metrics: Array<{
    codigo: string;
    nombre: string;
    porcentaje: number;
    totalPreguntas: number;
    correctas: number;
  }>;
}): Promise<void> {
  if (stryMutAct_9fa48("24921")) {
    {}
  } else {
    stryCov_9fa48("24921");
    const workbook = XLSX.utils.book_new();

    // Hoja 1: Resumen
    const summaryData = stryMutAct_9fa48("24922") ? [] : (stryCov_9fa48("24922"), [stryMutAct_9fa48("24923") ? [] : (stryCov_9fa48("24923"), [stryMutAct_9fa48("24924") ? "" : (stryCov_9fa48("24924"), 'Resumen del Dashboard')]), stryMutAct_9fa48("24925") ? [] : (stryCov_9fa48("24925"), [stryMutAct_9fa48("24926") ? "" : (stryCov_9fa48("24926"), 'Estudiante'), data.studentName]), stryMutAct_9fa48("24927") ? [] : (stryCov_9fa48("24927"), [stryMutAct_9fa48("24928") ? "" : (stryCov_9fa48("24928"), 'Total Intentos'), data.totalAttempts]), stryMutAct_9fa48("24929") ? [] : (stryCov_9fa48("24929"), [stryMutAct_9fa48("24930") ? "" : (stryCov_9fa48("24930"), 'Intentos Completados'), data.completedAttempts]), stryMutAct_9fa48("24931") ? [] : (stryCov_9fa48("24931"), [stryMutAct_9fa48("24932") ? "" : (stryCov_9fa48("24932"), 'Puntaje Promedio'), stryMutAct_9fa48("24933") ? `` : (stryCov_9fa48("24933"), `${data.avgScore.toFixed(1)}%`)]), stryMutAct_9fa48("24934") ? ["Stryker was here"] : (stryCov_9fa48("24934"), [])]);
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, stryMutAct_9fa48("24935") ? "" : (stryCov_9fa48("24935"), 'Resumen'));

    // Hoja 2: Intentos
    if (stryMutAct_9fa48("24939") ? data.attempts.length <= 0 : stryMutAct_9fa48("24938") ? data.attempts.length >= 0 : stryMutAct_9fa48("24937") ? false : stryMutAct_9fa48("24936") ? true : (stryCov_9fa48("24936", "24937", "24938", "24939"), data.attempts.length > 0)) {
      if (stryMutAct_9fa48("24940")) {
        {}
      } else {
        stryCov_9fa48("24940");
        const attemptsData = stryMutAct_9fa48("24941") ? [] : (stryCov_9fa48("24941"), [stryMutAct_9fa48("24942") ? [] : (stryCov_9fa48("24942"), [stryMutAct_9fa48("24943") ? "" : (stryCov_9fa48("24943"), 'Fecha'), stryMutAct_9fa48("24944") ? "" : (stryCov_9fa48("24944"), 'Examen'), stryMutAct_9fa48("24945") ? "" : (stryCov_9fa48("24945"), 'Asignatura'), stryMutAct_9fa48("24946") ? "" : (stryCov_9fa48("24946"), 'Estado'), stryMutAct_9fa48("24947") ? "" : (stryCov_9fa48("24947"), 'Puntaje (%)'), stryMutAct_9fa48("24948") ? "" : (stryCov_9fa48("24948"), 'Correctas'), stryMutAct_9fa48("24949") ? "" : (stryCov_9fa48("24949"), 'Total'), stryMutAct_9fa48("24950") ? "" : (stryCov_9fa48("24950"), 'Puntaje PAES')]), ...data.attempts.map(stryMutAct_9fa48("24951") ? () => undefined : (stryCov_9fa48("24951"), attempt => stryMutAct_9fa48("24952") ? [] : (stryCov_9fa48("24952"), [new Date(attempt.createdAt).toLocaleDateString(stryMutAct_9fa48("24953") ? "" : (stryCov_9fa48("24953"), 'es-CL')), attempt.exam.titulo, attempt.exam.subject.nombre, attempt.estado, attempt.porcentaje, attempt.correctas, attempt.totalPreguntas, stryMutAct_9fa48("24956") ? attempt.puntajePaes && 'N/A' : stryMutAct_9fa48("24955") ? false : stryMutAct_9fa48("24954") ? true : (stryCov_9fa48("24954", "24955", "24956"), attempt.puntajePaes || (stryMutAct_9fa48("24957") ? "" : (stryCov_9fa48("24957"), 'N/A')))])))]);
        const attemptsSheet = XLSX.utils.aoa_to_sheet(attemptsData);
        attemptsSheet[stryMutAct_9fa48("24958") ? "" : (stryCov_9fa48("24958"), '!cols')] = stryMutAct_9fa48("24959") ? [] : (stryCov_9fa48("24959"), [stryMutAct_9fa48("24960") ? {} : (stryCov_9fa48("24960"), {
          wch: 12
        }), stryMutAct_9fa48("24961") ? {} : (stryCov_9fa48("24961"), {
          wch: 40
        }), stryMutAct_9fa48("24962") ? {} : (stryCov_9fa48("24962"), {
          wch: 25
        }), stryMutAct_9fa48("24963") ? {} : (stryCov_9fa48("24963"), {
          wch: 12
        }), stryMutAct_9fa48("24964") ? {} : (stryCov_9fa48("24964"), {
          wch: 12
        }), stryMutAct_9fa48("24965") ? {} : (stryCov_9fa48("24965"), {
          wch: 10
        }), stryMutAct_9fa48("24966") ? {} : (stryCov_9fa48("24966"), {
          wch: 10
        }), stryMutAct_9fa48("24967") ? {} : (stryCov_9fa48("24967"), {
          wch: 12
        })]);
        XLSX.utils.book_append_sheet(workbook, attemptsSheet, stryMutAct_9fa48("24968") ? "" : (stryCov_9fa48("24968"), 'Intentos'));
      }
    }

    // Hoja 3: Métricas por Asignatura
    if (stryMutAct_9fa48("24972") ? data.metrics.length <= 0 : stryMutAct_9fa48("24971") ? data.metrics.length >= 0 : stryMutAct_9fa48("24970") ? false : stryMutAct_9fa48("24969") ? true : (stryCov_9fa48("24969", "24970", "24971", "24972"), data.metrics.length > 0)) {
      if (stryMutAct_9fa48("24973")) {
        {}
      } else {
        stryCov_9fa48("24973");
        const metricsData = stryMutAct_9fa48("24974") ? [] : (stryCov_9fa48("24974"), [stryMutAct_9fa48("24975") ? [] : (stryCov_9fa48("24975"), [stryMutAct_9fa48("24976") ? "" : (stryCov_9fa48("24976"), 'Asignatura'), stryMutAct_9fa48("24977") ? "" : (stryCov_9fa48("24977"), 'Código'), stryMutAct_9fa48("24978") ? "" : (stryCov_9fa48("24978"), 'Puntaje (%)'), stryMutAct_9fa48("24979") ? "" : (stryCov_9fa48("24979"), 'Preguntas Correctas'), stryMutAct_9fa48("24980") ? "" : (stryCov_9fa48("24980"), 'Total Preguntas')]), ...data.metrics.map(stryMutAct_9fa48("24981") ? () => undefined : (stryCov_9fa48("24981"), metric => stryMutAct_9fa48("24982") ? [] : (stryCov_9fa48("24982"), [metric.nombre, metric.codigo, metric.porcentaje, metric.correctas, metric.totalPreguntas])))]);
        const metricsSheet = XLSX.utils.aoa_to_sheet(metricsData);
        metricsSheet[stryMutAct_9fa48("24983") ? "" : (stryCov_9fa48("24983"), '!cols')] = stryMutAct_9fa48("24984") ? [] : (stryCov_9fa48("24984"), [stryMutAct_9fa48("24985") ? {} : (stryCov_9fa48("24985"), {
          wch: 30
        }), stryMutAct_9fa48("24986") ? {} : (stryCov_9fa48("24986"), {
          wch: 10
        }), stryMutAct_9fa48("24987") ? {} : (stryCov_9fa48("24987"), {
          wch: 12
        }), stryMutAct_9fa48("24988") ? {} : (stryCov_9fa48("24988"), {
          wch: 15
        }), stryMutAct_9fa48("24989") ? {} : (stryCov_9fa48("24989"), {
          wch: 15
        })]);
        XLSX.utils.book_append_sheet(workbook, metricsSheet, stryMutAct_9fa48("24990") ? "" : (stryCov_9fa48("24990"), 'Métricas'));
      }
    }
    const excelBuffer = XLSX.write(workbook, stryMutAct_9fa48("24991") ? {} : (stryCov_9fa48("24991"), {
      bookType: stryMutAct_9fa48("24992") ? "" : (stryCov_9fa48("24992"), 'xlsx'),
      type: stryMutAct_9fa48("24993") ? "" : (stryCov_9fa48("24993"), 'array')
    }));
    const blob = new Blob(stryMutAct_9fa48("24994") ? [] : (stryCov_9fa48("24994"), [excelBuffer]), stryMutAct_9fa48("24995") ? {} : (stryCov_9fa48("24995"), {
      type: stryMutAct_9fa48("24996") ? "" : (stryCov_9fa48("24996"), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    }));
    saveAs(blob, stryMutAct_9fa48("24997") ? `` : (stryCov_9fa48("24997"), `Dashboard_${data.studentName.replace(stryMutAct_9fa48("24998") ? /[a-z0-9]/gi : (stryCov_9fa48("24998"), /[^a-z0-9]/gi), stryMutAct_9fa48("24999") ? "" : (stryCov_9fa48("24999"), '_'))}_${new Date().toISOString().split(stryMutAct_9fa48("25000") ? "" : (stryCov_9fa48("25000"), 'T'))[0]}.xlsx`));
  }
}