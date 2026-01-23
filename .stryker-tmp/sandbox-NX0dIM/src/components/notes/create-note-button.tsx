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
import { FileText, Plus } from 'lucide-react';
import { NoteDialog } from './note-dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
interface CreateNoteButtonProps {
  questionId?: string;
  topicId?: string;
  defaultTitle?: string;
  defaultContent?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}
export function CreateNoteButton({
  questionId,
  topicId,
  defaultTitle = stryMutAct_9fa48("18022") ? "Stryker was here!" : (stryCov_9fa48("18022"), ''),
  defaultContent = stryMutAct_9fa48("18023") ? "Stryker was here!" : (stryCov_9fa48("18023"), ''),
  variant = stryMutAct_9fa48("18024") ? "" : (stryCov_9fa48("18024"), 'ghost'),
  size = stryMutAct_9fa48("18025") ? "" : (stryCov_9fa48("18025"), 'sm')
}: CreateNoteButtonProps) {
  if (stryMutAct_9fa48("18026")) {
    {}
  } else {
    stryCov_9fa48("18026");
    const [open, setOpen] = useState(stryMutAct_9fa48("18027") ? true : (stryCov_9fa48("18027"), false));
    return <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={variant} size={size} onClick={stryMutAct_9fa48("18028") ? () => undefined : (stryCov_9fa48("18028"), () => setOpen(stryMutAct_9fa48("18029") ? false : (stryCov_9fa48("18029"), true)))} aria-label="Crear nota de estudio">
            <FileText className="h-4 w-4 mr-2" />
            Nota
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">
            <strong>Crear nota de estudio</strong>
            <br />
            <span className="text-muted-foreground text-xs">
              Como los post-its en tus libros. Guarda trucos, fórmulas o conceptos clave para
              repasar después.
            </span>
          </p>
        </TooltipContent>
      </Tooltip>
      <NoteDialog open={open} onOpenChange={setOpen} questionId={questionId} topicId={topicId} defaultTitle={defaultTitle} defaultContent={defaultContent} />
    </>;
  }
}