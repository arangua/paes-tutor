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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Circle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BookmarkButton } from '@/components/bookmarks/bookmark-button';
import { CreateFlashcardButton } from '@/components/flashcards/create-flashcard-button';
import { CreateNoteButton } from '@/components/notes/create-note-button';
import { ContentTypeIcon } from '@/components/ui/content-type-icon';
interface QuestionOption {
  id: string;
  letra: string;
  texto: string;
  esCorrecta: boolean;
}
interface Question {
  id: string;
  enunciado: string;
  explicacion: string;
  tipo?: string;
  options: QuestionOption[];
  topic?: {
    nombre: string;
    ejeTematico: string;
  } | null;
}
interface AttemptAnswer {
  id: string;
  questionId: string;
  optionSelectedId: string | null;
  esCorrecta: boolean | null;
  omitida: boolean;
  question: Question;
  optionSelected: {
    id: string;
    letra: string;
    texto: string;
  } | null;
}
interface QuestionReviewProps {
  answer: AttemptAnswer;
  index: number;
  showTopic?: boolean;
}
export function QuestionReview({
  answer,
  index,
  showTopic = stryMutAct_9fa48("19003") ? false : (stryCov_9fa48("19003"), true)
}: QuestionReviewProps) {
  if (stryMutAct_9fa48("19004")) {
    {}
  } else {
    stryCov_9fa48("19004");
    const isCorrect = stryMutAct_9fa48("19007") ? answer.esCorrecta !== true : stryMutAct_9fa48("19006") ? false : stryMutAct_9fa48("19005") ? true : (stryCov_9fa48("19005", "19006", "19007"), answer.esCorrecta === (stryMutAct_9fa48("19008") ? false : (stryCov_9fa48("19008"), true)));
    const isOmitted = answer.omitida;
    const isIncorrect = stryMutAct_9fa48("19011") ? !isCorrect || !isOmitted : stryMutAct_9fa48("19010") ? false : stryMutAct_9fa48("19009") ? true : (stryCov_9fa48("19009", "19010", "19011"), (stryMutAct_9fa48("19012") ? isCorrect : (stryCov_9fa48("19012"), !isCorrect)) && (stryMutAct_9fa48("19013") ? isOmitted : (stryCov_9fa48("19013"), !isOmitted)));
    const correctOption = answer.question.options.find(stryMutAct_9fa48("19014") ? () => undefined : (stryCov_9fa48("19014"), opt => opt.esCorrecta));
    return <Card className={cn(stryMutAct_9fa48("19015") ? "" : (stryCov_9fa48("19015"), 'transition-all'), stryMutAct_9fa48("19018") ? isCorrect || 'border-green-500 bg-green-50/50 dark:bg-green-950/20' : stryMutAct_9fa48("19017") ? false : stryMutAct_9fa48("19016") ? true : (stryCov_9fa48("19016", "19017", "19018"), isCorrect && (stryMutAct_9fa48("19019") ? "" : (stryCov_9fa48("19019"), 'border-green-500 bg-green-50/50 dark:bg-green-950/20'))), stryMutAct_9fa48("19022") ? isOmitted || 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20' : stryMutAct_9fa48("19021") ? false : stryMutAct_9fa48("19020") ? true : (stryCov_9fa48("19020", "19021", "19022"), isOmitted && (stryMutAct_9fa48("19023") ? "" : (stryCov_9fa48("19023"), 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'))), stryMutAct_9fa48("19026") ? isIncorrect || 'border-red-500 bg-red-50/50 dark:bg-red-950/20' : stryMutAct_9fa48("19025") ? false : stryMutAct_9fa48("19024") ? true : (stryCov_9fa48("19024", "19025", "19026"), isIncorrect && (stryMutAct_9fa48("19027") ? "" : (stryCov_9fa48("19027"), 'border-red-500 bg-red-50/50 dark:bg-red-950/20'))))}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">Pregunta {stryMutAct_9fa48("19028") ? index - 1 : (stryCov_9fa48("19028"), index + 1)}</Badge>
              {stryMutAct_9fa48("19031") ? answer.question.tipo || <ContentTypeIcon type="question" questionType={answer.question.tipo} size={16} /> : stryMutAct_9fa48("19030") ? false : stryMutAct_9fa48("19029") ? true : (stryCov_9fa48("19029", "19030", "19031"), answer.question.tipo && <ContentTypeIcon type="question" questionType={answer.question.tipo} size={16} />)}
              <BookmarkButton questionId={answer.question.id} />
              <CreateFlashcardButton questionId={answer.question.id} defaultFront={answer.question.enunciado} defaultBack={answer.question.explicacion} size="sm" />
              <CreateNoteButton questionId={answer.question.id} defaultTitle={stryMutAct_9fa48("19032") ? `` : (stryCov_9fa48("19032"), `Nota: ${stryMutAct_9fa48("19033") ? answer.question.enunciado : (stryCov_9fa48("19033"), answer.question.enunciado.substring(0, 50))}...`)} defaultContent={answer.question.explicacion} size="sm" />
              {stryMutAct_9fa48("19036") ? isCorrect || <Badge variant="default" className="bg-green-600">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Correcta
                </Badge> : stryMutAct_9fa48("19035") ? false : stryMutAct_9fa48("19034") ? true : (stryCov_9fa48("19034", "19035", "19036"), isCorrect && <Badge variant="default" className="bg-green-600">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Correcta
                </Badge>)}
              {stryMutAct_9fa48("19039") ? isOmitted || <Badge variant="secondary" className="bg-yellow-600">
                  <Circle className="h-3 w-3 mr-1" />
                  Omitida
                </Badge> : stryMutAct_9fa48("19038") ? false : stryMutAct_9fa48("19037") ? true : (stryCov_9fa48("19037", "19038", "19039"), isOmitted && <Badge variant="secondary" className="bg-yellow-600">
                  <Circle className="h-3 w-3 mr-1" />
                  Omitida
                </Badge>)}
              {stryMutAct_9fa48("19042") ? isIncorrect || <Badge variant="destructive">
                  <XCircle className="h-3 w-3 mr-1" />
                  Incorrecta
                </Badge> : stryMutAct_9fa48("19041") ? false : stryMutAct_9fa48("19040") ? true : (stryCov_9fa48("19040", "19041", "19042"), isIncorrect && <Badge variant="destructive">
                  <XCircle className="h-3 w-3 mr-1" />
                  Incorrecta
                </Badge>)}
            </div>
            {stryMutAct_9fa48("19045") ? showTopic && answer.question.topic || <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Badge variant="outline" className="text-xs">
                  {answer.question.topic.nombre}
                </Badge>
                <span className="text-xs">{answer.question.topic.ejeTematico}</span>
              </div> : stryMutAct_9fa48("19044") ? false : stryMutAct_9fa48("19043") ? true : (stryCov_9fa48("19043", "19044", "19045"), (stryMutAct_9fa48("19047") ? showTopic || answer.question.topic : stryMutAct_9fa48("19046") ? true : (stryCov_9fa48("19046", "19047"), showTopic && answer.question.topic)) && <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Badge variant="outline" className="text-xs">
                  {answer.question.topic.nombre}
                </Badge>
                <span className="text-xs">{answer.question.topic.ejeTematico}</span>
              </div>)}
            <CardTitle className="text-lg mt-2">{answer.question.enunciado}</CardTitle>
          </div>
          <div className="flex-shrink-0">
            {isCorrect ? <CheckCircle2 className="h-6 w-6 text-green-600" /> : isOmitted ? <Circle className="h-6 w-6 text-yellow-600" /> : <XCircle className="h-6 w-6 text-red-600" />}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Opciones */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Opciones:</p>
          {answer.question.options.map(option => {
            if (stryMutAct_9fa48("19048")) {
              {}
            } else {
              stryCov_9fa48("19048");
              const isSelected = stryMutAct_9fa48("19051") ? answer.optionSelectedId !== option.id : stryMutAct_9fa48("19050") ? false : stryMutAct_9fa48("19049") ? true : (stryCov_9fa48("19049", "19050", "19051"), answer.optionSelectedId === option.id);
              const isCorrectOption = option.esCorrecta;
              return <div key={option.id} className={cn(stryMutAct_9fa48("19052") ? "" : (stryCov_9fa48("19052"), 'p-3 rounded-lg border-2 transition-all'), isCorrectOption ? stryMutAct_9fa48("19053") ? "" : (stryCov_9fa48("19053"), 'border-green-500 bg-green-100 dark:bg-green-900/30') : isSelected ? stryMutAct_9fa48("19054") ? "" : (stryCov_9fa48("19054"), 'border-red-500 bg-red-100 dark:bg-red-900/30') : stryMutAct_9fa48("19055") ? "" : (stryCov_9fa48("19055"), 'border-border bg-muted/50'))}>
                <div className="flex items-center gap-3">
                  <span className="font-medium min-w-[24px]">{option.letra}.</span>
                  <span className="flex-1">{option.texto}</span>
                  <div className="flex items-center gap-2">
                    {stryMutAct_9fa48("19058") ? isCorrectOption || <Badge variant="default" className="bg-green-600">
                        Correcta
                      </Badge> : stryMutAct_9fa48("19057") ? false : stryMutAct_9fa48("19056") ? true : (stryCov_9fa48("19056", "19057", "19058"), isCorrectOption && <Badge variant="default" className="bg-green-600">
                        Correcta
                      </Badge>)}
                    {stryMutAct_9fa48("19061") ? isSelected && !isCorrectOption || <Badge variant="destructive">Tu respuesta</Badge> : stryMutAct_9fa48("19060") ? false : stryMutAct_9fa48("19059") ? true : (stryCov_9fa48("19059", "19060", "19061"), (stryMutAct_9fa48("19063") ? isSelected || !isCorrectOption : stryMutAct_9fa48("19062") ? true : (stryCov_9fa48("19062", "19063"), isSelected && (stryMutAct_9fa48("19064") ? isCorrectOption : (stryCov_9fa48("19064"), !isCorrectOption)))) && <Badge variant="destructive">Tu respuesta</Badge>)}
                  </div>
                </div>
              </div>;
            }
          })}
        </div>

        {/* Explicación */}
        {stryMutAct_9fa48("19067") ? answer.question.explicacion || <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">Explicación:</p>
            </div>
            <p className="text-sm text-muted-foreground">{answer.question.explicacion}</p>
          </div> : stryMutAct_9fa48("19066") ? false : stryMutAct_9fa48("19065") ? true : (stryCov_9fa48("19065", "19066", "19067"), answer.question.explicacion && <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">Explicación:</p>
            </div>
            <p className="text-sm text-muted-foreground">{answer.question.explicacion}</p>
          </div>)}

        {/* Feedback adicional para respuestas incorrectas */}
        {stryMutAct_9fa48("19070") ? isIncorrect && correctOption || <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              Respuesta correcta: {correctOption.letra}
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-200">{correctOption.texto}</p>
          </div> : stryMutAct_9fa48("19069") ? false : stryMutAct_9fa48("19068") ? true : (stryCov_9fa48("19068", "19069", "19070"), (stryMutAct_9fa48("19072") ? isIncorrect || correctOption : stryMutAct_9fa48("19071") ? true : (stryCov_9fa48("19071", "19072"), isIncorrect && correctOption)) && <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              Respuesta correcta: {correctOption.letra}
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-200">{correctOption.texto}</p>
          </div>)}
      </CardContent>
    </Card>;
  }
}