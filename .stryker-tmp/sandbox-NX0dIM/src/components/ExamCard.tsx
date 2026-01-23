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
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock } from 'lucide-react';
import { ShareExamButton } from './exams/share-exam-button';
import { SubjectIcon } from '@/lib/subject-icons';
import { ContentTypeIcon } from '@/components/ui/content-type-icon';
interface ExamCardProps {
  exam: {
    id: string;
    titulo: string;
    descripcion: string | null;
    tipo: string;
    tiempoLimiteMin: number | null;
    totalPreguntas: number;
    fuente: string | null;
    subject: {
      id: string;
      nombre: string;
      codigo: string;
    };
  };
  onStartExam: (examId: string) => void;
}

/**
 * Componente optimizado con React.memo para evitar re-renders innecesarios
 * Solo se re-renderiza si las props cambian
 */
export const ExamCard = React.memo(function ExamCard({
  exam,
  onStartExam
}: ExamCardProps) {
  if (stryMutAct_9fa48("17242")) {
    {}
  } else {
    stryCov_9fa48("17242");
    const handleStartClick = React.useCallback(() => {
      if (stryMutAct_9fa48("17243")) {
        {}
      } else {
        stryCov_9fa48("17243");
        onStartExam(exam.id);
      }
    }, stryMutAct_9fa48("17244") ? [] : (stryCov_9fa48("17244"), [exam.id, onStartExam]));
    return <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <SubjectIcon codigo={exam.subject.codigo} size={24} />
              <CardTitle className="text-lg line-clamp-2 flex-1">{exam.titulo}</CardTitle>
            </div>
            <Badge variant="outline">{exam.subject.codigo}</Badge>
          </div>
          <CardDescription className="line-clamp-2">
            {stryMutAct_9fa48("17247") ? exam.descripcion && 'Sin descripción' : stryMutAct_9fa48("17246") ? false : stryMutAct_9fa48("17245") ? true : (stryCov_9fa48("17245", "17246", "17247"), exam.descripcion || (stryMutAct_9fa48("17248") ? "" : (stryCov_9fa48("17248"), 'Sin descripción')))}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Información del examen */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Asignatura:</span>
              <span className="font-medium">{exam.subject.nombre}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Tipo:</span>
              <div className="flex items-center gap-2">
                <ContentTypeIcon type="exam" examType={exam.tipo} size={16} />
                <Badge variant="secondary">{exam.tipo}</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Preguntas:</span>
              <span className="font-medium">{exam.totalPreguntas}</span>
            </div>
            {stryMutAct_9fa48("17251") ? exam.tiempoLimiteMin || <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  Tiempo límite: {exam.tiempoLimiteMin} minutos
                </span>
              </div> : stryMutAct_9fa48("17250") ? false : stryMutAct_9fa48("17249") ? true : (stryCov_9fa48("17249", "17250", "17251"), exam.tiempoLimiteMin && <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  Tiempo límite: {exam.tiempoLimiteMin} minutos
                </span>
              </div>)}
            {stryMutAct_9fa48("17254") ? exam.fuente || <div className="text-xs text-gray-500 dark:text-gray-500">Fuente: {exam.fuente}</div> : stryMutAct_9fa48("17253") ? false : stryMutAct_9fa48("17252") ? true : (stryCov_9fa48("17252", "17253", "17254"), exam.fuente && <div className="text-xs text-gray-500 dark:text-gray-500">Fuente: {exam.fuente}</div>)}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2">
            <Button className="flex-1" onClick={handleStartClick}>
              <BookOpen className="h-4 w-4 mr-2" />
              Iniciar Examen
            </Button>
            <ShareExamButton examId={exam.id} examTitle={exam.titulo} />
          </div>
        </CardContent>
      </Card>;
  }
}, (prevProps, nextProps) => {
  if (stryMutAct_9fa48("17255")) {
    {}
  } else {
    stryCov_9fa48("17255");
    // Comparación personalizada para evitar re-renders innecesarios
    return stryMutAct_9fa48("17258") ? prevProps.exam.id === nextProps.exam.id && prevProps.exam.titulo === nextProps.exam.titulo && prevProps.exam.descripcion === nextProps.exam.descripcion && prevProps.exam.tipo === nextProps.exam.tipo && prevProps.exam.totalPreguntas === nextProps.exam.totalPreguntas || prevProps.exam.subject.id === nextProps.exam.subject.id : stryMutAct_9fa48("17257") ? false : stryMutAct_9fa48("17256") ? true : (stryCov_9fa48("17256", "17257", "17258"), (stryMutAct_9fa48("17260") ? prevProps.exam.id === nextProps.exam.id && prevProps.exam.titulo === nextProps.exam.titulo && prevProps.exam.descripcion === nextProps.exam.descripcion && prevProps.exam.tipo === nextProps.exam.tipo || prevProps.exam.totalPreguntas === nextProps.exam.totalPreguntas : stryMutAct_9fa48("17259") ? true : (stryCov_9fa48("17259", "17260"), (stryMutAct_9fa48("17262") ? prevProps.exam.id === nextProps.exam.id && prevProps.exam.titulo === nextProps.exam.titulo && prevProps.exam.descripcion === nextProps.exam.descripcion || prevProps.exam.tipo === nextProps.exam.tipo : stryMutAct_9fa48("17261") ? true : (stryCov_9fa48("17261", "17262"), (stryMutAct_9fa48("17264") ? prevProps.exam.id === nextProps.exam.id && prevProps.exam.titulo === nextProps.exam.titulo || prevProps.exam.descripcion === nextProps.exam.descripcion : stryMutAct_9fa48("17263") ? true : (stryCov_9fa48("17263", "17264"), (stryMutAct_9fa48("17266") ? prevProps.exam.id === nextProps.exam.id || prevProps.exam.titulo === nextProps.exam.titulo : stryMutAct_9fa48("17265") ? true : (stryCov_9fa48("17265", "17266"), (stryMutAct_9fa48("17268") ? prevProps.exam.id !== nextProps.exam.id : stryMutAct_9fa48("17267") ? true : (stryCov_9fa48("17267", "17268"), prevProps.exam.id === nextProps.exam.id)) && (stryMutAct_9fa48("17270") ? prevProps.exam.titulo !== nextProps.exam.titulo : stryMutAct_9fa48("17269") ? true : (stryCov_9fa48("17269", "17270"), prevProps.exam.titulo === nextProps.exam.titulo)))) && (stryMutAct_9fa48("17272") ? prevProps.exam.descripcion !== nextProps.exam.descripcion : stryMutAct_9fa48("17271") ? true : (stryCov_9fa48("17271", "17272"), prevProps.exam.descripcion === nextProps.exam.descripcion)))) && (stryMutAct_9fa48("17274") ? prevProps.exam.tipo !== nextProps.exam.tipo : stryMutAct_9fa48("17273") ? true : (stryCov_9fa48("17273", "17274"), prevProps.exam.tipo === nextProps.exam.tipo)))) && (stryMutAct_9fa48("17276") ? prevProps.exam.totalPreguntas !== nextProps.exam.totalPreguntas : stryMutAct_9fa48("17275") ? true : (stryCov_9fa48("17275", "17276"), prevProps.exam.totalPreguntas === nextProps.exam.totalPreguntas)))) && (stryMutAct_9fa48("17278") ? prevProps.exam.subject.id !== nextProps.exam.subject.id : stryMutAct_9fa48("17277") ? true : (stryCov_9fa48("17277", "17278"), prevProps.exam.subject.id === nextProps.exam.subject.id)));
  }
});