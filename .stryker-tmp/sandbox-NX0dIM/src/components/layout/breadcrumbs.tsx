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
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
interface BreadcrumbItem {
  label: string;
  href?: string;
}
interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}
export function Breadcrumbs({
  items,
  className
}: BreadcrumbsProps) {
  if (stryMutAct_9fa48("17622")) {
    {}
  } else {
    stryCov_9fa48("17622");
    const pathname = usePathname();

    // Generar breadcrumbs automáticamente si no se proporcionan
    const generateBreadcrumbs = (): BreadcrumbItem[] => {
      if (stryMutAct_9fa48("17623")) {
        {}
      } else {
        stryCov_9fa48("17623");
        if (stryMutAct_9fa48("17625") ? false : stryMutAct_9fa48("17624") ? true : (stryCov_9fa48("17624", "17625"), items)) return items;
        const paths = stryMutAct_9fa48("17628") ? pathname?.split('/').filter(Boolean) && [] : stryMutAct_9fa48("17627") ? false : stryMutAct_9fa48("17626") ? true : (stryCov_9fa48("17626", "17627", "17628"), (stryMutAct_9fa48("17630") ? pathname.split('/').filter(Boolean) : stryMutAct_9fa48("17629") ? pathname?.split('/') : (stryCov_9fa48("17629", "17630"), pathname?.split(stryMutAct_9fa48("17631") ? "" : (stryCov_9fa48("17631"), '/')).filter(Boolean))) || (stryMutAct_9fa48("17632") ? ["Stryker was here"] : (stryCov_9fa48("17632"), [])));
        const breadcrumbs: BreadcrumbItem[] = stryMutAct_9fa48("17633") ? [] : (stryCov_9fa48("17633"), [stryMutAct_9fa48("17634") ? {} : (stryCov_9fa48("17634"), {
          label: stryMutAct_9fa48("17635") ? "" : (stryCov_9fa48("17635"), 'Inicio'),
          href: stryMutAct_9fa48("17636") ? "" : (stryCov_9fa48("17636"), '/')
        })]);
        let currentPath = stryMutAct_9fa48("17637") ? "Stryker was here!" : (stryCov_9fa48("17637"), '');
        paths.forEach((path, index) => {
          if (stryMutAct_9fa48("17638")) {
            {}
          } else {
            stryCov_9fa48("17638");
            currentPath += stryMutAct_9fa48("17639") ? `` : (stryCov_9fa48("17639"), `/${path}`);

            // Mapear rutas a labels más amigables
            let label = path;
            if (stryMutAct_9fa48("17642") ? path !== 'dashboard' : stryMutAct_9fa48("17641") ? false : stryMutAct_9fa48("17640") ? true : (stryCov_9fa48("17640", "17641", "17642"), path === (stryMutAct_9fa48("17643") ? "" : (stryCov_9fa48("17643"), 'dashboard')))) label = stryMutAct_9fa48("17644") ? "" : (stryCov_9fa48("17644"), 'Dashboard');else if (stryMutAct_9fa48("17647") ? path !== 'exams' : stryMutAct_9fa48("17646") ? false : stryMutAct_9fa48("17645") ? true : (stryCov_9fa48("17645", "17646", "17647"), path === (stryMutAct_9fa48("17648") ? "" : (stryCov_9fa48("17648"), 'exams')))) label = stryMutAct_9fa48("17649") ? "" : (stryCov_9fa48("17649"), 'Exámenes');else if (stryMutAct_9fa48("17652") ? path !== 'take' : stryMutAct_9fa48("17651") ? false : stryMutAct_9fa48("17650") ? true : (stryCov_9fa48("17650", "17651", "17652"), path === (stryMutAct_9fa48("17653") ? "" : (stryCov_9fa48("17653"), 'take')))) label = stryMutAct_9fa48("17654") ? "" : (stryCov_9fa48("17654"), 'Realizar Examen');else if (stryMutAct_9fa48("17657") ? path !== 'results' : stryMutAct_9fa48("17656") ? false : stryMutAct_9fa48("17655") ? true : (stryCov_9fa48("17655", "17656", "17657"), path === (stryMutAct_9fa48("17658") ? "" : (stryCov_9fa48("17658"), 'results')))) label = stryMutAct_9fa48("17659") ? "" : (stryCov_9fa48("17659"), 'Resultados');else if (stryMutAct_9fa48("17662") ? path !== 'attempts' : stryMutAct_9fa48("17661") ? false : stryMutAct_9fa48("17660") ? true : (stryCov_9fa48("17660", "17661", "17662"), path === (stryMutAct_9fa48("17663") ? "" : (stryCov_9fa48("17663"), 'attempts')))) label = stryMutAct_9fa48("17664") ? "" : (stryCov_9fa48("17664"), 'Intentos');else if (stryMutAct_9fa48("17667") ? path !== 'profile' : stryMutAct_9fa48("17666") ? false : stryMutAct_9fa48("17665") ? true : (stryCov_9fa48("17665", "17666", "17667"), path === (stryMutAct_9fa48("17668") ? "" : (stryCov_9fa48("17668"), 'profile')))) label = stryMutAct_9fa48("17669") ? "" : (stryCov_9fa48("17669"), 'Perfil');else if (stryMutAct_9fa48("17672") ? path !== 'admin' : stryMutAct_9fa48("17671") ? false : stryMutAct_9fa48("17670") ? true : (stryCov_9fa48("17670", "17671", "17672"), path === (stryMutAct_9fa48("17673") ? "" : (stryCov_9fa48("17673"), 'admin')))) label = stryMutAct_9fa48("17674") ? "" : (stryCov_9fa48("17674"), 'Panel de Administración');else if (stryMutAct_9fa48("17677") ? path !== 'import-exams' : stryMutAct_9fa48("17676") ? false : stryMutAct_9fa48("17675") ? true : (stryCov_9fa48("17675", "17676", "17677"), path === (stryMutAct_9fa48("17678") ? "" : (stryCov_9fa48("17678"), 'import-exams')))) label = stryMutAct_9fa48("17679") ? "" : (stryCov_9fa48("17679"), 'Importar Exámenes');else if (stryMutAct_9fa48("17682") ? path !== 'import-answer-key' : stryMutAct_9fa48("17681") ? false : stryMutAct_9fa48("17680") ? true : (stryCov_9fa48("17680", "17681", "17682"), path === (stryMutAct_9fa48("17683") ? "" : (stryCov_9fa48("17683"), 'import-answer-key')))) label = stryMutAct_9fa48("17684") ? "" : (stryCov_9fa48("17684"), 'Importar Clavijero');else if (stryMutAct_9fa48("17687") ? path !== 'import-topics' : stryMutAct_9fa48("17686") ? false : stryMutAct_9fa48("17685") ? true : (stryCov_9fa48("17685", "17686", "17687"), path === (stryMutAct_9fa48("17688") ? "" : (stryCov_9fa48("17688"), 'import-topics')))) label = stryMutAct_9fa48("17689") ? "" : (stryCov_9fa48("17689"), 'Importar Temarios');else if (stryMutAct_9fa48("17692") ? path !== 'cleanup-test-data' : stryMutAct_9fa48("17691") ? false : stryMutAct_9fa48("17690") ? true : (stryCov_9fa48("17690", "17691", "17692"), path === (stryMutAct_9fa48("17693") ? "" : (stryCov_9fa48("17693"), 'cleanup-test-data')))) label = stryMutAct_9fa48("17694") ? "" : (stryCov_9fa48("17694"), 'Limpiar Datos Ficticios');else if (stryMutAct_9fa48("17697") ? path !== 'ai-tutor' : stryMutAct_9fa48("17696") ? false : stryMutAct_9fa48("17695") ? true : (stryCov_9fa48("17695", "17696", "17697"), path === (stryMutAct_9fa48("17698") ? "" : (stryCov_9fa48("17698"), 'ai-tutor')))) label = stryMutAct_9fa48("17699") ? "" : (stryCov_9fa48("17699"), 'Tutor IA');else {
              if (stryMutAct_9fa48("17700")) {
                {}
              } else {
                stryCov_9fa48("17700");
                // Capitalizar primera letra y reemplazar guiones
                label = path.split(stryMutAct_9fa48("17701") ? "" : (stryCov_9fa48("17701"), '-')).map(stryMutAct_9fa48("17702") ? () => undefined : (stryCov_9fa48("17702"), word => stryMutAct_9fa48("17703") ? word.charAt(0).toUpperCase() - word.slice(1) : (stryCov_9fa48("17703"), (stryMutAct_9fa48("17705") ? word.toUpperCase() : stryMutAct_9fa48("17704") ? word.charAt(0).toLowerCase() : (stryCov_9fa48("17704", "17705"), word.charAt(0).toUpperCase())) + (stryMutAct_9fa48("17706") ? word : (stryCov_9fa48("17706"), word.slice(1)))))).join(stryMutAct_9fa48("17707") ? "" : (stryCov_9fa48("17707"), ' '));
              }
            }

            // No incluir el último item si es un ID (cuid)
            const isId = (stryMutAct_9fa48("17711") ? /^c[^a-z0-9]{24}$/ : stryMutAct_9fa48("17710") ? /^c[a-z0-9]$/ : stryMutAct_9fa48("17709") ? /^c[a-z0-9]{24}/ : stryMutAct_9fa48("17708") ? /c[a-z0-9]{24}$/ : (stryCov_9fa48("17708", "17709", "17710", "17711"), /^c[a-z0-9]{24}$/)).test(path);
            if (stryMutAct_9fa48("17714") ? isId || index === paths.length - 1 : stryMutAct_9fa48("17713") ? false : stryMutAct_9fa48("17712") ? true : (stryCov_9fa48("17712", "17713", "17714"), isId && (stryMutAct_9fa48("17716") ? index !== paths.length - 1 : stryMutAct_9fa48("17715") ? true : (stryCov_9fa48("17715", "17716"), index === (stryMutAct_9fa48("17717") ? paths.length + 1 : (stryCov_9fa48("17717"), paths.length - 1)))))) {
              if (stryMutAct_9fa48("17718")) {
                {}
              } else {
                stryCov_9fa48("17718");
                return;
              }
            }
            breadcrumbs.push(stryMutAct_9fa48("17719") ? {} : (stryCov_9fa48("17719"), {
              label,
              href: (stryMutAct_9fa48("17722") ? index !== paths.length - 1 : stryMutAct_9fa48("17721") ? false : stryMutAct_9fa48("17720") ? true : (stryCov_9fa48("17720", "17721", "17722"), index === (stryMutAct_9fa48("17723") ? paths.length + 1 : (stryCov_9fa48("17723"), paths.length - 1)))) ? undefined : currentPath
            }));
          }
        });
        return breadcrumbs;
      }
    };
    const breadcrumbs = generateBreadcrumbs();
    if (stryMutAct_9fa48("17727") ? breadcrumbs.length > 1 : stryMutAct_9fa48("17726") ? breadcrumbs.length < 1 : stryMutAct_9fa48("17725") ? false : stryMutAct_9fa48("17724") ? true : (stryCov_9fa48("17724", "17725", "17726", "17727"), breadcrumbs.length <= 1)) {
      if (stryMutAct_9fa48("17728")) {
        {}
      } else {
        stryCov_9fa48("17728");
        return null;
      }
    }
    return <nav aria-label="Breadcrumb" className={cn(stryMutAct_9fa48("17729") ? "" : (stryCov_9fa48("17729"), 'flex items-center space-x-2 text-sm text-muted-foreground'), className)}>
      {breadcrumbs.map((item, index) => {
        if (stryMutAct_9fa48("17730")) {
          {}
        } else {
          stryCov_9fa48("17730");
          const isLast = stryMutAct_9fa48("17733") ? index !== breadcrumbs.length - 1 : stryMutAct_9fa48("17732") ? false : stryMutAct_9fa48("17731") ? true : (stryCov_9fa48("17731", "17732", "17733"), index === (stryMutAct_9fa48("17734") ? breadcrumbs.length + 1 : (stryCov_9fa48("17734"), breadcrumbs.length - 1)));
          return <div key={stryMutAct_9fa48("17737") ? item.href && item.label : stryMutAct_9fa48("17736") ? false : stryMutAct_9fa48("17735") ? true : (stryCov_9fa48("17735", "17736", "17737"), item.href || item.label)} className="flex items-center space-x-2">
            {(stryMutAct_9fa48("17740") ? index !== 0 : stryMutAct_9fa48("17739") ? false : stryMutAct_9fa48("17738") ? true : (stryCov_9fa48("17738", "17739", "17740"), index === 0)) ? <Link href={stryMutAct_9fa48("17743") ? item.href && '/' : stryMutAct_9fa48("17742") ? false : stryMutAct_9fa48("17741") ? true : (stryCov_9fa48("17741", "17742", "17743"), item.href || (stryMutAct_9fa48("17744") ? "" : (stryCov_9fa48("17744"), '/')))} className="hover:text-foreground transition-colors">
                <Home className="h-4 w-4" />
              </Link> : <>
                <ChevronRight className="h-4 w-4" />
                {isLast ? <span className="text-foreground font-medium">{item.label}</span> : <Link href={stryMutAct_9fa48("17747") ? item.href && '#' : stryMutAct_9fa48("17746") ? false : stryMutAct_9fa48("17745") ? true : (stryCov_9fa48("17745", "17746", "17747"), item.href || (stryMutAct_9fa48("17748") ? "" : (stryCov_9fa48("17748"), '#')))} className="hover:text-foreground transition-colors">
                    {item.label}
                  </Link>}
              </>}
          </div>;
        }
      })}
    </nav>;
  }
}