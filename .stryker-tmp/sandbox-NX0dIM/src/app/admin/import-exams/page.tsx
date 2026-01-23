// @ts-nocheck
'use client';

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
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Upload, CheckCircle2, XCircle, AlertCircle, Plus, Trash2, Search, ExternalLink, Key, BookOpen, Trash } from 'lucide-react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { toast } from 'sonner';
interface ExamToImport {
  pdfUrl: string;
  pdfFile: File | null;
  inputType: 'url' | 'file'; // Tipo de entrada: URL o archivo local
  subjectName: string;
  examTitle: string;
  examType: string;
  year: string;
}

/**
 * Interfaz para resultados de importación de exámenes
 */
interface ImportResult {
  success: boolean;
  examTitle: string;
  message: string;
  details?: string; // Solo presente cuando success es true
}
const SUBJECTS = stryMutAct_9fa48("472") ? [] : (stryCov_9fa48("472"), [stryMutAct_9fa48("473") ? "" : (stryCov_9fa48("473"), 'Competencia Lectora'), stryMutAct_9fa48("474") ? "" : (stryCov_9fa48("474"), 'Matemática M1'), stryMutAct_9fa48("475") ? "" : (stryCov_9fa48("475"), 'Matemática M2'), stryMutAct_9fa48("476") ? "" : (stryCov_9fa48("476"), 'Ciencias - Biología'), stryMutAct_9fa48("477") ? "" : (stryCov_9fa48("477"), 'Ciencias - Física'), stryMutAct_9fa48("478") ? "" : (stryCov_9fa48("478"), 'Ciencias - Química'), stryMutAct_9fa48("479") ? "" : (stryCov_9fa48("479"), 'Historia y Ciencias Sociales')]);
const EXAM_TYPES = stryMutAct_9fa48("480") ? [] : (stryCov_9fa48("480"), [stryMutAct_9fa48("481") ? {} : (stryCov_9fa48("481"), {
  value: stryMutAct_9fa48("482") ? "" : (stryCov_9fa48("482"), 'oficial'),
  label: stryMutAct_9fa48("483") ? "" : (stryCov_9fa48("483"), 'Oficial')
}), stryMutAct_9fa48("484") ? {} : (stryCov_9fa48("484"), {
  value: stryMutAct_9fa48("485") ? "" : (stryCov_9fa48("485"), 'simulacro'),
  label: stryMutAct_9fa48("486") ? "" : (stryCov_9fa48("486"), 'Simulacro')
}), stryMutAct_9fa48("487") ? {} : (stryCov_9fa48("487"), {
  value: stryMutAct_9fa48("488") ? "" : (stryCov_9fa48("488"), 'practica'),
  label: stryMutAct_9fa48("489") ? "" : (stryCov_9fa48("489"), 'Práctica')
})]);
export default function ImportExamsPage() {
  if (stryMutAct_9fa48("490")) {
    {}
  } else {
    stryCov_9fa48("490");
    const [exams, setExams] = useState<ExamToImport[]>(stryMutAct_9fa48("491") ? [] : (stryCov_9fa48("491"), [stryMutAct_9fa48("492") ? {} : (stryCov_9fa48("492"), {
      pdfUrl: stryMutAct_9fa48("493") ? "Stryker was here!" : (stryCov_9fa48("493"), ''),
      pdfFile: null,
      inputType: stryMutAct_9fa48("494") ? "" : (stryCov_9fa48("494"), 'url'),
      // Por defecto usar URL
      subjectName: stryMutAct_9fa48("495") ? "Stryker was here!" : (stryCov_9fa48("495"), ''),
      examTitle: stryMutAct_9fa48("496") ? "Stryker was here!" : (stryCov_9fa48("496"), ''),
      examType: stryMutAct_9fa48("497") ? "" : (stryCov_9fa48("497"), 'oficial'),
      year: new Date().getFullYear().toString()
    })]));
    const [loading, setLoading] = useState(stryMutAct_9fa48("498") ? true : (stryCov_9fa48("498"), false));
    const [fetchingPDFs, setFetchingPDFs] = useState(stryMutAct_9fa48("499") ? true : (stryCov_9fa48("499"), false));
    const [demreUrl, setDemreUrl] = useState(stryMutAct_9fa48("500") ? "" : (stryCov_9fa48("500"), 'https://demre.cl/publicaciones/2026/pruebas-oficiales-paes-regular-p2026'));
    const [availablePDFs, setAvailablePDFs] = useState<Array<{
      url: string;
      title: string;
      subject?: string;
      year?: string;
    }>>(stryMutAct_9fa48("501") ? ["Stryker was here"] : (stryCov_9fa48("501"), []));
    const [searchError, setSearchError] = useState<string | null>(null);
    const [results, setResults] = useState<Array<{
      success: boolean;
      examTitle: string;
      message: string;
      details?: string;
    }>>(stryMutAct_9fa48("502") ? ["Stryker was here"] : (stryCov_9fa48("502"), []));
    const addExam = () => {
      if (stryMutAct_9fa48("503")) {
        {}
      } else {
        stryCov_9fa48("503");
        setExams(stryMutAct_9fa48("504") ? [] : (stryCov_9fa48("504"), [...exams, stryMutAct_9fa48("505") ? {} : (stryCov_9fa48("505"), {
          pdfUrl: stryMutAct_9fa48("506") ? "Stryker was here!" : (stryCov_9fa48("506"), ''),
          pdfFile: null,
          inputType: stryMutAct_9fa48("507") ? "" : (stryCov_9fa48("507"), 'url'),
          subjectName: stryMutAct_9fa48("508") ? "Stryker was here!" : (stryCov_9fa48("508"), ''),
          examTitle: stryMutAct_9fa48("509") ? "Stryker was here!" : (stryCov_9fa48("509"), ''),
          examType: stryMutAct_9fa48("510") ? "" : (stryCov_9fa48("510"), 'oficial'),
          year: new Date().getFullYear().toString()
        })]));
      }
    };
    const removeExam = (index: number) => {
      if (stryMutAct_9fa48("511")) {
        {}
      } else {
        stryCov_9fa48("511");
        setExams(stryMutAct_9fa48("512") ? exams : (stryCov_9fa48("512"), exams.filter(stryMutAct_9fa48("513") ? () => undefined : (stryCov_9fa48("513"), (_, i) => stryMutAct_9fa48("516") ? i === index : stryMutAct_9fa48("515") ? false : stryMutAct_9fa48("514") ? true : (stryCov_9fa48("514", "515", "516"), i !== index)))));
      }
    };
    const updateExam = (index: number, field: keyof ExamToImport, value: string) => {
      if (stryMutAct_9fa48("517")) {
        {}
      } else {
        stryCov_9fa48("517");
        const updated = stryMutAct_9fa48("518") ? [] : (stryCov_9fa48("518"), [...exams]);
        const currentExam = updated[index];
        // Asegurar que todos los campos siempre tengan valores definidos
        updated[index] = stryMutAct_9fa48("519") ? {} : (stryCov_9fa48("519"), {
          pdfUrl: (stryMutAct_9fa48("522") ? field !== 'pdfUrl' : stryMutAct_9fa48("521") ? false : stryMutAct_9fa48("520") ? true : (stryCov_9fa48("520", "521", "522"), field === (stryMutAct_9fa48("523") ? "" : (stryCov_9fa48("523"), 'pdfUrl')))) ? stryMutAct_9fa48("526") ? value && '' : stryMutAct_9fa48("525") ? false : stryMutAct_9fa48("524") ? true : (stryCov_9fa48("524", "525", "526"), value || (stryMutAct_9fa48("527") ? "Stryker was here!" : (stryCov_9fa48("527"), ''))) : stryMutAct_9fa48("530") ? currentExam?.pdfUrl && '' : stryMutAct_9fa48("529") ? false : stryMutAct_9fa48("528") ? true : (stryCov_9fa48("528", "529", "530"), (stryMutAct_9fa48("531") ? currentExam.pdfUrl : (stryCov_9fa48("531"), currentExam?.pdfUrl)) || (stryMutAct_9fa48("532") ? "Stryker was here!" : (stryCov_9fa48("532"), ''))),
          pdfFile: stryMutAct_9fa48("535") ? currentExam?.pdfFile && null : stryMutAct_9fa48("534") ? false : stryMutAct_9fa48("533") ? true : (stryCov_9fa48("533", "534", "535"), (stryMutAct_9fa48("536") ? currentExam.pdfFile : (stryCov_9fa48("536"), currentExam?.pdfFile)) || null),
          inputType: stryMutAct_9fa48("539") ? currentExam?.inputType && 'url' : stryMutAct_9fa48("538") ? false : stryMutAct_9fa48("537") ? true : (stryCov_9fa48("537", "538", "539"), (stryMutAct_9fa48("540") ? currentExam.inputType : (stryCov_9fa48("540"), currentExam?.inputType)) || (stryMutAct_9fa48("541") ? "" : (stryCov_9fa48("541"), 'url'))),
          subjectName: (stryMutAct_9fa48("544") ? field !== 'subjectName' : stryMutAct_9fa48("543") ? false : stryMutAct_9fa48("542") ? true : (stryCov_9fa48("542", "543", "544"), field === (stryMutAct_9fa48("545") ? "" : (stryCov_9fa48("545"), 'subjectName')))) ? stryMutAct_9fa48("548") ? value && '' : stryMutAct_9fa48("547") ? false : stryMutAct_9fa48("546") ? true : (stryCov_9fa48("546", "547", "548"), value || (stryMutAct_9fa48("549") ? "Stryker was here!" : (stryCov_9fa48("549"), ''))) : stryMutAct_9fa48("552") ? currentExam?.subjectName && '' : stryMutAct_9fa48("551") ? false : stryMutAct_9fa48("550") ? true : (stryCov_9fa48("550", "551", "552"), (stryMutAct_9fa48("553") ? currentExam.subjectName : (stryCov_9fa48("553"), currentExam?.subjectName)) || (stryMutAct_9fa48("554") ? "Stryker was here!" : (stryCov_9fa48("554"), ''))),
          examTitle: (stryMutAct_9fa48("557") ? field !== 'examTitle' : stryMutAct_9fa48("556") ? false : stryMutAct_9fa48("555") ? true : (stryCov_9fa48("555", "556", "557"), field === (stryMutAct_9fa48("558") ? "" : (stryCov_9fa48("558"), 'examTitle')))) ? stryMutAct_9fa48("561") ? value && '' : stryMutAct_9fa48("560") ? false : stryMutAct_9fa48("559") ? true : (stryCov_9fa48("559", "560", "561"), value || (stryMutAct_9fa48("562") ? "Stryker was here!" : (stryCov_9fa48("562"), ''))) : stryMutAct_9fa48("565") ? currentExam?.examTitle && '' : stryMutAct_9fa48("564") ? false : stryMutAct_9fa48("563") ? true : (stryCov_9fa48("563", "564", "565"), (stryMutAct_9fa48("566") ? currentExam.examTitle : (stryCov_9fa48("566"), currentExam?.examTitle)) || (stryMutAct_9fa48("567") ? "Stryker was here!" : (stryCov_9fa48("567"), ''))),
          examType: (stryMutAct_9fa48("570") ? field !== 'examType' : stryMutAct_9fa48("569") ? false : stryMutAct_9fa48("568") ? true : (stryCov_9fa48("568", "569", "570"), field === (stryMutAct_9fa48("571") ? "" : (stryCov_9fa48("571"), 'examType')))) ? stryMutAct_9fa48("574") ? value && 'oficial' : stryMutAct_9fa48("573") ? false : stryMutAct_9fa48("572") ? true : (stryCov_9fa48("572", "573", "574"), value || (stryMutAct_9fa48("575") ? "" : (stryCov_9fa48("575"), 'oficial'))) : stryMutAct_9fa48("578") ? currentExam?.examType && 'oficial' : stryMutAct_9fa48("577") ? false : stryMutAct_9fa48("576") ? true : (stryCov_9fa48("576", "577", "578"), (stryMutAct_9fa48("579") ? currentExam.examType : (stryCov_9fa48("579"), currentExam?.examType)) || (stryMutAct_9fa48("580") ? "" : (stryCov_9fa48("580"), 'oficial'))),
          year: (stryMutAct_9fa48("583") ? field !== 'year' : stryMutAct_9fa48("582") ? false : stryMutAct_9fa48("581") ? true : (stryCov_9fa48("581", "582", "583"), field === (stryMutAct_9fa48("584") ? "" : (stryCov_9fa48("584"), 'year')))) ? stryMutAct_9fa48("587") ? value && '' : stryMutAct_9fa48("586") ? false : stryMutAct_9fa48("585") ? true : (stryCov_9fa48("585", "586", "587"), value || (stryMutAct_9fa48("588") ? "Stryker was here!" : (stryCov_9fa48("588"), ''))) : stryMutAct_9fa48("591") ? currentExam?.year && '' : stryMutAct_9fa48("590") ? false : stryMutAct_9fa48("589") ? true : (stryCov_9fa48("589", "590", "591"), (stryMutAct_9fa48("592") ? currentExam.year : (stryCov_9fa48("592"), currentExam?.year)) || (stryMutAct_9fa48("593") ? "Stryker was here!" : (stryCov_9fa48("593"), '')))
        });

        // Auto-generar título si está vacío
        if (stryMutAct_9fa48("596") ? (field === 'subjectName' || field === 'year') && field === 'examType' : stryMutAct_9fa48("595") ? false : stryMutAct_9fa48("594") ? true : (stryCov_9fa48("594", "595", "596"), (stryMutAct_9fa48("598") ? field === 'subjectName' && field === 'year' : stryMutAct_9fa48("597") ? false : (stryCov_9fa48("597", "598"), (stryMutAct_9fa48("600") ? field !== 'subjectName' : stryMutAct_9fa48("599") ? false : (stryCov_9fa48("599", "600"), field === (stryMutAct_9fa48("601") ? "" : (stryCov_9fa48("601"), 'subjectName')))) || (stryMutAct_9fa48("603") ? field !== 'year' : stryMutAct_9fa48("602") ? false : (stryCov_9fa48("602", "603"), field === (stryMutAct_9fa48("604") ? "" : (stryCov_9fa48("604"), 'year')))))) || (stryMutAct_9fa48("606") ? field !== 'examType' : stryMutAct_9fa48("605") ? false : (stryCov_9fa48("605", "606"), field === (stryMutAct_9fa48("607") ? "" : (stryCov_9fa48("607"), 'examType')))))) {
          if (stryMutAct_9fa48("608")) {
            {}
          } else {
            stryCov_9fa48("608");
            if (stryMutAct_9fa48("611") ? updated[index].subjectName || updated[index].year : stryMutAct_9fa48("610") ? false : stryMutAct_9fa48("609") ? true : (stryCov_9fa48("609", "610", "611"), updated[index].subjectName && updated[index].year)) {
              if (stryMutAct_9fa48("612")) {
                {}
              } else {
                stryCov_9fa48("612");
                const typeLabel = stryMutAct_9fa48("615") ? EXAM_TYPES.find(t => t.value === updated[index].examType)?.label && 'Examen' : stryMutAct_9fa48("614") ? false : stryMutAct_9fa48("613") ? true : (stryCov_9fa48("613", "614", "615"), (stryMutAct_9fa48("616") ? EXAM_TYPES.find(t => t.value === updated[index].examType).label : (stryCov_9fa48("616"), EXAM_TYPES.find(stryMutAct_9fa48("617") ? () => undefined : (stryCov_9fa48("617"), t => stryMutAct_9fa48("620") ? t.value !== updated[index].examType : stryMutAct_9fa48("619") ? false : stryMutAct_9fa48("618") ? true : (stryCov_9fa48("618", "619", "620"), t.value === updated[index].examType)))?.label)) || (stryMutAct_9fa48("621") ? "" : (stryCov_9fa48("621"), 'Examen')));
                updated[index].examTitle = stryMutAct_9fa48("622") ? `` : (stryCov_9fa48("622"), `PAES ${updated[index].year} - ${updated[index].subjectName} (${typeLabel})`);
              }
            }
          }
        }
        setExams(updated);
      }
    };
    const handleImport = async () => {
      if (stryMutAct_9fa48("623")) {
        {}
      } else {
        stryCov_9fa48("623");
        // Validar
        const errors: string[] = stryMutAct_9fa48("624") ? ["Stryker was here"] : (stryCov_9fa48("624"), []);
        exams.forEach((exam, index) => {
          if (stryMutAct_9fa48("625")) {
            {}
          } else {
            stryCov_9fa48("625");
            if (stryMutAct_9fa48("628") ? exam.inputType !== 'url' : stryMutAct_9fa48("627") ? false : stryMutAct_9fa48("626") ? true : (stryCov_9fa48("626", "627", "628"), exam.inputType === (stryMutAct_9fa48("629") ? "" : (stryCov_9fa48("629"), 'url')))) {
              if (stryMutAct_9fa48("630")) {
                {}
              } else {
                stryCov_9fa48("630");
                if (stryMutAct_9fa48("633") ? false : stryMutAct_9fa48("632") ? true : stryMutAct_9fa48("631") ? exam.pdfUrl : (stryCov_9fa48("631", "632", "633"), !exam.pdfUrl)) {
                  if (stryMutAct_9fa48("634")) {
                    {}
                  } else {
                    stryCov_9fa48("634");
                    errors.push(stryMutAct_9fa48("635") ? `` : (stryCov_9fa48("635"), `Examen ${stryMutAct_9fa48("636") ? index - 1 : (stryCov_9fa48("636"), index + 1)}: URL del PDF requerida`));
                  }
                } else {
                  if (stryMutAct_9fa48("637")) {
                    {}
                  } else {
                    stryCov_9fa48("637");
                    // Validar formato de URL
                    try {
                      if (stryMutAct_9fa48("638")) {
                        {}
                      } else {
                        stryCov_9fa48("638");
                        new URL(exam.pdfUrl);
                      }
                    } catch {
                      if (stryMutAct_9fa48("639")) {
                        {}
                      } else {
                        stryCov_9fa48("639");
                        errors.push(stryMutAct_9fa48("640") ? `` : (stryCov_9fa48("640"), `Examen ${stryMutAct_9fa48("641") ? index - 1 : (stryCov_9fa48("641"), index + 1)}: URL del PDF inválida`));
                      }
                    }
                  }
                }
              }
            } else {
              if (stryMutAct_9fa48("642")) {
                {}
              } else {
                stryCov_9fa48("642");
                if (stryMutAct_9fa48("645") ? false : stryMutAct_9fa48("644") ? true : stryMutAct_9fa48("643") ? exam.pdfFile : (stryCov_9fa48("643", "644", "645"), !exam.pdfFile)) {
                  if (stryMutAct_9fa48("646")) {
                    {}
                  } else {
                    stryCov_9fa48("646");
                    errors.push(stryMutAct_9fa48("647") ? `` : (stryCov_9fa48("647"), `Examen ${stryMutAct_9fa48("648") ? index - 1 : (stryCov_9fa48("648"), index + 1)}: Archivo PDF requerido`));
                  }
                } else if (stryMutAct_9fa48("651") ? exam.pdfFile.type === 'application/pdf' : stryMutAct_9fa48("650") ? false : stryMutAct_9fa48("649") ? true : (stryCov_9fa48("649", "650", "651"), exam.pdfFile.type !== (stryMutAct_9fa48("652") ? "" : (stryCov_9fa48("652"), 'application/pdf')))) {
                  if (stryMutAct_9fa48("653")) {
                    {}
                  } else {
                    stryCov_9fa48("653");
                    errors.push(stryMutAct_9fa48("654") ? `` : (stryCov_9fa48("654"), `Examen ${stryMutAct_9fa48("655") ? index - 1 : (stryCov_9fa48("655"), index + 1)}: El archivo debe ser un PDF`));
                  }
                }
              }
            }
            if (stryMutAct_9fa48("658") ? false : stryMutAct_9fa48("657") ? true : stryMutAct_9fa48("656") ? exam.subjectName : (stryCov_9fa48("656", "657", "658"), !exam.subjectName)) errors.push(stryMutAct_9fa48("659") ? `` : (stryCov_9fa48("659"), `Examen ${stryMutAct_9fa48("660") ? index - 1 : (stryCov_9fa48("660"), index + 1)}: Asignatura requerida`));
            if (stryMutAct_9fa48("663") ? false : stryMutAct_9fa48("662") ? true : stryMutAct_9fa48("661") ? exam.examTitle : (stryCov_9fa48("661", "662", "663"), !exam.examTitle)) errors.push(stryMutAct_9fa48("664") ? `` : (stryCov_9fa48("664"), `Examen ${stryMutAct_9fa48("665") ? index - 1 : (stryCov_9fa48("665"), index + 1)}: Título requerido`));
            if (stryMutAct_9fa48("668") ? false : stryMutAct_9fa48("667") ? true : stryMutAct_9fa48("666") ? exam.year : (stryCov_9fa48("666", "667", "668"), !exam.year)) {
              if (stryMutAct_9fa48("669")) {
                {}
              } else {
                stryCov_9fa48("669");
                errors.push(stryMutAct_9fa48("670") ? `` : (stryCov_9fa48("670"), `Examen ${stryMutAct_9fa48("671") ? index - 1 : (stryCov_9fa48("671"), index + 1)}: Año requerido`));
              }
            } else {
              if (stryMutAct_9fa48("672")) {
                {}
              } else {
                stryCov_9fa48("672");
                // Validar que el año sea numérico y razonable
                const year = parseInt(exam.year);
                if (stryMutAct_9fa48("675") ? (isNaN(year) || year < 2000) && year > 2100 : stryMutAct_9fa48("674") ? false : stryMutAct_9fa48("673") ? true : (stryCov_9fa48("673", "674", "675"), (stryMutAct_9fa48("677") ? isNaN(year) && year < 2000 : stryMutAct_9fa48("676") ? false : (stryCov_9fa48("676", "677"), isNaN(year) || (stryMutAct_9fa48("680") ? year >= 2000 : stryMutAct_9fa48("679") ? year <= 2000 : stryMutAct_9fa48("678") ? false : (stryCov_9fa48("678", "679", "680"), year < 2000)))) || (stryMutAct_9fa48("683") ? year <= 2100 : stryMutAct_9fa48("682") ? year >= 2100 : stryMutAct_9fa48("681") ? false : (stryCov_9fa48("681", "682", "683"), year > 2100)))) {
                  if (stryMutAct_9fa48("684")) {
                    {}
                  } else {
                    stryCov_9fa48("684");
                    errors.push(stryMutAct_9fa48("685") ? `` : (stryCov_9fa48("685"), `Examen ${stryMutAct_9fa48("686") ? index - 1 : (stryCov_9fa48("686"), index + 1)}: Año inválido (debe ser entre 2000 y 2100)`));
                  }
                }
              }
            }
          }
        });
        if (stryMutAct_9fa48("690") ? errors.length <= 0 : stryMutAct_9fa48("689") ? errors.length >= 0 : stryMutAct_9fa48("688") ? false : stryMutAct_9fa48("687") ? true : (stryCov_9fa48("687", "688", "689", "690"), errors.length > 0)) {
          if (stryMutAct_9fa48("691")) {
            {}
          } else {
            stryCov_9fa48("691");
            setResults(stryMutAct_9fa48("692") ? [] : (stryCov_9fa48("692"), [stryMutAct_9fa48("693") ? {} : (stryCov_9fa48("693"), {
              success: stryMutAct_9fa48("694") ? true : (stryCov_9fa48("694"), false),
              examTitle: stryMutAct_9fa48("695") ? "" : (stryCov_9fa48("695"), 'Validación'),
              message: stryMutAct_9fa48("696") ? "" : (stryCov_9fa48("696"), 'Por favor completa todos los campos correctamente'),
              details: errors.join(stryMutAct_9fa48("697") ? "" : (stryCov_9fa48("697"), '\n'))
            })]));
            return;
          }
        }
        setLoading(stryMutAct_9fa48("698") ? false : (stryCov_9fa48("698"), true));
        setResults(stryMutAct_9fa48("699") ? ["Stryker was here"] : (stryCov_9fa48("699"), []));
        try {
          if (stryMutAct_9fa48("700")) {
            {}
          } else {
            stryCov_9fa48("700");
            // Mostrar progreso inicial
            toast.loading(stryMutAct_9fa48("701") ? `` : (stryCov_9fa48("701"), `Iniciando importación de ${exams.length} examen(es)...`), stryMutAct_9fa48("702") ? {} : (stryCov_9fa48("702"), {
              id: stryMutAct_9fa48("703") ? "" : (stryCov_9fa48("703"), 'import-progress')
            }));

            // Verificar si hay archivos para subir
            const hasFiles = stryMutAct_9fa48("704") ? exams.every(exam => exam.inputType === 'file' && exam.pdfFile) : (stryCov_9fa48("704"), exams.some(stryMutAct_9fa48("705") ? () => undefined : (stryCov_9fa48("705"), exam => stryMutAct_9fa48("708") ? exam.inputType === 'file' || exam.pdfFile : stryMutAct_9fa48("707") ? false : stryMutAct_9fa48("706") ? true : (stryCov_9fa48("706", "707", "708"), (stryMutAct_9fa48("710") ? exam.inputType !== 'file' : stryMutAct_9fa48("709") ? true : (stryCov_9fa48("709", "710"), exam.inputType === (stryMutAct_9fa48("711") ? "" : (stryCov_9fa48("711"), 'file')))) && exam.pdfFile))));
            if (stryMutAct_9fa48("713") ? false : stryMutAct_9fa48("712") ? true : (stryCov_9fa48("712", "713"), hasFiles)) {
              if (stryMutAct_9fa48("714")) {
                {}
              } else {
                stryCov_9fa48("714");
                // Usar FormData para enviar archivos
                const formData = new FormData();
                exams.forEach((exam, index) => {
                  if (stryMutAct_9fa48("715")) {
                    {}
                  } else {
                    stryCov_9fa48("715");
                    formData.append(stryMutAct_9fa48("716") ? `` : (stryCov_9fa48("716"), `exams[${index}][inputType]`), exam.inputType);
                    if (stryMutAct_9fa48("719") ? exam.inputType !== 'url' : stryMutAct_9fa48("718") ? false : stryMutAct_9fa48("717") ? true : (stryCov_9fa48("717", "718", "719"), exam.inputType === (stryMutAct_9fa48("720") ? "" : (stryCov_9fa48("720"), 'url')))) {
                      if (stryMutAct_9fa48("721")) {
                        {}
                      } else {
                        stryCov_9fa48("721");
                        formData.append(stryMutAct_9fa48("722") ? `` : (stryCov_9fa48("722"), `exams[${index}][pdfUrl]`), exam.pdfUrl);
                      }
                    } else if (stryMutAct_9fa48("724") ? false : stryMutAct_9fa48("723") ? true : (stryCov_9fa48("723", "724"), exam.pdfFile)) {
                      if (stryMutAct_9fa48("725")) {
                        {}
                      } else {
                        stryCov_9fa48("725");
                        formData.append(stryMutAct_9fa48("726") ? `` : (stryCov_9fa48("726"), `exams[${index}][pdfFile]`), exam.pdfFile);
                      }
                    }
                    formData.append(stryMutAct_9fa48("727") ? `` : (stryCov_9fa48("727"), `exams[${index}][subjectName]`), exam.subjectName);
                    formData.append(stryMutAct_9fa48("728") ? `` : (stryCov_9fa48("728"), `exams[${index}][examTitle]`), exam.examTitle);
                    formData.append(stryMutAct_9fa48("729") ? `` : (stryCov_9fa48("729"), `exams[${index}][examType]`), exam.examType);
                    formData.append(stryMutAct_9fa48("730") ? `` : (stryCov_9fa48("730"), `exams[${index}][year]`), exam.year);
                  }
                });
                const response = await fetch(stryMutAct_9fa48("731") ? "" : (stryCov_9fa48("731"), '/api/admin/import-exams'), stryMutAct_9fa48("732") ? {} : (stryCov_9fa48("732"), {
                  method: stryMutAct_9fa48("733") ? "" : (stryCov_9fa48("733"), 'POST'),
                  body: formData
                }));
                const data = await response.json();
                if (stryMutAct_9fa48("736") ? false : stryMutAct_9fa48("735") ? true : stryMutAct_9fa48("734") ? response.ok : (stryCov_9fa48("734", "735", "736"), !response.ok)) {
                  if (stryMutAct_9fa48("737")) {
                    {}
                  } else {
                    stryCov_9fa48("737");
                    let errorMessage = stryMutAct_9fa48("740") ? data.error && 'Error al importar exámenes' : stryMutAct_9fa48("739") ? false : stryMutAct_9fa48("738") ? true : (stryCov_9fa48("738", "739", "740"), data.error || (stryMutAct_9fa48("741") ? "" : (stryCov_9fa48("741"), 'Error al importar exámenes')));
                    if (stryMutAct_9fa48("744") ? response.status !== 401 : stryMutAct_9fa48("743") ? false : stryMutAct_9fa48("742") ? true : (stryCov_9fa48("742", "743", "744"), response.status === 401)) {
                      if (stryMutAct_9fa48("745")) {
                        {}
                      } else {
                        stryCov_9fa48("745");
                        errorMessage = stryMutAct_9fa48("746") ? "" : (stryCov_9fa48("746"), 'No tienes permiso para importar exámenes. Debes ser administrador.');
                      }
                    } else if (stryMutAct_9fa48("749") ? response.status !== 400 : stryMutAct_9fa48("748") ? false : stryMutAct_9fa48("747") ? true : (stryCov_9fa48("747", "748", "749"), response.status === 400)) {
                      if (stryMutAct_9fa48("750")) {
                        {}
                      } else {
                        stryCov_9fa48("750");
                        errorMessage = stryMutAct_9fa48("753") ? data.error && 'Los datos enviados son inválidos. Verifica el formato de los exámenes.' : stryMutAct_9fa48("752") ? false : stryMutAct_9fa48("751") ? true : (stryCov_9fa48("751", "752", "753"), data.error || (stryMutAct_9fa48("754") ? "" : (stryCov_9fa48("754"), 'Los datos enviados son inválidos. Verifica el formato de los exámenes.')));
                      }
                    } else if (stryMutAct_9fa48("758") ? response.status < 500 : stryMutAct_9fa48("757") ? response.status > 500 : stryMutAct_9fa48("756") ? false : stryMutAct_9fa48("755") ? true : (stryCov_9fa48("755", "756", "757", "758"), response.status >= 500)) {
                      if (stryMutAct_9fa48("759")) {
                        {}
                      } else {
                        stryCov_9fa48("759");
                        errorMessage = stryMutAct_9fa48("760") ? "" : (stryCov_9fa48("760"), 'Error del servidor al procesar los exámenes. Por favor, intenta nuevamente más tarde.');
                      }
                    }
                    throw new Error(errorMessage);
                  }
                }
                const results = stryMutAct_9fa48("763") ? data.results && [] : stryMutAct_9fa48("762") ? false : stryMutAct_9fa48("761") ? true : (stryCov_9fa48("761", "762", "763"), data.results || (stryMutAct_9fa48("764") ? ["Stryker was here"] : (stryCov_9fa48("764"), [])));
                setResults(results);

                // Mostrar resumen con toast
                const successCount = stryMutAct_9fa48("765") ? results.length : (stryCov_9fa48("765"), results.filter(stryMutAct_9fa48("766") ? () => undefined : (stryCov_9fa48("766"), (r: ImportResult) => r.success)).length);
                const failCount = stryMutAct_9fa48("767") ? results.length + successCount : (stryCov_9fa48("767"), results.length - successCount);
                if (stryMutAct_9fa48("771") ? successCount <= 0 : stryMutAct_9fa48("770") ? successCount >= 0 : stryMutAct_9fa48("769") ? false : stryMutAct_9fa48("768") ? true : (stryCov_9fa48("768", "769", "770", "771"), successCount > 0)) {
                  if (stryMutAct_9fa48("772")) {
                    {}
                  } else {
                    stryCov_9fa48("772");
                    toast.success(stryMutAct_9fa48("773") ? `` : (stryCov_9fa48("773"), `${successCount} examen(es) importado(s) correctamente`), stryMutAct_9fa48("774") ? {} : (stryCov_9fa48("774"), {
                      description: (stryMutAct_9fa48("778") ? failCount <= 0 : stryMutAct_9fa48("777") ? failCount >= 0 : stryMutAct_9fa48("776") ? false : stryMutAct_9fa48("775") ? true : (stryCov_9fa48("775", "776", "777", "778"), failCount > 0)) ? stryMutAct_9fa48("779") ? `` : (stryCov_9fa48("779"), `${failCount} examen(es) fallaron`) : undefined,
                      duration: 5000
                    }));
                  }
                }
                if (stryMutAct_9fa48("782") ? failCount > 0 || successCount === 0 : stryMutAct_9fa48("781") ? false : stryMutAct_9fa48("780") ? true : (stryCov_9fa48("780", "781", "782"), (stryMutAct_9fa48("785") ? failCount <= 0 : stryMutAct_9fa48("784") ? failCount >= 0 : stryMutAct_9fa48("783") ? true : (stryCov_9fa48("783", "784", "785"), failCount > 0)) && (stryMutAct_9fa48("787") ? successCount !== 0 : stryMutAct_9fa48("786") ? true : (stryCov_9fa48("786", "787"), successCount === 0)))) {
                  if (stryMutAct_9fa48("788")) {
                    {}
                  } else {
                    stryCov_9fa48("788");
                    toast.error(stryMutAct_9fa48("789") ? "" : (stryCov_9fa48("789"), 'Error al importar exámenes'), stryMutAct_9fa48("790") ? {} : (stryCov_9fa48("790"), {
                      description: stryMutAct_9fa48("791") ? "" : (stryCov_9fa48("791"), 'Ningún examen se pudo importar. Revisa los errores detallados abajo.'),
                      duration: 6000
                    }));
                  }
                }
              }
            } else {
              if (stryMutAct_9fa48("792")) {
                {}
              } else {
                stryCov_9fa48("792");
                // Solo URLs, usar JSON
                const response = await fetch(stryMutAct_9fa48("793") ? "" : (stryCov_9fa48("793"), '/api/admin/import-exams'), stryMutAct_9fa48("794") ? {} : (stryCov_9fa48("794"), {
                  method: stryMutAct_9fa48("795") ? "" : (stryCov_9fa48("795"), 'POST'),
                  headers: stryMutAct_9fa48("796") ? {} : (stryCov_9fa48("796"), {
                    'Content-Type': stryMutAct_9fa48("797") ? "" : (stryCov_9fa48("797"), 'application/json')
                  }),
                  body: JSON.stringify(stryMutAct_9fa48("798") ? {} : (stryCov_9fa48("798"), {
                    exams
                  }))
                }));
                const data = await response.json();
                if (stryMutAct_9fa48("801") ? false : stryMutAct_9fa48("800") ? true : stryMutAct_9fa48("799") ? response.ok : (stryCov_9fa48("799", "800", "801"), !response.ok)) {
                  if (stryMutAct_9fa48("802")) {
                    {}
                  } else {
                    stryCov_9fa48("802");
                    let errorMessage = stryMutAct_9fa48("805") ? data.error && 'Error al importar exámenes' : stryMutAct_9fa48("804") ? false : stryMutAct_9fa48("803") ? true : (stryCov_9fa48("803", "804", "805"), data.error || (stryMutAct_9fa48("806") ? "" : (stryCov_9fa48("806"), 'Error al importar exámenes')));
                    if (stryMutAct_9fa48("809") ? response.status !== 401 : stryMutAct_9fa48("808") ? false : stryMutAct_9fa48("807") ? true : (stryCov_9fa48("807", "808", "809"), response.status === 401)) {
                      if (stryMutAct_9fa48("810")) {
                        {}
                      } else {
                        stryCov_9fa48("810");
                        errorMessage = stryMutAct_9fa48("811") ? "" : (stryCov_9fa48("811"), 'No tienes permiso para importar exámenes. Debes ser administrador.');
                      }
                    } else if (stryMutAct_9fa48("814") ? response.status !== 400 : stryMutAct_9fa48("813") ? false : stryMutAct_9fa48("812") ? true : (stryCov_9fa48("812", "813", "814"), response.status === 400)) {
                      if (stryMutAct_9fa48("815")) {
                        {}
                      } else {
                        stryCov_9fa48("815");
                        errorMessage = stryMutAct_9fa48("818") ? data.error && 'Los datos enviados son inválidos. Verifica el formato de los exámenes.' : stryMutAct_9fa48("817") ? false : stryMutAct_9fa48("816") ? true : (stryCov_9fa48("816", "817", "818"), data.error || (stryMutAct_9fa48("819") ? "" : (stryCov_9fa48("819"), 'Los datos enviados son inválidos. Verifica el formato de los exámenes.')));
                      }
                    } else if (stryMutAct_9fa48("823") ? response.status < 500 : stryMutAct_9fa48("822") ? response.status > 500 : stryMutAct_9fa48("821") ? false : stryMutAct_9fa48("820") ? true : (stryCov_9fa48("820", "821", "822", "823"), response.status >= 500)) {
                      if (stryMutAct_9fa48("824")) {
                        {}
                      } else {
                        stryCov_9fa48("824");
                        errorMessage = stryMutAct_9fa48("825") ? "" : (stryCov_9fa48("825"), 'Error del servidor al procesar los exámenes. Por favor, intenta nuevamente más tarde.');
                      }
                    }
                    throw new Error(errorMessage);
                  }
                }
                const results = stryMutAct_9fa48("828") ? data.results && [] : stryMutAct_9fa48("827") ? false : stryMutAct_9fa48("826") ? true : (stryCov_9fa48("826", "827", "828"), data.results || (stryMutAct_9fa48("829") ? ["Stryker was here"] : (stryCov_9fa48("829"), [])));
                setResults(results);

                // Mostrar resumen con toast
                const successCount = stryMutAct_9fa48("830") ? results.length : (stryCov_9fa48("830"), results.filter(stryMutAct_9fa48("831") ? () => undefined : (stryCov_9fa48("831"), (r: ImportResult) => r.success)).length);
                const failCount = stryMutAct_9fa48("832") ? results.length + successCount : (stryCov_9fa48("832"), results.length - successCount);
                if (stryMutAct_9fa48("836") ? successCount <= 0 : stryMutAct_9fa48("835") ? successCount >= 0 : stryMutAct_9fa48("834") ? false : stryMutAct_9fa48("833") ? true : (stryCov_9fa48("833", "834", "835", "836"), successCount > 0)) {
                  if (stryMutAct_9fa48("837")) {
                    {}
                  } else {
                    stryCov_9fa48("837");
                    toast.success(stryMutAct_9fa48("838") ? `` : (stryCov_9fa48("838"), `${successCount} examen(es) importado(s) correctamente`), stryMutAct_9fa48("839") ? {} : (stryCov_9fa48("839"), {
                      description: (stryMutAct_9fa48("843") ? failCount <= 0 : stryMutAct_9fa48("842") ? failCount >= 0 : stryMutAct_9fa48("841") ? false : stryMutAct_9fa48("840") ? true : (stryCov_9fa48("840", "841", "842", "843"), failCount > 0)) ? stryMutAct_9fa48("844") ? `` : (stryCov_9fa48("844"), `${failCount} examen(es) fallaron`) : undefined,
                      duration: 5000
                    }));
                  }
                }
                if (stryMutAct_9fa48("847") ? failCount > 0 || successCount === 0 : stryMutAct_9fa48("846") ? false : stryMutAct_9fa48("845") ? true : (stryCov_9fa48("845", "846", "847"), (stryMutAct_9fa48("850") ? failCount <= 0 : stryMutAct_9fa48("849") ? failCount >= 0 : stryMutAct_9fa48("848") ? true : (stryCov_9fa48("848", "849", "850"), failCount > 0)) && (stryMutAct_9fa48("852") ? successCount !== 0 : stryMutAct_9fa48("851") ? true : (stryCov_9fa48("851", "852"), successCount === 0)))) {
                  if (stryMutAct_9fa48("853")) {
                    {}
                  } else {
                    stryCov_9fa48("853");
                    toast.error(stryMutAct_9fa48("854") ? "" : (stryCov_9fa48("854"), 'Error al importar exámenes'), stryMutAct_9fa48("855") ? {} : (stryCov_9fa48("855"), {
                      description: stryMutAct_9fa48("856") ? "" : (stryCov_9fa48("856"), 'Ningún examen se pudo importar. Revisa los errores detallados abajo.'),
                      duration: 6000
                    }));
                  }
                }
              }
            }
          }
        } catch (error) {
          if (stryMutAct_9fa48("857")) {
            {}
          } else {
            stryCov_9fa48("857");
            const errorInfo = extractErrorInfo(error);
            const structuredError = getErrorMessage(ERROR_CODES.DATA_IMPORT_FAILED, stryMutAct_9fa48("858") ? {} : (stryCov_9fa48("858"), {
              reason: errorInfo.message
            }));
            captureError(error instanceof Error ? error : new Error(String(error)), stryMutAct_9fa48("859") ? {} : (stryCov_9fa48("859"), {
              type: stryMutAct_9fa48("860") ? "" : (stryCov_9fa48("860"), 'exam_import_error'),
              path: (stryMutAct_9fa48("863") ? typeof window === 'undefined' : stryMutAct_9fa48("862") ? false : stryMutAct_9fa48("861") ? true : (stryCov_9fa48("861", "862", "863"), typeof window !== (stryMutAct_9fa48("864") ? "" : (stryCov_9fa48("864"), 'undefined')))) ? window.location.pathname : undefined
            }));
            toast.error(structuredError.title, stryMutAct_9fa48("865") ? {} : (stryCov_9fa48("865"), {
              description: stryMutAct_9fa48("866") ? `` : (stryCov_9fa48("866"), `${structuredError.description} ${structuredError.solution}`),
              duration: 6000
            }));
            setResults(stryMutAct_9fa48("867") ? [] : (stryCov_9fa48("867"), [stryMutAct_9fa48("868") ? {} : (stryCov_9fa48("868"), {
              success: stryMutAct_9fa48("869") ? true : (stryCov_9fa48("869"), false),
              examTitle: stryMutAct_9fa48("870") ? "" : (stryCov_9fa48("870"), 'Error'),
              message: structuredError.description
            })]));
          }
        } finally {
          if (stryMutAct_9fa48("871")) {
            {}
          } else {
            stryCov_9fa48("871");
            setLoading(stryMutAct_9fa48("872") ? true : (stryCov_9fa48("872"), false));
          }
        }
      }
    };
    const fetchPDFsFromDEMRE = async () => {
      if (stryMutAct_9fa48("873")) {
        {}
      } else {
        stryCov_9fa48("873");
        if (stryMutAct_9fa48("876") ? false : stryMutAct_9fa48("875") ? true : stryMutAct_9fa48("874") ? demreUrl : (stryCov_9fa48("874", "875", "876"), !demreUrl)) return;
        setFetchingPDFs(stryMutAct_9fa48("877") ? false : (stryCov_9fa48("877"), true));
        setAvailablePDFs(stryMutAct_9fa48("878") ? ["Stryker was here"] : (stryCov_9fa48("878"), []));
        setSearchError(null);
        try {
          if (stryMutAct_9fa48("879")) {
            {}
          } else {
            stryCov_9fa48("879");
            const response = await fetch(stryMutAct_9fa48("880") ? "" : (stryCov_9fa48("880"), '/api/admin/fetch-demre-pdfs'), stryMutAct_9fa48("881") ? {} : (stryCov_9fa48("881"), {
              method: stryMutAct_9fa48("882") ? "" : (stryCov_9fa48("882"), 'POST'),
              headers: stryMutAct_9fa48("883") ? {} : (stryCov_9fa48("883"), {
                'Content-Type': stryMutAct_9fa48("884") ? "" : (stryCov_9fa48("884"), 'application/json')
              }),
              body: JSON.stringify(stryMutAct_9fa48("885") ? {} : (stryCov_9fa48("885"), {
                url: demreUrl
              }))
            }));
            const data = await response.json();
            if (stryMutAct_9fa48("888") ? false : stryMutAct_9fa48("887") ? true : stryMutAct_9fa48("886") ? response.ok : (stryCov_9fa48("886", "887", "888"), !response.ok)) {
              if (stryMutAct_9fa48("889")) {
                {}
              } else {
                stryCov_9fa48("889");
                const errorMessage = stryMutAct_9fa48("892") ? (data.details || data.error) && 'Error al obtener PDFs' : stryMutAct_9fa48("891") ? false : stryMutAct_9fa48("890") ? true : (stryCov_9fa48("890", "891", "892"), (stryMutAct_9fa48("894") ? data.details && data.error : stryMutAct_9fa48("893") ? false : (stryCov_9fa48("893", "894"), data.details || data.error)) || (stryMutAct_9fa48("895") ? "" : (stryCov_9fa48("895"), 'Error al obtener PDFs')));
                setSearchError(errorMessage);
                setAvailablePDFs(stryMutAct_9fa48("896") ? ["Stryker was here"] : (stryCov_9fa48("896"), []));
                return;
              }
            }
            const pdfs = stryMutAct_9fa48("899") ? data.pdfs && [] : stryMutAct_9fa48("898") ? false : stryMutAct_9fa48("897") ? true : (stryCov_9fa48("897", "898", "899"), data.pdfs || (stryMutAct_9fa48("900") ? ["Stryker was here"] : (stryCov_9fa48("900"), [])));
            if (stryMutAct_9fa48("903") ? pdfs.length !== 0 : stryMutAct_9fa48("902") ? false : stryMutAct_9fa48("901") ? true : (stryCov_9fa48("901", "902", "903"), pdfs.length === 0)) {
              if (stryMutAct_9fa48("904")) {
                {}
              } else {
                stryCov_9fa48("904");
                setSearchError(stryMutAct_9fa48("905") ? "" : (stryCov_9fa48("905"), 'No se encontraron PDFs en esta página. Asegúrate de que la URL sea correcta y que la página contenga enlaces a archivos PDF.'));
                setAvailablePDFs(stryMutAct_9fa48("906") ? ["Stryker was here"] : (stryCov_9fa48("906"), []));
              }
            } else {
              if (stryMutAct_9fa48("907")) {
                {}
              } else {
                stryCov_9fa48("907");
                setAvailablePDFs(pdfs);
                setSearchError(null);
              }
            }
          }
        } catch (error) {
          if (stryMutAct_9fa48("908")) {
            {}
          } else {
            stryCov_9fa48("908");
            const errorMessage = error instanceof Error ? error.message : stryMutAct_9fa48("909") ? "" : (stryCov_9fa48("909"), 'Error de conexión. Verifica tu conexión a internet o que la URL sea accesible.');
            setSearchError(errorMessage);
            setAvailablePDFs(stryMutAct_9fa48("910") ? ["Stryker was here"] : (stryCov_9fa48("910"), []));
          }
        } finally {
          if (stryMutAct_9fa48("911")) {
            {}
          } else {
            stryCov_9fa48("911");
            setFetchingPDFs(stryMutAct_9fa48("912") ? true : (stryCov_9fa48("912"), false));
          }
        }
      }
    };
    const usePDF = (pdf: {
      url: string;
      title: string;
      subject?: string;
      year?: string;
    }) => {
      if (stryMutAct_9fa48("913")) {
        {}
      } else {
        stryCov_9fa48("913");
        // Agregar o actualizar el primer examen con los datos del PDF
        const updated = stryMutAct_9fa48("914") ? [] : (stryCov_9fa48("914"), [...exams]);
        updated[0] = stryMutAct_9fa48("915") ? {} : (stryCov_9fa48("915"), {
          pdfUrl: stryMutAct_9fa48("918") ? pdf.url && '' : stryMutAct_9fa48("917") ? false : stryMutAct_9fa48("916") ? true : (stryCov_9fa48("916", "917", "918"), pdf.url || (stryMutAct_9fa48("919") ? "Stryker was here!" : (stryCov_9fa48("919"), ''))),
          // Asegurar que siempre sea string
          pdfFile: null,
          inputType: stryMutAct_9fa48("920") ? "" : (stryCov_9fa48("920"), 'url'),
          subjectName: stryMutAct_9fa48("923") ? pdf.subject && '' : stryMutAct_9fa48("922") ? false : stryMutAct_9fa48("921") ? true : (stryCov_9fa48("921", "922", "923"), pdf.subject || (stryMutAct_9fa48("924") ? "Stryker was here!" : (stryCov_9fa48("924"), ''))),
          examTitle: stryMutAct_9fa48("927") ? pdf.title && `PAES ${pdf.year || new Date().getFullYear()} - Examen` : stryMutAct_9fa48("926") ? false : stryMutAct_9fa48("925") ? true : (stryCov_9fa48("925", "926", "927"), pdf.title || (stryMutAct_9fa48("928") ? `` : (stryCov_9fa48("928"), `PAES ${stryMutAct_9fa48("931") ? pdf.year && new Date().getFullYear() : stryMutAct_9fa48("930") ? false : stryMutAct_9fa48("929") ? true : (stryCov_9fa48("929", "930", "931"), pdf.year || new Date().getFullYear())} - Examen`))),
          examType: stryMutAct_9fa48("932") ? "" : (stryCov_9fa48("932"), 'oficial'),
          year: stryMutAct_9fa48("935") ? pdf.year && new Date().getFullYear().toString() : stryMutAct_9fa48("934") ? false : stryMutAct_9fa48("933") ? true : (stryCov_9fa48("933", "934", "935"), pdf.year || new Date().getFullYear().toString())
        });
        setExams(updated);
      }
    };
    const handleFileChange = (index: number, file: File | null) => {
      if (stryMutAct_9fa48("936")) {
        {}
      } else {
        stryCov_9fa48("936");
        const updated = stryMutAct_9fa48("937") ? [] : (stryCov_9fa48("937"), [...exams]);
        const currentExam = updated[index];
        updated[index] = stryMutAct_9fa48("938") ? {} : (stryCov_9fa48("938"), {
          pdfFile: file,
          pdfUrl: stryMutAct_9fa48("939") ? "Stryker was here!" : (stryCov_9fa48("939"), ''),
          // Limpiar URL si se selecciona archivo
          inputType: stryMutAct_9fa48("940") ? "" : (stryCov_9fa48("940"), 'file'),
          // Asegurar que todos los campos string siempre tengan valores definidos
          subjectName: stryMutAct_9fa48("943") ? currentExam?.subjectName && '' : stryMutAct_9fa48("942") ? false : stryMutAct_9fa48("941") ? true : (stryCov_9fa48("941", "942", "943"), (stryMutAct_9fa48("944") ? currentExam.subjectName : (stryCov_9fa48("944"), currentExam?.subjectName)) || (stryMutAct_9fa48("945") ? "Stryker was here!" : (stryCov_9fa48("945"), ''))),
          examTitle: stryMutAct_9fa48("948") ? currentExam?.examTitle && '' : stryMutAct_9fa48("947") ? false : stryMutAct_9fa48("946") ? true : (stryCov_9fa48("946", "947", "948"), (stryMutAct_9fa48("949") ? currentExam.examTitle : (stryCov_9fa48("949"), currentExam?.examTitle)) || (stryMutAct_9fa48("950") ? "Stryker was here!" : (stryCov_9fa48("950"), ''))),
          examType: stryMutAct_9fa48("953") ? currentExam?.examType && 'oficial' : stryMutAct_9fa48("952") ? false : stryMutAct_9fa48("951") ? true : (stryCov_9fa48("951", "952", "953"), (stryMutAct_9fa48("954") ? currentExam.examType : (stryCov_9fa48("954"), currentExam?.examType)) || (stryMutAct_9fa48("955") ? "" : (stryCov_9fa48("955"), 'oficial'))),
          year: stryMutAct_9fa48("958") ? currentExam?.year && '' : stryMutAct_9fa48("957") ? false : stryMutAct_9fa48("956") ? true : (stryCov_9fa48("956", "957", "958"), (stryMutAct_9fa48("959") ? currentExam.year : (stryCov_9fa48("959"), currentExam?.year)) || (stryMutAct_9fa48("960") ? "Stryker was here!" : (stryCov_9fa48("960"), '')))
        });
        setExams(updated);
      }
    };
    const handleInputTypeChange = (index: number, type: 'url' | 'file') => {
      if (stryMutAct_9fa48("961")) {
        {}
      } else {
        stryCov_9fa48("961");
        const updated = stryMutAct_9fa48("962") ? [] : (stryCov_9fa48("962"), [...exams]);
        const currentExam = updated[index];
        updated[index] = stryMutAct_9fa48("963") ? {} : (stryCov_9fa48("963"), {
          inputType: type,
          pdfUrl: (stryMutAct_9fa48("966") ? type !== 'url' : stryMutAct_9fa48("965") ? false : stryMutAct_9fa48("964") ? true : (stryCov_9fa48("964", "965", "966"), type === (stryMutAct_9fa48("967") ? "" : (stryCov_9fa48("967"), 'url')))) ? stryMutAct_9fa48("970") ? currentExam?.pdfUrl && '' : stryMutAct_9fa48("969") ? false : stryMutAct_9fa48("968") ? true : (stryCov_9fa48("968", "969", "970"), (stryMutAct_9fa48("971") ? currentExam.pdfUrl : (stryCov_9fa48("971"), currentExam?.pdfUrl)) || (stryMutAct_9fa48("972") ? "Stryker was here!" : (stryCov_9fa48("972"), ''))) : stryMutAct_9fa48("973") ? "Stryker was here!" : (stryCov_9fa48("973"), ''),
          pdfFile: (stryMutAct_9fa48("976") ? type !== 'file' : stryMutAct_9fa48("975") ? false : stryMutAct_9fa48("974") ? true : (stryCov_9fa48("974", "975", "976"), type === (stryMutAct_9fa48("977") ? "" : (stryCov_9fa48("977"), 'file')))) ? stryMutAct_9fa48("980") ? currentExam?.pdfFile && null : stryMutAct_9fa48("979") ? false : stryMutAct_9fa48("978") ? true : (stryCov_9fa48("978", "979", "980"), (stryMutAct_9fa48("981") ? currentExam.pdfFile : (stryCov_9fa48("981"), currentExam?.pdfFile)) || null) : null,
          // Asegurar que todos los campos string siempre tengan valores definidos
          subjectName: stryMutAct_9fa48("984") ? currentExam?.subjectName && '' : stryMutAct_9fa48("983") ? false : stryMutAct_9fa48("982") ? true : (stryCov_9fa48("982", "983", "984"), (stryMutAct_9fa48("985") ? currentExam.subjectName : (stryCov_9fa48("985"), currentExam?.subjectName)) || (stryMutAct_9fa48("986") ? "Stryker was here!" : (stryCov_9fa48("986"), ''))),
          examTitle: stryMutAct_9fa48("989") ? currentExam?.examTitle && '' : stryMutAct_9fa48("988") ? false : stryMutAct_9fa48("987") ? true : (stryCov_9fa48("987", "988", "989"), (stryMutAct_9fa48("990") ? currentExam.examTitle : (stryCov_9fa48("990"), currentExam?.examTitle)) || (stryMutAct_9fa48("991") ? "Stryker was here!" : (stryCov_9fa48("991"), ''))),
          examType: stryMutAct_9fa48("994") ? currentExam?.examType && 'oficial' : stryMutAct_9fa48("993") ? false : stryMutAct_9fa48("992") ? true : (stryCov_9fa48("992", "993", "994"), (stryMutAct_9fa48("995") ? currentExam.examType : (stryCov_9fa48("995"), currentExam?.examType)) || (stryMutAct_9fa48("996") ? "" : (stryCov_9fa48("996"), 'oficial'))),
          year: stryMutAct_9fa48("999") ? currentExam?.year && '' : stryMutAct_9fa48("998") ? false : stryMutAct_9fa48("997") ? true : (stryCov_9fa48("997", "998", "999"), (stryMutAct_9fa48("1000") ? currentExam.year : (stryCov_9fa48("1000"), currentExam?.year)) || (stryMutAct_9fa48("1001") ? "Stryker was here!" : (stryCov_9fa48("1001"), '')))
        });
        setExams(updated);
      }
    };
    const canImport = stryMutAct_9fa48("1002") ? exams.every(e => e.inputType === 'url' && e.pdfUrl && e.subjectName && e.examTitle && e.year || e.inputType === 'file' && e.pdfFile && e.subjectName && e.examTitle && e.year) : (stryCov_9fa48("1002"), exams.some(stryMutAct_9fa48("1003") ? () => undefined : (stryCov_9fa48("1003"), e => stryMutAct_9fa48("1006") ? e.inputType === 'url' && e.pdfUrl && e.subjectName && e.examTitle && e.year && e.inputType === 'file' && e.pdfFile && e.subjectName && e.examTitle && e.year : stryMutAct_9fa48("1005") ? false : stryMutAct_9fa48("1004") ? true : (stryCov_9fa48("1004", "1005", "1006"), (stryMutAct_9fa48("1008") ? e.inputType === 'url' && e.pdfUrl && e.subjectName && e.examTitle || e.year : stryMutAct_9fa48("1007") ? false : (stryCov_9fa48("1007", "1008"), (stryMutAct_9fa48("1010") ? e.inputType === 'url' && e.pdfUrl && e.subjectName || e.examTitle : stryMutAct_9fa48("1009") ? true : (stryCov_9fa48("1009", "1010"), (stryMutAct_9fa48("1012") ? e.inputType === 'url' && e.pdfUrl || e.subjectName : stryMutAct_9fa48("1011") ? true : (stryCov_9fa48("1011", "1012"), (stryMutAct_9fa48("1014") ? e.inputType === 'url' || e.pdfUrl : stryMutAct_9fa48("1013") ? true : (stryCov_9fa48("1013", "1014"), (stryMutAct_9fa48("1016") ? e.inputType !== 'url' : stryMutAct_9fa48("1015") ? true : (stryCov_9fa48("1015", "1016"), e.inputType === (stryMutAct_9fa48("1017") ? "" : (stryCov_9fa48("1017"), 'url')))) && e.pdfUrl)) && e.subjectName)) && e.examTitle)) && e.year)) || (stryMutAct_9fa48("1019") ? e.inputType === 'file' && e.pdfFile && e.subjectName && e.examTitle || e.year : stryMutAct_9fa48("1018") ? false : (stryCov_9fa48("1018", "1019"), (stryMutAct_9fa48("1021") ? e.inputType === 'file' && e.pdfFile && e.subjectName || e.examTitle : stryMutAct_9fa48("1020") ? true : (stryCov_9fa48("1020", "1021"), (stryMutAct_9fa48("1023") ? e.inputType === 'file' && e.pdfFile || e.subjectName : stryMutAct_9fa48("1022") ? true : (stryCov_9fa48("1022", "1023"), (stryMutAct_9fa48("1025") ? e.inputType === 'file' || e.pdfFile : stryMutAct_9fa48("1024") ? true : (stryCov_9fa48("1024", "1025"), (stryMutAct_9fa48("1027") ? e.inputType !== 'file' : stryMutAct_9fa48("1026") ? true : (stryCov_9fa48("1026", "1027"), e.inputType === (stryMutAct_9fa48("1028") ? "" : (stryCov_9fa48("1028"), 'file')))) && e.pdfFile)) && e.subjectName)) && e.examTitle)) && e.year))))));
    return <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <Breadcrumbs className="mb-4" />
        <h1 className="text-3xl font-bold mb-2">Importar Exámenes desde DEMRE</h1>
        <p className="text-muted-foreground">
          Importa exámenes reales desde el sitio web de DEMRE directamente a la base de datos
        </p>
        <Alert className="mt-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800 dark:text-blue-200">
            ℹ️ Importar Clavijero
          </AlertTitle>
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            <div className="space-y-2">
              <p>
                <strong>Los exámenes se importan sin respuestas correctas.</strong> Después de
                importar el examen, puedes importar el clavijero (PDF con respuestas correctas) para
                marcar automáticamente las respuestas.
              </p>
              <div className="flex gap-2 flex-wrap">
                <Link href="/admin/import-answer-key">
                  <Button variant="outline" size="sm" className="mt-2">
                    <Key className="mr-2 h-4 w-4" />
                    Importar Clavijero
                  </Button>
                </Link>
                <Link href="/admin/import-topics">
                  <Button variant="outline" size="sm" className="mt-2">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Importar Temarios
                  </Button>
                </Link>
                <Link href="/admin/cleanup-test-data">
                  <Button variant="outline" size="sm" className="mt-2">
                    <Trash className="mr-2 h-4 w-4" />
                    Limpiar Datos Ficticios
                  </Button>
                </Link>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🔍 Obtener PDFs Automáticamente desde DEMRE</CardTitle>
          <CardDescription>
            Ingresa la URL de la página de DEMRE y obtén automáticamente todos los PDFs disponibles.
            <strong className="block mt-1">
              Luego haz clic en un PDF para llenar automáticamente el formulario.
            </strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Label htmlFor="demre-url">URL de la página de DEMRE</Label>
              <Input id="demre-url" type="url" placeholder="https://demre.cl/publicaciones/2026/pruebas-oficiales-paes-regular-p2026" value={demreUrl} onChange={stryMutAct_9fa48("1029") ? () => undefined : (stryCov_9fa48("1029"), e => setDemreUrl(e.target.value))} />
            </div>
            <div className="flex items-end">
              <Button onClick={fetchPDFsFromDEMRE} disabled={stryMutAct_9fa48("1032") ? fetchingPDFs && !demreUrl : stryMutAct_9fa48("1031") ? false : stryMutAct_9fa48("1030") ? true : (stryCov_9fa48("1030", "1031", "1032"), fetchingPDFs || (stryMutAct_9fa48("1033") ? demreUrl : (stryCov_9fa48("1033"), !demreUrl)))}>
                {fetchingPDFs ? <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Buscando...
                  </> : <>
                    <Search className="h-4 w-4 mr-2" />
                    Buscar PDFs
                  </>}
              </Button>
            </div>
          </div>

          {stryMutAct_9fa48("1036") ? searchError || <Alert className="border-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error al buscar PDFs</AlertTitle>
              <AlertDescription>
                {searchError}
                <p className="mt-2 text-xs">
                  💡 <strong>Sugerencia:</strong> Puedes usar el método manual copiando directamente
                  la URL del PDF en el formulario de abajo.
                </p>
              </AlertDescription>
            </Alert> : stryMutAct_9fa48("1035") ? false : stryMutAct_9fa48("1034") ? true : (stryCov_9fa48("1034", "1035", "1036"), searchError && <Alert className="border-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error al buscar PDFs</AlertTitle>
              <AlertDescription>
                {searchError}
                <p className="mt-2 text-xs">
                  💡 <strong>Sugerencia:</strong> Puedes usar el método manual copiando directamente
                  la URL del PDF en el formulario de abajo.
                </p>
              </AlertDescription>
            </Alert>)}

          {stryMutAct_9fa48("1039") ? availablePDFs.length > 0 || <div className="space-y-2">
              <Label>✅ PDFs Encontrados ({availablePDFs.length})</Label>
              <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                {availablePDFs.map((pdf, index) => <div key={index} className="flex items-center justify-between p-2 border rounded hover:bg-muted cursor-pointer transition-colors" onClick={() => usePDF(pdf)}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{pdf.title}</p>
                      {pdf.subject && <p className="text-xs text-muted-foreground">{pdf.subject}</p>}
                      <p className="text-xs text-muted-foreground truncate">{pdf.url}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={e => {
                  e.stopPropagation();
                  usePDF(pdf);
                }} className="ml-2">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>)}
              </div>
              <p className="text-xs text-muted-foreground">
                💡 Haz clic en un PDF para llenar automáticamente el formulario de importación
              </p>
            </div> : stryMutAct_9fa48("1038") ? false : stryMutAct_9fa48("1037") ? true : (stryCov_9fa48("1037", "1038", "1039"), (stryMutAct_9fa48("1042") ? availablePDFs.length <= 0 : stryMutAct_9fa48("1041") ? availablePDFs.length >= 0 : stryMutAct_9fa48("1040") ? true : (stryCov_9fa48("1040", "1041", "1042"), availablePDFs.length > 0)) && <div className="space-y-2">
              <Label>✅ PDFs Encontrados ({availablePDFs.length})</Label>
              <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                {availablePDFs.map(stryMutAct_9fa48("1043") ? () => undefined : (stryCov_9fa48("1043"), (pdf, index) => <div key={index} className="flex items-center justify-between p-2 border rounded hover:bg-muted cursor-pointer transition-colors" onClick={stryMutAct_9fa48("1044") ? () => undefined : (stryCov_9fa48("1044"), () => usePDF(pdf))}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{pdf.title}</p>
                      {stryMutAct_9fa48("1047") ? pdf.subject || <p className="text-xs text-muted-foreground">{pdf.subject}</p> : stryMutAct_9fa48("1046") ? false : stryMutAct_9fa48("1045") ? true : (stryCov_9fa48("1045", "1046", "1047"), pdf.subject && <p className="text-xs text-muted-foreground">{pdf.subject}</p>)}
                      <p className="text-xs text-muted-foreground truncate">{pdf.url}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={e => {
                  if (stryMutAct_9fa48("1048")) {
                    {}
                  } else {
                    stryCov_9fa48("1048");
                    e.stopPropagation();
                    usePDF(pdf);
                  }
                }} className="ml-2">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>))}
              </div>
              <p className="text-xs text-muted-foreground">
                💡 Haz clic en un PDF para llenar automáticamente el formulario de importación
              </p>
            </div>)}

          {stryMutAct_9fa48("1051") ? !fetchingPDFs && !searchError && availablePDFs.length === 0 && demreUrl || <div className="text-sm text-muted-foreground text-center py-4">
              <p>
                Haz clic en "Buscar PDFs" para encontrar los exámenes disponibles en esta página.
              </p>
            </div> : stryMutAct_9fa48("1050") ? false : stryMutAct_9fa48("1049") ? true : (stryCov_9fa48("1049", "1050", "1051"), (stryMutAct_9fa48("1053") ? !fetchingPDFs && !searchError && availablePDFs.length === 0 || demreUrl : stryMutAct_9fa48("1052") ? true : (stryCov_9fa48("1052", "1053"), (stryMutAct_9fa48("1055") ? !fetchingPDFs && !searchError || availablePDFs.length === 0 : stryMutAct_9fa48("1054") ? true : (stryCov_9fa48("1054", "1055"), (stryMutAct_9fa48("1057") ? !fetchingPDFs || !searchError : stryMutAct_9fa48("1056") ? true : (stryCov_9fa48("1056", "1057"), (stryMutAct_9fa48("1058") ? fetchingPDFs : (stryCov_9fa48("1058"), !fetchingPDFs)) && (stryMutAct_9fa48("1059") ? searchError : (stryCov_9fa48("1059"), !searchError)))) && (stryMutAct_9fa48("1061") ? availablePDFs.length !== 0 : stryMutAct_9fa48("1060") ? true : (stryCov_9fa48("1060", "1061"), availablePDFs.length === 0)))) && demreUrl)) && <div className="text-sm text-muted-foreground text-center py-4">
              <p>
                Haz clic en "Buscar PDFs" para encontrar los exámenes disponibles en esta página.
              </p>
            </div>)}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📝 Método Manual (Alternativa)</CardTitle>
          <CardDescription>
            Si el método automático no funciona o prefieres hacerlo manualmente, tienes dos
            opciones:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">
              Opción 1: Usar URL (puede fallar por headers mal formateados)
            </h4>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>
                Visita{stryMutAct_9fa48("1062") ? "" : (stryCov_9fa48("1062"), ' ')}
                <a href="https://demre.cl/publicaciones/2026/pruebas-oficiales-paes-regular-p2026" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  el sitio de DEMRE
                </a>
              </li>
              <li>Encuentra el PDF del examen que quieres importar</li>
              <li>
                Copia la URL del PDF (clic derecho en el enlace → "Copiar dirección del enlace")
              </li>
              <li>Selecciona "URL" en el formulario de abajo y pega la URL</li>
              <li>Completa los demás campos y haz clic en "Importar Exámenes"</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold mb-2">
              Opción 2: Subir Archivo Local (Recomendado si hay problemas)
            </h4>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>
                Visita{stryMutAct_9fa48("1063") ? "" : (stryCov_9fa48("1063"), ' ')}
                <a href="https://demre.cl/publicaciones/2026/pruebas-oficiales-paes-regular-p2026" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  el sitio de DEMRE
                </a>
              </li>
              <li>Descarga el PDF del examen a tu computadora</li>
              <li>Selecciona "Archivo Local" en el formulario de abajo</li>
              <li>Haz clic en "Seleccionar archivo" y elige el PDF descargado</li>
              <li>Completa los demás campos y haz clic en "Importar Exámenes"</li>
            </ol>
            <p className="mt-2 text-xs text-muted-foreground">
              💡 Esta opción evita problemas con headers mal formateados del servidor de DEMRE
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {exams.map(stryMutAct_9fa48("1064") ? () => undefined : (stryCov_9fa48("1064"), (exam, index) => <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Examen {stryMutAct_9fa48("1065") ? index - 1 : (stryCov_9fa48("1065"), index + 1)}</CardTitle>
                {stryMutAct_9fa48("1068") ? exams.length > 1 || <Button variant="ghost" size="sm" onClick={() => removeExam(index)} className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button> : stryMutAct_9fa48("1067") ? false : stryMutAct_9fa48("1066") ? true : (stryCov_9fa48("1066", "1067", "1068"), (stryMutAct_9fa48("1071") ? exams.length <= 1 : stryMutAct_9fa48("1070") ? exams.length >= 1 : stryMutAct_9fa48("1069") ? true : (stryCov_9fa48("1069", "1070", "1071"), exams.length > 1)) && <Button variant="ghost" size="sm" onClick={stryMutAct_9fa48("1072") ? () => undefined : (stryCov_9fa48("1072"), () => removeExam(index))} className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Método de Importación *</Label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" name={stryMutAct_9fa48("1073") ? `` : (stryCov_9fa48("1073"), `inputType-${index}`)} value="url" checked={stryMutAct_9fa48("1076") ? exam?.inputType !== 'url' : stryMutAct_9fa48("1075") ? false : stryMutAct_9fa48("1074") ? true : (stryCov_9fa48("1074", "1075", "1076"), (stryMutAct_9fa48("1077") ? exam.inputType : (stryCov_9fa48("1077"), exam?.inputType)) === (stryMutAct_9fa48("1078") ? "" : (stryCov_9fa48("1078"), 'url')))} onChange={stryMutAct_9fa48("1079") ? () => undefined : (stryCov_9fa48("1079"), () => handleInputTypeChange(index, stryMutAct_9fa48("1080") ? "" : (stryCov_9fa48("1080"), 'url')))} className="w-4 h-4" />
                    <span>URL (desde DEMRE)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" name={stryMutAct_9fa48("1081") ? `` : (stryCov_9fa48("1081"), `inputType-${index}`)} value="file" checked={stryMutAct_9fa48("1084") ? exam?.inputType !== 'file' : stryMutAct_9fa48("1083") ? false : stryMutAct_9fa48("1082") ? true : (stryCov_9fa48("1082", "1083", "1084"), (stryMutAct_9fa48("1085") ? exam.inputType : (stryCov_9fa48("1085"), exam?.inputType)) === (stryMutAct_9fa48("1086") ? "" : (stryCov_9fa48("1086"), 'file')))} onChange={stryMutAct_9fa48("1087") ? () => undefined : (stryCov_9fa48("1087"), () => handleInputTypeChange(index, stryMutAct_9fa48("1088") ? "" : (stryCov_9fa48("1088"), 'file')))} className="w-4 h-4" />
                    <span>Archivo Local (recomendado si hay problemas con la URL)</span>
                  </label>
                </div>
              </div>

              {(stryMutAct_9fa48("1091") ? exam?.inputType !== 'url' : stryMutAct_9fa48("1090") ? false : stryMutAct_9fa48("1089") ? true : (stryCov_9fa48("1089", "1090", "1091"), (stryMutAct_9fa48("1092") ? exam.inputType : (stryCov_9fa48("1092"), exam?.inputType)) === (stryMutAct_9fa48("1093") ? "" : (stryCov_9fa48("1093"), 'url')))) ? <div className="space-y-2">
                  <Label htmlFor={stryMutAct_9fa48("1094") ? `` : (stryCov_9fa48("1094"), `pdfUrl-${index}`)}>URL del PDF *</Label>
                  <Input id={stryMutAct_9fa48("1095") ? `` : (stryCov_9fa48("1095"), `pdfUrl-${index}`)} type="url" placeholder="https://demre.cl/.../paes-2026-lectora.pdf" value={String(stryMutAct_9fa48("1096") ? exam?.pdfUrl && '' : (stryCov_9fa48("1096"), (stryMutAct_9fa48("1097") ? exam.pdfUrl : (stryCov_9fa48("1097"), exam?.pdfUrl)) ?? (stryMutAct_9fa48("1098") ? "Stryker was here!" : (stryCov_9fa48("1098"), ''))))} onChange={stryMutAct_9fa48("1099") ? () => undefined : (stryCov_9fa48("1099"), e => updateExam(index, stryMutAct_9fa48("1100") ? "" : (stryCov_9fa48("1100"), 'pdfUrl'), e.target.value))} />
                  <p className="text-xs text-muted-foreground">
                    Pega aquí la URL completa del PDF desde DEMRE
                  </p>
                </div> : <div className="space-y-2">
                  <Label htmlFor={stryMutAct_9fa48("1101") ? `` : (stryCov_9fa48("1101"), `pdfFile-${index}`)}>Archivo PDF *</Label>
                  <Input id={stryMutAct_9fa48("1102") ? `` : (stryCov_9fa48("1102"), `pdfFile-${index}`)} type="file" accept=".pdf" onChange={e => {
                if (stryMutAct_9fa48("1103")) {
                  {}
                } else {
                  stryCov_9fa48("1103");
                  const file = stryMutAct_9fa48("1106") ? e.target.files?.[0] && null : stryMutAct_9fa48("1105") ? false : stryMutAct_9fa48("1104") ? true : (stryCov_9fa48("1104", "1105", "1106"), (stryMutAct_9fa48("1107") ? e.target.files[0] : (stryCov_9fa48("1107"), e.target.files?.[0])) || null);
                  handleFileChange(index, file);
                }
              }} />
                  <p className="text-xs text-muted-foreground">
                    {(stryMutAct_9fa48("1108") ? exam.pdfFile : (stryCov_9fa48("1108"), exam?.pdfFile)) ? stryMutAct_9fa48("1109") ? `` : (stryCov_9fa48("1109"), `Archivo seleccionado: ${exam.pdfFile.name} (${(stryMutAct_9fa48("1110") ? exam.pdfFile.size / 1024 * 1024 : (stryCov_9fa48("1110"), (stryMutAct_9fa48("1111") ? exam.pdfFile.size * 1024 : (stryCov_9fa48("1111"), exam.pdfFile.size / 1024)) / 1024)).toFixed(2)} MB)`) : stryMutAct_9fa48("1112") ? "" : (stryCov_9fa48("1112"), 'Selecciona un archivo PDF descargado desde DEMRE. Esto evita problemas con headers mal formateados.')}
                  </p>
                </div>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={stryMutAct_9fa48("1113") ? `` : (stryCov_9fa48("1113"), `subjectName-${index}`)}>Asignatura *</Label>
                  <Select value={String(stryMutAct_9fa48("1114") ? exam?.subjectName && '' : (stryCov_9fa48("1114"), (stryMutAct_9fa48("1115") ? exam.subjectName : (stryCov_9fa48("1115"), exam?.subjectName)) ?? (stryMutAct_9fa48("1116") ? "Stryker was here!" : (stryCov_9fa48("1116"), ''))))} onValueChange={stryMutAct_9fa48("1117") ? () => undefined : (stryCov_9fa48("1117"), value => updateExam(index, stryMutAct_9fa48("1118") ? "" : (stryCov_9fa48("1118"), 'subjectName'), value))}>
                    <SelectTrigger id={stryMutAct_9fa48("1119") ? `` : (stryCov_9fa48("1119"), `subjectName-${index}`)}>
                      <SelectValue placeholder="Selecciona una asignatura" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map(stryMutAct_9fa48("1120") ? () => undefined : (stryCov_9fa48("1120"), subject => <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={stryMutAct_9fa48("1121") ? `` : (stryCov_9fa48("1121"), `year-${index}`)}>Año *</Label>
                  <Input id={stryMutAct_9fa48("1122") ? `` : (stryCov_9fa48("1122"), `year-${index}`)} type="text" placeholder="2026" value={String(stryMutAct_9fa48("1123") ? exam?.year && '' : (stryCov_9fa48("1123"), (stryMutAct_9fa48("1124") ? exam.year : (stryCov_9fa48("1124"), exam?.year)) ?? (stryMutAct_9fa48("1125") ? "Stryker was here!" : (stryCov_9fa48("1125"), ''))))} onChange={stryMutAct_9fa48("1126") ? () => undefined : (stryCov_9fa48("1126"), e => updateExam(index, stryMutAct_9fa48("1127") ? "" : (stryCov_9fa48("1127"), 'year'), e.target.value))} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={stryMutAct_9fa48("1128") ? `` : (stryCov_9fa48("1128"), `examType-${index}`)}>Tipo de Examen</Label>
                  <Select value={String(stryMutAct_9fa48("1129") ? exam?.examType && 'oficial' : (stryCov_9fa48("1129"), (stryMutAct_9fa48("1130") ? exam.examType : (stryCov_9fa48("1130"), exam?.examType)) ?? (stryMutAct_9fa48("1131") ? "" : (stryCov_9fa48("1131"), 'oficial'))))} onValueChange={stryMutAct_9fa48("1132") ? () => undefined : (stryCov_9fa48("1132"), value => updateExam(index, stryMutAct_9fa48("1133") ? "" : (stryCov_9fa48("1133"), 'examType'), value))}>
                    <SelectTrigger id={stryMutAct_9fa48("1134") ? `` : (stryCov_9fa48("1134"), `examType-${index}`)}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EXAM_TYPES.map(stryMutAct_9fa48("1135") ? () => undefined : (stryCov_9fa48("1135"), type => <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={stryMutAct_9fa48("1136") ? `` : (stryCov_9fa48("1136"), `examTitle-${index}`)}>Título del Examen *</Label>
                  <Input id={stryMutAct_9fa48("1137") ? `` : (stryCov_9fa48("1137"), `examTitle-${index}`)} type="text" placeholder="PAES 2026 - Competencia Lectora (Oficial)" value={String(stryMutAct_9fa48("1138") ? exam?.examTitle && '' : (stryCov_9fa48("1138"), (stryMutAct_9fa48("1139") ? exam.examTitle : (stryCov_9fa48("1139"), exam?.examTitle)) ?? (stryMutAct_9fa48("1140") ? "Stryker was here!" : (stryCov_9fa48("1140"), ''))))} onChange={stryMutAct_9fa48("1141") ? () => undefined : (stryCov_9fa48("1141"), e => updateExam(index, stryMutAct_9fa48("1142") ? "" : (stryCov_9fa48("1142"), 'examTitle'), e.target.value))} />
                  <p className="text-xs text-muted-foreground">
                    Se genera automáticamente, pero puedes editarlo
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>))}

        <Button variant="outline" onClick={addExam} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Otro Examen
        </Button>

        <Card>
          <CardContent className="pt-6">
            <Button onClick={handleImport} disabled={stryMutAct_9fa48("1145") ? loading && !canImport : stryMutAct_9fa48("1144") ? false : stryMutAct_9fa48("1143") ? true : (stryCov_9fa48("1143", "1144", "1145"), loading || (stryMutAct_9fa48("1146") ? canImport : (stryCov_9fa48("1146"), !canImport)))} className="w-full" size="lg">
              {loading ? <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Importando...
                </> : <>
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Exámenes
                </>}
            </Button>
          </CardContent>
        </Card>

        {stryMutAct_9fa48("1149") ? results.length > 0 || <div className="space-y-2">
            {results.map((result, index) => <Alert key={index} className={result.success ? '' : 'border-destructive'}>
                {result.success ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertTitle>{result.examTitle}</AlertTitle>
                <AlertDescription>
                  {result.message}
                  {result.details && <pre className="mt-2 text-xs whitespace-pre-wrap">{result.details}</pre>}
                </AlertDescription>
              </Alert>)}
          </div> : stryMutAct_9fa48("1148") ? false : stryMutAct_9fa48("1147") ? true : (stryCov_9fa48("1147", "1148", "1149"), (stryMutAct_9fa48("1152") ? results.length <= 0 : stryMutAct_9fa48("1151") ? results.length >= 0 : stryMutAct_9fa48("1150") ? true : (stryCov_9fa48("1150", "1151", "1152"), results.length > 0)) && <div className="space-y-2">
            {results.map(stryMutAct_9fa48("1153") ? () => undefined : (stryCov_9fa48("1153"), (result, index) => <Alert key={index} className={result.success ? stryMutAct_9fa48("1154") ? "Stryker was here!" : (stryCov_9fa48("1154"), '') : stryMutAct_9fa48("1155") ? "" : (stryCov_9fa48("1155"), 'border-destructive')}>
                {result.success ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertTitle>{result.examTitle}</AlertTitle>
                <AlertDescription>
                  {result.message}
                  {stryMutAct_9fa48("1158") ? result.details || <pre className="mt-2 text-xs whitespace-pre-wrap">{result.details}</pre> : stryMutAct_9fa48("1157") ? false : stryMutAct_9fa48("1156") ? true : (stryCov_9fa48("1156", "1157", "1158"), result.details && <pre className="mt-2 text-xs whitespace-pre-wrap">{result.details}</pre>)}
                </AlertDescription>
              </Alert>))}
          </div>)}
      </div>
    </div>;
  }
}