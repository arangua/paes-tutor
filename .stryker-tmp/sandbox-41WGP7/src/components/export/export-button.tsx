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
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, FileText, FileSpreadsheet, File, Loader2 } from 'lucide-react';
import { captureError } from '@/lib/monitoring';
import { getErrorMessage, extractErrorInfo, ERROR_CODES } from '@/lib/error-messages';
import { toast } from 'sonner';
interface ExportButtonProps {
  onExportPDF?: () => Promise<void>;
  onExportExcel?: () => Promise<void>;
  onExportWord?: () => Promise<void>;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}
export function ExportButton({
  onExportPDF,
  onExportExcel,
  onExportWord,
  disabled = stryMutAct_9fa48("17320") ? true : (stryCov_9fa48("17320"), false),
  variant = stryMutAct_9fa48("17321") ? "" : (stryCov_9fa48("17321"), 'outline'),
  size = stryMutAct_9fa48("17322") ? "" : (stryCov_9fa48("17322"), 'default')
}: ExportButtonProps) {
  if (stryMutAct_9fa48("17323")) {
    {}
  } else {
    stryCov_9fa48("17323");
    const [exporting, setExporting] = useState<string | null>(null);
    const handleExport = async (format: 'pdf' | 'excel' | 'word', handler?: () => Promise<void>) => {
      if (stryMutAct_9fa48("17324")) {
        {}
      } else {
        stryCov_9fa48("17324");
        if (stryMutAct_9fa48("17327") ? false : stryMutAct_9fa48("17326") ? true : stryMutAct_9fa48("17325") ? handler : (stryCov_9fa48("17325", "17326", "17327"), !handler)) return;
        try {
          if (stryMutAct_9fa48("17328")) {
            {}
          } else {
            stryCov_9fa48("17328");
            setExporting(format);
            await handler();
            // El toast de éxito se maneja en las funciones de exportación individuales
          }
        } catch (error) {
          if (stryMutAct_9fa48("17329")) {
            {}
          } else {
            stryCov_9fa48("17329");
            // Log error usando servicio de monitoreo
            captureError(error instanceof Error ? error : new Error(String(error)), stryMutAct_9fa48("17330") ? {} : (stryCov_9fa48("17330"), {
              type: stryMutAct_9fa48("17331") ? "" : (stryCov_9fa48("17331"), 'export_error'),
              format,
              path: (stryMutAct_9fa48("17334") ? typeof window === 'undefined' : stryMutAct_9fa48("17333") ? false : stryMutAct_9fa48("17332") ? true : (stryCov_9fa48("17332", "17333", "17334"), typeof window !== (stryMutAct_9fa48("17335") ? "" : (stryCov_9fa48("17335"), 'undefined')))) ? window.location.pathname : undefined
            }));

            // Mostrar mensaje de error mejorado
            const errorInfo = extractErrorInfo(error);
            const errorMessage = getErrorMessage(ERROR_CODES.DATA_EXPORT_FAILED, stryMutAct_9fa48("17336") ? {} : (stryCov_9fa48("17336"), {
              reason: errorInfo.message,
              format: stryMutAct_9fa48("17337") ? format.toLowerCase() : (stryCov_9fa48("17337"), format.toUpperCase())
            }));
            toast.error(errorMessage.title, stryMutAct_9fa48("17338") ? {} : (stryCov_9fa48("17338"), {
              description: stryMutAct_9fa48("17339") ? `` : (stryCov_9fa48("17339"), `${errorMessage.description} ${errorMessage.solution}`),
              duration: 6000
            }));
          }
        } finally {
          if (stryMutAct_9fa48("17340")) {
            {}
          } else {
            stryCov_9fa48("17340");
            setExporting(null);
          }
        }
      }
    };
    const hasAnyExport = stryMutAct_9fa48("17343") ? (onExportPDF || onExportExcel) && onExportWord : stryMutAct_9fa48("17342") ? false : stryMutAct_9fa48("17341") ? true : (stryCov_9fa48("17341", "17342", "17343"), (stryMutAct_9fa48("17345") ? onExportPDF && onExportExcel : stryMutAct_9fa48("17344") ? false : (stryCov_9fa48("17344", "17345"), onExportPDF || onExportExcel)) || onExportWord);
    if (stryMutAct_9fa48("17348") ? false : stryMutAct_9fa48("17347") ? true : stryMutAct_9fa48("17346") ? hasAnyExport : (stryCov_9fa48("17346", "17347", "17348"), !hasAnyExport)) {
      if (stryMutAct_9fa48("17349")) {
        {}
      } else {
        stryCov_9fa48("17349");
        return null;
      }
    }

    // Si solo hay una opción, mostrar botón directo
    if (stryMutAct_9fa48("17352") ? hasAnyExport && !onExportExcel || !onExportWord : stryMutAct_9fa48("17351") ? false : stryMutAct_9fa48("17350") ? true : (stryCov_9fa48("17350", "17351", "17352"), (stryMutAct_9fa48("17354") ? hasAnyExport || !onExportExcel : stryMutAct_9fa48("17353") ? true : (stryCov_9fa48("17353", "17354"), hasAnyExport && (stryMutAct_9fa48("17355") ? onExportExcel : (stryCov_9fa48("17355"), !onExportExcel)))) && (stryMutAct_9fa48("17356") ? onExportWord : (stryCov_9fa48("17356"), !onExportWord)))) {
      if (stryMutAct_9fa48("17357")) {
        {}
      } else {
        stryCov_9fa48("17357");
        return <Button variant={variant} size={size} onClick={stryMutAct_9fa48("17358") ? () => undefined : (stryCov_9fa48("17358"), () => handleExport(stryMutAct_9fa48("17359") ? "" : (stryCov_9fa48("17359"), 'pdf'), onExportPDF))} disabled={stryMutAct_9fa48("17362") ? disabled && exporting !== null : stryMutAct_9fa48("17361") ? false : stryMutAct_9fa48("17360") ? true : (stryCov_9fa48("17360", "17361", "17362"), disabled || (stryMutAct_9fa48("17364") ? exporting === null : stryMutAct_9fa48("17363") ? false : (stryCov_9fa48("17363", "17364"), exporting !== null)))} aria-label="Exportar a PDF">
        {(stryMutAct_9fa48("17367") ? exporting !== 'pdf' : stryMutAct_9fa48("17366") ? false : stryMutAct_9fa48("17365") ? true : (stryCov_9fa48("17365", "17366", "17367"), exporting === (stryMutAct_9fa48("17368") ? "" : (stryCov_9fa48("17368"), 'pdf')))) ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
        Exportar PDF
      </Button>;
      }
    }

    // Múltiples opciones: dropdown
    return <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={stryMutAct_9fa48("17371") ? disabled && exporting !== null : stryMutAct_9fa48("17370") ? false : stryMutAct_9fa48("17369") ? true : (stryCov_9fa48("17369", "17370", "17371"), disabled || (stryMutAct_9fa48("17373") ? exporting === null : stryMutAct_9fa48("17372") ? false : (stryCov_9fa48("17372", "17373"), exporting !== null)))} aria-label="Exportar datos" aria-haspopup="true">
          {exporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
          {exporting ? stryMutAct_9fa48("17374") ? `` : (stryCov_9fa48("17374"), `Exportando ${stryMutAct_9fa48("17375") ? exporting.toLowerCase() : (stryCov_9fa48("17375"), exporting.toUpperCase())}...`) : stryMutAct_9fa48("17376") ? "" : (stryCov_9fa48("17376"), 'Exportar')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {stryMutAct_9fa48("17379") ? onExportPDF || <DropdownMenuItem onClick={() => handleExport('pdf', onExportPDF)} disabled={exporting !== null}>
            <FileText className="h-4 w-4 mr-2" />
            Exportar a PDF
          </DropdownMenuItem> : stryMutAct_9fa48("17378") ? false : stryMutAct_9fa48("17377") ? true : (stryCov_9fa48("17377", "17378", "17379"), onExportPDF && <DropdownMenuItem onClick={stryMutAct_9fa48("17380") ? () => undefined : (stryCov_9fa48("17380"), () => handleExport(stryMutAct_9fa48("17381") ? "" : (stryCov_9fa48("17381"), 'pdf'), onExportPDF))} disabled={stryMutAct_9fa48("17384") ? exporting === null : stryMutAct_9fa48("17383") ? false : stryMutAct_9fa48("17382") ? true : (stryCov_9fa48("17382", "17383", "17384"), exporting !== null)}>
            <FileText className="h-4 w-4 mr-2" />
            Exportar a PDF
          </DropdownMenuItem>)}
        {stryMutAct_9fa48("17387") ? onExportExcel || <DropdownMenuItem onClick={() => handleExport('excel', onExportExcel)} disabled={exporting !== null}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Exportar a Excel
          </DropdownMenuItem> : stryMutAct_9fa48("17386") ? false : stryMutAct_9fa48("17385") ? true : (stryCov_9fa48("17385", "17386", "17387"), onExportExcel && <DropdownMenuItem onClick={stryMutAct_9fa48("17388") ? () => undefined : (stryCov_9fa48("17388"), () => handleExport(stryMutAct_9fa48("17389") ? "" : (stryCov_9fa48("17389"), 'excel'), onExportExcel))} disabled={stryMutAct_9fa48("17392") ? exporting === null : stryMutAct_9fa48("17391") ? false : stryMutAct_9fa48("17390") ? true : (stryCov_9fa48("17390", "17391", "17392"), exporting !== null)}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Exportar a Excel
          </DropdownMenuItem>)}
        {stryMutAct_9fa48("17395") ? onExportWord || <DropdownMenuItem onClick={() => handleExport('word', onExportWord)} disabled={exporting !== null}>
            <File className="h-4 w-4 mr-2" />
            Exportar a Word
          </DropdownMenuItem> : stryMutAct_9fa48("17394") ? false : stryMutAct_9fa48("17393") ? true : (stryCov_9fa48("17393", "17394", "17395"), onExportWord && <DropdownMenuItem onClick={stryMutAct_9fa48("17396") ? () => undefined : (stryCov_9fa48("17396"), () => handleExport(stryMutAct_9fa48("17397") ? "" : (stryCov_9fa48("17397"), 'word'), onExportWord))} disabled={stryMutAct_9fa48("17400") ? exporting === null : stryMutAct_9fa48("17399") ? false : stryMutAct_9fa48("17398") ? true : (stryCov_9fa48("17398", "17399", "17400"), exporting !== null)}>
            <File className="h-4 w-4 mr-2" />
            Exportar a Word
          </DropdownMenuItem>)}
      </DropdownMenuContent>
    </DropdownMenu>;
  }
}