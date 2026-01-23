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
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ErrorBoundaryWrapper } from '@/components/ErrorBoundaryWrapper';
import { Header } from '@/components/layout/header';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { KeyboardShortcutsProvider } from '@/components/keyboard-shortcuts-provider';
import { GlobalUndoRedoProvider } from '@/hooks/useGlobalUndoRedo';
const geistSans = Geist(stryMutAct_9fa48("13965") ? {} : (stryCov_9fa48("13965"), {
  variable: stryMutAct_9fa48("13966") ? "" : (stryCov_9fa48("13966"), '--font-geist-sans'),
  subsets: stryMutAct_9fa48("13967") ? [] : (stryCov_9fa48("13967"), [stryMutAct_9fa48("13968") ? "" : (stryCov_9fa48("13968"), 'latin')])
}));
const geistMono = Geist_Mono(stryMutAct_9fa48("13969") ? {} : (stryCov_9fa48("13969"), {
  variable: stryMutAct_9fa48("13970") ? "" : (stryCov_9fa48("13970"), '--font-geist-mono'),
  subsets: stryMutAct_9fa48("13971") ? [] : (stryCov_9fa48("13971"), [stryMutAct_9fa48("13972") ? "" : (stryCov_9fa48("13972"), 'latin')])
}));
export const metadata: Metadata = stryMutAct_9fa48("13973") ? {} : (stryCov_9fa48("13973"), {
  title: stryMutAct_9fa48("13974") ? "" : (stryCov_9fa48("13974"), 'PAES Tutor - Tu plataforma de preparación'),
  description: stryMutAct_9fa48("13975") ? "" : (stryCov_9fa48("13975"), 'Plataforma de preparación para la Prueba de Acceso a la Educación Superior (PAES)')
});
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (stryMutAct_9fa48("13976")) {
    {}
  } else {
    stryCov_9fa48("13976");
    return <html lang="es">
      <body className={stryMutAct_9fa48("13977") ? `` : (stryCov_9fa48("13977"), `${geistSans.variable} ${geistMono.variable} antialiased`)}>
        <TooltipProvider>
          <ErrorBoundaryWrapper>
            <GlobalUndoRedoProvider>
              <KeyboardShortcutsProvider>
                <Header />
                <main className="min-h-[calc(100vh-4rem)]">{children}</main>
                <Toaster position="top-right" richColors closeButton />
              </KeyboardShortcutsProvider>
            </GlobalUndoRedoProvider>
          </ErrorBoundaryWrapper>
        </TooltipProvider>
      </body>
    </html>;
  }
}