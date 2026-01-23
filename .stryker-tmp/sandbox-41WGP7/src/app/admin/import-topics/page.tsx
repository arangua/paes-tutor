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
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Upload, CheckCircle2, XCircle, AlertCircle, FileText, FileJson, File } from 'lucide-react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
const SUBJECTS = stryMutAct_9fa48("1159") ? [] : (stryCov_9fa48("1159"), [stryMutAct_9fa48("1160") ? "" : (stryCov_9fa48("1160"), 'Competencia Lectora'), stryMutAct_9fa48("1161") ? "" : (stryCov_9fa48("1161"), 'Matemática M1'), stryMutAct_9fa48("1162") ? "" : (stryCov_9fa48("1162"), 'Matemática M2'), stryMutAct_9fa48("1163") ? "" : (stryCov_9fa48("1163"), 'Ciencias - Biología'), stryMutAct_9fa48("1164") ? "" : (stryCov_9fa48("1164"), 'Ciencias - Física'), stryMutAct_9fa48("1165") ? "" : (stryCov_9fa48("1165"), 'Ciencias - Química'), stryMutAct_9fa48("1166") ? "" : (stryCov_9fa48("1166"), 'Historia y Ciencias Sociales')]);
interface Topic {
  asignatura: string;
  ejeTematico: string;
  nombre: string;
  descripcion?: string;
}
export default function ImportTopicsPage() {
  if (stryMutAct_9fa48("1167")) {
    {}
  } else {
    stryCov_9fa48("1167");
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [csvText, setCsvText] = useState(stryMutAct_9fa48("1168") ? "Stryker was here!" : (stryCov_9fa48("1168"), ''));
    const [jsonText, setJsonText] = useState(stryMutAct_9fa48("1169") ? "Stryker was here!" : (stryCov_9fa48("1169"), ''));
    const [subjectName, setSubjectName] = useState<string | undefined>(undefined); // Para PDFs cuando no se detecta asignatura
    const [activeTab, setActiveTab] = useState<'pdf' | 'csv-file' | 'csv-text' | 'json'>(stryMutAct_9fa48("1170") ? "" : (stryCov_9fa48("1170"), 'pdf'));
    const [loading, setLoading] = useState(stryMutAct_9fa48("1171") ? true : (stryCov_9fa48("1171"), false));
    const [result, setResult] = useState<{
      success: boolean;
      message: string;
      details?: string;
      result?: {
        total: number;
        created: number;
        updated: number;
        skipped: number;
        errors: Array<{
          topic: string;
          error: string;
        }>;
      };
    } | null>(null);
    const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (stryMutAct_9fa48("1172")) {
        {}
      } else {
        stryCov_9fa48("1172");
        const file = stryMutAct_9fa48("1173") ? e.target.files[0] : (stryCov_9fa48("1173"), e.target.files?.[0]);
        if (stryMutAct_9fa48("1175") ? false : stryMutAct_9fa48("1174") ? true : (stryCov_9fa48("1174", "1175"), file)) {
          if (stryMutAct_9fa48("1176")) {
            {}
          } else {
            stryCov_9fa48("1176");
            // Validar extensión
            const fileName = stryMutAct_9fa48("1177") ? file.name.toUpperCase() : (stryCov_9fa48("1177"), file.name.toLowerCase());
            if (stryMutAct_9fa48("1180") ? false : stryMutAct_9fa48("1179") ? true : stryMutAct_9fa48("1178") ? fileName.endsWith('.pdf') : (stryCov_9fa48("1178", "1179", "1180"), !(stryMutAct_9fa48("1181") ? fileName.startsWith('.pdf') : (stryCov_9fa48("1181"), fileName.endsWith(stryMutAct_9fa48("1182") ? "" : (stryCov_9fa48("1182"), '.pdf')))))) {
              if (stryMutAct_9fa48("1183")) {
                {}
              } else {
                stryCov_9fa48("1183");
                setResult(stryMutAct_9fa48("1184") ? {} : (stryCov_9fa48("1184"), {
                  success: stryMutAct_9fa48("1185") ? true : (stryCov_9fa48("1185"), false),
                  message: stryMutAct_9fa48("1186") ? "" : (stryCov_9fa48("1186"), 'El archivo debe ser un PDF'),
                  details: stryMutAct_9fa48("1187") ? "" : (stryCov_9fa48("1187"), 'Por favor, selecciona un archivo PDF válido.')
                }));
                return;
              }
            }

            // Validar tamaño (máximo 50 MB)
            const MAX_FILE_SIZE = stryMutAct_9fa48("1188") ? 50 * 1024 / 1024 : (stryCov_9fa48("1188"), (stryMutAct_9fa48("1189") ? 50 / 1024 : (stryCov_9fa48("1189"), 50 * 1024)) * 1024); // 50 MB
            if (stryMutAct_9fa48("1193") ? file.size <= MAX_FILE_SIZE : stryMutAct_9fa48("1192") ? file.size >= MAX_FILE_SIZE : stryMutAct_9fa48("1191") ? false : stryMutAct_9fa48("1190") ? true : (stryCov_9fa48("1190", "1191", "1192", "1193"), file.size > MAX_FILE_SIZE)) {
              if (stryMutAct_9fa48("1194")) {
                {}
              } else {
                stryCov_9fa48("1194");
                setResult(stryMutAct_9fa48("1195") ? {} : (stryCov_9fa48("1195"), {
                  success: stryMutAct_9fa48("1196") ? true : (stryCov_9fa48("1196"), false),
                  message: stryMutAct_9fa48("1197") ? "" : (stryCov_9fa48("1197"), 'El archivo es demasiado grande'),
                  details: stryMutAct_9fa48("1198") ? `` : (stryCov_9fa48("1198"), `El tamaño máximo permitido es ${stryMutAct_9fa48("1199") ? MAX_FILE_SIZE / 1024 * 1024 : (stryCov_9fa48("1199"), (stryMutAct_9fa48("1200") ? MAX_FILE_SIZE * 1024 : (stryCov_9fa48("1200"), MAX_FILE_SIZE / 1024)) / 1024)} MB.`)
                }));
                return;
              }
            }

            // Validar tamaño mínimo
            const MIN_FILE_SIZE = 100; // 100 bytes
            if (stryMutAct_9fa48("1204") ? file.size >= MIN_FILE_SIZE : stryMutAct_9fa48("1203") ? file.size <= MIN_FILE_SIZE : stryMutAct_9fa48("1202") ? false : stryMutAct_9fa48("1201") ? true : (stryCov_9fa48("1201", "1202", "1203", "1204"), file.size < MIN_FILE_SIZE)) {
              if (stryMutAct_9fa48("1205")) {
                {}
              } else {
                stryCov_9fa48("1205");
                setResult(stryMutAct_9fa48("1206") ? {} : (stryCov_9fa48("1206"), {
                  success: stryMutAct_9fa48("1207") ? true : (stryCov_9fa48("1207"), false),
                  message: stryMutAct_9fa48("1208") ? "" : (stryCov_9fa48("1208"), 'El archivo es demasiado pequeño'),
                  details: stryMutAct_9fa48("1209") ? "" : (stryCov_9fa48("1209"), 'El archivo parece estar vacío o corrupto.')
                }));
                return;
              }
            }
            setPdfFile(file);
            setResult(null);
          }
        }
      }
    };
    const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (stryMutAct_9fa48("1210")) {
        {}
      } else {
        stryCov_9fa48("1210");
        const file = stryMutAct_9fa48("1211") ? e.target.files[0] : (stryCov_9fa48("1211"), e.target.files?.[0]);
        if (stryMutAct_9fa48("1213") ? false : stryMutAct_9fa48("1212") ? true : (stryCov_9fa48("1212", "1213"), file)) {
          if (stryMutAct_9fa48("1214")) {
            {}
          } else {
            stryCov_9fa48("1214");
            // Validar extensión
            const fileName = stryMutAct_9fa48("1215") ? file.name.toUpperCase() : (stryCov_9fa48("1215"), file.name.toLowerCase());
            if (stryMutAct_9fa48("1218") ? !fileName.endsWith('.csv') || !fileName.endsWith('.txt') : stryMutAct_9fa48("1217") ? false : stryMutAct_9fa48("1216") ? true : (stryCov_9fa48("1216", "1217", "1218"), (stryMutAct_9fa48("1219") ? fileName.endsWith('.csv') : (stryCov_9fa48("1219"), !(stryMutAct_9fa48("1220") ? fileName.startsWith('.csv') : (stryCov_9fa48("1220"), fileName.endsWith(stryMutAct_9fa48("1221") ? "" : (stryCov_9fa48("1221"), '.csv')))))) && (stryMutAct_9fa48("1222") ? fileName.endsWith('.txt') : (stryCov_9fa48("1222"), !(stryMutAct_9fa48("1223") ? fileName.startsWith('.txt') : (stryCov_9fa48("1223"), fileName.endsWith(stryMutAct_9fa48("1224") ? "" : (stryCov_9fa48("1224"), '.txt')))))))) {
              if (stryMutAct_9fa48("1225")) {
                {}
              } else {
                stryCov_9fa48("1225");
                setResult(stryMutAct_9fa48("1226") ? {} : (stryCov_9fa48("1226"), {
                  success: stryMutAct_9fa48("1227") ? true : (stryCov_9fa48("1227"), false),
                  message: stryMutAct_9fa48("1228") ? "" : (stryCov_9fa48("1228"), 'El archivo debe ser CSV o TXT'),
                  details: stryMutAct_9fa48("1229") ? "" : (stryCov_9fa48("1229"), 'Por favor, selecciona un archivo CSV o TXT válido.')
                }));
                return;
              }
            }

            // Validar tamaño (máximo 5 MB)
            const MAX_FILE_SIZE = stryMutAct_9fa48("1230") ? 5 * 1024 / 1024 : (stryCov_9fa48("1230"), (stryMutAct_9fa48("1231") ? 5 / 1024 : (stryCov_9fa48("1231"), 5 * 1024)) * 1024); // 5 MB
            if (stryMutAct_9fa48("1235") ? file.size <= MAX_FILE_SIZE : stryMutAct_9fa48("1234") ? file.size >= MAX_FILE_SIZE : stryMutAct_9fa48("1233") ? false : stryMutAct_9fa48("1232") ? true : (stryCov_9fa48("1232", "1233", "1234", "1235"), file.size > MAX_FILE_SIZE)) {
              if (stryMutAct_9fa48("1236")) {
                {}
              } else {
                stryCov_9fa48("1236");
                setResult(stryMutAct_9fa48("1237") ? {} : (stryCov_9fa48("1237"), {
                  success: stryMutAct_9fa48("1238") ? true : (stryCov_9fa48("1238"), false),
                  message: stryMutAct_9fa48("1239") ? "" : (stryCov_9fa48("1239"), 'El archivo es demasiado grande'),
                  details: stryMutAct_9fa48("1240") ? `` : (stryCov_9fa48("1240"), `El tamaño máximo permitido es ${stryMutAct_9fa48("1241") ? MAX_FILE_SIZE / 1024 * 1024 : (stryCov_9fa48("1241"), (stryMutAct_9fa48("1242") ? MAX_FILE_SIZE * 1024 : (stryCov_9fa48("1242"), MAX_FILE_SIZE / 1024)) / 1024)} MB.`)
                }));
                return;
              }
            }
            setCsvFile(file);
            setResult(null);
          }
        }
      }
    };
    const handleCsvTextChange = (value: string) => {
      if (stryMutAct_9fa48("1243")) {
        {}
      } else {
        stryCov_9fa48("1243");
        setCsvText(value);
        setResult(null);
      }
    };
    const handleJsonTextChange = (value: string) => {
      if (stryMutAct_9fa48("1244")) {
        {}
      } else {
        stryCov_9fa48("1244");
        setJsonText(value);
        setResult(null);
      }
    };
    const validateJsonFormat = (text: string): Topic[] | null => {
      if (stryMutAct_9fa48("1245")) {
        {}
      } else {
        stryCov_9fa48("1245");
        try {
          if (stryMutAct_9fa48("1246")) {
            {}
          } else {
            stryCov_9fa48("1246");
            const parsed = JSON.parse(text);
            if (stryMutAct_9fa48("1249") ? false : stryMutAct_9fa48("1248") ? true : stryMutAct_9fa48("1247") ? Array.isArray(parsed) : (stryCov_9fa48("1247", "1248", "1249"), !Array.isArray(parsed))) {
              if (stryMutAct_9fa48("1250")) {
                {}
              } else {
                stryCov_9fa48("1250");
                throw new Error(stryMutAct_9fa48("1251") ? "" : (stryCov_9fa48("1251"), 'El JSON debe ser un array de temas'));
              }
            }
            const topics: Topic[] = stryMutAct_9fa48("1252") ? ["Stryker was here"] : (stryCov_9fa48("1252"), []);
            for (const item of parsed) {
              if (stryMutAct_9fa48("1253")) {
                {}
              } else {
                stryCov_9fa48("1253");
                if (stryMutAct_9fa48("1256") ? (!item.asignatura || !item.ejeTematico) && !item.nombre : stryMutAct_9fa48("1255") ? false : stryMutAct_9fa48("1254") ? true : (stryCov_9fa48("1254", "1255", "1256"), (stryMutAct_9fa48("1258") ? !item.asignatura && !item.ejeTematico : stryMutAct_9fa48("1257") ? false : (stryCov_9fa48("1257", "1258"), (stryMutAct_9fa48("1259") ? item.asignatura : (stryCov_9fa48("1259"), !item.asignatura)) || (stryMutAct_9fa48("1260") ? item.ejeTematico : (stryCov_9fa48("1260"), !item.ejeTematico)))) || (stryMutAct_9fa48("1261") ? item.nombre : (stryCov_9fa48("1261"), !item.nombre)))) {
                  if (stryMutAct_9fa48("1262")) {
                    {}
                  } else {
                    stryCov_9fa48("1262");
                    throw new Error(stryMutAct_9fa48("1263") ? "" : (stryCov_9fa48("1263"), 'Cada tema debe tener: asignatura, ejeTematico, nombre'));
                  }
                }
                topics.push(stryMutAct_9fa48("1264") ? {} : (stryCov_9fa48("1264"), {
                  asignatura: item.asignatura,
                  ejeTematico: item.ejeTematico,
                  nombre: item.nombre,
                  descripcion: stryMutAct_9fa48("1267") ? item.descripcion && undefined : stryMutAct_9fa48("1266") ? false : stryMutAct_9fa48("1265") ? true : (stryCov_9fa48("1265", "1266", "1267"), item.descripcion || undefined)
                }));
              }
            }
            return topics;
          }
        } catch (error) {
          if (stryMutAct_9fa48("1268")) {
            {}
          } else {
            stryCov_9fa48("1268");
            return null;
          }
        }
      }
    };
    const handleImport = async () => {
      if (stryMutAct_9fa48("1269")) {
        {}
      } else {
        stryCov_9fa48("1269");
        setLoading(stryMutAct_9fa48("1270") ? false : (stryCov_9fa48("1270"), true));
        setResult(null);
        try {
          if (stryMutAct_9fa48("1271")) {
            {}
          } else {
            stryCov_9fa48("1271");
            let response: Response;
            if (stryMutAct_9fa48("1274") ? activeTab !== 'pdf' : stryMutAct_9fa48("1273") ? false : stryMutAct_9fa48("1272") ? true : (stryCov_9fa48("1272", "1273", "1274"), activeTab === (stryMutAct_9fa48("1275") ? "" : (stryCov_9fa48("1275"), 'pdf')))) {
              if (stryMutAct_9fa48("1276")) {
                {}
              } else {
                stryCov_9fa48("1276");
                if (stryMutAct_9fa48("1279") ? false : stryMutAct_9fa48("1278") ? true : stryMutAct_9fa48("1277") ? pdfFile : (stryCov_9fa48("1277", "1278", "1279"), !pdfFile)) {
                  if (stryMutAct_9fa48("1280")) {
                    {}
                  } else {
                    stryCov_9fa48("1280");
                    setResult(stryMutAct_9fa48("1281") ? {} : (stryCov_9fa48("1281"), {
                      success: stryMutAct_9fa48("1282") ? true : (stryCov_9fa48("1282"), false),
                      message: stryMutAct_9fa48("1283") ? "" : (stryCov_9fa48("1283"), 'Archivo PDF requerido'),
                      details: stryMutAct_9fa48("1284") ? "" : (stryCov_9fa48("1284"), 'Por favor, selecciona un archivo PDF del temario.')
                    }));
                    setLoading(stryMutAct_9fa48("1285") ? true : (stryCov_9fa48("1285"), false));
                    return;
                  }
                }
                const formData = new FormData();
                formData.append(stryMutAct_9fa48("1286") ? "" : (stryCov_9fa48("1286"), 'pdfFile'), pdfFile);
                if (stryMutAct_9fa48("1288") ? false : stryMutAct_9fa48("1287") ? true : (stryCov_9fa48("1287", "1288"), subjectName)) {
                  if (stryMutAct_9fa48("1289")) {
                    {}
                  } else {
                    stryCov_9fa48("1289");
                    formData.append(stryMutAct_9fa48("1290") ? "" : (stryCov_9fa48("1290"), 'subjectName'), subjectName);
                  }
                }
                response = await fetch(stryMutAct_9fa48("1291") ? "" : (stryCov_9fa48("1291"), '/api/admin/import-topics'), stryMutAct_9fa48("1292") ? {} : (stryCov_9fa48("1292"), {
                  method: stryMutAct_9fa48("1293") ? "" : (stryCov_9fa48("1293"), 'POST'),
                  body: formData
                }));
              }
            } else if (stryMutAct_9fa48("1296") ? activeTab !== 'csv-file' : stryMutAct_9fa48("1295") ? false : stryMutAct_9fa48("1294") ? true : (stryCov_9fa48("1294", "1295", "1296"), activeTab === (stryMutAct_9fa48("1297") ? "" : (stryCov_9fa48("1297"), 'csv-file')))) {
              if (stryMutAct_9fa48("1298")) {
                {}
              } else {
                stryCov_9fa48("1298");
                if (stryMutAct_9fa48("1301") ? false : stryMutAct_9fa48("1300") ? true : stryMutAct_9fa48("1299") ? csvFile : (stryCov_9fa48("1299", "1300", "1301"), !csvFile)) {
                  if (stryMutAct_9fa48("1302")) {
                    {}
                  } else {
                    stryCov_9fa48("1302");
                    setResult(stryMutAct_9fa48("1303") ? {} : (stryCov_9fa48("1303"), {
                      success: stryMutAct_9fa48("1304") ? true : (stryCov_9fa48("1304"), false),
                      message: stryMutAct_9fa48("1305") ? "" : (stryCov_9fa48("1305"), 'Archivo requerido'),
                      details: stryMutAct_9fa48("1306") ? "" : (stryCov_9fa48("1306"), 'Por favor, selecciona un archivo CSV.')
                    }));
                    setLoading(stryMutAct_9fa48("1307") ? true : (stryCov_9fa48("1307"), false));
                    return;
                  }
                }
                const formData = new FormData();
                formData.append(stryMutAct_9fa48("1308") ? "" : (stryCov_9fa48("1308"), 'csvFile'), csvFile);
                response = await fetch(stryMutAct_9fa48("1309") ? "" : (stryCov_9fa48("1309"), '/api/admin/import-topics'), stryMutAct_9fa48("1310") ? {} : (stryCov_9fa48("1310"), {
                  method: stryMutAct_9fa48("1311") ? "" : (stryCov_9fa48("1311"), 'POST'),
                  body: formData
                }));
              }
            } else if (stryMutAct_9fa48("1314") ? activeTab !== 'csv-text' : stryMutAct_9fa48("1313") ? false : stryMutAct_9fa48("1312") ? true : (stryCov_9fa48("1312", "1313", "1314"), activeTab === (stryMutAct_9fa48("1315") ? "" : (stryCov_9fa48("1315"), 'csv-text')))) {
              if (stryMutAct_9fa48("1316")) {
                {}
              } else {
                stryCov_9fa48("1316");
                if (stryMutAct_9fa48("1319") ? false : stryMutAct_9fa48("1318") ? true : stryMutAct_9fa48("1317") ? csvText.trim() : (stryCov_9fa48("1317", "1318", "1319"), !(stryMutAct_9fa48("1320") ? csvText : (stryCov_9fa48("1320"), csvText.trim())))) {
                  if (stryMutAct_9fa48("1321")) {
                    {}
                  } else {
                    stryCov_9fa48("1321");
                    setResult(stryMutAct_9fa48("1322") ? {} : (stryCov_9fa48("1322"), {
                      success: stryMutAct_9fa48("1323") ? true : (stryCov_9fa48("1323"), false),
                      message: stryMutAct_9fa48("1324") ? "" : (stryCov_9fa48("1324"), 'Texto CSV requerido'),
                      details: stryMutAct_9fa48("1325") ? "" : (stryCov_9fa48("1325"), 'Por favor, ingresa el contenido CSV.')
                    }));
                    setLoading(stryMutAct_9fa48("1326") ? true : (stryCov_9fa48("1326"), false));
                    return;
                  }
                }
                const formData = new FormData();
                formData.append(stryMutAct_9fa48("1327") ? "" : (stryCov_9fa48("1327"), 'csvText'), csvText);
                response = await fetch(stryMutAct_9fa48("1328") ? "" : (stryCov_9fa48("1328"), '/api/admin/import-topics'), stryMutAct_9fa48("1329") ? {} : (stryCov_9fa48("1329"), {
                  method: stryMutAct_9fa48("1330") ? "" : (stryCov_9fa48("1330"), 'POST'),
                  body: formData
                }));
              }
            } else {
              if (stryMutAct_9fa48("1331")) {
                {}
              } else {
                stryCov_9fa48("1331");
                // JSON
                if (stryMutAct_9fa48("1334") ? false : stryMutAct_9fa48("1333") ? true : stryMutAct_9fa48("1332") ? jsonText.trim() : (stryCov_9fa48("1332", "1333", "1334"), !(stryMutAct_9fa48("1335") ? jsonText : (stryCov_9fa48("1335"), jsonText.trim())))) {
                  if (stryMutAct_9fa48("1336")) {
                    {}
                  } else {
                    stryCov_9fa48("1336");
                    setResult(stryMutAct_9fa48("1337") ? {} : (stryCov_9fa48("1337"), {
                      success: stryMutAct_9fa48("1338") ? true : (stryCov_9fa48("1338"), false),
                      message: stryMutAct_9fa48("1339") ? "" : (stryCov_9fa48("1339"), 'JSON requerido'),
                      details: stryMutAct_9fa48("1340") ? "" : (stryCov_9fa48("1340"), 'Por favor, ingresa el JSON con los temas.')
                    }));
                    setLoading(stryMutAct_9fa48("1341") ? true : (stryCov_9fa48("1341"), false));
                    return;
                  }
                }
                const topics = validateJsonFormat(jsonText);
                if (stryMutAct_9fa48("1344") ? false : stryMutAct_9fa48("1343") ? true : stryMutAct_9fa48("1342") ? topics : (stryCov_9fa48("1342", "1343", "1344"), !topics)) {
                  if (stryMutAct_9fa48("1345")) {
                    {}
                  } else {
                    stryCov_9fa48("1345");
                    setResult(stryMutAct_9fa48("1346") ? {} : (stryCov_9fa48("1346"), {
                      success: stryMutAct_9fa48("1347") ? true : (stryCov_9fa48("1347"), false),
                      message: stryMutAct_9fa48("1348") ? "" : (stryCov_9fa48("1348"), 'JSON inválido'),
                      details: stryMutAct_9fa48("1349") ? "" : (stryCov_9fa48("1349"), 'El formato JSON no es válido. Cada tema debe tener: asignatura, ejeTematico, nombre.')
                    }));
                    setLoading(stryMutAct_9fa48("1350") ? true : (stryCov_9fa48("1350"), false));
                    return;
                  }
                }
                response = await fetch(stryMutAct_9fa48("1351") ? "" : (stryCov_9fa48("1351"), '/api/admin/import-topics'), stryMutAct_9fa48("1352") ? {} : (stryCov_9fa48("1352"), {
                  method: stryMutAct_9fa48("1353") ? "" : (stryCov_9fa48("1353"), 'POST'),
                  headers: stryMutAct_9fa48("1354") ? {} : (stryCov_9fa48("1354"), {
                    'Content-Type': stryMutAct_9fa48("1355") ? "" : (stryCov_9fa48("1355"), 'application/json')
                  }),
                  body: JSON.stringify(stryMutAct_9fa48("1356") ? {} : (stryCov_9fa48("1356"), {
                    topics
                  }))
                }));
              }
            }
            const data = await response.json();
            if (stryMutAct_9fa48("1359") ? false : stryMutAct_9fa48("1358") ? true : stryMutAct_9fa48("1357") ? response.ok : (stryCov_9fa48("1357", "1358", "1359"), !response.ok)) {
              if (stryMutAct_9fa48("1360")) {
                {}
              } else {
                stryCov_9fa48("1360");
                throw new Error(stryMutAct_9fa48("1363") ? data.error && 'Error al importar temarios' : stryMutAct_9fa48("1362") ? false : stryMutAct_9fa48("1361") ? true : (stryCov_9fa48("1361", "1362", "1363"), data.error || (stryMutAct_9fa48("1364") ? "" : (stryCov_9fa48("1364"), 'Error al importar temarios'))));
              }
            }
            setResult(stryMutAct_9fa48("1365") ? {} : (stryCov_9fa48("1365"), {
              success: stryMutAct_9fa48("1366") ? false : (stryCov_9fa48("1366"), true),
              message: data.message,
              details: data.details,
              result: data.result
            }));

            // Limpiar formularios si fue exitoso
            if (stryMutAct_9fa48("1369") ? activeTab !== 'pdf' : stryMutAct_9fa48("1368") ? false : stryMutAct_9fa48("1367") ? true : (stryCov_9fa48("1367", "1368", "1369"), activeTab === (stryMutAct_9fa48("1370") ? "" : (stryCov_9fa48("1370"), 'pdf')))) {
              if (stryMutAct_9fa48("1371")) {
                {}
              } else {
                stryCov_9fa48("1371");
                setPdfFile(null);
                setSubjectName(undefined);
                const fileInput = document.getElementById('pdfFile') as HTMLInputElement;
                if (stryMutAct_9fa48("1373") ? false : stryMutAct_9fa48("1372") ? true : (stryCov_9fa48("1372", "1373"), fileInput)) {
                  if (stryMutAct_9fa48("1374")) {
                    {}
                  } else {
                    stryCov_9fa48("1374");
                    fileInput.value = stryMutAct_9fa48("1375") ? "Stryker was here!" : (stryCov_9fa48("1375"), '');
                  }
                }
              }
            } else if (stryMutAct_9fa48("1378") ? activeTab !== 'csv-file' : stryMutAct_9fa48("1377") ? false : stryMutAct_9fa48("1376") ? true : (stryCov_9fa48("1376", "1377", "1378"), activeTab === (stryMutAct_9fa48("1379") ? "" : (stryCov_9fa48("1379"), 'csv-file')))) {
              if (stryMutAct_9fa48("1380")) {
                {}
              } else {
                stryCov_9fa48("1380");
                setCsvFile(null);
                const fileInput = document.getElementById('csvFile') as HTMLInputElement;
                if (stryMutAct_9fa48("1382") ? false : stryMutAct_9fa48("1381") ? true : (stryCov_9fa48("1381", "1382"), fileInput)) {
                  if (stryMutAct_9fa48("1383")) {
                    {}
                  } else {
                    stryCov_9fa48("1383");
                    fileInput.value = stryMutAct_9fa48("1384") ? "Stryker was here!" : (stryCov_9fa48("1384"), '');
                  }
                }
              }
            } else if (stryMutAct_9fa48("1387") ? activeTab !== 'csv-text' : stryMutAct_9fa48("1386") ? false : stryMutAct_9fa48("1385") ? true : (stryCov_9fa48("1385", "1386", "1387"), activeTab === (stryMutAct_9fa48("1388") ? "" : (stryCov_9fa48("1388"), 'csv-text')))) {
              if (stryMutAct_9fa48("1389")) {
                {}
              } else {
                stryCov_9fa48("1389");
                setCsvText(stryMutAct_9fa48("1390") ? "Stryker was here!" : (stryCov_9fa48("1390"), ''));
              }
            } else {
              if (stryMutAct_9fa48("1391")) {
                {}
              } else {
                stryCov_9fa48("1391");
                setJsonText(stryMutAct_9fa48("1392") ? "Stryker was here!" : (stryCov_9fa48("1392"), ''));
              }
            }
          }
        } catch (error) {
          if (stryMutAct_9fa48("1393")) {
            {}
          } else {
            stryCov_9fa48("1393");
            setResult(stryMutAct_9fa48("1394") ? {} : (stryCov_9fa48("1394"), {
              success: stryMutAct_9fa48("1395") ? true : (stryCov_9fa48("1395"), false),
              message: stryMutAct_9fa48("1396") ? "" : (stryCov_9fa48("1396"), 'Error al importar temarios'),
              details: error instanceof Error ? error.message : stryMutAct_9fa48("1397") ? "" : (stryCov_9fa48("1397"), 'Error desconocido')
            }));
          }
        } finally {
          if (stryMutAct_9fa48("1398")) {
            {}
          } else {
            stryCov_9fa48("1398");
            setLoading(stryMutAct_9fa48("1399") ? true : (stryCov_9fa48("1399"), false));
          }
        }
      }
    };
    const getExampleJson = () => {
      if (stryMutAct_9fa48("1400")) {
        {}
      } else {
        stryCov_9fa48("1400");
        return JSON.stringify(stryMutAct_9fa48("1401") ? [] : (stryCov_9fa48("1401"), [stryMutAct_9fa48("1402") ? {} : (stryCov_9fa48("1402"), {
          asignatura: stryMutAct_9fa48("1403") ? "" : (stryCov_9fa48("1403"), 'Matemática M1'),
          ejeTematico: stryMutAct_9fa48("1404") ? "" : (stryCov_9fa48("1404"), 'Álgebra'),
          nombre: stryMutAct_9fa48("1405") ? "" : (stryCov_9fa48("1405"), 'Ecuaciones lineales'),
          descripcion: stryMutAct_9fa48("1406") ? "" : (stryCov_9fa48("1406"), 'Resolución de ecuaciones de primer grado')
        }), stryMutAct_9fa48("1407") ? {} : (stryCov_9fa48("1407"), {
          asignatura: stryMutAct_9fa48("1408") ? "" : (stryCov_9fa48("1408"), 'Matemática M1'),
          ejeTematico: stryMutAct_9fa48("1409") ? "" : (stryCov_9fa48("1409"), 'Álgebra'),
          nombre: stryMutAct_9fa48("1410") ? "" : (stryCov_9fa48("1410"), 'Sistemas de ecuaciones'),
          descripcion: stryMutAct_9fa48("1411") ? "" : (stryCov_9fa48("1411"), 'Métodos de resolución de sistemas')
        })]), null, 2);
      }
    };
    const getExampleCsv = () => {
      if (stryMutAct_9fa48("1412")) {
        {}
      } else {
        stryCov_9fa48("1412");
        return stryMutAct_9fa48("1413") ? `` : (stryCov_9fa48("1413"), `asignatura,eje tematico,nombre,descripcion
Matemática M1,Álgebra,Ecuaciones lineales,Resolución de ecuaciones de primer grado
Matemática M1,Álgebra,Sistemas de ecuaciones,Métodos de resolución de sistemas
Competencia Lectora,Comprensión lectora,Inferencia,Capacidad de inferir información implícita`);
      }
    };
    return <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-6">
        <Breadcrumbs className="mb-4" />
        <h1 className="text-3xl font-bold">Importar Temarios</h1>
        <p className="text-muted-foreground mt-2">
          Importa temarios completos para organizar el contenido por asignatura, eje temático y
          tema.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Importar Temarios</CardTitle>
          <CardDescription>
            Puedes importar temarios desde un archivo PDF, CSV, texto CSV o formato JSON. Los temas
            se organizarán automáticamente por asignatura y eje temático.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={stryMutAct_9fa48("1414") ? () => undefined : (stryCov_9fa48("1414"), v => setActiveTab(v as typeof activeTab))}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pdf">
                <File className="mr-2 h-4 w-4" />
                PDF
              </TabsTrigger>
              <TabsTrigger value="csv-file">
                <FileText className="mr-2 h-4 w-4" />
                CSV Archivo
              </TabsTrigger>
              <TabsTrigger value="csv-text">
                <FileText className="mr-2 h-4 w-4" />
                CSV Texto
              </TabsTrigger>
              <TabsTrigger value="json">
                <FileJson className="mr-2 h-4 w-4" />
                JSON
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pdf" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pdfFile">Archivo PDF del Temario *</Label>
                <Input id="pdfFile" type="file" accept=".pdf,application/pdf" onChange={handlePdfFileChange} disabled={loading} className="cursor-pointer" />
                {stryMutAct_9fa48("1417") ? pdfFile || <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>
                      {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div> : stryMutAct_9fa48("1416") ? false : stryMutAct_9fa48("1415") ? true : (stryCov_9fa48("1415", "1416", "1417"), pdfFile && <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>
                      {pdfFile.name} ({(stryMutAct_9fa48("1418") ? pdfFile.size / 1024 * 1024 : (stryCov_9fa48("1418"), (stryMutAct_9fa48("1419") ? pdfFile.size * 1024 : (stryCov_9fa48("1419"), pdfFile.size / 1024)) / 1024)).toFixed(2)} MB)
                    </span>
                  </div>)}
                <p className="text-sm text-muted-foreground">
                  El sistema detectará automáticamente asignaturas, ejes temáticos y temas del PDF.
                </p>
              </div>

              {/* Selector de asignatura (opcional, para cuando no se detecta) */}
              <div className="space-y-2">
                <Label htmlFor="subjectName">Asignatura (Opcional)</Label>
                <Select value={stryMutAct_9fa48("1422") ? subjectName && '__none__' : stryMutAct_9fa48("1421") ? false : stryMutAct_9fa48("1420") ? true : (stryCov_9fa48("1420", "1421", "1422"), subjectName || (stryMutAct_9fa48("1423") ? "" : (stryCov_9fa48("1423"), '__none__')))} onValueChange={stryMutAct_9fa48("1424") ? () => undefined : (stryCov_9fa48("1424"), value => setSubjectName((stryMutAct_9fa48("1427") ? value !== '__none__' : stryMutAct_9fa48("1426") ? false : stryMutAct_9fa48("1425") ? true : (stryCov_9fa48("1425", "1426", "1427"), value === (stryMutAct_9fa48("1428") ? "" : (stryCov_9fa48("1428"), '__none__')))) ? undefined : value))}>
                  <SelectTrigger id="subjectName">
                    <SelectValue placeholder="Selecciona si el PDF no tiene asignatura explícita" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Ninguna (detectar automáticamente)</SelectItem>
                    {SUBJECTS.map(stryMutAct_9fa48("1429") ? () => undefined : (stryCov_9fa48("1429"), subject => <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Si el PDF no contiene el nombre de la asignatura, selecciona una aquí.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="csv-file" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="csvFile">Archivo CSV *</Label>
                <Input id="csvFile" type="file" accept=".csv,.txt" onChange={handleCsvFileChange} disabled={loading} className="cursor-pointer" />
                {stryMutAct_9fa48("1432") ? csvFile || <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>
                      {csvFile.name} ({(csvFile.size / 1024).toFixed(2)} KB)
                    </span>
                  </div> : stryMutAct_9fa48("1431") ? false : stryMutAct_9fa48("1430") ? true : (stryCov_9fa48("1430", "1431", "1432"), csvFile && <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>
                      {csvFile.name} ({(stryMutAct_9fa48("1433") ? csvFile.size * 1024 : (stryCov_9fa48("1433"), csvFile.size / 1024)).toFixed(2)} KB)
                    </span>
                  </div>)}
                <p className="text-sm text-muted-foreground">
                  El CSV debe tener columnas: asignatura, eje temático, nombre, descripción
                  (opcional)
                </p>
              </div>
            </TabsContent>

            <TabsContent value="csv-text" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="csvText">Contenido CSV *</Label>
                <Textarea id="csvText" value={csvText} onChange={stryMutAct_9fa48("1434") ? () => undefined : (stryCov_9fa48("1434"), e => handleCsvTextChange(e.target.value))} disabled={loading} placeholder={getExampleCsv()} rows={10} className="font-mono text-sm" />
                <p className="text-sm text-muted-foreground">
                  Pega el contenido CSV aquí. Primera fila debe ser encabezados.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="json" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jsonText">JSON *</Label>
                <Textarea id="jsonText" value={jsonText} onChange={stryMutAct_9fa48("1435") ? () => undefined : (stryCov_9fa48("1435"), e => handleJsonTextChange(e.target.value))} disabled={loading} placeholder={getExampleJson()} rows={10} className="font-mono text-sm" />
                <p className="text-sm text-muted-foreground">
                  Formato: array de objetos con asignatura, ejeTematico, nombre, descripcion
                  (opcional)
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Botón de importar */}
          <Button onClick={handleImport} disabled={stryMutAct_9fa48("1438") ? (loading || activeTab === 'pdf' && !pdfFile || activeTab === 'csv-file' && !csvFile || activeTab === 'csv-text' && !csvText.trim()) && activeTab === 'json' && !jsonText.trim() : stryMutAct_9fa48("1437") ? false : stryMutAct_9fa48("1436") ? true : (stryCov_9fa48("1436", "1437", "1438"), (stryMutAct_9fa48("1440") ? (loading || activeTab === 'pdf' && !pdfFile || activeTab === 'csv-file' && !csvFile) && activeTab === 'csv-text' && !csvText.trim() : stryMutAct_9fa48("1439") ? false : (stryCov_9fa48("1439", "1440"), (stryMutAct_9fa48("1442") ? (loading || activeTab === 'pdf' && !pdfFile) && activeTab === 'csv-file' && !csvFile : stryMutAct_9fa48("1441") ? false : (stryCov_9fa48("1441", "1442"), (stryMutAct_9fa48("1444") ? loading && activeTab === 'pdf' && !pdfFile : stryMutAct_9fa48("1443") ? false : (stryCov_9fa48("1443", "1444"), loading || (stryMutAct_9fa48("1446") ? activeTab === 'pdf' || !pdfFile : stryMutAct_9fa48("1445") ? false : (stryCov_9fa48("1445", "1446"), (stryMutAct_9fa48("1448") ? activeTab !== 'pdf' : stryMutAct_9fa48("1447") ? true : (stryCov_9fa48("1447", "1448"), activeTab === (stryMutAct_9fa48("1449") ? "" : (stryCov_9fa48("1449"), 'pdf')))) && (stryMutAct_9fa48("1450") ? pdfFile : (stryCov_9fa48("1450"), !pdfFile)))))) || (stryMutAct_9fa48("1452") ? activeTab === 'csv-file' || !csvFile : stryMutAct_9fa48("1451") ? false : (stryCov_9fa48("1451", "1452"), (stryMutAct_9fa48("1454") ? activeTab !== 'csv-file' : stryMutAct_9fa48("1453") ? true : (stryCov_9fa48("1453", "1454"), activeTab === (stryMutAct_9fa48("1455") ? "" : (stryCov_9fa48("1455"), 'csv-file')))) && (stryMutAct_9fa48("1456") ? csvFile : (stryCov_9fa48("1456"), !csvFile)))))) || (stryMutAct_9fa48("1458") ? activeTab === 'csv-text' || !csvText.trim() : stryMutAct_9fa48("1457") ? false : (stryCov_9fa48("1457", "1458"), (stryMutAct_9fa48("1460") ? activeTab !== 'csv-text' : stryMutAct_9fa48("1459") ? true : (stryCov_9fa48("1459", "1460"), activeTab === (stryMutAct_9fa48("1461") ? "" : (stryCov_9fa48("1461"), 'csv-text')))) && (stryMutAct_9fa48("1462") ? csvText.trim() : (stryCov_9fa48("1462"), !(stryMutAct_9fa48("1463") ? csvText : (stryCov_9fa48("1463"), csvText.trim())))))))) || (stryMutAct_9fa48("1465") ? activeTab === 'json' || !jsonText.trim() : stryMutAct_9fa48("1464") ? false : (stryCov_9fa48("1464", "1465"), (stryMutAct_9fa48("1467") ? activeTab !== 'json' : stryMutAct_9fa48("1466") ? true : (stryCov_9fa48("1466", "1467"), activeTab === (stryMutAct_9fa48("1468") ? "" : (stryCov_9fa48("1468"), 'json')))) && (stryMutAct_9fa48("1469") ? jsonText.trim() : (stryCov_9fa48("1469"), !(stryMutAct_9fa48("1470") ? jsonText : (stryCov_9fa48("1470"), jsonText.trim())))))))} className="w-full" size="lg">
            {loading ? <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importando temarios...
              </> : <>
                <Upload className="mr-2 h-4 w-4" />
                Importar Temarios
              </>}
          </Button>

          {/* Resultados */}
          {stryMutAct_9fa48("1473") ? result || <Alert variant={result.success ? 'default' : 'destructive'} className={result.success ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : ''}>
              {result.success ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertTitle>{result.success ? 'Éxito' : 'Error'}</AlertTitle>
              <AlertDescription className="mt-2">
                <div className="font-medium">{result.message}</div>
                {result.details && <div className="mt-2 whitespace-pre-line text-sm">{result.details}</div>}
              </AlertDescription>
            </Alert> : stryMutAct_9fa48("1472") ? false : stryMutAct_9fa48("1471") ? true : (stryCov_9fa48("1471", "1472", "1473"), result && <Alert variant={result.success ? stryMutAct_9fa48("1474") ? "" : (stryCov_9fa48("1474"), 'default') : stryMutAct_9fa48("1475") ? "" : (stryCov_9fa48("1475"), 'destructive')} className={result.success ? stryMutAct_9fa48("1476") ? "" : (stryCov_9fa48("1476"), 'border-green-500 bg-green-50 dark:bg-green-950/20') : stryMutAct_9fa48("1477") ? "Stryker was here!" : (stryCov_9fa48("1477"), '')}>
              {result.success ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertTitle>{result.success ? stryMutAct_9fa48("1478") ? "" : (stryCov_9fa48("1478"), 'Éxito') : stryMutAct_9fa48("1479") ? "" : (stryCov_9fa48("1479"), 'Error')}</AlertTitle>
              <AlertDescription className="mt-2">
                <div className="font-medium">{result.message}</div>
                {stryMutAct_9fa48("1482") ? result.details || <div className="mt-2 whitespace-pre-line text-sm">{result.details}</div> : stryMutAct_9fa48("1481") ? false : stryMutAct_9fa48("1480") ? true : (stryCov_9fa48("1480", "1481", "1482"), result.details && <div className="mt-2 whitespace-pre-line text-sm">{result.details}</div>)}
              </AlertDescription>
            </Alert>)}

          {/* Información adicional */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Información importante</AlertTitle>
            <AlertDescription className="mt-2">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>
                  <strong>PDF:</strong> El sistema detectará automáticamente asignaturas, ejes
                  temáticos y temas. Si no se detecta la asignatura, puedes seleccionarla
                  manualmente.
                </li>
                <li>Las asignaturas válidas son: {SUBJECTS.join(stryMutAct_9fa48("1483") ? "" : (stryCov_9fa48("1483"), ', '))}</li>
                <li>
                  Los temas duplicados (misma asignatura, eje temático y nombre) se actualizarán en
                  lugar de crear duplicados.
                </li>
                <li>El formato CSV debe tener encabezados en la primera fila.</li>
                <li>El formato JSON debe ser un array de objetos.</li>
                <li>La descripción es opcional en todos los formatos.</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Ejemplos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Ejemplo CSV</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                  {getExampleCsv()}
                </pre>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => {
                  if (stryMutAct_9fa48("1484")) {
                    {}
                  } else {
                    stryCov_9fa48("1484");
                    setActiveTab(stryMutAct_9fa48("1485") ? "" : (stryCov_9fa48("1485"), 'csv-text'));
                    setCsvText(getExampleCsv());
                  }
                }}>
                  Usar ejemplo
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Ejemplo JSON</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                  {getExampleJson()}
                </pre>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => {
                  if (stryMutAct_9fa48("1486")) {
                    {}
                  } else {
                    stryCov_9fa48("1486");
                    setActiveTab(stryMutAct_9fa48("1487") ? "" : (stryCov_9fa48("1487"), 'json'));
                    setJsonText(getExampleJson());
                  }
                }}>
                  Usar ejemplo
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>;
  }
}