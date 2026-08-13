import React, { useState, useRef } from 'react';
import './assets/pseint-theme.css';
import { LoginScreen } from './components/Login/LoginScreen';
import { StudentHeader } from './components/StudentHeader/StudentHeader';
import { ExamCard } from './components/ExamCard/ExamCard';
import { ExamCompleted } from './components/ExamCompleted/ExamCompleted';
import { Sidebar } from './components/Sidebar/Sidebar';
import { CodeEditor } from './components/Editor/CodeEditor';
import { Console } from './components/Console/Console';
import { AdminPanel } from './components/Admin/AdminPanel';
import { getAssignedExercises } from './exercises/bank';
import { Lexer } from './interpreter/lexer';
import { Parser } from './interpreter/parser';
import { Interpreter } from './interpreter/interpreter';
import { evaluateCodeAgainstExercise } from './interpreter/evaluator';
import { saveSubmissionDirectly } from './services/turso';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState('6A');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Exam session state
  const [assignedExercises, setAssignedExercises] = useState([]);
  const [currentStep, setCurrentStep] = useState(1); // 1 or 2
  const [isCompleted, setIsCompleted] = useState(false);

  // Code solutions saved per step { 1: code1, 2: code2 }
  const [solutions, setSolutions] = useState({ 1: '', 2: '' });

  // Code editor state
  const [code, setCode] = useState('');
  const [history, setHistory] = useState(['']);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Interpreter console & evaluator state
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [waitingForInput, setWaitingForInput] = useState(false);
  const [inputVarName, setInputVarName] = useState('');
  const [evalResult, setEvalResult] = useState(null);

  const inputResolverRef = useRef(null);
  const interpreterRef = useRef(null);
  const textareaRef = useRef(null);

  const handleStartExam = (grade, studentName) => {
    setSelectedGrade(grade);
    setSelectedStudent(studentName);
    const assigned = getAssignedExercises(studentName);
    setAssignedExercises(assigned);
    setCurrentStep(1);
    setIsCompleted(false);

    const initialCode = assigned[0]?.starterCode || '';
    setSolutions({ 1: initialCode, 2: assigned[1]?.starterCode || '' });
    updateCode(initialCode);
    setConsoleLogs([]);
    setEvalResult(null);
    setIsLoggedIn(true);
  };

  const handleNextStep = () => {
    // Save current step code
    const updatedSolutions = { ...solutions, [currentStep]: code };
    setSolutions(updatedSolutions);

    if (currentStep === 1) {
      setCurrentStep(2);
      const nextCode = updatedSolutions[2] || assignedExercises[1]?.starterCode || '';
      updateCode(nextCode);
      setConsoleLogs([]);
      setEvalResult(null);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      const updatedSolutions = { ...solutions, [currentStep]: code };
      setSolutions(updatedSolutions);

      setCurrentStep(1);
      const prevCode = updatedSolutions[1] || assignedExercises[0]?.starterCode || '';
      updateCode(prevCode);
      setConsoleLogs([]);
      setEvalResult(null);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsCompleted(false);
    setCurrentStep(1);
  };

  const handleRun = async () => {
    if (isRunning) return;

    setConsoleLogs([
      { type: 'system-start', text: '*** Ejecución Iniciada. ***' }
    ]);
    setIsRunning(true);
    setWaitingForInput(false);
    setEvalResult(null);

    try {
      const lexer = new Lexer(code);
      const tokens = lexer.tokenize();
      const parser = new Parser(tokens);
      const ast = parser.parse();

      const interpreter = new Interpreter({
        onOutput: (text) => {
          setConsoleLogs(prev => [...prev, { type: 'output', text }]);
        },
        onInputRequest: (varName) => {
          setWaitingForInput(true);
          setInputVarName(varName);

          return new Promise((resolve) => {
            inputResolverRef.current = (userInput) => {
              setWaitingForInput(false);
              setConsoleLogs(prev => [...prev, { type: 'user-input', text: `> ${userInput}` }]);
              resolve(userInput);
            };
          });
        },
        onError: (errMsg) => {
          setConsoleLogs(prev => [
            ...prev,
            { type: 'error', text: errMsg },
            { type: 'system-end', text: '*** EJECUCIÓN CON ERRORES ***' }
          ]);
          setIsRunning(false);
          setWaitingForInput(false);
        },
        onFinish: () => {
          setConsoleLogs(prev => [
            ...prev,
            { type: 'system-end', text: '*** Ejecución Finalizada. ***' }
          ]);
          setIsRunning(false);
          setWaitingForInput(false);
        }
      });

      interpreterRef.current = interpreter;
      await interpreter.execute(ast);
    } catch (err) {
      setConsoleLogs(prev => [
        ...prev,
        { type: 'error', text: err.message || String(err) },
        { type: 'system-end', text: '*** EJECUCIÓN CON ERRORES ***' }
      ]);
      setIsRunning(false);
      setWaitingForInput(false);
    }
  };

  const handleEvaluate = async () => {
    const currentEx = assignedExercises[currentStep - 1];
    const res = await evaluateCodeAgainstExercise(code, currentEx);
    setEvalResult(res);

    // Save directly to Turso DB and LocalStorage
    const submissionPayload = {
      id: Date.now().toString(),
      studentName: selectedStudent || 'Anónimo',
      grade: selectedGrade || '6A',
      exerciseId: currentEx ? currentEx.id : `ex-${currentStep}`,
      exerciseTitle: currentEx ? currentEx.title : `Ejercicio ${currentStep}`,
      code: code,
      results: res.results || [],
      allPassed: res.success,
      passedCount: res.passedCount || 0,
      totalTests: res.totalTests || 0,
      createdAt: new Date().toISOString()
    };

    await saveSubmissionDirectly(submissionPayload);
  };

  const handleStop = () => {
    if (interpreterRef.current) {
      interpreterRef.current.stop();
    }
    if (inputResolverRef.current) {
      inputResolverRef.current('0');
    }
    setConsoleLogs(prev => [
      ...prev,
      { type: 'system-end', text: '*** Ejecución Detenida por el Usuario. ***' }
    ]);
    setIsRunning(false);
    setWaitingForInput(false);
  };

  const handleClearConsole = () => {
    setConsoleLogs([]);
    setEvalResult(null);
  };

  const handleSubmitInput = (val) => {
    if (inputResolverRef.current) {
      inputResolverRef.current(val);
      inputResolverRef.current = null;
    }
  };

  const updateCode = (newCode) => {
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push(newCode);
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
    setCode(newCode);
  };

  const handleInsertSnippet = (snippet) => {
    const target = textareaRef.current;
    if (target) {
      const savedScrollTop = target.scrollTop;
      const savedScrollLeft = target.scrollLeft;
      const start = target.selectionStart || 0;
      const end = target.selectionEnd || 0;
      const newCode = code.substring(0, start) + snippet + code.substring(end);
      updateCode(newCode);
      setTimeout(() => {
        target.focus({ preventScroll: true });
        target.selectionStart = target.selectionEnd = start + snippet.length;
        target.scrollTop = savedScrollTop;
        target.scrollLeft = savedScrollLeft;
      }, 0);
    } else {
      updateCode(code + '\n' + snippet);
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <LoginScreen 
          onStartExam={handleStartExam} 
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
        <AdminPanel 
          isOpen={isAdminOpen} 
          onClose={() => setIsAdminOpen(false)} 
        />
      </>
    );
  }

  const currentExercise = assignedExercises[currentStep - 1];

  return (
    <div className="pseint-app">
      <StudentHeader 
        selectedGrade={selectedGrade}
        selectedStudent={selectedStudent}
        currentStep={currentStep}
        isCompleted={isCompleted}
        onLogout={handleLogout}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
      />

      {isCompleted ? (
        <ExamCompleted 
          studentName={selectedStudent}
          grade={selectedGrade}
          onResetExam={handleLogout}
        />
      ) : (
        <>
          <ExamCard 
            exercise={currentExercise}
            currentStep={currentStep}
            onNextStep={handleNextStep}
            onPrevStep={handlePrevStep}
            isLastStep={currentStep === 2}
          />

          <div className="pseint-workspace">
            <Sidebar onInsertSnippet={handleInsertSnippet} />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
              <CodeEditor 
                code={code}
                setCode={updateCode}
                onRun={handleRun}
                onEvaluate={handleEvaluate}
                onStop={handleStop}
                isRunning={isRunning}
                textareaRef={textareaRef}
                history={history}
                setHistory={setHistory}
                historyIndex={historyIndex}
                setHistoryIndex={setHistoryIndex}
              />

              <Console 
                consoleLogs={consoleLogs}
                waitingForInput={waitingForInput}
                inputVarName={inputVarName}
                onSubmitInput={handleSubmitInput}
                onRun={handleRun}
                onEvaluate={handleEvaluate}
                onStop={handleStop}
                onClear={handleClearConsole}
                isRunning={isRunning}
                evalResult={evalResult}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
