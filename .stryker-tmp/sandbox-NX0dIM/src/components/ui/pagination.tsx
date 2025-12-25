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
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className
}: PaginationProps) {
  if (stryMutAct_9fa48("20849")) {
    {}
  } else {
    stryCov_9fa48("20849");
    if (stryMutAct_9fa48("20853") ? totalPages > 1 : stryMutAct_9fa48("20852") ? totalPages < 1 : stryMutAct_9fa48("20851") ? false : stryMutAct_9fa48("20850") ? true : (stryCov_9fa48("20850", "20851", "20852", "20853"), totalPages <= 1)) {
      if (stryMutAct_9fa48("20854")) {
        {}
      } else {
        stryCov_9fa48("20854");
        return null;
      }
    }
    const getPageNumbers = () => {
      if (stryMutAct_9fa48("20855")) {
        {}
      } else {
        stryCov_9fa48("20855");
        const pages: (number | 'ellipsis')[] = stryMutAct_9fa48("20856") ? ["Stryker was here"] : (stryCov_9fa48("20856"), []);
        const maxVisible = 7;
        if (stryMutAct_9fa48("20860") ? totalPages > maxVisible : stryMutAct_9fa48("20859") ? totalPages < maxVisible : stryMutAct_9fa48("20858") ? false : stryMutAct_9fa48("20857") ? true : (stryCov_9fa48("20857", "20858", "20859", "20860"), totalPages <= maxVisible)) {
          if (stryMutAct_9fa48("20861")) {
            {}
          } else {
            stryCov_9fa48("20861");
            // Mostrar todas las páginas
            for (let i = 1; stryMutAct_9fa48("20864") ? i > totalPages : stryMutAct_9fa48("20863") ? i < totalPages : stryMutAct_9fa48("20862") ? false : (stryCov_9fa48("20862", "20863", "20864"), i <= totalPages); stryMutAct_9fa48("20865") ? i-- : (stryCov_9fa48("20865"), i++)) {
              if (stryMutAct_9fa48("20866")) {
                {}
              } else {
                stryCov_9fa48("20866");
                pages.push(i);
              }
            }
          }
        } else {
          if (stryMutAct_9fa48("20867")) {
            {}
          } else {
            stryCov_9fa48("20867");
            // Lógica para mostrar páginas con ellipsis
            if (stryMutAct_9fa48("20871") ? currentPage > 3 : stryMutAct_9fa48("20870") ? currentPage < 3 : stryMutAct_9fa48("20869") ? false : stryMutAct_9fa48("20868") ? true : (stryCov_9fa48("20868", "20869", "20870", "20871"), currentPage <= 3)) {
              if (stryMutAct_9fa48("20872")) {
                {}
              } else {
                stryCov_9fa48("20872");
                // Inicio: 1, 2, 3, 4, ..., total
                for (let i = 1; stryMutAct_9fa48("20875") ? i > 4 : stryMutAct_9fa48("20874") ? i < 4 : stryMutAct_9fa48("20873") ? false : (stryCov_9fa48("20873", "20874", "20875"), i <= 4); stryMutAct_9fa48("20876") ? i-- : (stryCov_9fa48("20876"), i++)) {
                  if (stryMutAct_9fa48("20877")) {
                    {}
                  } else {
                    stryCov_9fa48("20877");
                    pages.push(i);
                  }
                }
                pages.push(stryMutAct_9fa48("20878") ? "" : (stryCov_9fa48("20878"), 'ellipsis'));
                pages.push(totalPages);
              }
            } else if (stryMutAct_9fa48("20882") ? currentPage < totalPages - 2 : stryMutAct_9fa48("20881") ? currentPage > totalPages - 2 : stryMutAct_9fa48("20880") ? false : stryMutAct_9fa48("20879") ? true : (stryCov_9fa48("20879", "20880", "20881", "20882"), currentPage >= (stryMutAct_9fa48("20883") ? totalPages + 2 : (stryCov_9fa48("20883"), totalPages - 2)))) {
              if (stryMutAct_9fa48("20884")) {
                {}
              } else {
                stryCov_9fa48("20884");
                // Final: 1, ..., total-3, total-2, total-1, total
                pages.push(1);
                pages.push(stryMutAct_9fa48("20885") ? "" : (stryCov_9fa48("20885"), 'ellipsis'));
                for (let i = stryMutAct_9fa48("20886") ? totalPages + 3 : (stryCov_9fa48("20886"), totalPages - 3); stryMutAct_9fa48("20889") ? i > totalPages : stryMutAct_9fa48("20888") ? i < totalPages : stryMutAct_9fa48("20887") ? false : (stryCov_9fa48("20887", "20888", "20889"), i <= totalPages); stryMutAct_9fa48("20890") ? i-- : (stryCov_9fa48("20890"), i++)) {
                  if (stryMutAct_9fa48("20891")) {
                    {}
                  } else {
                    stryCov_9fa48("20891");
                    pages.push(i);
                  }
                }
              }
            } else {
              if (stryMutAct_9fa48("20892")) {
                {}
              } else {
                stryCov_9fa48("20892");
                // Medio: 1, ..., current-1, current, current+1, ..., total
                pages.push(1);
                pages.push(stryMutAct_9fa48("20893") ? "" : (stryCov_9fa48("20893"), 'ellipsis'));
                pages.push(stryMutAct_9fa48("20894") ? currentPage + 1 : (stryCov_9fa48("20894"), currentPage - 1));
                pages.push(currentPage);
                pages.push(stryMutAct_9fa48("20895") ? currentPage - 1 : (stryCov_9fa48("20895"), currentPage + 1));
                pages.push(stryMutAct_9fa48("20896") ? "" : (stryCov_9fa48("20896"), 'ellipsis'));
                pages.push(totalPages);
              }
            }
          }
        }
        return pages;
      }
    };
    const pageNumbers = getPageNumbers();
    return <div className={cn(stryMutAct_9fa48("20897") ? "" : (stryCov_9fa48("20897"), 'flex items-center justify-center gap-2'), className)}>
      <Button variant="outline" size="sm" onClick={stryMutAct_9fa48("20898") ? () => undefined : (stryCov_9fa48("20898"), () => onPageChange(stryMutAct_9fa48("20899") ? currentPage + 1 : (stryCov_9fa48("20899"), currentPage - 1)))} disabled={stryMutAct_9fa48("20902") ? currentPage !== 1 : stryMutAct_9fa48("20901") ? false : stryMutAct_9fa48("20900") ? true : (stryCov_9fa48("20900", "20901", "20902"), currentPage === 1)} aria-label="Página anterior">
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pageNumbers.map((page, index) => {
        if (stryMutAct_9fa48("20903")) {
          {}
        } else {
          stryCov_9fa48("20903");
          if (stryMutAct_9fa48("20906") ? page !== 'ellipsis' : stryMutAct_9fa48("20905") ? false : stryMutAct_9fa48("20904") ? true : (stryCov_9fa48("20904", "20905", "20906"), page === (stryMutAct_9fa48("20907") ? "" : (stryCov_9fa48("20907"), 'ellipsis')))) {
            if (stryMutAct_9fa48("20908")) {
              {}
            } else {
              stryCov_9fa48("20908");
              return <Button key={stryMutAct_9fa48("20909") ? `` : (stryCov_9fa48("20909"), `ellipsis-${index}`)} variant="ghost" size="sm" disabled className="cursor-default">
              <MoreHorizontal className="h-4 w-4" />
            </Button>;
            }
          }
          return <Button key={page} variant={(stryMutAct_9fa48("20912") ? currentPage !== page : stryMutAct_9fa48("20911") ? false : stryMutAct_9fa48("20910") ? true : (stryCov_9fa48("20910", "20911", "20912"), currentPage === page)) ? stryMutAct_9fa48("20913") ? "" : (stryCov_9fa48("20913"), 'default') : stryMutAct_9fa48("20914") ? "" : (stryCov_9fa48("20914"), 'outline')} size="sm" onClick={stryMutAct_9fa48("20915") ? () => undefined : (stryCov_9fa48("20915"), () => onPageChange(page))} aria-label={stryMutAct_9fa48("20916") ? `` : (stryCov_9fa48("20916"), `Ir a página ${page}`)} aria-current={(stryMutAct_9fa48("20919") ? currentPage !== page : stryMutAct_9fa48("20918") ? false : stryMutAct_9fa48("20917") ? true : (stryCov_9fa48("20917", "20918", "20919"), currentPage === page)) ? stryMutAct_9fa48("20920") ? "" : (stryCov_9fa48("20920"), 'page') : undefined}>
            {page}
          </Button>;
        }
      })}

      <Button variant="outline" size="sm" onClick={stryMutAct_9fa48("20921") ? () => undefined : (stryCov_9fa48("20921"), () => onPageChange(stryMutAct_9fa48("20922") ? currentPage - 1 : (stryCov_9fa48("20922"), currentPage + 1)))} disabled={stryMutAct_9fa48("20925") ? currentPage !== totalPages : stryMutAct_9fa48("20924") ? false : stryMutAct_9fa48("20923") ? true : (stryCov_9fa48("20923", "20924", "20925"), currentPage === totalPages)} aria-label="Página siguiente">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>;
  }
}